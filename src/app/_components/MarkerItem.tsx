'use client';
import React from 'react';
import { MarkerF, OverlayView } from '@react-google-maps/api';
import { ListingType } from '../(routes)/edit-listing/[id]/page';
import MarkerListingItem from './MarkerListingItem';

type MarkerItemProps = {
  listing: ListingType;
  selectedListing: ListingType | null;
  onSelect: (listing: ListingType | null) => void;
};

const MarkerItem = ({
  listing,
  selectedListing,
  onSelect,
}: MarkerItemProps) => {
  if (!listing.coordinates) return null;

  const isSelected = selectedListing?.id === listing.id;

  return (
    <>
      <MarkerF
        position={listing.coordinates}
        onClick={() => onSelect(listing)}
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
