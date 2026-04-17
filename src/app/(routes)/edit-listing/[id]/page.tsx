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
  fullName?: string;
  createdBy?: string;
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { listingImages, id, ...rest } = formValue as ListingType & { listingImages?: unknown };
    const cleanValue = {
      ...rest,
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

    if (error) {
      toast.error('Error saving listing. Please try again.');
      setIsLoading(false);
      setIsSaving(false);
      setIsSavingAndPublishing(false);
      return;
    }

    if (data) {
      toast.success('Listing updated successfully!');
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

  const handlePublish = async (formValue: ListingType) => {
    setIsLoading(true);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { listingImages, id, ...rest } = formValue as ListingType & { listingImages?: unknown };
    const cleanValue = {
      ...rest,
      bedroom: formValue.bedroom ? Number(formValue.bedroom) : null,
      bathroom: formValue.bathroom ? Number(formValue.bathroom) : null,
      reception: formValue.reception ? Number(formValue.reception) : null,
      size: formValue.size ? Number(formValue.size) : null,
      sellingPrice: formValue.sellingPrice ? Number(formValue.sellingPrice) : null,
      rentingPrice: formValue.rentingPrice ? Number(formValue.rentingPrice) : null,
      active: true,
    };

    const { data, error } = await supabase
      .from('listing')
      .update(cleanValue)
      .eq('id', resolvedParams.id)
      .select();

    if (error) {
      setIsLoading(false);
      setIsSavingAndPublishing(false);
      toast.error('Error publishing listing. Please try again.');
      return;
    }

    if (data) {
      setIsLoading(false);
      setIsSavingAndPublishing(false);
      router.push('/');
      toast.success('Listing published successfully!');
    }
  };

  const fieldLabel = (text: string) => (
    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{text}</label>
  );

  const sectionTitle = (text: string) => (
    <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">{text}</h3>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Listing</h1>
        <p className="text-sm text-gray-500 mt-1">{listing?.address}</p>
      </div>

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
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Section 1 — Listing basics */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {sectionTitle('Listing details')}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  {fieldLabel('Title')}
                  <Input
                    onChange={handleChange}
                    value={values.title || ''}
                    maxLength={100}
                    name="title"
                    placeholder="e.g. Bright 2-bed flat in Shoreditch"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  {fieldLabel('Listing type')}
                  <RadioGroup
                    value={values.type}
                    onValueChange={(e) => setFieldValue('type', e)}
                    className="flex gap-4 pt-1"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="Rent" id="rent" />
                      <Label htmlFor="rent" className="cursor-pointer">For Rent</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="Sale" id="sell" />
                      <Label htmlFor="sell" className="cursor-pointer">For Sale</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex flex-col gap-1.5">
                  {fieldLabel('Property type')}
                  <Select
                    name="propertyType"
                    onValueChange={(e) => setFieldValue('propertyType', e)}
                    value={values.propertyType}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Terraced House">Terraced House</SelectItem>
                      <SelectItem value="Semi-Detached House">Semi-Detached House</SelectItem>
                      <SelectItem value="Detached House">Detached House</SelectItem>
                      <SelectItem value="Studio">Studio</SelectItem>
                      <SelectItem value="Flat">Flat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  {fieldLabel(values.type === 'Sale' ? 'Selling price (£)' : 'Monthly rent (£)')}
                  {values.type === 'Sale' ? (
                    <Input
                      onChange={handleChange}
                      value={values.sellingPrice || ''}
                      type="number"
                      name="sellingPrice"
                      placeholder="e.g. 450000"
                    />
                  ) : (
                    <Input
                      onChange={handleChange}
                      value={values.rentingPrice || ''}
                      type="number"
                      name="rentingPrice"
                      min="0"
                      placeholder="e.g. 1800"
                    />
                  )}
                </div>
                {values.type === 'Sale' && (
                  <div className="flex flex-col gap-1.5">
                    {fieldLabel('Tenure')}
                    <Select
                      name="tenure"
                      onValueChange={(e) => setFieldValue('tenure', e)}
                      value={values.tenure}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select tenure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Freehold">Freehold</SelectItem>
                        <SelectItem value="Leasehold">Leasehold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            {/* Section 2 — Property details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {sectionTitle('Property details')}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                <div className="flex flex-col gap-1.5">
                  {fieldLabel('Bedrooms')}
                  <Input onChange={handleChange} value={values.bedroom || ''} type="number" name="bedroom" min="0" placeholder="0" />
                </div>
                <div className="flex flex-col gap-1.5">
                  {fieldLabel('Bathrooms')}
                  <Input onChange={handleChange} value={values.bathroom || ''} type="number" name="bathroom" min="0" placeholder="0" />
                </div>
                <div className="flex flex-col gap-1.5">
                  {fieldLabel('Receptions')}
                  <Input onChange={handleChange} value={values.reception || ''} type="number" name="reception" min="0" placeholder="0" />
                </div>
                <div className="flex flex-col gap-1.5">
                  {fieldLabel('Size (sq ft)')}
                  <Input onChange={handleChange} value={values.size || ''} type="number" name="size" placeholder="0" />
                </div>
                <div className="flex flex-col gap-1.5">
                  {fieldLabel('Parking')}
                  <Select name="parking" onValueChange={(e) => setFieldValue('parking', e)} value={values.parking}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  {fieldLabel('Garden')}
                  <Select name="garden" onValueChange={(e) => setFieldValue('garden', e)} value={values.garden}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  {fieldLabel('Balcony')}
                  <Select name="balcony" onValueChange={(e) => setFieldValue('balcony', e)} value={values.balcony}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section 3 — Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {sectionTitle('Description')}
              <Textarea
                onChange={handleChange}
                value={values.description || ''}
                rows={5}
                name="description"
                placeholder="Describe the property — location highlights, nearby transport, condition, etc."
              />
            </div>

            {/* Section 4 — Images */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {sectionTitle('Photos')}
              <FileUpload
                setImages={(value) => setImages(value ? Array.from(value) : [])}
                imageList={listing?.listingImages || []}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pb-10">
              <Button
                disabled={isLoading}
                onClick={() => setIsSaving(true)}
                type="submit"
                variant="outline"
                className="font-semibold text-primary border-primary hover:text-primary hover:bg-primary/5 cursor-pointer"
              >
                {isLoading && isSaving ? <><Loader className="animate-spin h-4 w-4 mr-1" />Saving...</> : 'Save draft'}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={isLoading} type="button" className="font-semibold cursor-pointer">
                    {isLoading && isSavingAndPublishing ? <><Loader className="animate-spin h-4 w-4 mr-1" />Publishing...</> : 'Save & Publish'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Ready to publish?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Your listing will be visible to everyone. You can unpublish it at any time.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="cursor-pointer" onClick={() => handlePublish(values)}>
                      {isLoading ? <><Loader className="animate-spin h-4 w-4 mr-1" />Publishing</> : 'Publish'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

          </form>
        )}
      </Formik>
    </div>
  );
};

export default EditListing;
