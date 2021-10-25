import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import './home.scss'
import axios from 'axios'
import AuthContext from '../../../context/authentication/authContext'
import { errorNotification } from '../../../utils/notification/ToastNotification'
import MDEditor from '@uiw/react-md-editor'


function Home() {
    const authContext = useContext(AuthContext)
    const [allPost, setAllPost] = useState([])
    useEffect(() => {
        const registerConfirm = async () => {
            try {
                const res = await axios.get("/api/post/user")
                if (res) {
                    setAllPost(res.data)
                }
            } catch (err) {
                errorNotification(err.response.message)
            }
        }
        registerConfirm()
    }, [])

    const [postDetail, setPostDetail] = useState({})
    const onClickPost = async (id) => {
        try {
            const res = await axios.get(`/api/post/user/${id}`)
            if (res) {
                setPostDetail(res.data)
            }
        } catch (err) {
            errorNotification(err.response.message)
        }
    }

    return (
        <div className="background__color">
            <div className="container min-vh-100">
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
                                    : <Link to="/signup" className="btn-flip" data-back="Signup" data-front="Let's challenge"></Link>
                            }
                        </div>

                    </div>
                    <div className="col-lg-7">
                        <div className="home__posts" >
                            {allPost && allPost.map((post) => {
                                return (
                                    <div className="home__post shadow" 
                                        data-bs-toggle="modal" 
                                        data-bs-target="#exampleModal" 
                                        data-bs-whatever={post.id} onClick={() => { onClickPost(post.id) }} 
                                        key={post.id}
                                    >
                                        <h5 className="home__post--title" >{post.title}</h5>
                                        <p className="home__post--content" >
                                            {<MDEditor.Markdown source={post.content.length ? `${post.content.slice(0,50)} ...` : post.content}/> }
                                        </p>
                                        <div className="home__post--infor">
                                            <div>
                                                <p>By: {post.author}</p>
                                                <p>{new Date(post.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                    </div>
                    <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-lg" >
                            <div className="modal-content">
                                <div className="modal-header ">
                                    <h5 className="modal-title" id="exampleModalLabel">{postDetail ? postDetail.title : ""}</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body modal-body-height">
                                    {postDetail ? <MDEditor.Markdown source={ postDetail.content} /> : ""}
                                </div>
                                <div className="post-infor">
                                    <div>
                                        <p className="by">By: {postDetail ? postDetail.author : ""}</p>
                                        <p className="date">{postDetail ? new Date(postDetail.createdAt).toLocaleString() : ""}</p>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-dark" data-bs-dismiss="modal">Close</button>
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
