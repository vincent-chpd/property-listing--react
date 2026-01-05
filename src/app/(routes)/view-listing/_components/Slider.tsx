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
    <div className="flex">
      {imageList ? (
        <>
          <div>
            <Carousel>
              <CarouselContent>
                {imageList.map((image, index) => (
                  <CarouselItem key={index}>
                    <Image
                      src={image.url}
                      alt={`Listing Image ${index + 1}`}
                      width={800}
                      height={300}
                      className="object-cover rounded-lg h-[300px] cursor-grab"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="cursor-pointer" />
              <CarouselNext className="cursor-pointer" />
            </Carousel>
          </div>
        </>
      ) : (
        <div className="w-full h-[200px] bg-slate-200 animate-pulse rounded-lg"></div>
      )}
    </div>
  );
};

export default Slider;
