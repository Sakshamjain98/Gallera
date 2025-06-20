'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

function Page() {
  const router = useRouter();
  useEffect(() => {
    router.push('/admin');
  }, [router]);
  return (
    <div>Loading</div>
  )
}

export default Page