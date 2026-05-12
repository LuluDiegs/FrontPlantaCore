import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  const location = useLocation();

  const isMapPage = location.pathname === '/mapa';

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.body}>
        <Sidebar />
        <main className={
          isMapPage
            ? styles.mainFull
            : styles.main
        }>
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
