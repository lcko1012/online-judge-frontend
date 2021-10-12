import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import './home.scss'
import AuthContext from '../../../context/authentication/authContext'

function Home() {
    const authContext = useContext(AuthContext)
    
    return (
        <div className="background__color">
            <div className="container  vh-100">
                <div className="row">

                    <div className="col-lg-5 home__left">
                        <div className="home__title-container">
                            <h5 className="text-dark home__title">
                                Welcome to OnlineJudge
                            </h5>
                            
                            <p className=" home__sub-title text-dark">
                                An Automatic Code Grading System
                            </p>

                           {
                               authContext.isAuthenticated ? null
                                : <Link to="/signup" class="btn-flip" data-back="Signup" data-front="Let's challenge"></Link>
                           }
                        </div>
                       
                    </div>
                    <div className="col-lg-7">
                        <div className="home__posts">
                            <div className="home__post">
                                <h5 className="home__post--title">The Importance of Algorithms</h5>
                                <p className="home__post--content">
                                The first step towards an understanding of why the study and knowledge of 
                                algorithms are so important is to define exactly...
                                </p>
                                <div className="home__post--infor">
                                    <div>
                                        <p>By: Admin</p>
                                        <p>June 9th 2021</p>
                                    </div>
                                    
                                </div>
                            </div>

                            <div className="home__post">
                                <h5 className="home__post--title">Planned System-wide Test Announcement</h5>
                                <p className="home__post--content">
                                System will be stress tested on exactly 6PM, October 16th (GMT+7) 
                                </p>
                                <div className="home__post--infor">
                                    <div>
                                        <p>By: Admin</p>
                                        <p>June 9th 2021</p>
                                    </div>
                                    
                                </div>
                            </div>
                            
                            <div className="home__post">
                                <h5 className="home__post--title">Why do we use it?</h5>
                                <p className="home__post--content">
                                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 
                                The point of using Lorem Ipsum is that it...
                                </p>
                                <div className="home__post--infor">
                                    <div>
                                        <p>By: Dare</p>
                                        <p>June 9th 2021</p>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                
            </div>
        </div>
        
    )
}

export default Home
