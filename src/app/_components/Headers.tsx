"use client"
import Image from 'next/image'
import React, { useEffect } from 'react'
import logo from '../../../public/logo.svg'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, useUser } from '@clerk/nextjs'

const Headers = () => {
  const path = usePathname();
  const {user, isSignedIn } = useUser();

  useEffect(() => {
    console.log("Current path:", path);
  }, [ path ]);

  return (
    <div className="p-6 px-10 flex justify-between shadow-sm fixed top-0 w-full z-10 bg-white">
      <div className="flex items-center gap-10">
        <Image
          src={logo}
          alt="Logo"
          width={150}
          height={150}
        />
        <ul className="hidden md:flex gap-10">
          <Link href={"/"}><li className={`hover:text-primary font-medium text-sm cursor-pointer ${path === '/' && 'text-primary'}`}>For Rent</li></Link>
          <li className="hover:text-primary font-medium text-sm cursor-pointer">For Sales</li>
          <li className="hover:text-primary font-medium text-sm cursor-pointer">Agent Finder</li>
        </ul>
      </div>
      <div className='flex gap-2 items-center'>
        <Button>
          <Plus className='h-5 w-5'/> Post Your Ad
        </Button>
        {isSignedIn ? (
          <UserButton />
        ) : (
          <Link href='/sign-in'>
            <Button variant="outline">Login</Button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Headers
