'use client';
import React, { useEffect, useState } from 'react';
import Listing from './Listing';
import { supabase } from '@/utils/supabase/client';
import { ListingType } from '../(routes)/edit-listing/[id]/page';
import { toast } from 'sonner';

type ListingMapViewProps = {
  type: 'Sale' | 'Rent';
};
const ListingMapView = ({ type }: ListingMapViewProps) => {
  const [listings, setListings] = useState<ListingType[]>([]);

  useEffect(() => {
    getLatestListings();
  }, []);

  const getLatestListings = async () => {
    const { data, error } = await supabase
      .from('listing')
      .select('*, listingImages(url, listing_id)')
      .eq('active', true)
      .eq('type', type)
      .order('id', { ascending: false });

    if (data) {
      console.log(data);
      setListings(data);
    }

    if (error) {
      toast.error('Error fetching listings');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div>
        <Listing listings={listings} />
      </div>
      <div>Map</div>
    </div>
  );
};

export default ListingMapView;
