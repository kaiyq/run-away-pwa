import { useState, useEffect } from 'react'
import recordService from '../db/records'

/**
 * 记录列表组件 - 数字极简票券风
 */
export default function RecordListPreview({ onViewDetail, onRefresh }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')

  const loadRecords = async () => {
    setLoading(true)
    try {
      const data = await recordService.getAll({ searchText })
      setRecords(data)
    } catch (error) {
      alert('加载失败：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这条记录吗？')) return
    try {
      await recordService.delete(id)
      await loadRecords()
      if (onRefresh) onRefresh()
    } catch (error) {
      alert('删除失败：' + error.message)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => loadRecords(), 300)
    return () => clearTimeout(timer)
  }, [searchText])

  useEffect(() => {
    loadRecords()
  }, [])

  // 格式化日期为票据风格
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const weekday = weekdays[date.getDay()]
    return { year, month, day, weekday }
  }

  return (
    <div style={styles.container}>
      {/* 顶部票据头 */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.ticketNo}>
            <span style={styles.label}>TICKET NO.</span>
            <span style={styles.number}>{String(records.length).padStart(4, '0')}</span>
          </div>
          <div style={styles.dateInfo}>
            <span style={styles.dateLabel}>RECORD LIST</span>
            <span style={styles.barcode}>|||| ||| || |||</span>
          </div>
        </div>
        <div style={styles.headerMain}>
          <h1 style={styles.mainTitle}>RECORDS</h1>
          <div style={styles.subtitle}>
            <span>记录</span>
            <span style={styles.arrow}>→</span>
            <span>LIST</span>
          </div>
        </div>
      </div>

      {/* 搜索框 - 票据风格 */}
      <div style={styles.searchSection}>
        <div style={styles.searchLabel}>
          <span>@</span>
          <span>SEARCH</span>
        </div>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="输入关键词..."
          style={styles.searchInput}
        />
      </div>

      {/* 记录列表 - 票券卡片 */}
      {loading ? (
        <div style={styles.loading}>
          <div style={styles.loadingText}>LOADING...</div>
        </div>
      ) : records.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>□</div>
          <p style={styles.emptyText}>NO RECORDS FOUND</p>
          <p style={styles.emptySub}>暂无记录</p>
        </div>
      ) : (
        <div style={styles.list}>
          {records.map((record, index) => {
            const date = formatDate(record.date)
            return (
              <div key={record.id} style={styles.ticket}>
                {/* 票据左侧 - 序号和日期 */}
                <div style={styles.ticketLeft}>
                  <div style={styles.ticketNo}>
                    <span style={styles.noLabel}>NO.</span>
                    <span style={styles.noNumber}>{String(index + 1).padStart(3, '0')}</span>
                  </div>
                  <div style={styles.ticketDate}>
                    <div style={styles.dateYear}>{date.year}</div>
                    <div style={styles.dateMD}>
                      <span style={styles.dateMonth}>{date.month}</span>
                      <span style={styles.dateDivider}>/</span>
                      <span style={styles.dateDay}>{date.day}</span>
                    </div>
                    <div style={styles.dateWeekday}>{date.weekday}</div>
                  </div>
                </div>

                {/* 票据右侧 - 内容 */}
                <div style={styles.ticketRight}>
                  <div style={styles.contentSection}>
                    <div style={styles.sectionLabel}>〈 A发言记录 〉</div>
                    <div style={styles.contentText}>
                      {record.content.slice(0, 50)}
                      {record.content.length > 50 && '...'}
                    </div>
                  </div>

                  {record.myFeeling && (
                    <div style={styles.feelingSection}>
                      <div style={styles.sectionLabel}>〈 我的感受 〉</div>
                      <div style={styles.feelingText}>
                        {record.myFeeling.slice(0, 40)}
                        {record.myFeeling.length > 40 && '...'}
                      </div>
                    </div>
                  )}

                  {record.tags && record.tags.length > 0 && (
                    <div style={styles.tagsRow}>
                      {record.tags.map((tag, i) => (
                        <span key={i} style={styles.tag}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 票据底部 - 操作按钮 */}
                  <div style={styles.ticketActions}>
                    <div style={styles.actionLeft}>
                      <span style={styles.checkMark}>✓</span>
                      <span style={styles.validMark}>VALID</span>
                    </div>
                    <div style={styles.actionButtons}>
                      <button onClick={() => onViewDetail && onViewDetail(record)} style={styles.detailBtn}>
                        DETAIL →
                      </button>
                      <button onClick={() => handleDelete(record.id)} style={styles.deleteBtn}>
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 底部装饰 */}
      <div style={styles.footer}>
        <div style={styles.footerLine} />
        <div style={styles.footerText}>
          <span>END OF LIST</span>
          <span style={styles.footerDot}>■</span>
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
  ticketNo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  label: {
    fontSize: '10px',
    letterSpacing: '2px',
    fontWeight: '400',
    fontFamily: '"Courier New", monospace',
    color: '#666666'
  },
  number: {
    fontSize: '32px',
    fontWeight: '700',
    fontFamily: '"Helvetica Now", "Arial", sans-serif',
    letterSpacing: '-1px',
    lineHeight: '1'
  },
  dateInfo: {
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px'
  },
  dateLabel: {
    fontSize: '10px',
    letterSpacing: '2px',
    fontFamily: '"Courier New", monospace',
    color: '#666666'
  },
  barcode: {
    fontSize: '12px',
    fontFamily: '"Courier New", monospace',
    letterSpacing: '2px',
    color: '#000000'
  },
  headerMain: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  mainTitle: {
    fontSize: '64px',
    fontWeight: '900',
    fontFamily: '"Helvetica Now", "Arial Black", sans-serif',
    letterSpacing: '-4px',
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
  // 搜索区域
  searchSection: {
    marginBottom: '32px',
    padding: '16px',
    border: '2px solid #000000',
    background: '#fafafa'
  },
  searchLabel: {
    fontSize: '10px',
    letterSpacing: '2px',
    fontFamily: '"Courier New", monospace',
    marginBottom: '8px',
    display: 'flex',
    gap: '6px',
    color: '#666666'
  },
  searchInput: {
    width: '100%',
    padding: '12px 0',
    fontSize: '14px',
    fontFamily: '"Helvetica Now", "Arial", sans-serif',
    border: 'none',
    borderBottom: '2px solid #000000',
    background: 'transparent',
    outline: 'none',
    letterSpacing: '0.5px'
  },
  // 加载和空状态
  loading: {
    padding: '80px 20px',
    textAlign: 'center'
  },
  loadingText: {
    fontSize: '14px',
    letterSpacing: '4px',
    fontFamily: '"Courier New", monospace',
    color: '#000000'
  },
  empty: {
    padding: '80px 20px',
    textAlign: 'center',
    border: '2px dashed #000000'
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  emptyText: {
    fontSize: '16px',
    letterSpacing: '2px',
    fontFamily: '"Courier New", monospace',
    margin: '0 0 8px 0',
    color: '#000000'
  },
  emptySub: {
    fontSize: '12px',
    color: '#666666',
    fontFamily: '"Helvetica Now", "Arial", sans-serif',
    margin: '0'
  },
  // 票据列表
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  ticket: {
    display: 'flex',
    border: '3px solid #000000',
    background: '#ffffff',
    position: 'relative',
    overflow: 'hidden'
  },
  // 票据左侧
  ticketLeft: {
    width: '100px',
    borderRight: '2px solid #000000',
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#f5f5f5'
  },
  ticketDate: {
    marginTop: '16px',
    textAlign: 'center'
  },
  dateYear: {
    fontSize: '11px',
    fontFamily: '"Courier New", monospace',
    color: '#666666',
    marginBottom: '8px',
    letterSpacing: '1px'
  },
  dateMD: {
    fontSize: '28px',
    fontWeight: '700',
    fontFamily: '"Helvetica Now", "Arial", sans-serif',
    lineHeight: '1',
    marginBottom: '4px'
  },
  dateMonth: {
    color: '#000000'
  },
  dateDivider: {
    margin: '0 2px',
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
  // 票据右侧
  ticketRight: {
    flex: 1,
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  contentSection: {
    marginBottom: '4px'
  },
  sectionLabel: {
    fontSize: '10px',
    letterSpacing: '2px',
    fontFamily: '"Courier New", monospace',
    color: '#666666',
    marginBottom: '8px'
  },
  contentText: {
    fontSize: '14px',
    fontFamily: '"Helvetica Now", "Arial", sans-serif',
    lineHeight: '1.6',
    color: '#000000',
    letterSpacing: '0.3px'
  },
  feelingSection: {
    marginBottom: '4px'
  },
  feelingText: {
    fontSize: '13px',
    fontFamily: '"Helvetica Now", "Arial", sans-serif',
    lineHeight: '1.6',
    color: '#444444',
    fontStyle: 'italic',
    letterSpacing: '0.3px'
  },
  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  tag: {
    fontSize: '10px',
    fontFamily: '"Courier New", monospace',
    color: '#000000',
    letterSpacing: '1px',
    padding: '4px 8px',
    border: '1px solid #000000',
    background: '#ffffff'
  },
  // 票据操作区
  ticketActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: '1px solid #e0e0e0',
    marginTop: '8px'
  },
  actionLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  checkMark: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#000000'
  },
  validMark: {
    fontSize: '10px',
    letterSpacing: '2px',
    fontFamily: '"Courier New", monospace',
    color: '#666666'
  },
  actionButtons: {
    display: 'flex',
    gap: '12px'
  },
  detailBtn: {
    padding: '8px 16px',
    fontSize: '11px',
    fontFamily: '"Courier New", monospace',
    letterSpacing: '1px',
    background: '#000000',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  deleteBtn: {
    width: '32px',
    height: '32px',
    fontSize: '20px',
    fontWeight: '300',
    background: '#ffffff',
    color: '#000000',
    border: '2px solid #000000',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  // 底部装饰
  footer: {
    marginTop: '48px',
    padding: '24px 0',
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
    color: '#999999'
  },
  footerDot: {
    fontSize: '8px'
  }
}
