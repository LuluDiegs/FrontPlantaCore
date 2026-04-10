import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, RotateCcw, Leaf, Droplets, Sun, AlertTriangle, CheckCircle2, X, Zap, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from './Home.module.css'

const mockResult = {
  popular: 'Costela-de-Adão',
  scientific: 'Monstera deliciosa',
  family: 'Araceae',
  origin: 'América Central',
  confidence: 94,
  toxic: true,
  toxicNote: 'Tóxica para cães, gatos e crianças pequenas. Evite ingestão.',
  care: 'Moderada',
  light: 'Meia-sombra',
  watering: 'A cada 7–10 dias',
  humidity: 'Alta',
  description:
    'Planta tropical muito apreciada por suas folhas grandes e perfuradas. Originária da América Central e México, é amplamente cultivada como planta ornamental no mundo inteiro.',
}

function AppHeader() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.headerLogo}>
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <path d="M16 30 L16 14" stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M16 22 C13 16 7 14 4 8 C9 5 16 10 16 22Z" fill="rgba(255,255,255,0.6)"/>
          <path d="M16 16 C19 10 25 8 28 2 C23 -1 16 4 16 16Z" fill="white"/>
          <path d="M16 14 C16 10 17 6 18 3 C20 4 20 8 18 12 Q17 13 16 14Z" fill="rgba(255,255,255,0.45)"/>
        </svg>
        <span className={styles.headerLogoText}>PlantID</span>
      </Link>

      <div className={styles.headerRight}>
        <div className={styles.xpChip}>
          <Zap size={13} />
          <span>0 XP</span>
        </div>
        <Link to="/entrar" className={styles.headerSignIn}>
          <LogOut size={16} />
          Sair
        </Link>
      </div>
    </header>
  )
}

function BotanicalBg() {
  return (
    <div className={styles.botanicalBg} aria-hidden="true">
      <svg className={styles.bgSvgTR} viewBox="0 0 300 360" fill="none">
        <path fillRule="evenodd" d="M150 18C200 18 258 66 268 138C278 210 248 272 200 298C175 311 150 315 150 315C150 315 125 311 100 298C52 272 22 210 32 138C42 66 100 18 150 18Z M88 178C78 167 70 173 73 186C76 199 90 199 94 188C97 180 93 172 88 178Z M208 172C198 161 188 168 192 181C196 194 210 193 214 182C217 174 213 166 208 172Z M150 272C140 261 130 268 134 281C138 294 152 293 156 281C159 272 155 264 150 272Z" fill="var(--color-medium)" opacity="0.1" />
        <path d="M150 22 Q148 168 153 312" stroke="rgba(45,106,79,0.07)" strokeWidth="2" fill="none" />
      </svg>

      <svg className={styles.bgSvgBL} viewBox="0 0 180 290" fill="none">
        <rect x="68" y="12" width="44" height="268" rx="22" fill="var(--color-light)" opacity="0.12" />
        <path d="M70 118 C70 118 28 116 20 86C12 56 28 40 44 43C60 46 62 62 62 62 L68 65" fill="none" stroke="var(--color-light)" strokeWidth="30" strokeLinecap="round" opacity="0.1" />
        <path d="M110 140 C110 140 152 138 160 108C168 78 152 62 136 65C120 68 118 84 118 84 L112 86" fill="none" stroke="var(--color-light)" strokeWidth="28" strokeLinecap="round" opacity="0.09" />
      </svg>

      <svg className={styles.bgSvgTL} viewBox="0 0 200 310" fill="none">
        <path d="M185 300 Q130 210 85 130 Q52 72 20 14" stroke="rgba(45,106,79,0.1)" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <ellipse cx="168" cy="275" rx="42" ry="9" transform="rotate(-28 168 275)" fill="var(--color-medium)" opacity="0.1" />
        <ellipse cx="148" cy="242" rx="46" ry="9" transform="rotate(-38 148 242)" fill="var(--color-medium)" opacity="0.09" />
        <ellipse cx="126" cy="207" rx="48" ry="9" transform="rotate(-48 126 207)" fill="var(--color-medium)" opacity="0.08" />
        <ellipse cx="104" cy="172" rx="46" ry="8" transform="rotate(-57 104 172)" fill="var(--color-medium)" opacity="0.07" />
        <ellipse cx="78" cy="133" rx="42" ry="8" transform="rotate(-66 78 133)" fill="var(--color-medium)" opacity="0.07" />
      </svg>

      <svg className={styles.bgSvgBR} viewBox="0 0 210 270" fill="none">
        <path d="M22 258 Q62 185 104 108 Q135 50 165 14" stroke="rgba(45,106,79,0.1)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M36 232C24 223 18 210 26 202C34 194 48 200 49 211C50 220 44 232 36 232Z" fill="var(--color-medium)" opacity="0.1" transform="rotate(-22 36 217)" />
        <path d="M55 198C43 189 37 176 45 168C53 160 67 166 68 177C69 186 63 198 55 198Z" fill="var(--color-medium)" opacity="0.09" transform="rotate(-30 55 183)" />
        <path d="M76 163C64 154 58 141 66 133C74 125 88 131 89 142C90 151 84 163 76 163Z" fill="var(--color-medium)" opacity="0.08" transform="rotate(-40 76 148)" />
        <path d="M98 126C87 117 82 104 90 97C98 90 111 96 111 107C111 116 105 126 98 126Z" fill="var(--color-medium)" opacity="0.07" transform="rotate(-50 98 111)" />
      </svg>
    </div>
  )
}

