/**
 * 应用主布局 - 数字极简票券风
 */
export default function Layout({ children, currentPage, onPageChange }) {
  const navItems = [
    { id: 'record', icon: '01', label: 'RECORD', labelZh: '记录' },
    { id: 'list', icon: '02', label: 'LIST', labelZh: '列表' },
    { id: 'stats', icon: '03', label: 'STATS', labelZh: '统计' },
    { id: 'settings', icon: '04', label: 'SET', labelZh: '设置' }
  ]

  return (
    <div style={styles.container}>
      {/* 背景装饰 - 极简网格 */}
      <div style={styles.gridDecoration} />

      {/* 主内容区域 */}
      <main style={styles.main}>
        {children}
      </main>

      {/* 底部导航栏 - 票据风格 */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          {/* 顶部装饰线 */}
          <div style={styles.navTopLine} />
          <div style={styles.navMain}>
            {/* 左侧装饰 */}
            <div style={styles.navDecoration}>
              <span style={styles.barcode}>|||| ||| ||</span>
            </div>

            {/* 导航按钮 */}
            <div style={styles.navItems}>
              {navItems.map((item, index) => (
                <NavItem
                  key={item.id}
                  {...item}
                  active={currentPage === item.id}
                  onClick={() => onPageChange(item.id)}
                  index={index}
                />
              ))}
            </div>

            {/* 右侧装饰 */}
            <div style={styles.navDecoration}>
              <span style={styles.ticketNo}>NO.{String(currentPage ? navItems.findIndex(n => n.id === currentPage) + 1 : 1).padStart(2, '0')}</span>
            </div>
          </div>
          {/* 底部装饰线 */}
          <div style={styles.navBottomLine} />
        </div>
      </nav>
    </div>
  )
}

/**
 * 导航按钮组件 - 票券风格
 */
function NavItem({ icon, label, labelZh, active, onClick, index }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.navItem,
        ...(active ? styles.navItemActive : {})
      }}
    >
      <div style={styles.navItemTop}>
        <span style={styles.navItemIndex}>{icon}</span>
        {active && <span style={styles.navIndicator}>◆</span>}
      </div>
      <span style={styles.navItemLabel}>{label}</span>
      <span style={styles.navItemLabelZh}>{labelZh}</span>
    </button>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    background: '#ffffff',
    color: '#000000'
  },
  gridDecoration: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 0,
    backgroundImage: `
      linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px'
  },
  main: {
    flex: 1,
    paddingBottom: '140px',
    position: 'relative',
    zIndex: 1,
    padding: '24px 20px',
    maxWidth: '700px',
    margin: '0 auto',
    width: '100%'
  },
  navbar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: '#ffffff',
    borderTop: '3px solid #000000',
    zIndex: 100,
    paddingBottom: 'env(safe-area-inset-bottom)',
    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)'
  },
  navContent: {
    maxWidth: '700px',
    margin: '0 auto'
  },
  navTopLine: {
    height: '1px',
    background: 'linear-gradient(to right, transparent, #e0e0e0, transparent)'
  },
  navMain: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px'
  },
  navDecoration: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0
  },
  barcode: {
    fontSize: '8px',
    fontFamily: '"Courier New", monospace',
    letterSpacing: '1px',
    color: '#999999'
  },
  ticketNo: {
    fontSize: '9px',
    fontFamily: '"Courier New", monospace',
    letterSpacing: '1px',
    color: '#666666',
    fontWeight: '600'
  },
  navItems: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    flex: 1
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '10px 16px',
    background: 'transparent',
    border: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minWidth: '60px'
  },
  navItemActive: {
    background: '#000000',
    color: '#ffffff',
    borderColor: '#000000'
  },
  navItemTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    height: '16px'
  },
  navItemIndex: {
    fontSize: '10px',
    fontFamily: '"Courier New", monospace',
    letterSpacing: '1px',
    fontWeight: '600'
  },
  navIndicator: {
    fontSize: '8px'
  },
  navItemLabel: {
    fontSize: '11px',
    fontFamily: '"Helvetica Now", "Arial", sans-serif',
    fontWeight: '700',
    letterSpacing: '1px',
    lineHeight: '1'
  },
  navItemLabelZh: {
    fontSize: '9px',
    fontFamily: '"Courier New", monospace',
    letterSpacing: '1px',
    opacity: 0.7,
    marginTop: '2px'
  },
  navBottomLine: {
    height: '2px',
    background: '#000000'
  }
}
