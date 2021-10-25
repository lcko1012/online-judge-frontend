import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import './home.scss'
import axios from 'axios'
import AuthContext from '../../../context/authentication/authContext'
import { errorNotification, successNotification } from '../../../utils/notification/ToastNotification'
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



    // window.onload = function () {
    //     const exampleModal = document.getElementById('exampleModal')
    //     exampleModal.addEventListener('show.bs.modal', function (event) {
    //         // Button that triggered the modal
    //         let button = event.relatedTarget
    //         // Extract info from data-bs-* attributes
    //         let recipient = button.getAttribute('data-bs-whatever')
    //         // If necessary, you could initiate an AJAX request here
    //         // and then do the updating in a callback.
    //         //
    //         // Update the modal's content.
    //         let modalTitle = exampleModal.querySelector('.modal-title')
    //         let modalBody = exampleModal.querySelector('.modal-body')
    //         let modalBy = exampleModal.querySelector('.by')
    //         let modalDate = exampleModal.querySelector('.date')


    //         modalTitle.textContent = allPost[recipient].title
    //         modalBody.textContent = allPost[recipient].content
    //         modalBy.textContent = "By: " + allPost[recipient].infor
    //         modalDate.textContent = allPost[recipient].date


    //     })
    // }
    const [allPost1, setAllPost1] = useState({})
    const onClickPost = async (id) => {
        console.log(id)
        try {
            const res = await axios.get(`/api/post/user/${id}`)
            if (res) {
                setAllPost1(res.data)

            }
        } catch (err) {
            errorNotification(err.response.message)
        }
    }
    // let allPost = [
    //     {
    //         id: "2",
    //         title: "âsasas",
    //         content: "sđsdsd",
    //         infor: "ưerwerwer",
    //         date: "3434",
    //         chitiet: "may la ai vay"
    //     },
    //     {
    //         id: "1",
    //         title: "sdsdsdsd",
    //         content: "sđssdsdsdsdsddsd",
    //         infor: "ưerwersdsdsdsdwer",
    //         date: "3434",
    //         chitiet: "tao la long"
    //     },
    // ]




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
                        <div className="home__posts" >
                            {allPost && allPost.map((iteam, index) => {
                                return (
                                    <div className="home__post" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever={iteam.id} onClick={() => { onClickPost(iteam.id) }} >
                                        <h5 className="home__post--title" >{iteam.title}</h5>
                                        <p className="home__post--content" >
                                            {iteam.content}
                                        </p>
                                        <div className="home__post--infor">
                                            <div>
                                                <p>By: {iteam.author}</p>
                                                <p>{iteam.createdAt}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                    </div>
                    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg" >
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">{allPost1 ? allPost1.title : ""}</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body modal-body-height">
                                    {allPost1 ? allPost1.content : ""}
                                </div>
                                <div className="post-infor">
                                    <div>
                                        <p class="by">{allPost1 ? allPost1.author : ""}</p>
                                        <p class="date">{allPost1 ? allPost1.createdAt : ""}</p>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
