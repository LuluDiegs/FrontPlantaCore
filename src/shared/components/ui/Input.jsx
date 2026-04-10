import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './Input.module.css';

/**
 * Input reutilizável com label, erro e toggle de senha.
 * Compatível com React Hook Form via forwardRef.
 */
const Input = forwardRef(function Input(
  { label, error, type = 'text', icon: Icon, className = '', ...props },
  ref,
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={`${styles.group} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}

      <div className={`${styles.wrapper} ${error ? styles.wrapperError : ''}`}>
        {Icon && <Icon size={18} className={styles.icon} />}

        <input
          ref={ref}
          type={inputType}
          className={styles.input}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
});

export default Input;
