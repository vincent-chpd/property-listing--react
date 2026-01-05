import React from 'react';
import Image from 'next/image';
import { ListingType } from '../../../(routes)/edit-listing/[id]/page';
import { Button } from '@/components/ui/button';

type ListingDetailsProps = {
  listingDetails: ListingType;
};

const AgentDetails = ({ listingDetails }: ListingDetailsProps) => {
  return (
    <div className="flex gap-5 item-center justify-between p-5 rounded-lg shadow-md border">
      <div className="flex items-center gap-6">
        {listingDetails?.profilePicture && (
          <Image
            src={listingDetails.profilePicture}
            alt="Profile picture"
            width={60}
            height={60}
            className="rounded-full"
          />
        )}
        <div>
          <h2 className="text-lg font-bold">{listingDetails?.fullName}</h2>
          <h2 className="text-gray-500">{listingDetails?.createdBy}</h2>
        </div>
      </div>
      <Button className="mt-2 cursor-pointer">Send Message</Button>
    </div>
  );
};

export default AgentDetails;
