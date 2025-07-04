import React from 'react'
import { Outlet } from 'react-router-dom'

const ClientLayout = () => {
  return (
    <div>
        <Outlet/>
    </div>
  )
}

export default ClientLayout