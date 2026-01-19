import { SignIn } from '@clerk/nextjs';
import Image from 'next/image';
import SignupImage from '../../../../../public/signup-img.jpg';

export default function Page() {
  return (
    <div className="grid grid-cols-[1fr_1fr] -mt-32">
      <div className="m-auto">
        <SignIn />
      </div>
      <div className="rounded-xl mr-4">
        <Image
          src={SignupImage}
          width={600}
          height={400}
          alt={'Home image'}
          className="h-[98vh] w-full rounded-4xl"
        />
      </div>
    </div>
  );
}
