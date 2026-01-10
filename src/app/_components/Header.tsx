'use client';
import Image from 'next/image';
import React, { useEffect } from 'react';
import logo from '../../../public/logo.svg';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignOutButton, useUser } from '@clerk/nextjs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import User from '../(routes)/user/[[...rest]]/page';

const Header = () => {
  const path = usePathname();
  const { user, isSignedIn } = useUser();

  useEffect(() => {}, [path]);

  return (
    <div className="pt-6 px-10 flex justify-between shadow-sm fixed top-0 w-full z-10 bg-white">
      <div className="flex items-center gap-10">
        <Link href={'/'}>
          <Image src={logo} alt="Logo" width={150} height={150} />
        </Link>
        <ul className="hidden md:flex gap-10 justify-center items-center">
          <Link href={'/'}>
            <li
              className={`hover:text-primary font-medium text-sm cursor-pointer py-4 ${
                path === '/' && 'text-primary font-semibold '
              }`}
            >
              For Rent
            </li>
          </Link>

          <Link href={'/for-sale'}>
            <li
              className={`hover:text-primary font-medium text-sm cursor-pointer py-4 ${
                path === '/for-sale' && 'text-primary font-semibold '
              }`}
            >
              For Sales
            </li>
          </Link>

          <li className="hover:text-primary font-medium text-sm cursor-pointer">
            Agent Finder
          </li>
        </ul>
      </div>
      <div className="flex gap-2 items-center">
        <Link href="/add-new-listing">
          <Button className="cursor-pointer">
            <Plus className="h-5 w-5" /> Post Your Ad
          </Button>
        </Link>
        {isSignedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none border-none">
              <Image
                src={user?.imageUrl}
                width={35}
                height={35}
                alt="User Avatar"
                className="rounded-full w-full cursor-pointer "
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-2 cursor-pointer">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/user" className="cursor-pointer">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Link href="/user/my-listings">My listings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <SignOutButton>Logout</SignOutButton>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/sign-in">
            <Button variant="outline" className="cursor-pointer">
              Login
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
