import React from 'react'
import Image from 'next/image'

const Navbar = () => {
  return (
    <header className='sticky bg-black  z-50 top-0 left-0 right-0 h-16 flex items-center justify-between px-6 md:px-20 gap-3 border-b border-gray-600'>
      <div className='flex items-center gap-3 rounded-full overflow-hidden'>
        <Image
          src="/image.png"
          alt="Logo"
          width={40}
          height={40}
          priority
        />
        <span className='font-semibold text-sm'>AI Voice Translator</span>
      </div>

      <nav aria-label="Main navigation">
        <a href="#" className='text-sm hover:underline' target="_blank" rel="noopener noreferrer">
          Go to repository
        </a>
      </nav>
    </header>
  )
} 

export default Navbar