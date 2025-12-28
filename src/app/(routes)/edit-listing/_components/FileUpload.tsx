import Image from 'next/image';
import React, { useState } from 'react'

type FileUploadProps = {
  setImages: (files: FileList | null) => void;
  imageList?: { url: string }[];
}

const FileUpload = ({setImages, imageList} :FileUploadProps ) => {
  const [imagePrewiew, setImagePreview] = useState<string[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setImages(files)
    const previews: string[] = files ? Array.from(files).map((file: File) => URL.createObjectURL(file)) : [];
      setImagePreview(previews)
  };

  return (
    <div>
      <div className="flex items-center justify-center w-full">
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or GIF (MAX. 800x400px)</p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            onChange={handleFileUpload}
            multiple
            className="hidden"
            accept='image/png, image/jpeg, image/gif'
          />
        </label>
      </div>
      <div className='mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-10 gap-y-3 mt=-3'>
        {imagePrewiew.map((image, index) => (
          <div key={index}>
            <Image
              src={image}
              width={80}
              height={80}
              className='rounded-lg object-cover h-[80px] w-[80px]'
              alt={`image-${index}`}
            />
          </div>
        ))}
      </div>
      <div className='mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-10 gap-y-3 mt=-3'>
        { imageList && imageList.map((image, index) => (
          <div key={index}>
            <Image
              src={image?.url}
              width={80}
              height={80}
              className='rounded-lg object-cover h-[80px] w-[80px]'
              alt={`image-${index}`}
            />
          </div>
        ))}
      </div>
    </div>

  )
}

export default FileUpload
