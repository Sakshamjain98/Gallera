'use client';
import { useRouter } from 'next/navigation';
import React, { use, useEffect } from 'react'

function Page() {
  const router = useRouter();
  useEffect(() => {
    router.push('/admin');
  }, []);
  return (
    <div>Loading</div>
  )
}

export default Page