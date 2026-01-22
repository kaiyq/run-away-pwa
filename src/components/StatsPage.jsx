import { useState, useEffect } from 'react'
import recordService from '../db/records'

/**
 * 统计页面组件 - 数字极简票券风
 */
export default function StatsPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true)
      try {
        const data = await recordService.getStatistics()
        setStats(data)
      } catch (error) {
        alert('加载失败：' + error.message)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.loadingText}>LOADING...</div>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const topTags = Object.entries(stats.tagCount || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div style={styles.container}>
      {/* 顶部票据头 */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.ticketInfo}>
            <span style={styles.label}>STATISTICS</span>
            <span style={styles.ticketNo}>NO.001</span>
          </div>
          <div style={styles.dateInfo}>
            <span style={styles.dateLabel}>DATA</span>
            <span style={styles.barcode}>|||| ||| ||</span>
          </div>
        </div>
        <div style={styles.headerMain}>
          <h1 style={styles.mainTitle}>STATS</h1>
          <div style={styles.subtitle}>
            <span>数据</span>
            <span style={styles.arrow}>→</span>
            <span>统计</span>
          </div>
        </div>
      </div>

      {/* 总数票据 */}
      <div style={styles.totalTicket}>
        <div style={styles.totalLeft}>
          <div style={styles.totalLabel}>TOTAL</div>
          <div style={styles.totalLabelZh}>记录总数</div>
        </div>
        <div style={styles.totalRight}>
          <div style={styles.totalNumber}>{stats.total}</div>
          <div style={styles.totalUnit}>RECORDS</div>
        </div>
      </div>

      {/* 标签分布票据 */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionLabel}>TAGS</span>
          <span style={styles.sectionDivider}>|</span>
          <span style={styles.sectionLabelZh}>标签分布</span>
        </div>
        {Object.keys(stats.tagCount || {}).length === 0 ? (
          <div style={styles.empty}>
            <span style={styles.emptyText}>NO DATA</span>
          </div>
        ) : (
          <div style={styles.tagsList}>
            {topTags.map(([tag, count], index) => {
              const percentage = ((count / stats.total) * 100).toFixed(1)
              return (
                <div key={tag} style={styles.tagItem}>
                  <div style={styles.tagItemHeader}>
                    <div style={styles.tagIndex}>
                      <span style={styles.indexNo}>{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div style={styles.tagInfo}>
                      <span style={styles.tagName}>{tag}</span>
                      <span style={styles.tagCount}>{count}次</span>
                    </div>
                    <div style={styles.tagPercentage}>{percentage}%</div>
                  </div>
                  <div style={styles.progressBar}>
                    <div style={{...styles.progressFill, width: `${percentage}%`}} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 提示票据 */}
      <div style={styles.tipTicket}>
        <span style={styles.tipIcon}>◆</span>
        <span style={styles.tipText}>记录越多，统计数据越准确</span>
      </div>

      {/* 底部装饰 */}
      <div style={styles.footer}>
        <div style={styles.footerLine} />
        <div style={styles.footerText}>
          <span>END OF STATS</span>
          <span style={styles.footerDot}>■</span>
        </div>
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
  // 加载状态
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
  // 总数票据
  totalTicket: {
    display: 'flex',
    border: '3px solid #000000',
    background: '#000000',
    color: '#ffffff',
    marginBottom: '32px'
  },
  totalLeft: {
    flex: 1,
    padding: '32px',
    borderRight: '2px solid rgba(255,255,255,0.2)'
  },
  totalLabel: {
    fontSize: '12px',
    letterSpacing: '3px',
    fontFamily: '"Courier New", monospace',
    marginBottom: '8px',
    opacity: 0.8
  },
  totalLabelZh: {
    fontSize: '11px',
    fontFamily: '"Courier New", monospace',
    opacity: 0.6
  },
  totalRight: {
    width: '180px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  totalNumber: {
    fontSize: '56px',
    fontWeight: '900',
    fontFamily: '"Helvetica Now", "Arial Black", sans-serif',
    letterSpacing: '-3px',
    lineHeight: '1',
    marginBottom: '8px'
  },
  totalUnit: {
    fontSize: '10px',
    letterSpacing: '2px',
    fontFamily: '"Courier New", monospace',
    opacity: 0.7
  },
  // 分区样式
  section: {
    marginBottom: '32px',
    padding: '24px',
    border: '2px solid #e0e0e0',
    background: '#ffffff'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px'
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
  empty: {
    padding: '40px',
    textAlign: 'center',
    border: '2px dashed #e0e0e0'
  },
  emptyText: {
    fontSize: '12px',
    letterSpacing: '2px',
    fontFamily: '"Courier New", monospace',
    color: '#999999'
  },
  // 标签列表
  tagsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  tagItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  tagItemHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  tagIndex: {
    width: '40px',
    height: '40px',
    background: '#000000',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  indexNo: {
    fontSize: '12px',
    fontFamily: '"Courier New", monospace',
    fontWeight: '700',
    letterSpacing: '1px'
  },
  tagInfo: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tagName: {
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: '"Helvetica Now", "Arial", sans-serif',
    color: '#000000'
  },
  tagCount: {
    fontSize: '12px',
    fontFamily: '"Courier New", monospace',
    color: '#666666'
  },
  tagPercentage: {
    fontSize: '14px',
    fontWeight: '700',
    fontFamily: '"Helvetica Now", "Arial", sans-serif',
    color: '#000000'
  },
  progressBar: {
    width: '100%',
    height: '6px',
    background: '#f5f5f5',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: '#000000',
    transition: 'width 0.5s ease-out'
  },
  // 提示票据
  tipTicket: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    border: '2px solid #e0e0e0',
    background: '#fafafa',
    marginBottom: '32px'
  },
  tipIcon: {
    fontSize: '12px'
  },
  tipText: {
    fontSize: '13px',
    fontFamily: '"Helvetica Now", "Arial", sans-serif',
    color: '#666666',
    flex: 1
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
