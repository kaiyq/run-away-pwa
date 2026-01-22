import { useState } from 'react'
import { analyzeMentorSpeech } from '../services/aiService'

/**
 * 预设标签列表
 */
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
 * 记录表单组件 - 数字极简票券风
 */
export default function RecordForm({ onSubmit }) {
  const [content, setContent] = useState('')
  const [myFeeling, setMyFeeling] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedTags, setSelectedTags] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState(null)
  const [aiComment, setAiComment] = useState('')

  // 切换标签选择
  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  // AI智能分析
  const handleAiAnalyze = async () => {
    if (!content.trim() || !myFeeling.trim()) {
      alert('请先填写A发言记录和你的感受')
      return
    }

    const apiKey = localStorage.getItem('ai_api_key') || ''
    const provider = localStorage.getItem('ai_provider') || 'glm'

    if (!apiKey) {
      alert('AI功能暂不可用')
      return
    }

    setIsAnalyzing(true)
    setAiSuggestion(null)
    setAiComment('')

    try {
      const result = await analyzeMentorSpeech(content, myFeeling, provider, apiKey)

      if (result.tags && result.tags.length > 0) {
        setAiSuggestion(result.tags)
        setAiComment(result.comment || '加油，你做得很好！')
      }
    } catch (error) {
      alert('AI分析失败：' + error.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // 接受AI建议
  const acceptAiSuggestion = () => {
    if (aiSuggestion) {
      setSelectedTags(aiSuggestion)
      setAiSuggestion(null)
    }
  }

  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!content.trim() || !myFeeling.trim()) {
      alert('请填写完整信息')
      return
    }

    setIsSubmitting(true)

    try {
      const record = {
        content: content.trim(),
        myFeeling: myFeeling.trim(),
        date: date,
        autoTags: aiSuggestion || [],
        manualTags: selectedTags.filter(t => !(aiSuggestion || []).includes(t))
      }

      await onSubmit(record)

      // 重置表单
      setContent('')
      setMyFeeling('')
      setDate(new Date().toISOString().split('T')[0])
      setSelectedTags([])
      setAiSuggestion(null)
      setAiComment('')

      alert('记录添加成功！')
    } catch (error) {
      alert('添加失败：' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 格式化日期
  const formatDateDisplay = (dateStr) => {
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return { year, month, day }
  }

  const dateDisplay = formatDateDisplay(date)

  return (
    <div style={styles.container}>
      {/* 顶部票据头 */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.ticketInfo}>
            <span style={styles.label}>FORM</span>
            <span style={styles.ticketNo}>NO.001</span>
          </div>
          <div style={styles.sectionTitle}>
            <span style={styles.titleMain}>NEW</span>
            <span style={styles.titleSub}>RECORD</span>
          </div>
        </div>
        <div style={styles.headerLine} />
      </div>

      <form onSubmit={handleSubmit}>
        {/* 日期选择区 */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionLabel}>DATE</span>
            <span style={styles.sectionDivider}>|</span>
            <span style={styles.sectionLabelZh}>日期</span>
          </div>
          <div style={styles.dateDisplay}>
            <div style={styles.dateLeft}>
              <div style={styles.dateYear}>{dateDisplay.year}</div>
              <div style={styles.dateMD}>
                <span style={styles.dateMonth}>{dateDisplay.month}</span>
                <span style={styles.dateSlash}>/</span>
                <span style={styles.dateDay}>{dateDisplay.day}</span>
              </div>
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={styles.dateInput}
              required
            />
          </div>
        </div>

        {/* A发言记录 */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionLabel}>CONTENT</span>
            <span style={styles.sectionDivider}>|</span>
            <span style={styles.sectionLabelZh}>A发言</span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="输入内容..."
            style={styles.textarea}
            rows={5}
            required
          />
          <div style={styles.charCount}>{content.length} chars</div>
        </div>

        {/* 我的感受 */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionLabel}>FEELING</span>
            <span style={styles.sectionDivider}>|</span>
            <span style={styles.sectionLabelZh}>我的感受</span>
          </div>
          <textarea
            value={myFeeling}
            onChange={(e) => setMyFeeling(e.target.value)}
            placeholder="输入感受..."
            style={styles.textarea}
            rows={3}
            required
          />
          <div style={styles.charCount}>{myFeeling.length} chars</div>
        </div>

        {/* AI 分析按钮 */}
        <div style={styles.section}>
          <button
            type="button"
            onClick={handleAiAnalyze}
            disabled={isAnalyzing}
            style={{
              ...styles.aiButton,
              ...(isAnalyzing ? styles.aiButtonLoading : {})
            }}
          >
            <span style={styles.aiButtonLabel}>AI ANALYSIS</span>
            <span style={styles.aiButtonLabelZh}>智能分析</span>
          </button>

          {/* AI 评论 */}
          {aiComment && (
            <div style={styles.aiComment}>
              <span style={styles.aiCommentQuote}>"</span>
              <span style={styles.aiCommentText}>{aiComment}</span>
            </div>
          )}

          {/* AI 建议 */}
          {aiSuggestion && aiSuggestion.length > 0 && (
            <div style={styles.aiSuggestion}>
              <div style={styles.aiSuggestionHeader}>
                <span style={styles.aiSuggestionLabel}>AI SUGGESTION</span>
                <button
                  type="button"
                  onClick={acceptAiSuggestion}
                  style={styles.acceptButton}
                >
                  ACCEPT →
                </button>
              </div>
              <div style={styles.suggestionTags}>
                {aiSuggestion.map(tag => (
                  <span key={tag} style={styles.suggestionTag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 标签选择 */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionLabel}>TAGS</span>
            <span style={styles.sectionDivider}>|</span>
            <span style={styles.sectionLabelZh}>标签</span>
          </div>
          <div style={styles.tagsGrid}>
            {PRESET_TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                style={{
                  ...styles.tag,
                  ...(selectedTags.includes(tag) ? styles.tagActive : {})
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 提交按钮 */}
        <div style={styles.submitSection}>
          <div style={styles.submitLine} />
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              ...styles.submitButton,
              ...(isSubmitting ? styles.submitButtonDisabled : {})
            }}
          >
            <span style={styles.submitIcon}>■</span>
            <span style={styles.submitLabel}>SUBMIT</span>
            <span style={styles.submitLabelZh}>提交</span>
          </button>
        </div>
      </form>

      {/* 底部装饰 */}
      <div style={styles.footer}>
        <div style={styles.footerLine} />
        <div style={styles.footerText}>
          <span>END OF FORM</span>
          <span style={styles.footerDot}>◆</span>
        </div>
      </div>
    </div>
  )
}

// 票据风样式
const styles = {
  container: {
    maxWidth: '700px',
    margin: '0 auto'
  },
  // 顶部票据头
  header: {
    marginBottom: '32px'
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  ticketInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  label: {
    fontSize: '10px',
    letterSpacing: '2px',
    fontFamily: '"Courier New", monospace',
    color: '#999999'
  },
  ticketNo: {
    fontSize: '24px',
    fontWeight: '700',
    fontFamily: '"Helvetica Now", "Arial", sans-serif',
    letterSpacing: '-1px'
  },
  sectionTitle: {
    textAlign: 'right'
  },
  titleMain: {
    display: 'block',
    fontSize: '48px',
    fontWeight: '900',
    fontFamily: '"Helvetica Now", "Arial Black", sans-serif',
    letterSpacing: '-3px',
    lineHeight: '0.85'
  },
  titleSub: {
    display: 'block',
    fontSize: '14px',
    letterSpacing: '4px',
    fontFamily: '"Courier New", monospace',
    marginTop: '4px'
  },
  headerLine: {
    height: '3px',
    background: '#000000'
  },
  // 分区样式
  section: {
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '1px solid #e0e0e0'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px'
  },
  sectionLabel: {
    fontSize: '11px',
    letterSpacing: '2px',
    fontFamily: '"Courier New", monospace',
    fontWeight: '600',
    color: '#000000'
  },
  sectionDivider: {
    fontSize: '12px',
    color: '#cccccc'
  },
  sectionLabelZh: {
    fontSize: '10px',
    letterSpacing: '1px',
    fontFamily: '"Courier New", monospace',
    color: '#999999'
  },
  // 日期显示
  dateDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dateLeft: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px'
  },
  dateYear: {
    fontSize: '12px',
    fontFamily: '"Courier New", monospace',
    color: '#999999'
  },
  dateMD: {
    fontSize: '32px',
    fontWeight: '700',
    fontFamily: '"Helvetica Now", "Arial", sans-serif',
    lineHeight: '1'
  },
  dateMonth: {
    color: '#000000'
  },
  dateSlash: {
    margin: '0 4px',
    color: '#cccccc'
  },
  dateDay: {
    color: '#000000'
  },
  dateInput: {
    padding: '8px 12px',
    fontSize: '12px',
    fontFamily: '"Courier New", monospace',
    border: '2px solid #000000',
    background: '#ffffff',
    cursor: 'pointer'
  },
  // 输入框
  textarea: {
    width: '100%',
    padding: '16px',
    fontSize: '14px',
    fontFamily: '"Helvetica Now", "Arial", sans-serif',
    lineHeight: '1.6',
    border: '2px solid #e0e0e0',
    background: '#fafafa',
    resize: 'none',
    letterSpacing: '0.3px'
  },
  charCount: {
    textAlign: 'right',
    fontSize: '10px',
    fontFamily: '"Courier New", monospace',
    color: '#999999',
    marginTop: '4px'
  },
  // AI 按钮
  aiButton: {
    width: '100%',
    padding: '16px',
    background: '#000000',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  },
  aiButtonLoading: {
    opacity: 0.6,
    cursor: 'wait'
  },
  aiButtonLabel: {
    fontSize: '12px',
    letterSpacing: '2px',
    fontFamily: '"Courier New", monospace',
    fontWeight: '600'
  },
  aiButtonLabelZh: {
    fontSize: '10px',
    fontFamily: '"Courier New", monospace',
    opacity: 0.7
  },
  aiComment: {
    marginTop: '16px',
    padding: '16px',
    border: '2px dashed #000000',
    background: '#fafafa',
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start'
  },
  aiCommentQuote: {
    fontSize: '24px',
    lineHeight: '1',
    flexShrink: 0
  },
  aiCommentText: {
    fontSize: '13px',
    fontFamily: '"Helvetica Now", "Arial", sans-serif',
    lineHeight: '1.6',
    fontStyle: 'italic'
  },
  aiSuggestion: {
    marginTop: '16px',
    padding: '16px',
    border: '3px solid #000000',
    background: '#ffffff'
  },
  aiSuggestionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  aiSuggestionLabel: {
    fontSize: '11px',
    letterSpacing: '2px',
    fontFamily: '"Courier New", monospace',
    fontWeight: '600'
  },
  acceptButton: {
    padding: '6px 12px',
    fontSize: '11px',
    fontFamily: '"Courier New", monospace',
    background: '#000000',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer'
  },
  suggestionTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  suggestionTag: {
    padding: '6px 12px',
    background: '#f5f5f5',
    border: '1px solid #000000',
    fontSize: '11px',
    fontFamily: '"Courier New", monospace'
  },
  // 标签网格
  tagsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px'
  },
  tag: {
    padding: '12px',
    background: '#ffffff',
    border: '2px solid #e0e0e0',
    fontSize: '11px',
    fontFamily: '"Courier New", monospace',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  tagActive: {
    background: '#000000',
    color: '#ffffff',
    borderColor: '#000000'
  },
  // 提交区域
  submitSection: {
    marginTop: '40px'
  },
  submitLine: {
    height: '2px',
    background: '#000000',
    marginBottom: '24px'
  },
  submitButton: {
    width: '100%',
    padding: '20px',
    background: '#000000',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px'
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  submitIcon: {
    fontSize: '8px'
  },
  submitLabel: {
    fontSize: '14px',
    letterSpacing: '3px',
    fontFamily: '"Courier New", monospace',
    fontWeight: '700'
  },
  submitLabelZh: {
    fontSize: '11px',
    fontFamily: '"Courier New", monospace',
    opacity: 0.7
  },
  // 底部装饰
  footer: {
    marginTop: '48px'
  },
  footerLine: {
    height: '1px',
    background: '#e0e0e0'
  },
  footerText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '16px 0',
    fontSize: '10px',
    letterSpacing: '3px',
    fontFamily: '"Courier New", monospace',
    color: '#999999'
  },
  footerDot: {
    fontSize: '8px'
  }
}
