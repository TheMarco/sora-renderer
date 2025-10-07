'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /new on initial load
    router.push('/new');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="spinner w-8 h-8" />
    </div>
  );
}

