import { motion } from 'framer-motion'
import { User, Server, Palette, Info, ExternalLink } from 'lucide-react'
import useStore from '../store/useStore'

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function Settings() {
  const { userId, setUserId, darkMode, toggleDarkMode, serverOnline, wsConnected } = useStore()

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      className="space-y-6 max-w-2xl"
    >
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-display font-semibold text-text-primary tracking-tight">설정</h1>
        <p className="text-sm text-text-muted mt-1">대시보드 환경을 커스터마이즈하세요</p>
      </motion.div>

      {/* User */}
      <motion.div variants={fadeUp} className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <User className="w-4 h-4 text-text-secondary" />
          <h3 className="text-sm font-bold text-text-primary">사용자</h3>
        </div>
        <div>
          <label className="section-title mb-2 block">User ID</label>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(parseInt(e.target.value) || 1)}
            className="input-field w-32 font-mono"
          />
          <p className="text-[11px] text-text-muted mt-1">백엔드 userId 값 (테스트용)</p>
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div variants={fadeUp} className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <Palette className="w-4 h-4 text-text-secondary" />
          <h3 className="text-sm font-bold text-text-primary">외관</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-primary font-medium">다크 모드</p>
            <p className="text-xs text-text-muted">시스템 기본값 또는 수동 전환</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
              darkMode ? 'bg-accent' : 'bg-surface-3'
            }`}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${
                darkMode ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </motion.div>

      {/* Server status */}
      <motion.div variants={fadeUp} className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <Server className="w-4 h-4 text-text-secondary" />
          <h3 className="text-sm font-bold text-text-primary">서버 상태</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-text-secondary">Spring Boot (8081)</span>
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${serverOnline ? 'bg-emerald-400' : 'bg-red-400'}`} />
              <span className="text-xs font-mono text-text-muted">{serverOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-text-secondary">WebSocket (STOMP)</span>
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${wsConnected ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
              <span className="text-xs font-mono text-text-muted">{wsConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-text-secondary">Swagger UI</span>
            <a
              href="http://localhost:8081/swagger-ui/index.html"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-accent hover:underline"
            >
              열기 <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Info */}
      <motion.div variants={fadeUp} className="glass-card p-6 space-y-3">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-text-secondary" />
          <h3 className="text-sm font-bold text-text-primary">정보</h3>
        </div>
        <div className="space-y-2 text-xs text-text-muted">
          <p><span className="text-text-secondary font-medium">프로젝트:</span> AI Location Agent</p>
          <p><span className="text-text-secondary font-medium">백엔드:</span> Spring Boot 3 + Java 21</p>
          <p><span className="text-text-secondary font-medium">프론트:</span> React 18 + Vite + Tailwind CSS</p>
          <p><span className="text-text-secondary font-medium">AI:</span> OpenAI GPT-4o-mini</p>
          <p><span className="text-text-secondary font-medium">작성자:</span> 김보민</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
