import { useState, useEffect } from 'react'
import recordService from '../db/records'

/**
 * 记录详情组件 - 数字极简票券风
 */
export default function RecordDetail({ recordId, onClose }) {
  const [record, setRecord] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true)
      try {
        const data = await recordService.getById(recordId)
        setRecord(data)
      } catch (error) {
        alert('加载失败：' + error.message)
      } finally {
        setLoading(false)
      }
    }

    if (recordId) loadDetail()
  }, [recordId])

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.loadingText}>LOADING...</div>
        </div>
      </div>
    )
  }

  if (!record) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <div style={styles.errorIcon}>■</div>
          <p style={styles.errorText}>RECORD NOT FOUND</p>
          <button onClick={onClose} style={styles.backButton}>
            ← BACK
          </button>
        </div>
      </div>
    )
  }

  // 格式化日期
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
    const weekday = weekdays[date.getDay()]
    return { year, month, day, weekday }
  }

  const date = formatDate(record.date)
  const createdDate = new Date(record.createdAt)
  const createdFormatted = `${String(createdDate.getHours()).padStart(2, '0')}:${String(createdDate.getMinutes()).padStart(2, '0')}:${String(createdDate.getSeconds()).padStart(2, '0')}`

  return (
    <div style={styles.container}>
      {/* 顶部票据头 */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <button onClick={onClose} style={styles.backBtn}>
            ←
          </button>
          <div style={styles.ticketInfo}>
            <span style={styles.label}>TICKET</span>
            <span style={styles.ticketNo}>#{record.id}</span>
          </div>
        </div>
        <div style={styles.headerMain}>
          <h1 style={styles.mainTitle}>DETAIL</h1>
          <div style={styles.subtitle}>
            <span>RECORD</span>
            <span style={styles.arrow}>→</span>
            <span>VIEW</span>
          </div>
        </div>
      </div>

      {/* 主要票据 */}
      <div style={styles.ticket}>
        {/* 票据左侧 */}
        <div style={styles.ticketLeft}>
          <div style={styles.ticketDate}>
            <div style={styles.dateYear}>{date.year}</div>
            <div style={styles.dateMD}>
              <span style={styles.dateMonth}>{date.month}</span>
              <span style={styles.dateDivider}>/</span>
              <span style={styles.dateDay}>{date.day}</span>
            </div>
            <div style={styles.dateWeekday}>{date.weekday}</div>
          </div>
          <div style={styles.ticketDivider} />
          <div style={styles.ticketTime}>
            <span style={styles.timeLabel}>CREATED</span>
            <span style={styles.timeValue}>{createdFormatted}</span>
          </div>
        </div>

        {/* 票据右侧 */}
        <div style={styles.ticketRight}>
          {/* A发言记录 */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionLabel}>CONTENT</span>
              <span style={styles.sectionDivider}>|</span>
              <span style={styles.sectionLabelZh}>A发言记录</span>
            </div>
            <div style={styles.contentBox}>
              <div style={styles.contentText}>{record.content}</div>
            </div>
          </div>

          {/* 我的感受 */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionLabel}>FEELING</span>
              <span style={styles.sectionDivider}>|</span>
              <span style={styles.sectionLabelZh}>我的感受</span>
            </div>
            <div style={styles.feelingBox}>
              <div style={styles.feelingText}>{record.myFeeling}</div>
            </div>
          </div>

          {/* 标签 */}
          {record.tags && record.tags.length > 0 && (
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionLabel}>TAGS</span>
                <span style={styles.sectionDivider}>|</span>
                <span style={styles.sectionLabelZh}>标签</span>
              </div>
              <div style={styles.tagsContainer}>
                {record.tags.map((tag, i) => (
                  <span key={i} style={styles.tag}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部装饰 */}
      <div style={styles.footer}>
        <div style={styles.footerLine} />
        <div style={styles.footerText}>
          <span>END OF TICKET</span>
          <span style={styles.footerDot}>◆</span>
        </div>
        <div style={styles.footerLine} />
      </div>
    </div>
  )
}

// 票据风样式
const styles = {
  container: {
    padding: '24px 20px',
    maxWidth: '700px',
    margin: '0 auto',
    minHeight: '100vh',
    background: '#ffffff',
    color: '#000000'
  },
  // 加载和错误状态
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh'
  },
  loadingText: {
    fontSize: '14px',
    letterSpacing: '4px',
    fontFamily: '"Courier New", monospace',
    color: '#000000'
  },
  error: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    textAlign: 'center'
  },
  errorIcon: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  errorText: {
    fontSize: '16px',
    letterSpacing: '2px',
    fontFamily: '"Courier New", monospace',
    margin: '0 0 24px 0',
    color: '#000000'
  },
  backButton: {
    padding: '12px 24px',
    fontSize: '11px',
    fontFamily: '"Courier New", monospace',
    background: '#ffffff',
    color: '#000000',
    border: '2px solid #000000',
    cursor: 'pointer'
  },
  // 顶部票据头
  header: {
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '3px solid #000000'
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  backBtn: {
    width: '44px',
    height: '44px',
    fontSize: '20px',
    background: '#ffffff',
    color: '#000000',
    border: '2px solid #000000',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  ticketInfo: {
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px'
  },
  label: {
    fontSize: '10px',
    letterSpacing: '2px',
    fontFamily: '"Courier New", monospace',
    color: '#999999'
  },
  ticketNo: {
    fontSize: '18px',
    fontWeight: '700',
    fontFamily: '"Helvetica Now", "Arial", sans-serif',
    letterSpacing: '-0.5px'
  },
  headerMain: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  mainTitle: {
    fontSize: '56px',
    fontWeight: '900',
    fontFamily: '"Helvetica Now", "Arial Black", sans-serif',
    letterSpacing: '-3px',
    lineHeight: '0.85',
    margin: '0'
  },
  subtitle: {
    fontSize: '12px',
    letterSpacing: '4px',
    fontFamily: '"Courier New", monospace',
    textTransform: 'uppercase',
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  arrow: {
    fontSize: '16px'
  },
  // 主票据
  ticket: {
    display: 'flex',
    border: '3px solid #000000',
    background: '#ffffff',
    marginBottom: '48px'
  },
  // 票据左侧
  ticketLeft: {
    width: '120px',
    borderRight: '2px solid #000000',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#f5f5f5'
  },
  ticketDate: {
    textAlign: 'center',
    marginBottom: '24px'
  },
  dateYear: {
    fontSize: '11px',
    fontFamily: '"Courier New", monospace',
    color: '#999999',
    marginBottom: '8px',
    letterSpacing: '1px'
  },
  dateMD: {
    fontSize: '32px',
    fontWeight: '700',
    fontFamily: '"Helvetica Now", "Arial", sans-serif',
    lineHeight: '1',
    marginBottom: '8px'
  },
  dateMonth: {
    color: '#000000'
  },
  dateDivider: {
    margin: '0 4px',
    color: '#666666'
  },
  dateDay: {
    color: '#000000'
  },
  dateWeekday: {
    fontSize: '10px',
    letterSpacing: '1px',
    fontFamily: '"Courier New", monospace',
    color: '#666666'
  },
  ticketDivider: {
    width: '100%',
    height: '1px',
    background: '#e0e0e0',
    marginBottom: '24px'
  },
  ticketTime: {
    textAlign: 'center'
  },
  timeLabel: {
    fontSize: '9px',
    letterSpacing: '1px',
    fontFamily: '"Courier New", monospace',
    color: '#999999',
    marginBottom: '4px'
  },
  timeValue: {
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: '"Courier New", monospace',
    color: '#000000'
  },
  // 票据右侧
  ticketRight: {
    flex: 1,
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
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
  contentBox: {
    padding: '20px',
    background: '#fafafa',
    border: '2px solid #e0e0e0'
  },
  contentText: {
    fontSize: '15px',
    fontFamily: '"Helvetica Now", "Arial", sans-serif',
    lineHeight: '1.7',
    color: '#000000',
    letterSpacing: '0.3px',
    whiteSpace: 'pre-wrap'
  },
  feelingBox: {
    padding: '20px',
    background: '#ffffff',
    border: '2px dashed #000000'
  },
  feelingText: {
    fontSize: '14px',
    fontFamily: '"Helvetica Now", "Arial", sans-serif',
    lineHeight: '1.7',
    color: '#333333',
    fontStyle: 'italic',
    letterSpacing: '0.3px',
    whiteSpace: 'pre-wrap'
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  tag: {
    padding: '6px 12px',
    background: '#ffffff',
    border: '2px solid #000000',
    fontSize: '11px',
    fontFamily: '"Courier New", monospace',
    color: '#000000',
    letterSpacing: '1px'
  },
  // 底部装饰
  footer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'center'
  },
  footerLine: {
    width: '100%',
    height: '1px',
    background: '#e0e0e0'
  },
  footerText: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '10px',
    letterSpacing: '3px',
    fontFamily: '"Courier New", monospace',
    color: '#999999',
    padding: '16px 0'
  },
  footerDot: {
    fontSize: '8px'
  }
}
