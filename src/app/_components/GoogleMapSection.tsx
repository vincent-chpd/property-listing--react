'use client';
import React, { useEffect } from 'react';
import { GoogleMap } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '80vh',
  borderRadius: 10,
};

type GoogleMapSectionProps = {
  coordinates: {
    lat: number;
    lng: number;
  } | null;
};

const GoogleMapSection = ({ coordinates }: GoogleMapSectionProps) => {
  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
    lat: 37.7749,
    lng: -122.4194,
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
        zoom={12}
        center={coordinates || center}
        onLoad={setMap}
        onUnmount={() => setMap(null)}
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
