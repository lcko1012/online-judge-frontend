import React from 'react'
import AdminHeader from '../admin/header/AdminHeader'
import Footer from '../users/footer/Footer'

function AdminLayout({ children }) {
    return (
        <>
            <AdminHeader />
            {children}
            <Footer />
        </>
    )
}

export default AdminLayout
