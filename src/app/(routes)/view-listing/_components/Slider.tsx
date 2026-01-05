import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';

type SliderProps = {
  imageList?: { url: string; listing_id?: string }[];
};

const Slider = ({ imageList }: SliderProps) => {
  return (
    <div>
      {imageList ? (
        <Carousel>
          <CarouselContent>
            {imageList.map((image, index) => (
              <CarouselItem key={index}>
                <Image
                  src={image.url}
                  alt={`Listing Image ${index + 1}`}
                  width={800}
                  height={300}
                  className="object-cover rounded-lg h-[300px]"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <div className="w-full h-[200px] bg-slate-200 animate-pulse rounded-lg"></div>
      )}
    </div>
  );
};

export default Slider;
