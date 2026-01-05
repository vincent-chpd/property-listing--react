import { Bath, BedDouble, MapPin, X } from 'lucide-react';
import { ListingType } from '../(routes)/edit-listing/[id]/page';
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type MarkerListingItemProps = {
  item: ListingType;
  closeHandler: () => void;
};

const MarkerListingItem = ({ item, closeHandler }: MarkerListingItemProps) => {
  return (
    <div className="relative flex cursor-pointer bg-white min-w-[360px] shadow-lg rounded-lg">
      <X className="absolute top-1 right-1" onClick={() => closeHandler()} />
      <Image
        src={
          item.listingImages?.[0]?.url ||
          'https://khcnggknlyklpooymuog.supabase.co/storage/v1/object/public/listing-images/placeholder'
        }
        alt="Image of the listing"
        width={800}
        height={150}
        className="rounded-tl-lg rounded-bl-lg object-cover w-[180px]"
      />
      <div className="flex flex-col flex-1 gap-2 p-2 justify-between">
        <h2 className="font-bold text-lg">
          £{item.rentingPrice?.toLocaleString()} {item.type === 'Rent' && 'pcm'}
        </h2>
        <h2 className="flex gap-2 text-xs text-gray-400">
          <MapPin className="h-4 w-4" />
          {item.address}
        </h2>

        <div className="flex gap-2 items-center justify-start">
          <h2 className="flex gap-2 text-xs bg-slate-200 rounded-sm p-2 items-center text-gray-600 w-fit justify-center">
            <BedDouble className="h-3 w-3" />
            {item?.bedroom}
          </h2>
          <h2 className="flex gap-2 text-xs  bg-slate-200 rounded-sm w-fit p-2 items-center text-gray-600 justify-center">
            <Bath className="h-3 w-3" />
            {item?.bathroom}
          </h2>
        </div>
        <Link href={`/view-listing/${item.id}`}>
          <Button className="w-full cursor-pointer" size="sm">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MarkerListingItem;
