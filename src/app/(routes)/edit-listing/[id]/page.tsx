"use client";
import React, { useEffect, use, useState } from 'react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Formik } from 'formik'
import { Button } from '@/components/ui/button';
import { supabase } from '@/utils/supabase/client'
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

type ListingFormValues = {
  type: string;
  propertyType: string;
  bedroom: number | null;
  bathroom: number | null;
  reception: number | null;
  parking: string;
  garden: string;
  balcony: string;
  size: number | null;
  tenure: string;
  sellingPrice?: number | null;
  rentingPrice?: number | null;
  description: string;
  profilePicture: string;
}

interface EditListingProps {
  params: Promise<{ id: string }>;
}

const EditListing = ({ params }: EditListingProps) => {
  const [listing, setListing] = useState<ListingFormValues | null>(null);
  const user = useUser();
  const router = useRouter();

  const resolvedParams = use(params);

  useEffect(() => {
    const verifyUserRecord = async () => {
      if (!user?.isSignedIn || !user.user) return;

      const { data } = await supabase
        .from('listing')
        .select('*')
        .eq('createdBy', user.user.primaryEmailAddress?.emailAddress)
        .eq('id', resolvedParams.id);

      if (data && data.length > 0) {
        setListing(data[0]);
      } else {
        router.replace('/');
      }
    };

    verifyUserRecord();
  }, [user, resolvedParams, router]);

  const onSubmitHandler = async(formValue: ListingFormValues) => {
    const cleanValue = {
        ...formValue,
        bedroom: formValue.bedroom ? Number(formValue.bedroom) : null,
        bathroom: formValue.bathroom ? Number(formValue.bathroom) : null,
        reception: formValue.reception ? Number(formValue.reception) : null,
        size: formValue.size ? Number(formValue.size) : null,
        sellingPrice: formValue.sellingPrice ? Number(formValue.sellingPrice) : null,
        rentingPrice: formValue.rentingPrice ? Number(formValue.rentingPrice) : null,
      };

    const { data, error } = await supabase
      .from('listing')
      .update(cleanValue)
      .eq('id', resolvedParams.id)
      .select()

      if(data){
        toast.success("Listing updated successfully!");
        console.log(data)
      }

      if(error){
        console.error(error);
        toast.error("Error updating listing. Please try again.");
      }

      if(!listing) {
        toast.error("No listing found to update.");
        return;
      }
  }

  return (
    <div className='px-10 md:px-36 my-10'>
      <h2 className="font-bold text-xl">Enter more details about your listing</h2>
      <Formik
        initialValues={{
          type: "",
          propertyType: "",
          profilePicture: user.user?.imageUrl || "",
          fullName: user.user?.fullName,
          bedroom: null,
          bathroom: null,
          reception: null,
          parking: "",
          garden: "",
          balcony: "",
          size: null,
          tenure: "",
          sellingPrice: null,
          rentingPrice: null,
          description: "",
        }}
        onSubmit={(values) => {
          console.log("Form values:", values);
          onSubmitHandler(values)
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit
        }) => (
          <form onSubmit={handleSubmit}>
            <div className='p-8 rounded-lg shadow-md mt-4'>
              <div className='grid grid-cols-1 md:grid-cols-3'>
                <div className='flex flex-col gap-2'>
                  <h2 className="text-sm text-slate-500">Rent or Sell</h2>
                  <RadioGroup defaultValue={listing?.type} onValueChange={e => values.type = e} >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Rent" id="rent" />
                      <Label htmlFor="Rent">Rent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Sell" id="sell" />
                      <Label htmlFor="sell">Sell</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className='flex flex-col gap-2 mt-10 md:mt-0'>
                  <h2 className="text-sm text-slate-500">Property Type</h2>
                  <Select name="propertyType" onValueChange={e => values.propertyType=e} defaultValue={listing?.propertyType || ''}>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder={listing?.propertyType ? listing.propertyType : "Select Property Type"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Terraced House">Terraced House</SelectItem>
                      <SelectItem value="Semi-Detached House">Semi-Detached House</SelectItem>
                      <SelectItem value="Detached House">Detached House</SelectItem>
                      <SelectItem value="Bungalow">Bungalow</SelectItem>
                      <SelectItem value="Flat">Flat</SelectItem>
                      <SelectItem value="Cottage">Cottage</SelectItem>
                      <SelectItem value="Maisonette">Maisonette</SelectItem>
                      <SelectItem value="Townhouse">Townhouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-3 mt-10 gap-8'>
                <div className='flex flex-col gap-2'>
                  <h2 className="text-sm text-slate-500">Bedroom</h2>
                  <Input
                    onChange={handleChange}
                    defaultValue={listing?.bedroom || ''}
                    type="number"
                    name="bedroom"
                    min="0"
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <h2 className="text-sm text-slate-500">Bathroom</h2>
                  <Input
                    onChange={handleChange}
                    defaultValue={listing?.bathroom || ''}
                    type="number"
                    name="bathroom"
                    min="0"
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <h2 className="text-sm text-slate-500">Reception</h2>
                  <Input
                    onChange={handleChange}
                    defaultValue={listing?.reception || ''}
                    type="number"
                    name="reception"
                    min="0"
                  />
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-3 mt-10 gap-8'>
                <div className='flex flex-col gap-2'>
                  <h2 className="text-sm text-slate-500">Parking</h2>
                  <Select name="parking" onValueChange={e => values.parking=e} defaultValue={listing?.parking || ''}>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Please Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex flex-col gap-2'>
                  <h2 className="text-sm text-slate-500">Garden</h2>
                  <Select name="garden" onValueChange={e => values.garden=e} defaultValue={listing?.garden || ''}>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Please Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex flex-col gap-2'>
                  <h2 className="text-sm text-slate-500">Balcony</h2>
                  <Select name="balcony" onValueChange={e => values.balcony=e} defaultValue={listing?.balcony || ''}>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Please Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex flex-col gap-2'>
                  <h2 className="text-sm text-slate-500">Size (Sq ft)</h2>
                  <Input
                    name="size"
                    onChange={handleChange}
                    defaultValue={listing?.size || ''}
                    type="number"
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <h2 className="text-sm text-slate-500">Tenure</h2>
                  <Select name="tenure" onValueChange={e => values.tenure=e} defaultValue={listing?.tenure || ''}>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Select Tenure" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Freehold">Freehold</SelectItem>
                      <SelectItem value="Leasehold">Leasehold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex flex-col gap-2'>
                  <h2 className="text-sm text-slate-500">Selling Price (£)</h2>
                  <Input
                    onChange={handleChange}
                    defaultValue={listing?.sellingPrice || ''}
                    type="number"
                    name="sellingPrice"
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <h2 className="text-sm text-slate-500">Renting Price (Monthly)(£)</h2>
                  <Input
                    onChange={handleChange}
                    defaultValue={listing?.rentingPrice || ''}
                    type="number"
                    name="rentingPrice"
                    min="0"
                  />
                </div>
              </div>
              <div className='flex flex-col gap-2 mt-8'>
                <h2 className="text-sm text-slate-500">Description</h2>
                <Textarea
                  onChange={handleChange}
                  defaultValue={listing?.description || ''}
                  rows={4}
                  name="description"
                />
              </div>
            <Button
              type="submit"
              className='mt-8 w-full font-bold'
            >
              Save & Publish
            </Button>
            </div>
          </form>
      )}
      </Formik>
    </div>
  )
}

export default EditListing
