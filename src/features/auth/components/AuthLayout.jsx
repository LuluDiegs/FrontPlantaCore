import { Link } from 'react-router-dom';
import { Leaf, Sparkles, Droplets, Users } from 'lucide-react';
import styles from './AuthLayout.module.css';

export default function AuthLayout({ children, title, subtitle }) {
  return (
        <div className={styles.page}>
        <div className={styles.panel}>
        <div className={styles.panelLeaf1} />
        <div className={styles.panelLeaf2} />
        <div className={styles.panelLeaf3} />
        <div className={styles.panelLeaf4} />
        <div className={styles.panelCircle1} />
        <div className={styles.panelCircle2} />
        <div className={styles.panelContent}>
          <div className={styles.panelIconWrap}>
            <Leaf size={44} />
          </div>
          <h2 className={styles.panelTitle}>Planta Core</h2>
          <p className={styles.panelText}>
            Identifique, cuide e conecte-se com o mundo das plantas
          </p>
          <div className={styles.panelFeatures}>
            <div className={styles.panelFeature}>
              <Sparkles size={16} />
              <span>Identificação por imagem</span>
            </div>
            <div className={styles.panelFeature}>
              <Droplets size={16} />
              <span>Lembretes de cuidados</span>
            </div>
            <div className={styles.panelFeature}>
              <Users size={16} />
              <span>Comunidade de plantas</span>
            </div>
          </div>
        </div>
      </div>

        <div className={styles.formSide}>
        <div className={styles.card}>
          <Link to="/" className={styles.brand}>
            <Leaf size={28} />
            <span>Planta Core</span>
          </Link>

          {title && <h1 className={styles.title}>{title}</h1>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

          {children}
        </div>
      </div>
    </div>
  );
}
