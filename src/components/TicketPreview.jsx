import { useState } from 'react'
import RecordListPreview from './RecordList_Ticket'

/**
 * 票据风预览页面
 */
export default function TicketPreview({ onClose, onViewDetail }) {
  const [selectedRecord, setSelectedRecord] = useState(null)

  const handleViewDetail = (record) => {
    setSelectedRecord(record)
    if (onViewDetail) onViewDetail(record)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#ffffff',
      zIndex: 9999,
      overflow: 'auto'
    }}>
      {/* 顶部提示条 */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '12px 20px',
        background: '#000000',
        color: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10000
      }}>
        <span style={{
          fontSize: '11px',
          letterSpacing: '2px',
          fontFamily: '"Courier New", monospace'
        }}>
          ◆ 设计预览 / TICKET STYLE PREVIEW
        </span>
        <button
          onClick={onClose}
          style={{
            padding: '6px 12px',
            fontSize: '11px',
            fontFamily: '"Courier New", monospace',
            background: '#ffffff',
            color: '#000000',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '1px'
          }}
        >
          ✕ CLOSE
        </button>
      </div>

      {/* 预览内容 */}
      <div style={{ marginTop: '48px' }}>
        <RecordListPreview
          onViewDetail={handleViewDetail}
          onRefresh={() => {}}
        />
      </div>
    </div>
  )
}
