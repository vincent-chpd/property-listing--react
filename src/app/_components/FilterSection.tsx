'use client';
import React from 'react';
import { Bath, BedDouble, CarFront, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

type FilterSectionProps = {
  setBedCount: (value: number) => void;
  setBathCount: (value: number) => void;
  setParkingCount: (value: number) => void;
  setHomeType: (value: string) => void;
  handleSearchClick: () => void;
};

const homeTypes = [
  { label: 'Any', value: '' },
  { label: 'Flat', value: 'Flat' },
  { label: 'Terraced House', value: 'Terraced House' },
  { label: 'Semi-Detached House', value: 'Semi-Detached House' },
  { label: 'Detached House', value: 'Detached House' },
  { label: 'Studio', value: 'Studio' },
];

const bedOptions = [
  { label: 'Any', value: 0 },
  { label: '1+', value: 1 },
  { label: '2+', value: 2 },
  { label: '3+', value: 3 },
  { label: '4+', value: 4 },
];

const selectClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer';

const FilterSection = ({
  setBedCount,
  setBathCount,
  setParkingCount,
  setHomeType,
  handleSearchClick,
}: FilterSectionProps) => {
  return (
    <div className="flex flex-col gap-3 mt-1 ">
      <div className="flex gap-3">
      <div className="flex items-center gap-2">
        <Home className="h-4 w-4 text-gray-400 shrink-0" />
        <select className={selectClass} defaultValue="" onChange={(e) => setHomeType(e.target.value)}>
          {homeTypes.map(({ label, value }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
        <div className="flex-1 flex items-center gap-2">
          <BedDouble className="h-4 w-4 text-gray-400 shrink-0" />
          <select className={selectClass} defaultValue={0} onChange={(e) => setBedCount(Number(e.target.value))}>
            {bedOptions.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 flex items-center gap-2">
          <Bath className="h-4 w-4 text-gray-400 shrink-0" />
          <select className={selectClass} defaultValue={0} onChange={(e) => setBathCount(Number(e.target.value))}>
            {bedOptions.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 flex items-center gap-2">
          <CarFront className="h-4 w-4 text-gray-400 shrink-0" />
          <select className={selectClass} defaultValue={0} onChange={(e) => setParkingCount(Number(e.target.value))}>
            {[{ label: 'Any', value: 0 }, { label: '1', value: 1 }, { label: '2+', value: 2 }].map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <Button
        onClick={handleSearchClick}
        className="w-full rounded-full cursor-pointer bg-primary hover:bg-primary/90 flex items-center gap-2"
      >
        <Search className="h-4 w-4" />
        Search
      </Button>
    </div>
  );
};

export default FilterSection;
