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
  setCoordinates,
}) => {
  const [isClient, setIsClient] = useState(false);

  // Solves hydration mismatch error in Next.js
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) return null;

  const handleChange = (place: Address | null) => {
    selectedAddress(place);

    if (place && setCoordinates) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ placeId: (place.value as unknown as { place_id: string }).place_id }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          setCoordinates({ lat: location.lat(), lng: location.lng() });
        }
      });
    }
  };

  return (
    <div className="flex items-center w-full">
      <MapPin className="h-10 w-10 p-2 rounded-l-lg text-primary bg-red-50" />
      <GooglePlacesAutocomplete
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
        selectProps={{
          placeholder: 'Search for an address',
          isClearable: true,
          className: 'w-full rounded-lg',
          onChange: handleChange,
        }}
      />
    </div>
  );
};

export default GoogleAddressSearch;
