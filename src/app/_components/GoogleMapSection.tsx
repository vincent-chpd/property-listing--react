'use client';
import React, { useEffect, useState } from 'react';
import { ListingType } from '../(routes)/edit-listing/[id]/page';

import { GoogleMap } from '@react-google-maps/api';
import MarkerItem from './MarkerItem';

const containerStyle = {
  width: '100%',
  height: '80vh',
  borderRadius: 10,
};

type GoogleMapSectionProps = {
  listings: ListingType[];
  coordinates: {
    lat: number;
    lng: number;
  } | null;
};

const GoogleMapSection = ({ coordinates, listings }: GoogleMapSectionProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedListing, setSelectedListing] = useState<ListingType | null>(
    null
  );

  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 51.5072,
    lng: 0.1276,
  });

  useEffect(() => {
    if (coordinates && map) {
      setCenter(coordinates);
    }
  }, [coordinates, map]);

  return (
    <div className="h-full w-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={17}
        center={coordinates || center}
        onLoad={setMap}
        onUnmount={() => setMap(null)}
      >
        {listings.map((listing, index) => (
          <MarkerItem
            key={index}
            listing={listing}
            selectedListing={selectedListing}
            onSelect={setSelectedListing}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapSection;
