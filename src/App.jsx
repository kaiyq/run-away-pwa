import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import RecordForm from './components/RecordForm'
import RecordList from './components/RecordList'
import RecordDetail from './components/RecordDetail'
import StatsPage from './components/StatsPage'
import SettingsPage from './components/SettingsPage'
import TicketPreview from './components/TicketPreview'
import recordService from './db/records'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('record')
  const [selectedRecordId, setSelectedRecordId] = useState(null)
  const [listKey, setListKey] = useState(0) // 用于刷新列表
  const [showTicketPreview, setShowTicketPreview] = useState(false) // 票据风预览

  // 处理记录提交
  const handleSubmit = async (record) => {
    await recordService.add(record)
    setListKey(prev => prev + 1) // 刷新列表
  }

  // 查看记录详情
  const handleViewDetail = (record) => {
    setSelectedRecordId(record.id)
  }

  // 关闭详情页
  const handleCloseDetail = () => {
    setSelectedRecordId(null)
  }

  // 如果正在查看详情
  if (selectedRecordId) {
    return <RecordDetail recordId={selectedRecordId} onClose={handleCloseDetail} />
  }

  // 根据当前页面渲染内容
  const renderContent = () => {
    switch (currentPage) {
      case 'record':
        return <RecordForm onSubmit={handleSubmit} />
      case 'list':
        return <RecordList
          key={listKey}
          onViewDetail={handleViewDetail}
          onRefresh={() => setListKey(prev => prev + 1)}
        />
      case 'stats':
        return <StatsPage />
      case 'settings':
        return <SettingsPage onShowTicketPreview={() => setShowTicketPreview(true)} />
      default:
        return <RecordForm onSubmit={handleSubmit} />
    }
  }

  return (
    <>
      {/* 票据风预览层 */}
      {showTicketPreview && (
        <TicketPreview
          onClose={() => setShowTicketPreview(false)}
          onViewDetail={handleViewDetail}
        />
      )}

      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderContent()}
      </Layout>
    </>
  )
}

export default App
