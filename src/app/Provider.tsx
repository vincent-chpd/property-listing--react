'use client';
import React from 'react';
import Header from './_components/Header';
import { Loader2 } from 'lucide-react';
import { LoadScript } from '@react-google-maps/api';

const Provider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY || ''}
        libraries={['places']}
        loadingElement={
          <div className="flex min-h-screen items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-3 text-gray-600">
              <Loader2 className="h-8 w-8 animate-spin stroke-primary" />
              <span className="text-sm font-medium">Loading…</span>
            </div>
          </div>
        }
      >
        <Header />
        <div className="mt-32">{children}</div>
      </LoadScript>
    </div>
  );
};

export default Provider;
