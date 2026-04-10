import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import styles from './ImageUpload.module.css';

/**
 * Componente de upload de imagem com preview e drag-and-drop.
 *
 * @param {function} onFileSelect - Callback recebe o File selecionado
 * @param {string} currentImage - URL da imagem atual (para edição)
 * @param {string} accept - Tipos aceitos (default: "image/*")
 */
export default function ImageUpload({ onFileSelect, currentImage, accept = 'image/*', label = 'Arraste uma foto ou clique para selecionar' }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onFileSelect?.(file);
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setPreview(null);
    onFileSelect?.(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div
      className={`${styles.dropzone} ${isDragging ? styles.dragging : ''} ${preview ? styles.hasPreview : ''}`}
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className={styles.hiddenInput}
      />

      {preview ? (
        <>
          <img src={preview} alt="Preview" className={styles.preview} />
          <button className={styles.clearBtn} onClick={handleClear} aria-label="Remover imagem">
            <X size={16} />
          </button>
        </>
      ) : (
        <div className={styles.placeholder}>
          <Upload size={28} />
          <span>{label}</span>
        </div>
      )}
    </div>
  );
}
