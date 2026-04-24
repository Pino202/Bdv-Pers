import { useState, useEffect } from 'react';
import { shouldShowLanding } from '@/lib/geoFilter';
import BdvLanding from '@/pages/BdvLanding';

export default function GeoGate({ children }) {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    shouldShowLanding().then(show => setStatus(show ? 'landing' : 'pass'));
  }, []);

  if (status === 'checking') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#0047AB] rounded-full animate-spin" />
      </div>
    );
  }

  if (status === 'landing') return <BdvLanding />;
  return children;
}
