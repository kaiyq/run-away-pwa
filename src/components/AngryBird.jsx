import { useState } from 'react'
import { motion } from 'framer-motion'

/**
 * 愤怒小鸟组件
 * 简约线条风格，带有趣味交互
 */
export default function AngryBird({ recordCount = 0 }) {
  const [emotion, setEmotion] = useState('normal') // normal, angry, explosion
  const [isFlying, setIsFlying] = useState(false)

  // 点击小鸟
  const handleClick = () => {
    if (emotion === 'normal') {
      setEmotion('angry')
      setTimeout(() => setEmotion('normal'), 1000)
    } else if (emotion === 'angry') {
      setEmotion('explosion')
      setTimeout(() => {
        setEmotion('normal')
      }, 1500)
    }
  }

  // 长按小鸟扔出
  const handleLongPress = () => {
    setIsFlying(true)
    setTimeout(() => {
      setIsFlying(false)
    }, 1000)
  }

  return (
    <motion.div
      className="fixed bottom-24 right-6 z-50 cursor-pointer select-none"
      initial={{ scale: 0 }}
      animate={{
        scale: isFlying ? [1, 0.5, 0] : 1,
        x: isFlying ? [0, 200, 300] : 0,
        y: isFlying ? [0, -100, 500] : 0,
        rotate: isFlying ? [0, 180, 720] : emotion === 'explosion' ? [0, 90, 180, 360] : 0
      }}
      transition={{
        scale: { duration: 0.5 },
        x: isFlying ? { duration: 1 } : {},
        y: isFlying ? { duration: 1 } : {},
        rotate: isFlying ? { duration: 1 } : emotion === 'explosion' ? { duration: 0.5 } : {}
      }}
      onClick={handleClick}
      onMouseDown={() => {
        // 长按检测
        const timer = setTimeout(handleLongPress, 500)
        const clearTimer = () => clearTimeout(timer)
        window.addEventListener('mouseup', clearTimer, { once: true })
        window.addEventListener('touchend', clearTimer, { once: true })
      }}
      whileHover={{ scale: emotion === 'normal' ? 1.1 : 1 }}
      whileTap={{ scale: 0.9 }}
      style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
    >
      {/* 小鸟主体 - 简约SVG风格 */}
      <svg
        width="70"
        height="70"
        viewBox="0 0 60 60"
      >
        {/* 身体 - 圆形 */}
        <circle
          cx="30"
          cy="30"
          r="25"
          fill={emotion === 'angry' ? '#FF4444' : emotion === 'explosion' ? '#FF6B6B' : '#FF8C00'}
          stroke="#000"
          strokeWidth="2"
        />

        {/* 肚子 - 浅色圆形 */}
        <circle
          cx="30"
          cy="35"
          r="15"
          fill="#FFE4B5"
          stroke="#000"
          strokeWidth="1"
        />

        {/* 眉毛 */}
        {emotion !== 'normal' && (
          <>
            <motion.line
              x1="18"
              y1="18"
              x2="26"
              y2="22"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{ rotate: emotion === 'angry' ? 20 : 0 }}
              transformOrigin="20 20"
            />
            <motion.line
              x1="42"
              y1="18"
              x2="34"
              y2="22"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{ rotate: emotion === 'angry' ? -20 : 0 }}
              transformOrigin="40 20"
            />
          </>
        )}

        {/* 眼睛 */}
        <circle cx="22" cy="22" r="4" fill="white" stroke="#000" strokeWidth="1" />
        <circle cx="38" cy="22" r="4" fill="white" stroke="#000" strokeWidth="1" />

        {/* 眼珠 */}
        <circle cx="22" cy="22" r="2" fill="#000" />
        <circle cx="38" cy="22" r="2" fill="#000" />

        {/* 嘴巴 - 三角形 */}
        <polygon
          points="30,25 26,30 34,30"
          fill="#FFD700"
          stroke="#000"
          strokeWidth="1"
        />

        {/* 表情文字（在爆炸时显示） */}
        {emotion === 'explosion' && (
          <text x="30" y="52" textAnchor="middle" fontSize="10" fill="#000" fontWeight="bold">
            BOOM!
          </text>
        )}
      </svg>

      {/* 记录数量提示 */}
      {recordCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold border-2 border-white">
          {recordCount}
        </div>
      )}

      {/* 点击提示（只在无记录时显示） */}
      {emotion === 'normal' && recordCount === 0 && (
        <motion.div
          className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap bg-gray-900 text-white px-3 py-1.5 rounded-lg"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          👆 点我发泄！
        </motion.div>
      )}
    </motion.div>
  )
}
