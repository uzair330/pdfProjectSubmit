import { UserButton } from '@clerk/nextjs'
import React from 'react'

const NavBar = () => {
  return (
    <div className='flex justify-between fixed  w-full p-4 '>
      <div className="text-white"></div>
      <div className="">

      <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  )
}

export default NavBar
