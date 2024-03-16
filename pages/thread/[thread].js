import React, { useState, useEffect } from 'react'
import Thread from '../../components/Thread'
import { useRouter } from 'next/router';
import Sidebar from '../../components/Sidebar';

const ThreadSlug = () => {
    const router = useRouter();
    const { thread } = router.query;

  return (
    <div>
        <Sidebar />
        <Thread threadID={thread} />
    </div>
  )
}

export default ThreadSlug