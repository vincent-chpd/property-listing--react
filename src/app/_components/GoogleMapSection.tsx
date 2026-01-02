'use client';

import React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '80vh',
  borderRadius: '8px',
};

const center = {
  lat: 51.5075,
  lng: 0.1276,
};

// Define libraries outside component to prevent re-creation
const libraries: ('places' | 'drawing' | 'geometry' | 'visualization')[] = [];

const GoogleMapSection = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY || '',
    libraries, // Add this to stabilize the loader
    preventGoogleFontsLoading: true, // Optional: prevents loading Google fonts
  });

  const [map, setMap] = React.useState<google.maps.Map | null>(null);

  const onLoad = React.useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full">
        Error loading maps
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading maps...
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      />
    </div>
  );
};

export default GoogleMapSection;
