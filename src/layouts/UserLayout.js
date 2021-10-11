import React from 'react'
import Footer from '../users/footer/Footer'
import Header from '../users/header/Header'

function UserLayout({ children }) {
    return (
        <>
            <Header />
            <div className="container">
                {children}
            </div>
            <Footer />
        </>
    )
}
function UserLayout1({ children }) {
    return (
        <>

            <div className="Signup-container">
                {children}
            </div>

        </>
    )
}

export default { UserLayout, UserLayout1 }
