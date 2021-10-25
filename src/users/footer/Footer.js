import React from 'react'
import { Link } from 'react-router-dom'
import './footer.scss'

function Footer() {
    return (
        <footer class="bg-dark text-center text-white footer__container">
            <div class="text-center p-3" style={{backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
                © 2021 Copyright: <span class="text-white">OnlineJudge.com</span>
            </div>
        </footer>
    )
}

export default Footer
