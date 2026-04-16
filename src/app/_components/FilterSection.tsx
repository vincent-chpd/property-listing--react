'use client';
import React, { useState } from 'react';
import { Bath, BedDouble, CarFront, Home, Building2, Landmark, Trees, Warehouse } from 'lucide-react';

type FilterSectionProps = {
  setBedCount: (value: number) => void;
  setBathCount: (value: number) => void;
  setParkingCount: (value: number) => void;
  setHomeType: (value: string) => void;
};

const homeTypes = [
  { label: 'Any', value: '', icon: Home },
  { label: 'Flat', value: 'Flat', icon: Building2 },
  { label: 'Terraced', value: 'Terraced House', icon: Landmark },
  { label: 'Semi-Detached', value: 'Semi-Detached House', icon: Trees },
  { label: 'Detached', value: 'Detached House', icon: Warehouse },
  { label: 'Studio', value: 'Studio', icon: Home },
];

const bedOptions = [
  { label: 'Any', value: 0 },
  { label: '1+', value: 1 },
  { label: '2+', value: 2 },
  { label: '3+', value: 3 },
  { label: '4+', value: 4 },
];

const FilterSection = ({
  setBedCount,
  setBathCount,
  setParkingCount,
  setHomeType,
}: FilterSectionProps) => {
  const [activeType, setActiveType] = useState('');
  const [activeBed, setActiveBed] = useState(0);
  const [activeBath, setActiveBath] = useState(0);

  const handleType = (value: string) => {
    setActiveType(value);
    setHomeType(value);
  };

  const handleBed = (value: number) => {
    setActiveBed(value);
    setBedCount(value);
  };

  const handleBath = (value: number) => {
    setActiveBath(value);
    setBathCount(value);
  };

  return (
    <div className="flex flex-col gap-3 mt-1">
      {/* Property type chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {homeTypes.map(({ label, value, icon: Icon }) => (
          <button
            key={value}
            onClick={() => handleType(value)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-full border text-xs font-medium shrink-0 transition-all cursor-pointer
              ${activeType === value
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Beds / Baths row */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1">
          <BedDouble className="h-4 w-4 text-gray-400 shrink-0" />
          <div className="flex gap-1">
            {bedOptions.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handleBed(value)}
                className={`px-3 py-1 rounded-full border text-xs font-medium transition-all cursor-pointer
                  ${activeBed === value
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Bath className="h-4 w-4 text-gray-400 shrink-0" />
          <div className="flex gap-1">
            {bedOptions.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handleBath(value)}
                className={`px-3 py-1 rounded-full border text-xs font-medium transition-all cursor-pointer
                  ${activeBath === value
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <CarFront className="h-4 w-4 text-gray-400 shrink-0" />
          <div className="flex gap-1">
            {[{ label: 'Any', value: 0 }, { label: '1', value: 1 }, { label: '2+', value: 2 }].map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setParkingCount(value)}
                className="px-3 py-1 rounded-full border text-xs font-medium border-gray-200 text-gray-600 hover:border-gray-400 transition-all cursor-pointer"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
