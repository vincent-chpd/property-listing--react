import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';

type SliderProps = {
  imageList?: { url: string; listing_id?: string }[];
};

const Slider = ({ imageList }: SliderProps) => {
  return (
    <div className="flex">
      {imageList === undefined ? (
        <div className="w-full h-[400px] bg-slate-200 animate-pulse rounded-lg" />
      ) : imageList.length === 0 ? (
        <div className="w-full h-[400px] bg-slate-100 rounded-lg flex flex-col items-center justify-center gap-3 text-slate-400">
          <ImageOff className="h-16 w-16" />
          <p className="text-sm font-medium">No photos available</p>
        </div>
      ) : (
        <Carousel className="w-full">
          <CarouselContent>
            {imageList.map((image, index) => (
              <CarouselItem key={index}>
                <Image
                  src={image.url}
                  alt={`Listing Image ${index + 1}`}
                  width={800}
                  height={300}
                  className="object-cover rounded-lg h-[400px] w-[100vw] cursor-grab"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="cursor-pointer" />
          <CarouselNext className="cursor-pointer" />
        </Carousel>
      )}
    </div>
  );
};

export default Slider;
