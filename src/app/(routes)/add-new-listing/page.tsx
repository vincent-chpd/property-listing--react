"use client"
import React, { useState} from 'react'
import GoogleAddressSearch from '../../_components/GoogleAddressSearch'
import { Button } from '@/components/ui/button'
import { supabase } from '@/utils/supabase/client'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'

const AddNewListing = () => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const { user } = useUser();
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  const handleNext = async() => {
    if (selectedAddress && coordinates) {
      setLoader(true);

      const { data, error } = await supabase
        .from('listing')
        .insert([
          {
            address: selectedAddress,
            coordinates: coordinates,
            createdBy: user?.primaryEmailAddress?.emailAddress
          }
        ])
        .select();

        if (data) {
          setLoader(false);
          toast.success("Listing added successfully!");
          router.replace(`/edit-listing/${data[0].id}`);
        }
        if (error) {
          setLoader(false);
          toast.error("Error adding listing. Please try again.");
        }
    }
  };

  return (
    <div className="mt-10">
      <div className='p-10 flex flex-col items-center justify-center gap-5'>
        <h2 className='font-bold text-2x'>
          Add New Listing
        </h2>
        <div className='p-5 rounded-lg border shadow-md flex flex-col gap-5 w-full max-w-lg'>
          <h2 className='text-gray-500 mb-2'>
            Enter address which you want to list.
          </h2>
          <GoogleAddressSearch
            selectedAddress={value => setSelectedAddress(value ? value.label : null)}
            setCoordinates={coords => setCoordinates(coords)}
          />
          <Button
            onClick={handleNext}
            disabled={!selectedAddress || !coordinates || loader}
          >
            {loader ? <Loader className='animate-spin'/> : "Next" }
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddNewListing
