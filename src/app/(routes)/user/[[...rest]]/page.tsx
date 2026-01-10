'use client';
import { UserButton, UserProfile } from '@clerk/nextjs';
import { Building2 } from 'lucide-react';
import React from 'react';
import UserListings from '../_components/UserListings';

const User = () => {
  return (
    <div className="my-2 px-8 md:px-10 lg:px-32 w-full">
      <h2 className="font-bold text-2xl py-3">Profile</h2>
      <UserProfile>
        <UserButton.UserProfilePage
          label="My Listing"
          labelIcon={<Building2 className="h-5 w-5" />}
          url="my-listings"
        >
          <UserListings />
        </UserButton.UserProfilePage>
      </UserProfile>
    </div>
  );
};

export default User;
