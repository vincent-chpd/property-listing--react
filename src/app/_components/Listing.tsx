import React from 'react'
import { ListingType } from '../(routes)/edit-listing/[id]/page'
import Image from 'next/image'

type ListingProps = {
  listings: ListingType[]
}

const Listing = ({listings}: ListingProps) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings.map((item: ListingType, index: number) => (
          <div key={index}>
            <Image
              src={item.listingImages?.[0]?.url || 'https://khcnggknlyklpooymuog.supabase.co/storage/v1/object/public/listing-images/placeholder'}
              alt='Image of the listing'
              width={800}
              height={150}
              className='rounded-lg object-cover h-[150px]'
            />
            <div>
              <h2 className='font-bold text-xl'>£{item.rentingPrice}</h2>
              <small>{item.address}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Listing
