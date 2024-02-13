import { UserButton } from '@clerk/nextjs'

const NavBar = () => {
  return (
    <div className='flex justify-end fixed w-full p-4 '>
    
      
      <div className="flex justify-end">

      <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  )
}

export default NavBar
