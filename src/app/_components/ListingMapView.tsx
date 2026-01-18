'use client';
import React, { useEffect, useState } from 'react';
import Listing from './Listing';
import { supabase } from '@/utils/supabase/client';
import { ListingType } from '../(routes)/edit-listing/[id]/page';
import { toast } from 'sonner';
import GoogleMapSection from './GoogleMapSection';

type ListingMapViewProps = {
  type: 'Sale' | 'Rent';
};

type SearchedAddress = {
  value: {
    description: string;
    structured_formatting: {
      main_text: string;
      secondary_text: string;
    };
  };
};

const ListingMapView = ({ type }: ListingMapViewProps) => {
  const [listings, setListings] = useState<ListingType[]>([]);
  const [searchedAddress, setSearchedAddress] = useState<SearchedAddress>();
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

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
      setListings(data);
    }

    if (error) {
      toast.error('Error fetching listings');
    }
  };

  const handleSearchClick = async () => {
    const searchTerm = searchedAddress?.value?.structured_formatting.main_text;

    const { data, error } = await supabase
      .from('listing')
      .select('*, listingImages(url, listing_id)')
      .eq('active', true)
      .eq('type', type)
      .like('address', `%${searchTerm}%`)
      .order('id', { ascending: false });

    if (data) {
      setListings(data);
    }

    if (error) {
      toast.error('Error fetching listings');
    }
  };

  return (
    <div className=" grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <Listing
          listings={listings}
          handleSearchClick={handleSearchClick}
          searchedAddress={(value) => setSearchedAddress(value)}
          setCoordinates={setCoordinates}
        />
      </div>
      <div className="w-[48%] fixed top-34 right-0 mr-6">
        <GoogleMapSection coordinates={coordinates} listings={listings} />
      </div>
    </div>
  );
};

export default ListingMapView;
