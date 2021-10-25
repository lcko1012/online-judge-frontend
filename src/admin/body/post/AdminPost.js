import React, { useEffect, useReducer, useState } from 'react'
import { Link } from 'react-router-dom'
import './AdminPost.scss'
import AuthContext from '../../../context/authentication/authContext'
import axios from 'axios'
import { useContext } from 'react'
import { errorNotification } from '../../../utils/notification/ToastNotification'
import { isEmpty } from '../../../utils/validation/Validation'

const ACTIONS = {
	ON_CHANGE: 'on-change',
	NEXT_PAGE: 'next-page',
	PREV_PAGE: 'prev-page',
	GET_POST_LIST: 'get-post-list',
	RESET_POST: 'reset-post',
	SUBMIT_SEARCH: 'submit-search'
}

function PostsReducer(state, action) {
	switch (action.type) {
		case ACTIONS.ON_CHANGE:
			return { ...state, [action.payload.name]: action.payload.value }
		case ACTIONS.NEXT_PAGE:
			return { ...state, currentPage: state.currentPage + 1 }
		case ACTIONS.PREV_PAGE:
			return { ...state, currentPage: state.currentPage - 1}
		case ACTIONS.GET_POST_LIST:
			return { ...state, postList: action.payload}
		case ACTIONS.RESET_POST:
			return { ...state, 
				postList: action.payload, 
				currentPage: 1,
				searchText: ''
			}
		case ACTIONS.SUBMIT_SEARCH: 
			return { ...state,
				postList: action.payload,
				currentPage: 1
			}
		default:
			return state
	}
}

function AdminPost() {
	const authContext = useContext(AuthContext)
	const { user } = authContext
	const initialPosts = {
		postList: [],
		currentPage: 1,
		searchText: ''
	}
	const [postsState, dispatch] = useReducer(PostsReducer, initialPosts)
	const {postList, currentPage, searchText} = postsState
	const [postsPerPage, setPostsPerPage] = useState(10)

	const checkRole = () => {
		return user.role === 'Admin' ? 'admin' : 'teacher'
	}

	useEffect(() => {
		const getPostList = async () => {
			try {
				const res = await axios.get(`/api/post/${checkRole()}`);
				dispatch({type: ACTIONS.GET_POST_LIST, payload: res.data})
			} catch (error) {
				console.log(error)
			}
		}
		getPostList()
	}, [])

	const indexOfLastPost = currentPage * postsPerPage
	const indexOfFirstPost = indexOfLastPost - postsPerPage
	const currentPosts = postList.slice(indexOfFirstPost, indexOfLastPost)

	const onClickNext = () => {
		if (currentPage < Math.round(postList.length / postsPerPage)) {
			dispatch({type: ACTIONS.NEXT_PAGE})
		}
	}

	const onClickPrev = () => {
		if (currentPage > 1) {
			dispatch({type:  ACTIONS.PREV_PAGE})
		}
	}

	const onChangeSearch = e => {
		dispatch({ type: ACTIONS.ON_CHANGE, payload: {
            name: e.target.name,
            value: e.target.value 
        }});
	}

	const onSubmitSearch = async (e) => {
		e.preventDefault()
		if(isEmpty(searchText)) return errorNotification("Please fill in field") 
		try {
			const res = await axios.post("/api/post/search_title", {
				searchText: searchText
			})
			dispatch({type: ACTIONS.SUBMIT_SEARCH, payload: res.data})
		} catch (error) {
			errorNotification(error.response.data.message)
		}
	}

	const onClickReset = async () => {
		try {
			const res = await axios.get(`/api/post/${checkRole()}`)
			dispatch({type: ACTIONS.RESET_POST, payload: res.data})
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className="h-100">
			<div className="container mt-5 mb-5">
				<div className="d-flex align-items-center justify-content-between mb-4">
					<div>
						<div className="input-group me-2 me-lg-3 ">
							<span className="input-group-text">
								<i className="fal fa-search"></i>
							</span>
							<form onSubmit={onSubmitSearch}>
								<input
									type="text"
									className="form-control"
									placeholder="Content or author's name"
									value={searchText}
									name="searchText"
									onChange={onChangeSearch}
								/>
							</form>
						</div>
					</div>

					<div>
						<button
							className="btn btn-light"
							onClick={onClickReset}
						>Reset</button>
					</div>
				</div>
				<div className="card card-body border-0 shadow table-wrapper table-responsive">
					<table className="table table-hover">
						<thead>
							<tr>
								<th>ID</th>
								<th>Post ID</th>
								<th>Title</th>
								<th>Author</th>
								<th>Created</th>
								<th>Visibility</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{postList &&
								<>
									{
										currentPosts.map((post, index) =>
											<tr key={post.id}>
												<td><span className="fw-normal">{index}</span></td>
												<td><span className="fw-normal">{post.id}</span></td>
												<td><span className="fw-normal">{post.title}</span></td>
												<td><span className="fw-normal">{post.author}</span></td>
												<td>{new Date(post.createdAt).toLocaleString()}</td>
												<td>
													<span className="fw-normal">
														{post.visibleMode === 'public' ? 'Yes' : 'No'}
													</span>
												</td>
												<td>
													<Link to={`/admin/post/${post.id}/detail`}>
														<button className="btn btn-light btn-xs">
															Detail
														</button>
													</Link>
												</td>
											</tr>
										)
									}
								</>
							}
						</tbody>
					</table>
					<div className="card-footer px-3 border-0 d-flex flex-column flex-lg-row align-items-center justify-content-between">
						<nav aria-label="Page navigation example">
							<ul className="pagination mb-0">
								<li className="page-item">
									<button
										className="page-link"
										onClick={onClickPrev}
										disabled={currentPage === 1}
									>
										Previous
									</button>
								</li>
								<li className="page-item">
									<button className="page-link">{currentPage}</button>
								</li>
								<li className="page-item">
									<button
										className="page-link"
										onClick={onClickNext}
										disabled={currentPage === Math.round(postList.length / postsPerPage)}
									>
										Next
									</button>
								</li>
							</ul>
						</nav>
					</div>
				</div>

				<div className="d-flex justify-content-end mt-4">
					<Link to="/admin/post/new">
						<button className="btn btn-dark"><i className="fal fa-plus mr-2"></i> Create</button>
					</Link>
				</div>
			</div>

		</div>
	)
}

export default AdminPost
