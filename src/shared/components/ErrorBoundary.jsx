import { Component } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import Button from './ui/Button';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          padding: '24px',
          textAlign: 'center',
          gap: '12px',
        }}>
          <AlertTriangle size={40} color="var(--color-forest)" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Algo deu errado</h2>
          <p style={{ color: 'var(--color-text-light)', maxWidth: 320 }}>
            Ocorreu um erro inesperado nesta seção.
          </p>
          <Button variant="secondary" onClick={this.handleReset}>
            <RotateCcw size={16} /> Tentar novamente
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
