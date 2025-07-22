import React from 'react'
import Header from "./_components/Headers";

const Provider = ({children}:Readonly<{children: React.ReactNode;}>) => {
  return (
    <div>
      <Header />
      <div className='mt-32 flex justify-center'>
        {children}
      </div>
    </div>
  )
}

export default Provider