function IdleZone({ onFile }) {
  const cameraRef = useRef(null)
  const fileRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const processFile = useCallback((file) => {
    if (file && file.type.startsWith('image/')) onFile(file)
  }, [onFile])

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => setIsDragging(false)
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    processFile(e.dataTransfer.files[0])
  }

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.45 }}
    >
      <div className={styles.cardTopStrip} />

      <div className={styles.cardHeader}>
        <div className={styles.cardIconRing}>
          <svg viewBox="0 0 80 80" fill="none" className={styles.cardIconSvg}>
            <path d="M40 72 L40 28" stroke="var(--color-forest)" strokeWidth="4" strokeLinecap="round" opacity="0.85"/>
            <path d="M40 55 C30 48 18 46 12 34 C22 28 38 38 40 55Z" fill="var(--color-medium)" opacity="0.9"/>
            <path d="M40 42 C30 36 20 34 15 22 C25 17 38 27 40 42Z" fill="var(--color-medium)" opacity="0.7"/>
            <path d="M40 48 C50 41 62 39 68 27 C58 21 42 31 40 48Z" fill="var(--color-forest)" opacity="0.85"/>
            <path d="M40 36 C50 30 60 28 65 16 C55 11 42 21 40 36Z" fill="var(--color-forest)" opacity="0.65"/>
            <path d="M40 28 C38 20 38 14 40 8 C42 14 42 20 40 28Z" fill="var(--color-medium)" opacity="0.8"/>
            <circle cx="40" cy="7" r="4" fill="var(--color-cta)" opacity="0.9"/>
            <circle cx="36" cy="13" r="2.5" fill="var(--color-cta)" opacity="0.55"/>
            <circle cx="44" cy="10" r="2" fill="var(--color-cta)" opacity="0.45"/>
          </svg>
        </div>
        <h1 className={styles.cardTitle}>Identifique uma Planta</h1>
        <p className={styles.cardSubtitle}>
          Tire uma foto ou envie uma imagem — descubra tudo sobre ela em segundos
        </p>
      </div>

      <div
        className={`${styles.dropZone} ${isDragging ? styles.dropZoneActive : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        <div className={styles.dropZoneCornerTL} />
        <div className={styles.dropZoneCornerTR} />
        <div className={styles.dropZoneCornerBL} />
        <div className={styles.dropZoneCornerBR} />

        <div className={styles.dropZoneInner}>
          <span className={styles.dropZoneEmoji}>🌿</span>
          <p className={styles.dropZoneText}>
            {isDragging ? 'Solte a foto aqui!' : 'Arraste uma foto aqui'}
          </p>
          <p className={styles.dropZoneOr}>ou clique para escolher</p>
        </div>
      </div>

      <div className={styles.actionButtons}>
        <button
          className={styles.btnCamera}
          onClick={() => cameraRef.current?.click()}
        >
          <Camera size={20} />
          Tirar uma foto
        </button>
        <button
          className={styles.btnFile}
          onClick={() => fileRef.current?.click()}
        >
          <Upload size={20} />
          Escolher arquivo
        </button>
      </div>

      <p className={styles.supportedFormats}>Suporta JPG, PNG, WEBP · Máx. 5 MB</p>

      <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={(e) => processFile(e.target.files[0])} style={{ display: 'none' }} />
      <input ref={fileRef} type="file" accept="image/*" onChange={(e) => processFile(e.target.files[0])} style={{ display: 'none' }} />
    </motion.div>
  )
}

function PreviewZone({ imageUrl, onAnalyze, onReset }) {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.cardTopStrip} />

      <div className={styles.previewHeader}>
        <CheckCircle2 size={20} color="var(--color-medium)" />
        <span>Foto selecionada</span>
        <button className={styles.resetBtn} onClick={onReset} aria-label="Remover foto">
          <X size={16} />
        </button>
      </div>

      <div className={styles.previewImageWrap}>
        <img src={imageUrl} alt="Planta a identificar" className={styles.previewImage} />
        <div className={styles.previewCornerTL} />
        <div className={styles.previewCornerTR} />
        <div className={styles.previewCornerBL} />
        <div className={styles.previewCornerBR} />
      </div>

      <button className={styles.btnAnalyze} onClick={onAnalyze}>
        <Zap size={20} />
        Analisar Planta
      </button>

      <button className={styles.btnResetFull} onClick={onReset}>
        <RotateCcw size={15} />
        Escolher outra foto
      </button>
    </motion.div>
  )
}

function AnalyzingZone({ imageUrl }) {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.cardTopStrip} />

      <div className={styles.analyzingHeader}>
        <div className={styles.analyzingDots}>
          <span className={styles.analyzingDot} />
          <span className={styles.analyzingDot} />
          <span className={styles.analyzingDot} />
        </div>
        <p className={styles.analyzingTitle}>Analisando sua planta</p>
        <p className={styles.analyzingSubtitle}>Identificando a espécie...</p>
      </div>

      <div className={styles.analyzingImageWrap}>
        <img src={imageUrl} alt="Analisando" className={styles.analyzingImage} />
        <div className={styles.analyzingOverlay} />
        <div className={styles.analyzingScanLine} />
        <div className={styles.analyzingCornerTL} />
        <div className={styles.analyzingCornerTR} />
        <div className={styles.analyzingCornerBL} />
        <div className={styles.analyzingCornerBR} />
        <div className={styles.analyzingRing} />
      </div>

      <div className={styles.analyzingProgressWrap}>
        <div className={styles.analyzingProgressBar}>
          <div className={styles.analyzingProgressFill} />
        </div>
        <p className={styles.analyzingProgressText}>Processando padrões botânicos...</p>
      </div>
    </motion.div>
  )
}

function ResultZone({ imageUrl, onReset }) {
  return (
    <motion.div
      className={`${styles.card} ${styles.resultCard}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.cardTopStrip} />

      <div className={styles.resultHeader}>
        <span className={styles.resultBadge}>
          <CheckCircle2 size={14} /> Identificado!
        </span>
        <span className={styles.resultConfidence}>{mockResult.confidence}% preciso</span>
      </div>

      <div className={styles.resultImageRow}>
        <div className={styles.resultImageWrap}>
          <img src={imageUrl} alt={mockResult.popular} className={styles.resultImage} />
        </div>
        <div className={styles.resultNames}>
          <p className={styles.resultPopular}>{mockResult.popular}</p>
          <p className={styles.resultScientific}>{mockResult.scientific}</p>
          <div className={styles.resultFamilyBadge}>
            <Leaf size={11} />
            {mockResult.family}
          </div>
          <p className={styles.resultOrigin}>🌍 {mockResult.origin}</p>
        </div>
      </div>

      <p className={styles.resultDescription}>{mockResult.description}</p>

      <div className={styles.resultGrid}>
        <div className={styles.resultInfoCard}>
          <Droplets size={16} color="var(--color-medium)" />
          <span className={styles.resultInfoLabel}>Rega</span>
          <span className={styles.resultInfoValue}>{mockResult.watering}</span>
        </div>
        <div className={styles.resultInfoCard}>
          <Sun size={16} color="#f39c12" />
          <span className={styles.resultInfoLabel}>Luz</span>
          <span className={styles.resultInfoValue}>{mockResult.light}</span>
        </div>
        <div className={styles.resultInfoCard}>
          <span className={styles.resultInfoEmoji}>💦</span>
          <span className={styles.resultInfoLabel}>Humidade</span>
          <span className={styles.resultInfoValue}>{mockResult.humidity}</span>
        </div>
        <div className={styles.resultInfoCard}>
          <span className={styles.resultInfoEmoji}>🌱</span>
          <span className={styles.resultInfoLabel}>Cuidado</span>
          <span className={styles.resultInfoValue}>{mockResult.care}</span>
        </div>
      </div>

      {mockResult.toxic && (
        <div className={styles.toxicAlert}>
          <AlertTriangle size={18} color="#dc2626" />
          <div>
            <p className={styles.toxicTitle}>Planta tóxica</p>
            <p className={styles.toxicNote}>{mockResult.toxicNote}</p>
          </div>
        </div>
      )}

      <div className={styles.resultActions}>
        <button className={styles.btnSave}>
          <Leaf size={16} />
          Salvar no histórico
        </button>
        <button className={styles.btnNewScan} onClick={onReset}>
          <RotateCcw size={16} />
          Identificar outra
        </button>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const [phase, setPhase] = useState('idle')
  const [imageUrl, setImageUrl] = useState(null)

  const handleFile = useCallback((file) => {
    setImageUrl(URL.createObjectURL(file))
    setPhase('preview')
  }, [])

  const handleAnalyze = () => {
    setPhase('analyzing')
    setTimeout(() => setPhase('result'), 3200)
  }

  const handleReset = () => {
    setPhase('idle')
    setImageUrl(null)
  }

  return (
    <div className={styles.page}>
      <AppHeader />

      <BotanicalBg />

      <main className={styles.main}>
        <div className={styles.welcomeRow}>
          <p className={styles.welcomeText}>
            Olá, Explorador! 🌿 <span>O que vamos descobrir hoje?</span>
          </p>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <IdleZone key="idle" onFile={handleFile} />
          )}
          {phase === 'preview' && (
            <PreviewZone key="preview" imageUrl={imageUrl} onAnalyze={handleAnalyze} onReset={handleReset} />
          )}
          {phase === 'analyzing' && (
            <AnalyzingZone key="analyzing" imageUrl={imageUrl} />
          )}
          {phase === 'result' && (
            <ResultZone key="result" imageUrl={imageUrl} onReset={handleReset} />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
