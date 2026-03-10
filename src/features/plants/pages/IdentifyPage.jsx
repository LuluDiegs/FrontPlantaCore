import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, RotateCcw, CheckCircle2, X, Zap } from 'lucide-react';
import { useIdentifyPlant } from '../hooks/usePlants';
import styles from './IdentifyPage.module.css';

function IdleZone({ onFile }) {
  const cameraRef = useRef(null);
  const fileRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback((file) => {
    if (file && file.type.startsWith('image/')) onFile(file);
  }, [onFile]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

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
        <h1 className={styles.cardTitle}>Identificar Planta</h1>
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
        <button className={styles.btnCamera} onClick={() => cameraRef.current?.click()}>
          <Camera size={20} />
          Tirar uma foto
        </button>
        <button className={styles.btnFile} onClick={() => fileRef.current?.click()}>
          <Upload size={20} />
          Escolher arquivo
        </button>
      </div>

      <p className={styles.supportedFormats}>Suporta JPG, PNG, WEBP · Máx. 5 MB</p>

      <div className={styles.tips}>
        <h3>Dicas para uma boa identificação</h3>
        <ul>
          <li>Use fotos nítidas e bem iluminadas</li>
          <li>Foque nas folhas, flores ou frutos da planta</li>
          <li>Evite fotos muito distantes</li>
          <li>Prefira fotos com fundo simples</li>
        </ul>
      </div>

      <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={(e) => processFile(e.target.files[0])} style={{ display: 'none' }} />
      <input ref={fileRef} type="file" accept="image/*" onChange={(e) => processFile(e.target.files[0])} style={{ display: 'none' }} />
    </motion.div>
  );
}

function PreviewZone({ imageUrl, onAnalyze, onReset, isPending }) {
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

      <button className={styles.btnAnalyze} onClick={onAnalyze} disabled={isPending}>
        <Zap size={20} />
        Analisar Planta
      </button>

      <button className={styles.btnResetFull} onClick={onReset}>
        <RotateCcw size={15} />
        Escolher outra foto
      </button>
    </motion.div>
  );
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
  );
}

export default function IdentifyPage() {
  const [phase, setPhase] = useState('idle');
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const identify = useIdentifyPlant();

  const handleFile = useCallback((f) => {
    setFile(f);
    setImageUrl(URL.createObjectURL(f));
    setPhase('preview');
  }, []);

  const handleAnalyze = () => {
    if (!file) return;
    setPhase('analyzing');
    identify.mutate(file, {
      onError: () => setPhase('preview'),
    });
  };

  const handleReset = () => {
    setPhase('idle');
    setFile(null);
    setImageUrl(null);
  };

  return (
    <div className={styles.page}>
      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <IdleZone key="idle" onFile={handleFile} />
        )}
        {phase === 'preview' && (
          <PreviewZone
            key="preview"
            imageUrl={imageUrl}
            onAnalyze={handleAnalyze}
            onReset={handleReset}
            isPending={identify.isPending}
          />
        )}
        {phase === 'analyzing' && (
          <AnalyzingZone key="analyzing" imageUrl={imageUrl} />
        )}
      </AnimatePresence>
    </div>
  );
}
