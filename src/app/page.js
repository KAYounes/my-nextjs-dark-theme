import Image from 'next/image';
import styles from './page.module.css';
import ThemeButtons from '@/components/ThemeButtons/ThemeButtons';

export default function Home() {
  return (
    <>
      <h1>Next App: Default Template</h1>
      <ThemeButtons />
    </>
  );
}
