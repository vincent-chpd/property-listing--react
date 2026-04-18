'use client';
import Image from 'next/image';
import React from 'react';
import logo from '../../../public/logo-primary.png';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
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

const Header = () => {
  const path = usePathname();
  const { user, isSignedIn } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between mb-2 px-6 h-16 max-w-screen-2xl mx-auto">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image src={logo} alt="Logo" width={80} height={50} />
        </Link>

        {/* Nav links – hidden on mobile */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-gray-100 ${
              path === '/' ? 'text-primary font-semibold' : 'text-gray-600'
            }`}
          >
            For Rent
          </Link>
          <Link
            href="/for-sale"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-gray-100 ${
              path === '/for-sale' ? 'text-primary font-semibold' : 'text-gray-600'
            }`}
          >
            For Sale
          </Link>
          <Link
            href="/agent-finder"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-gray-100 ${
              path === '/agent-finder' ? 'text-primary font-semibold' : 'text-gray-600'
            }`}
          >
            Agent Finder
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link href="/add-new-listing">
            <Button size="sm" className="cursor-pointer hidden sm:flex gap-1">
              <Plus className="h-4 w-4" /> Post Ad
            </Button>
          </Link>

          {isSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none border-none">
                <Image
                  src={user?.imageUrl}
                  width={34}
                  height={34}
                  alt="User Avatar"
                  className="rounded-full cursor-pointer ring-2 ring-transparent hover:ring-primary/40 transition-all"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mr-2">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/user" className="cursor-pointer w-full">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/user/my-listings" className="cursor-pointer w-full">My listings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <SignOutButton>Logout</SignOutButton>
                </DropdownMenuItem>
                <div className="md:hidden">
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/" className="cursor-pointer w-full">For Rent</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/for-sale" className="cursor-pointer w-full">For Sale</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/agent-finder" className="cursor-pointer w-full">Agent Finder</Link>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/sign-in">
              <Button variant="outline" size="sm" className="cursor-pointer">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
