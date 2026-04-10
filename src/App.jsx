import Providers from './app/providers';
import AppRouter from './app/router';
import PersistGate from './shared/components/guards/PersistGate';

export default function App() {
  return (
    <Providers>
      <PersistGate>
        <AppRouter />
      </PersistGate>
    </Providers>
  );
}
