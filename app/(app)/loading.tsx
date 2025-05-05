import { Loader2 } from 'lucide-react'
import React from 'react'

function Loading() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen -mt-20'>
        <Loader2 className='h-24 w-24 text-red-600 animate-spin ' />
    </div>
  )
}

export default Loading