import { SignIn } from '@clerk/nextjs';
import Image from 'next/image';
import SignupImage from '../../../../../public/signup-img.jpg';

export default function Page() {
  return (
    <div className="grid grid-cols-[1fr_1fr] h-[100vh] -mt-32">
      <div>
        <Image
          src={SignupImage}
          width={800}
          height={400}
          alt={'Home image'}
          className="h-[100vh] w-full"
        />
      </div>
      <div className="m-auto">
        <SignIn />
      </div>
    </div>
  );
}
