'use client';
import { MapPin } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

export type Address = {
  label: string;
  value: string;
};

export type Coordinates = {
  lat: number;
  lng: number;
};

type GoogleAddressSearchProps = {
  selectedAddress: (address: Address | null) => void;
  setCoordinates?: (coords: Coordinates) => void;
};

const GoogleAddressSearch: React.FC<GoogleAddressSearchProps> = ({
  selectedAddress,
}) => {
  const [isClient, setIsClient] = useState(false);

  // Solves hydration mismatch error in Next.js
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) return null;

  return (
    <div className="flex items-center w-full">
      <MapPin className="h-10 w-10 p-2 rounded-l-lg text-primary bg-red-50" />
      <GooglePlacesAutocomplete
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
        selectProps={{
          placeholder: 'Search for an address',
          isClearable: true,
          className: 'w-full rounded-lg',
          onChange: (place) => {
            selectedAddress(place);
          },
        }}
      />
    </div>
  );
};

export default GoogleAddressSearch;
