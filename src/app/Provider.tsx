'use client';
import React from 'react';
import Header from './_components/Header';
import { LoadScript } from '@react-google-maps/api';

const Provider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY || ''}
        libraries={['places']}
      >
        <Header />
        <div className="mt-32">{children}</div>
      </LoadScript>
    </div>
  );
};

export default Provider;
