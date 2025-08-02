import React from 'react'
import Header from "./_components/Header";

const Provider = ({children}:Readonly<{children: React.ReactNode;}>) => {
  return (
    <div>
      <Header />
      <div className='mt-32'>
        {children}
      </div>
    </div>
  )
}

export default Provider
