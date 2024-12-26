import React from 'react'

const Loader = () => {
  return (
    <div className='flex h-screen w-full items-center justify-center bg-[#1c1d25]'>
      <img
        src='/icons/loading-circle.svg'
        alt='loading'
        width={50}
        height={50}
      />
    </div>
  )
}

export default Loader