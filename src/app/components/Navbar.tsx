import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

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
        <span className='font-semibold text-md'>AI Voice Translator</span>
      </div>

      <Link href="https://github.com/DebpratimSharma/voice-to-voice-ai-translate"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-white text-gray-300 transition-all duration-200 "
      > 
      Go to repository
      </Link>
    </header>
  )
} 

export default Navbar