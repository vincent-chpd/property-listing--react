'use client';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';
import { Bath, BedDouble, MapPin, Ruler, Trash } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ListingType } from '../../../(routes)/edit-listing/[id]/page';
import { Button } from '@/components/ui/button';
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
import Link from 'next/link';

const UserListings = () => {
  const [listing, setListing] = useState<ListingType[] | null>([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const GetUserListing = async () => {
        const { data, error } = await supabase
          .from('listing')
          .select('*, listingImages(url, listing_id)')
          .eq('createdBy', user?.primaryEmailAddress?.emailAddress);

        if (error) {
          console.error('Error fetching listings:', error);
          return;
        }

        setListing(data || []);
      };

      GetUserListing();
    }
  }, [user]);

  const deleteListing = async (id: number) => {
    await supabase.from('listingImages').delete().eq('listing_id', id);

    const { error } = await supabase.from('listing').delete().eq('id', id);
    if (error) {
      toast.error('Error deleting listing. Please try again.');
      return;
    }
    setListing((prev) => prev?.filter((l) => l.id !== id) ?? []);
    toast.success('Listing deleted.');
  };

  return (
    <div className="py-4 w-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-semibold text-gray-900">My listings</h2>
          <p className="text-xs text-gray-400 mt-0.5">{listing?.length ?? 0} total</p>
        </div>
        <Link href="/add-new-listing">
          <Button size="sm" className="cursor-pointer">+ New listing</Button>
        </Link>
      </div>

      {listing && listing.length === 0 && (
        <div className="text-center py-16 text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">
          No listings yet. Create your first one.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {listing &&
          listing.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="relative w-full aspect-video bg-gray-100">
                <Image
                  src={
                    item.listingImages?.[0]?.url ||
                    'https://khcnggknlyklpooymuog.supabase.co/storage/v1/object/public/listing-images/placeholder'
                  }
                  alt="Listing image"
                  fill
                  className="object-cover"
                />
                <span className={`absolute top-2.5 left-2.5 text-xs font-semibold px-2 py-0.5 rounded-full ${item.active ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
                  {item.active ? 'Published' : 'Draft'}
                </span>
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col gap-2">
                <div>
                  <p className="font-semibold text-gray-900 text-sm line-clamp-1">
                    {item.title || item.address}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5 line-clamp-1">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {item.address}
                  </p>
                </div>

                <p className="text-sm font-semibold text-gray-900">
                  £{(item.rentingPrice ?? item.sellingPrice)?.toLocaleString() ?? '—'}
                  {item.type === 'Rent' && <span className="font-normal text-gray-400"> /mo</span>}
                </p>

                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <BedDouble className="h-3.5 w-3.5" />{item?.bedroom ?? '—'} bed
                  </span>
                  <span className="text-gray-300">·</span>
                  <span className="flex items-center gap-1">
                    <Bath className="h-3.5 w-3.5" />{item?.bathroom ?? '—'} bath
                  </span>
                  <span className="text-gray-300">·</span>
                  <span className="flex items-center gap-1">
                    <Ruler className="h-3.5 w-3.5" />{item?.size ?? '—'} sq ft
                  </span>
                </div>

                <div className="flex gap-2 mt-1 pt-3 border-t border-gray-100">
                  <Button variant="outline" size="sm" className="flex-1 cursor-pointer" asChild>
                    <Link href={`/view-listing/${item.id}`}>View</Link>
                  </Button>
                  <Button size="sm" className="flex-1 cursor-pointer" asChild>
                    <Link href={`/edit-listing/${item.id}`}>Edit</Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive" className="cursor-pointer">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete listing?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. The listing will be permanently deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteListing(item.id!)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default UserListings;
