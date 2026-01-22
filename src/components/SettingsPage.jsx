import { useState, useEffect } from 'react'
import recordService from '../db/records'

/**
 * 设置页面组件 - 数字极简票券风
 */
export default function SettingsPage() {
  const [recordCount, setRecordCount] = useState(0)

  useEffect(() => {
    const loadCount = async () => {
      try {
        const records = await recordService.getAll()
        setRecordCount(records.length)
      } catch (error) {
        console.error('加载记录数失败', error)
      }
    }
    loadCount()
  }, [])

  // 清空所有数据
  const handleClearAll = async () => {
    if (!confirm('⚠️ 警告：此操作将删除所有记录，且无法恢复！\n\n确定要继续吗？')) {
      return
    }

    if (!confirm('🔴 最后确认：真的要删除所有数据吗？')) {
      return
    }

    try {
      const records = await recordService.getAll()
      for (const record of records) {
        await recordService.delete(record.id)
      }
      alert('✅ 所有数据已清空')
      window.location.reload()
    } catch (error) {
      alert('删除失败：' + error.message)
    }
  }

  // 导出数据
  const handleExport = async () => {
    try {
      const data = await recordService.exportData()
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `run-away-backup-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      alert('✅ 数据已导出！')
    } catch (error) {
      alert('导出失败：' + error.message)
    }
  }

  return (
    <div style={styles.container}>
      {/* 顶部票据头 */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.ticketInfo}>
            <span style={styles.label}>SETTINGS</span>
            <span style={styles.ticketNo}>NO.004</span>
          </div>
          <div style={styles.sectionTitle}>
            <span style={styles.titleMain}>SET</span>
            <span style={styles.titleSub}>UP</span>
          </div>
        </div>
        <div style={styles.headerLine} />
      </div>

      {/* 数据概览票据 */}
      <div style={styles.dataTicket}>
        <div style={styles.dataLeft}>
          <div style={styles.dataLabel}>DATA</div>
          <div style={styles.dataLabelZh}>数据概览</div>
        </div>
        <div style={styles.dataRight}>
          <div style={styles.dataNumber}>{recordCount}</div>
          <div style={styles.dataUnit}>RECORDS</div>
        </div>
      </div>

      {/* 数据管理 */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionLabel}>MANAGEMENT</span>
          <span style={styles.sectionDivider}>|</span>
          <span style={styles.sectionLabelZh}>数据管理</span>
        </div>
        <div style={styles.buttonGroup}>
          <button onClick={handleExport} style={styles.exportButton}>
            <span style={styles.buttonLabel}>EXPORT</span>
            <span style={styles.buttonLabelZh}>导出数据</span>
          </button>
          <button onClick={handleClearAll} style={styles.clearButton}>
            <span style={styles.buttonLabel}>CLEAR</span>
            <span style={styles.buttonLabelZh}>清空所有</span>
          </button>
        </div>
        <div style={styles.tip}>
          <span style={styles.tipIcon}>◆</span>
          <span style={styles.tipText}>定期导出数据可以备份你的记录</span>
        </div>
      </div>

      {/* 关于 */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionLabel}>ABOUT</span>
          <span style={styles.sectionDivider}>|</span>
          <span style={styles.sectionLabelZh}>关于</span>
        </div>
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>APP NAME</span>
            <span style={styles.infoDivider}>→</span>
            <span style={styles.infoValue}>Run-A-Way</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>VERSION</span>
            <span style={styles.infoDivider}>→</span>
            <span style={styles.infoValue}>1.0.0</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>STORAGE</span>
            <span style={styles.infoDivider}>→</span>
            <span style={styles.infoValue}>LOCAL ONLY</span>
          </div>
        </div>
        <div style={styles.slogan}>
          <span style={styles.sloganText}>记录A发言，释放你的心情</span>
        </div>
      </div>

      {/* 底部装饰 */}
      <div style={styles.footer}>
        <div style={styles.footerLine} />
        <div style={styles.footerText}>
          <span>END OF SETTINGS</span>
          <span style={styles.footerDot}>◆</span>
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
  // 数据概览票据
  dataTicket: {
    display: 'flex',
    border: '3px solid #000000',
    background: '#000000',
    color: '#ffffff',
    marginBottom: '32px'
  },
  dataLeft: {
    flex: 1,
    padding: '32px',
    borderRight: '2px solid rgba(255,255,255,0.2)'
  },
  dataLabel: {
    fontSize: '12px',
    letterSpacing: '3px',
    fontFamily: '"Courier New", monospace',
    marginBottom: '8px',
    opacity: 0.8
  },
  dataLabelZh: {
    fontSize: '11px',
    fontFamily: '"Courier New", monospace',
    opacity: 0.6
  },
  dataRight: {
    width: '160px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dataNumber: {
    fontSize: '48px',
    fontWeight: '900',
    fontFamily: '"Helvetica Now", "Arial Black", sans-serif',
    letterSpacing: '-2px',
    lineHeight: '1',
    marginBottom: '8px'
  },
  dataUnit: {
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
  // 按钮组
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  exportButton: {
    padding: '16px',
    background: '#000000',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  },
  clearButton: {
    padding: '16px',
    background: '#ffffff',
    color: '#000000',
    border: '2px solid #000000',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  },
  buttonLabel: {
    fontSize: '12px',
    letterSpacing: '2px',
    fontFamily: '"Courier New", monospace',
    fontWeight: '600'
  },
  buttonLabelZh: {
    fontSize: '10px',
    fontFamily: '"Courier New", monospace',
    opacity: 0.7
  },
  tip: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '16px',
    padding: '12px',
    background: '#fafafa',
    border: '1px solid #e0e0e0'
  },
  tipIcon: {
    fontSize: '10px'
  },
  tipText: {
    fontSize: '12px',
    fontFamily: '"Helvetica Now", "Arial", sans-serif',
    color: '#666666',
    flex: 1
  },
  // 信息网格
  infoGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #e0e0e0'
  },
  infoLabel: {
    fontSize: '11px',
    letterSpacing: '2px',
    fontFamily: '"Courier New", monospace',
    color: '#666666'
  },
  infoDivider: {
    fontSize: '12px',
    color: '#e0e0e0'
  },
  infoValue: {
    fontSize: '13px',
    fontFamily: '"Helvetica Now", "Arial", sans-serif',
    color: '#000000',
    fontWeight: '600'
  },
  slogan: {
    marginTop: '20px',
    padding: '16px',
    background: '#fafafa',
    border: '2px solid #000000',
    textAlign: 'center'
  },
  sloganText: {
    fontSize: '13px',
    fontFamily: '"Helvetica Now", "Arial", sans-serif',
    color: '#000000',
    letterSpacing: '1px'
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
