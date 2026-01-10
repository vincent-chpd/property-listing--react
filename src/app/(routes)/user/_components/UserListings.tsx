'use client';
import { supabase } from '@/utils/supabase/client';
import { useUser } from '@clerk/nextjs';
import { Bath, BedDouble, MapPin, Ruler, Trash } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ListingType } from '../../../(routes)/edit-listing/[id]/page';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const UserListings = () => {
  const [listing, setListing] = useState<ListingType[] | null>([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const GetUserListing = async () => {
        const { data, error } = await supabase
          .from('listing')
          .select('*, listingImages(url, listing_id)')
          .eq('createdBy', user?.primaryEmailAddress?.emailAddress);

        if (error) {
          console.error('Error fetching listings:', error);
          return;
        }

        setListing(data || []);
      };

      GetUserListing();
    }
  }, [user]);

  return (
    <div className="my-5 w-full">
      <h2>Manage your listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-3">
        {listing &&
          listing.map((item, index) => (
            <div
              key={index}
              className="p-3 border-2 border-gray-100  rounded-lg relative"
            >
              <h2 className="bg-primary text-white w-fit absolute px-2 py-1 text-sm m-1 rounded-lg">
                {item.active ? 'Published' : 'Draft'}
              </h2>
              <Image
                src={
                  item.listingImages?.[0]?.url ||
                  'https://khcnggknlyklpooymuog.supabase.co/storage/v1/object/public/listing-images/placeholder'
                }
                alt="Image of the listing"
                width={800}
                height={150}
                className="rounded-lg object-cover w-full h-50"
              />
              <div className="flex flex-col mt-2 gap-1">
                <h2 className="font-bold text-lg">
                  £ {item.rentingPrice?.toLocaleString()}{' '}
                  {item.type === 'Rent' && 'pcm'}
                </h2>
                <h2 className="flex gap-2 text-xs text-gray-400">
                  <MapPin className="h-4 w-4" />
                  {item.address}
                </h2>

                <div className="flex gap-2 items-center justify-between mt-2">
                  <h2 className="flex gap-2 text-sm bg-slate-200 rounded-sm p-2 items-center text-gray-600 w-full justify-center">
                    <BedDouble className="h-4 w-4" />
                    {item?.bedroom}
                  </h2>
                  <h2 className="flex gap-2 text-sm  bg-slate-200 rounded-sm w-full p-2 items-center text-gray-600 justify-center">
                    <Bath className="h-4 w-4" />
                    {item?.bathroom}
                  </h2>
                  <h2 className="flex gap-2 text-sm min-w-[110px] bg-slate-200 rounded-sm w-full p-2 items-center text-gray-600 justify-center">
                    <Ruler className="h-4 w-4" />
                    {item?.size}
                  </h2>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button
                    variant={'outline'}
                    className="flex-1"
                    size="sm"
                    asChild
                  >
                    <Link href={`/view-listing/${item.id}`}>View</Link>
                  </Button>

                  <Button className="flex-3" size="sm">
                    <Link href={`/edit-listing/${item.id}`}>Edit</Link>
                  </Button>

                  <Button size="sm" variant={'destructive'}>
                    <Trash />
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default UserListings;
