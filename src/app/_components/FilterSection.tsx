import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bath, BedDouble, CarFront } from 'lucide-react';

type FilterSectionProps = {
  setBedCount: (value: number | null) => void;
  setBathCount: (value: number | null) => void;
  setParkingCount: (value: number | null) => void;
  setHomeType: (value: string) => void;
};

const FilterSection = ({
  setBedCount,
  setBathCount,
  setParkingCount,
  setHomeType,
}: FilterSectionProps) => {
  return (
    <div className="flex gap-4 my-2">
      <Select onValueChange={(value) => setBedCount(Number(value))}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Bed" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">
            <h2 className="flex gap-2 text-xs">
              <BedDouble className="h-5 w-5 text-primary" />
              1+{' '}
            </h2>
          </SelectItem>
          <SelectItem value="2">
            <h2 className="flex gap-2 text-xs">
              <BedDouble className="h-5 w-5 text-primary" />
              2+{' '}
            </h2>
          </SelectItem>
          <SelectItem value="3">
            <h2 className="flex gap-2 text-xs">
              <BedDouble className="h-5 w-5 text-primary" />
              3+{' '}
            </h2>
          </SelectItem>
          <SelectItem value="4">
            <h2 className="flex gap-2 text-xs">
              <BedDouble className="h-5 w-5 text-primary" />
              4+{' '}
            </h2>
          </SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => setBathCount(Number(value))}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Bath" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">
            <h2 className="flex gap-2 text-xs">
              <Bath className="h-5 w-5 text-primary" />
              1+{' '}
            </h2>
          </SelectItem>
          <SelectItem value="2">
            <h2 className="flex gap-2 text-xs">
              <Bath className="h-5 w-5 text-primary" />
              2+{' '}
            </h2>
          </SelectItem>
          <SelectItem value="3">
            <h2 className="flex gap-2 text-xs">
              <Bath className="h-5 w-5 text-primary" />
              3+{' '}
            </h2>
          </SelectItem>
          <SelectItem value="4">
            <h2 className="flex gap-2 text-xs">
              <Bath className="h-5 w-5 text-primary" />
              4+{' '}
            </h2>
          </SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => setParkingCount(Number(value))}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Parking" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">
            <h2 className="flex gap-2 text-xs">
              <CarFront className="h-5 w-5 text-primary" />1{' '}
            </h2>
          </SelectItem>
          <SelectItem value="2+">
            <h2 className="flex gap-2 text-xs">
              <CarFront className="h-5 w-5 text-primary items" />
              2+{' '}
            </h2>
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) =>
          value === 'all' ? setHomeType('') : setHomeType(value)
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Home Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="flat">Flat</SelectItem>
          <SelectItem value="Semi-Detached House">
            Semi-Detached House
          </SelectItem>
          <SelectItem value="detached">Detached House</SelectItem>
          <SelectItem value="terraced">Terraced House</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterSection;
