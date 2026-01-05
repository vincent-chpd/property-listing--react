'use client';
import React, { useEffect, use, useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Formik } from 'formik';
import { Button } from '@/components/ui/button';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import FileUpload from '../_components/FileUpload';
import { Loader } from 'lucide-react';

export type ListingType = {
  id?: number;
  title?: string;
  type: string;
  active?: boolean;
  propertyType: string;
  bedroom?: number | null;
  bathroom?: number | null;
  reception?: number | null;
  parking: string;
  garden?: string;
  balcony?: string;
  size?: number | null;
  tenure?: string;
  sellingPrice?: number | null;
  rentingPrice?: number | null;
  description?: string;
  profilePicture?: string;
  listingImages?: { url: string }[];
  address: string;
  coordinates?:
    | {
        lat: number;
        lng: number;
      }
    | undefined;
};

interface EditListingProps {
  params: Promise<{ id: string }>;
}

const EditListing = ({ params }: EditListingProps) => {
  const [listing, setListing] = useState<ListingType | null>(null);
  const user = useUser();
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingAndPublishing, setIsSavingAndPublishing] = useState(false);

  const resolvedParams = use(params);

  useEffect(() => {
    const verifyUserRecord = async () => {
      if (!user?.isSignedIn || !user.user) return;

      const { data } = await supabase
        .from('listing')
        .select('*, listingImages(listing_id, url)')
        .eq('createdBy', user.user.primaryEmailAddress?.emailAddress)
        .eq('id', resolvedParams.id);

      if (data && data.length > 0) {
        setListing(data[0]);
      } else {
        router.replace('/');
      }
    };

    verifyUserRecord();
  }, [user.user, user.isSignedIn, resolvedParams, router]);

  const onSubmitHandler = async (formValue: ListingType) => {
    setIsLoading(true);

    const cleanValue = {
      ...formValue,
      bedroom: formValue.bedroom ? Number(formValue.bedroom) : null,
      bathroom: formValue.bathroom ? Number(formValue.bathroom) : null,
      reception: formValue.reception ? Number(formValue.reception) : null,
      size: formValue.size ? Number(formValue.size) : null,
      sellingPrice: formValue.sellingPrice
        ? Number(formValue.sellingPrice)
        : null,
      rentingPrice: formValue.rentingPrice
        ? Number(formValue.rentingPrice)
        : null,
      active: formValue.active || false,
    };

    const { data, error } = await supabase
      .from('listing')
      .update(cleanValue)
      .eq('id', resolvedParams.id)
      .select();

    if (data) {
      toast.success('Listing updated successfully!');
      setIsLoading(false);
      setIsSaving(false);
      setIsSavingAndPublishing(false);
    }

    for (const image of images) {
      const file = image;

      const fileName = Date.now().toString();

      const fileExtension = file.name.split('.').pop();

      const { data, error } = await supabase.storage
        .from('listing-images')
        .upload(`${fileName}`, file, {
          contentType: `image/${fileExtension}`,
          upsert: false,
        });

      if (data) {
        const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL + fileName;
        const { data, error } = await supabase
          .from('listingImages')
          .insert([{ url: imageUrl, listing_id: resolvedParams.id }])
          .select();
      }

      if (error) {
        toast.error(`Error uploading image ${fileName}. Please try again.`);
        return;
      }

      setIsLoading(false);
      setIsSaving(false);
      setIsSavingAndPublishing(false);
    }
  };

  const handlePublish = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('listing')
      .update({ active: true })
      .eq('id', resolvedParams.id)
      .select();

    if (data) {
      setIsLoading(false);
      setIsSavingAndPublishing(false);
      router.push('/');
      toast.success('Listing published successfully!');
    }

    if (error) {
      setIsLoading(false);
      setIsSavingAndPublishing(false);
      toast.error('Error publishing listing. Please try again.');
    }
  };

  return (
    <div className="px-10 md:px-36 my-10">
      <h2 className="font-bold text-xl">
        Enter more details about your listing
      </h2>
      <Formik
        enableReinitialize={true}
        initialValues={{
          type: listing?.type || '',
          propertyType: listing?.propertyType || '',
          bedroom: listing?.bedroom || null,
          bathroom: listing?.bathroom || null,
          reception: listing?.reception || null,
          parking: listing?.parking || '',
          garden: listing?.garden || '',
          balcony: listing?.balcony || '',
          size: listing?.size || null,
          tenure: listing?.tenure || '',
          sellingPrice: listing?.sellingPrice || null,
          rentingPrice: listing?.rentingPrice || null,
          description: listing?.description || '',
          title: listing?.title || '',
          profilePicture: user.user?.imageUrl || '',
          fullName: user.user?.fullName || '',
          address: listing?.address || '',
          active: listing?.active || false,
        }}
        onSubmit={(values) => {
          onSubmitHandler(values);
        }}
      >
        {({ values, handleChange, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <div className="p-8 rounded-lg shadow-md mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <h2 className="text-sm text-slate-500">Rent or Sell</h2>
                  <RadioGroup
                    value={values.type}
                    onValueChange={(e) => setFieldValue('type', e)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Rent" id="rent" />
                      <Label htmlFor="rent">Rent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Sell" id="sell" />
                      <Label htmlFor="sell">Sell</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex flex-col gap-2 mt-10 md:mt-0">
                  <h2 className="text-sm text-slate-500">Property Type</h2>
                  <Select
                    name="propertyType"
                    onValueChange={(e) => setFieldValue('propertyType', e)}
                    value={values.propertyType}
                  >
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Select Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Terraced House">
                        Terraced House
                      </SelectItem>
                      <SelectItem value="Semi-Detached House">
                        Semi-Detached House
                      </SelectItem>
                      <SelectItem value="Detached House">
                        Detached House
                      </SelectItem>
                      <SelectItem value="Studio">Studio</SelectItem>
                      <SelectItem value="Flat">Flat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 mt-10 gap-8">
                <div className="flex flex-col gap-2">
                  <h2 className="text-sm text-slate-500">Bedroom</h2>
                  <Input
                    onChange={handleChange}
                    value={values.bedroom || ''}
                    type="number"
                    name="bedroom"
                    min="0"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-sm text-slate-500">Bathroom</h2>
                  <Input
                    onChange={handleChange}
                    value={values.bathroom || ''}
                    type="number"
                    name="bathroom"
                    min="0"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-sm text-slate-500">Reception</h2>
                  <Input
                    onChange={handleChange}
                    value={values.reception || ''}
                    type="number"
                    name="reception"
                    min="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 mt-10 gap-8">
                <div className="flex flex-col gap-2">
                  <h2 className="text-sm text-slate-500">Parking</h2>
                  <Select
                    name="parking"
                    onValueChange={(e) => setFieldValue('parking', e)}
                    value={values.parking}
                  >
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Please Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-sm text-slate-500">Garden</h2>
                  <Select
                    name="garden"
                    onValueChange={(e) => setFieldValue('garden', e)}
                    value={values.garden}
                  >
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Please Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-sm text-slate-500">Balcony</h2>
                  <Select
                    name="balcony"
                    onValueChange={(e) => setFieldValue('balcony', e)}
                    value={values.balcony}
                  >
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Please Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-sm text-slate-500">Size (Sq ft)</h2>
                  <Input
                    name="size"
                    onChange={handleChange}
                    value={values.size || ''}
                    type="number"
                  />
                </div>
                {values.type === 'Sell' && (
                  <div className="flex flex-col gap-2">
                    <h2 className="text-sm text-slate-500">Tenure</h2>
                    <Select
                      name="tenure"
                      onValueChange={(e) => setFieldValue('tenure', e)}
                      value={values.tenure}
                    >
                      <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Select Tenure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Freehold">Freehold</SelectItem>
                        <SelectItem value="Leasehold">Leasehold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {values.type === 'Sell' ? (
                  <div className="flex flex-col gap-2">
                    <h2 className="text-sm text-slate-500">
                      Selling Price (£)
                    </h2>
                    <Input
                      onChange={handleChange}
                      value={values.sellingPrice || ''}
                      type="number"
                      name="sellingPrice"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <h2 className="text-sm text-slate-500">
                      Renting Price (Monthly)(£)
                    </h2>
                    <Input
                      onChange={handleChange}
                      value={values.rentingPrice || ''}
                      type="number"
                      name="rentingPrice"
                      min="0"
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 mt-8">
                <h2 className="text-sm text-slate-500">Title</h2>
                <Input
                  onChange={handleChange}
                  value={values.title || ''}
                  maxLength={100}
                  name="title"
                />
              </div>
              <div className="flex flex-col gap-2 mt-8">
                <h2 className="text-sm text-slate-500">Description</h2>
                <Textarea
                  onChange={handleChange}
                  value={values.description || ''}
                  rows={4}
                  name="description"
                />
              </div>
              <div className="mt-8">
                <h2 className="font-lg text-gray-500 my-2">
                  Upload Property Images
                </h2>
                <FileUpload
                  setImages={(value) =>
                    setImages(value ? Array.from(value) : [])
                  }
                  imageList={listing?.listingImages || []}
                />
              </div>
              <div className="flex gap-4 justify-end">
                <Button
                  disabled={isLoading}
                  onClick={() => {
                    setIsSaving(true);
                  }}
                  type="submit"
                  variant="outline"
                  className="font-bold text-primary border-primary hover:text-primary hover:bg-primary/5"
                >
                  {isLoading && isSaving ? (
                    <>
                      <Loader className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      disabled={isLoading}
                      type="button"
                      className="font-bold cursor-pointer"
                    >
                      {isLoading && isSavingAndPublishing ? (
                        <>
                          <Loader className="animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        'Save & Publish'
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Ready to publish?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Do you really want to publish this listing?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="cursor-pointer"
                        onClick={() => {
                          handlePublish();
                        }}
                      >
                        {isLoading ? (
                          <>
                            <Loader className="animate-spin" /> Publishing
                          </>
                        ) : (
                          'Publish'
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default EditListing;
