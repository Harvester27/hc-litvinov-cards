import Navigation from '@/components/Navigation';
import GamesCarousel from './GamesCarousel';
import styles from './page.module.css';

export const metadata = {
  title: 'Hry | HC Litvínov Lancers',
  description: 'Vyberte si hru ze světa Lancers: Tipovačka, Les stínů, VIP Lancers, Lancers Card a hokejový manažer Lancers CUP.',
};

export default function GamesPage() {
  return (
    <main className={styles.page}>
      <Navigation />
      <h1 className={styles.visuallyHidden}>Hry Lancers</h1>
      <GamesCarousel />
    </main>
  );
}
