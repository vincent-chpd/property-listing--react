'use client';
import React, { useState } from 'react';
import { ListingType } from '../(routes)/edit-listing/[id]/page';
import Image from 'next/image';
import { Bath, BedDouble, MapPin, Ruler, Search } from 'lucide-react';
import GoogleAddressSearch from './GoogleAddressSearch';
import Link from 'next/link';
import FilterSection from './FilterSection';

type ListingProps = {
  listings: ListingType[];
  handleSearchClick: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchedAddress: (value: any) => void;
  setBedCount: (value: number) => void;
  setBathCount: (value: number) => void;
  setParkingCount: (value: number) => void;
  setHomeType: (value: string) => void;
  loading: boolean;
};

type Address = {
  label: string;
};

const Listing = ({
  listings,
  handleSearchClick,
  searchedAddress,
  setBathCount,
  setBedCount,
  setParkingCount,
  setHomeType,
  loading,
}: ListingProps) => {
  const [address, setAddress] = useState<Address | null>(null);
  const [tempAddress, setTempAddress] = useState<Address | null>(null);

  const handleSearch = () => {
    setAddress(tempAddress);
    handleSearchClick();
  };

  return (
    <div>
      {/* Search + filters */}
      <div className="py-4 flex flex-col gap-3 border-gray-200 border-2 rounded-lg px-4 shadow-sm mb-4">
        <div className="flex items-center gap-2 bg-white">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <div className="flex-1">
            <GoogleAddressSearch
              selectedAddress={(value) => {
                searchedAddress(value);
                setTempAddress(value);
              }}
            />
          </div>
        </div>

        <FilterSection
          setBedCount={setBedCount}
          setBathCount={setBathCount}
          setParkingCount={setParkingCount}
          setHomeType={setHomeType}
          handleSearchClick={handleSearch}
        />
      </div>

      {/* Results count */}
      {address && (
        <p className="text-sm text-gray-500 mb-3">
          <span className="font-semibold text-gray-900">{listings?.length}</span> result
          {listings.length !== 1 ? 's' : ''} in{' '}
          <span className="font-semibold text-primary">{address.label}</span>
        </p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-8 pb-16">
        {listings.length > 0
          ? listings.map((item: ListingType, index: number) => (
              <Link href={`/view-listing/${item.id}`} key={index}>
                <div className="group cursor-pointer">
                  {/* Image */}
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100">
                    <Image
                      src={
                        item.listingImages?.[0]?.url ||
                        'https://khcnggknlyklpooymuog.supabase.co/storage/v1/object/public/listing-images/placeholder'
                      }
                      alt="Listing image"
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    {item.type && (
                      <span className="absolute top-3 left-3 bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                        {item.type === 'Rent' ? 'For Rent' : 'For Sale'}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="mt-2.5 flex flex-col gap-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-gray-900 text-sm line-clamp-1 flex-1">
                        {item.title || item.address}
                      </p>
                    </div>

                    <p className="flex gap-1 items-center text-xs text-gray-400 line-clamp-1">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {item.address}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex gap-1 items-center text-xs text-gray-500">
                        <BedDouble className="h-3.5 w-3.5" />
                        {item?.bedroom ?? '—'} bed
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="flex gap-1 items-center text-xs text-gray-500">
                        <Bath className="h-3.5 w-3.5" />
                        {item?.bathroom ?? '—'} bath
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="flex gap-1 items-center text-xs text-gray-500">
                        <Ruler className="h-3.5 w-3.5" />
                        {item?.size ?? '—'} sq ft
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-gray-900">
                      <span className="font-semibold">
                        £{(item.rentingPrice ?? item.sellingPrice)?.toLocaleString()}
                      </span>
                      {item.type === 'Rent' && (
                        <span className="font-normal text-gray-500"> / month</span>
                      )}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          : !loading && (
              <div className="col-span-full text-center py-20 text-gray-400">
                No listings found. Try adjusting your filters.
              </div>
            )}

        {loading &&
          [1, 2, 3, 4, 5, 6].map((_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="w-full aspect-square rounded-2xl bg-gray-200 animate-pulse" />
              <div className="h-3.5 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
              <div className="h-3.5 w-1/3 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Listing;
