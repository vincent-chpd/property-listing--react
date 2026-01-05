'use client';
import React, { useEffect, useState, use } from 'react';
import { supabase } from '@/utils/supabase/client';
import { ListingType } from '../../../(routes)/edit-listing/[id]/page';
import Slider from '../_components/Slider';
import Details from '../_components/Details';

type ViewListingProps = {
  params: Promise<{ id: string }>;
};

const ViewListing = ({ params }: ViewListingProps) => {
  const [listingDetails, setListingDetails] = useState<ListingType>();

  const resolvedParams = use(params);

  useEffect(() => {
    getLisingDetails();
  }, []);

  const getLisingDetails = async () => {
    const { data, error } = await supabase
      .from('listing')
      .select('*, listingImages(url, listing_id)')
      .eq('id', resolvedParams.id)
      .eq('active', true);

    if (data) {
      setListingDetails(data[0]);
    }

    if (error) {
      console.log('Error fetching listing details:', error);
    }
  };

  return (
    <div className="px-4 md:px-32 lg:px-120 my-3">
      <h1 className="text-2xl font-bold mb-2">{listingDetails?.title}</h1>
      <Slider imageList={listingDetails?.listingImages} />
      <Details listingDetails={listingDetails} />
    </div>
  );
};

export default ViewListing;
