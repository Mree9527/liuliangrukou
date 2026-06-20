import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Dashboard to avoid SSR issues with Telegram WebApp SDK
const Dashboard = dynamic(() => import('../components/Dashboard'), { ssr: false });

export default function Home() {
  useEffect(() => {
    // Initialize Telegram Mini App environment if running inside TG
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  return <Dashboard />;
}
