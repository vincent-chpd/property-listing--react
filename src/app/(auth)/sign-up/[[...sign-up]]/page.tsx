import { SignUp } from '@clerk/nextjs';
import Image from 'next/image';
import SignupImage from '../../../../../public/signup-img.jpg';

export default function Page() {
  return (
    <div>
      <SignUp />
      <Image
        src={SignupImage}
        width={600}
        height={200}
        alt={'Home image'}
        className="rounded-lg"
      />
    </div>
  );
}
