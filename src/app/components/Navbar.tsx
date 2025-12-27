import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Dropbox } from './Dropbox'

const Navbar = () => {
  return (
    <header className='sticky bg-black  z-50 top-0 left-0 right-0 h-16 flex items-center justify-between px-6 md:px-20 gap-3 border-b border-gray-600'>
      <div className='flex items-center gap-3  overflow-hidden'>
        <Image
          src="/icon.png"
          className='rounded-full'
          
          alt="Logo"
          width={35}
          height={35}
          priority
        />
        <span className='font-semibold text-md'>AI Voice Translator</span>
      </div>

      <Dropbox />
    </header>
  )
} 

export default Navbar