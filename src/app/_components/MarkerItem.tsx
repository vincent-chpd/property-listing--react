// MarkerItem.tsx
'use client';
import React from 'react';
import { MarkerF, OverlayView } from '@react-google-maps/api';
import { ListingType } from '../(routes)/edit-listing/[id]/page';
import MarkerListingItem from './MarkerListingItem';

type MarkerItemProps = {
  listing: ListingType;
  selectedListing: ListingType | null;
  onSelect: (listing: ListingType | null) => void;
  map: google.maps.Map | null;
};

const MarkerItem = ({
  listing,
  selectedListing,
  onSelect,
  map,
}: MarkerItemProps) => {
  if (!listing.coordinates) return null;

  const isSelected = selectedListing?.id === listing.id;

  const handleMarkerClick = (listing: ListingType) => {
    onSelect(listing);
    if (map && listing.coordinates) {
      map.panTo({
        lat: listing.coordinates.lat,
        lng: listing.coordinates.lng + 0.05, // Slightly offset to show overlay
      });
    }
  };

  return (
    <>
      <MarkerF
        position={listing.coordinates}
        onClick={() => handleMarkerClick(listing)}
      />
      {isSelected && (
        <OverlayView
          position={listing.coordinates}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div>
            <MarkerListingItem
              item={listing}
              closeHandler={() => onSelect(null)}
            />
          </div>
        </OverlayView>
      )}
    </>
  );
};

export default MarkerItem;
