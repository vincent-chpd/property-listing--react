import React from 'react';
import { ListingType } from '../(routes)/edit-listing/[id]/page';
import Image from 'next/image';
import { Bath, BedDouble, MapPin, Ruler, Search } from 'lucide-react';
import GoogleAddressSearch from './GoogleAddressSearch';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type ListingProps = {
  listings: ListingType[];
  handleSearchClick: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchedAddress: (value: any) => void;
  setCoordinates: (coords: { lat: number; lng: number } | null) => void;
};

type Address = {
  label: string;
};

const Listing = ({
  listings,
  handleSearchClick,
  searchedAddress,
  setCoordinates,
}: ListingProps) => {
  const [address, setAddress] = React.useState<Address | null>(null);

  return (
    <div>
      <div className="p-3 flex gap-2 items-center">
        <GoogleAddressSearch
          selectedAddress={(value) => {
            searchedAddress(value);
            setAddress(value);
          }}
          setCoordinates={setCoordinates}
        />
        <Button
          className="flex gap-2 cursor-pointer"
          onClick={handleSearchClick}
        >
          <Search className="h-4 w-4 " /> Search
        </Button>
      </div>

      <div className="p-3">
        {address && (
          <div>
            <h2>
              Found <span className="font-bold">{listings?.length}</span> Result
              {listings.length > 1 ? 's' : ''} in{' '}
              <span className="font-bold text-primary">{address.label}</span>
            </h2>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {listings.length > 0
          ? listings.map((item: ListingType, index: number) => (
              <Link href={`/view-listing/${item.id}`} key={index}>
                <div
                  key={index}
                  className="p-3 border-1 border-transparent hover:border-primary/30 cursor-pointer rounded-lg"
                >
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
                        {item?.size} sq. ft
                      </h2>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          : [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
              <div
                key={index}
                className="h-[230px] w-full bg-slate-200 animate-pulse rounded-lg"
              />
            ))}
      </div>
    </div>
  );
};

export default Listing;
