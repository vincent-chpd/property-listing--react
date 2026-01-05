import React from 'react';
import { ListingType } from '../../../(routes)/edit-listing/[id]/page';
import { BedDouble, HouseIcon, MapPin, Ruler, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GoogleMapSection from '@/app/_components/GoogleMapSection';

type DetailsProps = {
  listingDetails: ListingType | undefined;
};

const Details = ({ listingDetails }: DetailsProps) => {
  if (!listingDetails) return null;

  return (
    <div className="my-6 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-xl">
            £
            {`${listingDetails.rentingPrice?.toLocaleString()} pcm` ||
              listingDetails.sellingPrice?.toLocaleString()}
          </h2>
          <h2 className=" text-sm text-gray-500 flex gap-1 mt-2">
            <MapPin className="h-4 w-4" />
            {listingDetails.address}
          </h2>
        </div>
        <Button className="flex gap-2 items-center">
          <Share /> Share
        </Button>
      </div>

      <hr />

      <div className="mt-4 flex flex-col gap-4 mb-4">
        <h2 className="font-bold text-xl">Key Features</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <h2 className="flex gap-2 items-center bg-primary/10 text-primary rounded-lg  p-3 justify-center">
            <HouseIcon className="h-5 w-5" />
            {listingDetails.propertyType}
          </h2>
          <h2 className="flex gap-2 items-center bg-primary/10 text-primary rounded-lg  p-3 justify-center">
            <Ruler className="h-5 w-5" />
            {listingDetails.size} sqft
          </h2>
          <h2 className="flex gap-2 items-center bg-primary/10 text-primary rounded-lg  p-3 justify-center">
            <BedDouble className="h-5 w-5" />
            {listingDetails.bedroom} Beds
          </h2>
          <h2 className="flex gap-2 items-center bg-primary/10 text-primary rounded-lg  p-3 justify-center">
            {listingDetails.bathroom} Baths
          </h2>
          <h2 className="flex gap-2 items-center bg-primary/10 text-primary rounded-lg  p-3 justify-center">
            {listingDetails.parking} Parking
          </h2>
        </div>
        <h2 className="font-bold text-xl">Description</h2>
        <p>{listingDetails.description}</p>
      </div>

      <hr />

      <h2 className="font-bold text-xl">Find On Map</h2>
      <GoogleMapSection
        coordinates={listingDetails.coordinates ?? null}
        listings={[listingDetails]}
      />
    </div>
  );
};

export default Details;
