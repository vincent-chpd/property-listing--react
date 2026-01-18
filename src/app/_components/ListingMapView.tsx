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
  const [loading, setLoading] = useState(false);
  const [searchedAddress, setSearchedAddress] = useState<SearchedAddress>();
  const [bedCount, setBedCount] = useState(0);
  const [bathCount, setBathCount] = useState(0);
  const [parkingCount, setParkingCount] = useState(0);
  const [homeType, setHomeType] = useState('');
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    getLatestListings();
  }, []);

  const getLatestListings = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  const handleSearchClick = async () => {
    const searchTerm = searchedAddress?.value?.structured_formatting.main_text;

    if (searchedAddress?.value) {
      // You'll need to geocode the address here to get coordinates
      // This assumes you have access to Google's Geocoding API
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { address: searchedAddress.value.description },
        (results, status) => {
          if (status === 'OK' && results?.[0]) {
            setCoordinates({
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
            });
          }
        }
      );
    }

    let query = supabase
      .from('listing')
      .select('*, listingImages(url, listing_id)')
      .eq('active', true)
      .eq('type', type)
      .gte('bedroom', bedCount)
      .gte('bathroom', bathCount)
      .gte('parking', parkingCount)
      .order('id', { ascending: false });

    if (searchTerm) {
      query = query.like('address', `%${searchTerm}%`);
    }

    if (homeType) {
      query = query.eq('propertyType', homeType);
    }

    const { data, error } = await query;
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
          setBedCount={setBedCount}
          setBathCount={setBathCount}
          setParkingCount={setParkingCount}
          setHomeType={setHomeType}
          loading={loading}
        />
      </div>
      <div className="w-[48%] fixed top-34 right-0 mr-6">
        <GoogleMapSection coordinates={coordinates} listings={listings} />
      </div>
    </div>
  );
};

export default ListingMapView;
