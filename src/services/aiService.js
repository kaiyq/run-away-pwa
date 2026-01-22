/**
 * AI服务模块
 * 支持DeepSeek、通义千问和GLM API
 */

// 预设标签列表
const PRESET_TAGS = [
  '打压学生',
  '反常识',
  '标榜自己',
  '与事实不符',
  'PUA/情感操控',
  '人身攻击',
  '无视事实',
  '双标',
  '转移话题',
  '推卸责任',
  '贬低他人',
  '自相矛盾'
]

/**
 * 分析导师言论，返回标签和简短评论
 * @param {string} content - 导师言论
 * @param {string} myFeeling - 学生感受
 * @param {string} provider - AI提供商 (deepseek/qwen/glm)
 * @param {string} apiKey - API密钥
 * @returns {Promise<Object>} 分析结果
 */
export async function analyzeMentorSpeech(content, myFeeling, provider = 'deepseek', apiKey = '') {
  if (!apiKey) {
    console.warn('未配置API Key，跳过AI分析')
    return {
      tags: [],
      comment: '未配置AI服务，请在设置中添加API Key'
    }
  }

  try {
    if (provider === 'deepseek') {
      return await analyzeWithDeepSeek(content, myFeeling, apiKey)
    } else if (provider === 'qwen') {
      return await analyzeWithQwen(content, myFeeling, apiKey)
    } else if (provider === 'glm') {
      return await analyzeWithGLM(content, myFeeling, apiKey)
    }
  } catch (error) {
    console.error('AI分析失败:', error)
    return {
      tags: [],
      comment: 'AI分析失败：' + error.message
    }
  }
}

/**
 * 使用DeepSeek API分析
 */
async function analyzeWithDeepSeek(content, myFeeling, apiKey) {
  const prompt = `你是一个帮助学生分析A发言的助手。请分析以下内容，并返回JSON格式的结果。

A发言：${content}

学生感受：${myFeeling}

请从以下标签中选择1-5个最匹配的标签：
${PRESET_TAGS.join('、')}

返回格式（必须是有效的JSON）：
{
  "tags": ["标签1", "标签2"],
  "comment": "简短评论（10-20字，理解和支持学生）"
}

要求：
1. 只使用上述预设标签
2. 评论要温暖、理解、支持学生
3. 返回纯JSON，不要有其他内容`

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个善解人意的学生心理辅导助手，善于识别不当言论。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'API请求失败')
    }

    const data = await response.json()
    const content_result = data.choices[0].message.content

    // 解析AI返回的JSON
    let result
    try {
      // 尝试直接解析
      result = JSON.parse(content_result)
    } catch (e) {
      // 如果直接解析失败，尝试提取JSON部分
      const jsonMatch = content_result.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('AI返回格式错误')
      }
    }

    // 验证返回的标签是否在预设列表中
    const validTags = result.tags.filter(tag => PRESET_TAGS.includes(tag))

    return {
      tags: validTags,
      comment: result.comment || '加油，你做得很好！'
    }
  } catch (error) {
    console.error('DeepSeek API错误:', error)
    throw error
  }
}

/**
 * 使用通义千问API分析
 */
async function analyzeWithQwen(content, myFeeling, apiKey) {
  const prompt = `你是一个帮助学生分析A发言的助手。请分析以下内容，并返回JSON格式的结果。

A发言：${content}

学生感受：${myFeeling}

请从以下标签中选择1-5个最匹配的标签：
${PRESET_TAGS.join('、')}

返回格式（必须是有效的JSON）：
{
  "tags": ["标签1", "标签2"],
  "comment": "简短评论（10-20字，理解和支持学生）"
}

要求：
1. 只使用上述预设标签
2. 评论要温暖、理解、支持学生
3. 返回纯JSON，不要有其他内容`

  try {
    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'qwen-plus',
        messages: [
          {
            role: 'system',
            content: '你是一个善解人意的学生心理辅导助手，善于识别不当言论。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'API请求失败')
    }

    const data = await response.json()
    const content_result = data.choices[0].message.content

    // 解析AI返回的JSON
    let result
    try {
      result = JSON.parse(content_result)
    } catch (e) {
      const jsonMatch = content_result.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('AI返回格式错误')
      }
    }

    // 验证返回的标签是否在预设列表中
    const validTags = result.tags.filter(tag => PRESET_TAGS.includes(tag))

    return {
      tags: validTags,
      comment: result.comment || '加油，你做得很好！'
    }
  } catch (error) {
    console.error('通义千问API错误:', error)
    throw error
  }
}

/**
 * 使用GLM (智谱AI) API分析
 */
async function analyzeWithGLM(content, myFeeling, apiKey) {
  const prompt = `你是一个帮助学生分析A发言的助手。请分析以下内容，并返回JSON格式的结果。

A发言：${content}

学生感受：${myFeeling}

请从以下标签中选择1-5个最匹配的标签：
${PRESET_TAGS.join('、')}

返回格式（必须是有效的JSON）：
{
  "tags": ["标签1", "标签2"],
  "comment": "简短评论（10-20字，理解和支持学生）"
}

要求：
1. 只使用上述预设标签
2. 评论要温暖、理解、支持学生
3. 返回纯JSON，不要有其他内容`

  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: [
          {
            role: 'system',
            content: '你是一个善解人意的学生心理辅导助手，善于识别不当言论。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'API请求失败')
    }

    const data = await response.json()
    const content_result = data.choices[0].message.content

    // 解析AI返回的JSON
    let result
    try {
      result = JSON.parse(content_result)
    } catch (e) {
      const jsonMatch = content_result.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('AI返回格式错误')
      }
    }

    // 验证返回的标签是否在预设列表中
    const validTags = result.tags.filter(tag => PRESET_TAGS.includes(tag))

    return {
      tags: validTags,
      comment: result.comment || '加油，你做得很好！'
    }
  } catch (error) {
    console.error('GLM API错误:', error)
    throw error
  }
}

/**
 * 测试API连接
 */
export async function testApiConnection(provider, apiKey) {
  if (!apiKey) {
    return { success: false, error: 'API Key为空' }
  }

  try {
    const result = await analyzeMentorSpeech(
      '测试内容',
      '测试感受',
      provider,
      apiKey
    )
    return { success: true, result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
