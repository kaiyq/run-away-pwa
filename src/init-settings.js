/**
 * 初始化设置 - 预设GLM API Key
 */
(function initSettings() {
  const GLM_API_KEY = 'bed22d40d9d247b1a756b8d174f693d0.U2DeTTBYM2dBT7ea'

  // 强制设置GLM API Key（即使之前有值也覆盖）
  localStorage.setItem('ai_api_key', GLM_API_KEY)
  localStorage.setItem('ai_provider', 'glm')

  console.log('✅ GLM API Key已预设')
  console.log('📝 Provider: glm')
})()
