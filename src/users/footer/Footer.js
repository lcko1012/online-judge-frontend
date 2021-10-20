import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <footer class="bg-dark text-center text-white">
            {/* <div class="container p-4">
                <section>
                    <p className="mb-0">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt distinctio earum
                        repellat quaerat voluptatibus placeat nam, commodi optio pariatur est quia magnam
                        eum harum corrupti dicta, aliquam sequi voluptate quas.
                    </p>
                </section>
            </div> */}

            <div class="text-center p-3" style={{backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
                © 2021 Copyright: <span class="text-white">OnlineJudge.com</span>
            </div>
        </footer>
    )
}

export default Footer
