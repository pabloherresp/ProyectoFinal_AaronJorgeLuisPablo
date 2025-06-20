import React, { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"
import { Link, useNavigate, useParams } from "react-router-dom"
import collection from "../services/collection"
import { NewProfessionalBox } from "../components/NewProfessionalBox.jsx";
import { ActivityCard } from "../components/ActivityCard.jsx";
import { CommentBox } from "../components/CommentBox.jsx";

export const PersonalSpace = () => {
	const navigate = useNavigate()
	const { store, dispatch } = useGlobalReducer()

	const [inscriptions, setInscriptions] = useState(null)
	const [order, setOrder] = useState("start")
	const [inverted, setInverted] = useState(-1)
	const [limit, setLimit] = useState(15)
	const [activeTab, setActiveTab] = useState('inscripciones');

	const formatDate = (date) => {
		return date.toLocaleString("en-GB", { timeZone: "UTC" })
	}

	const loadInscriptions = async () => {
		const resp = await collection.getInscriptionsForUser()
		if ("error" in resp)
			setInscriptions([])
		else
			setInscriptions([...resp])
	}

	const handleClickHead = (text) => {
		if (text == order)
			setInverted(-1 * inverted)
		else {
			setOrder(text)
			setInverted(-1)
		}
	}

	const handleSeeMore = () => {
		setLimit(limit + 10)
	}

	const compareFunction = (a, b) => {
		if (order == "name")
			return inverted * a.activity.info_activity.name.localeCompare(b.activity.info_activity.name)
		else if (order == "start")
			return inverted * a.activity.start_date.localeCompare(b.activity.start_date)
		else if (order == "end")
			return inverted * a.activity.end_date.localeCompare(b.activity.end_date)
		else if (order == "price")
			return inverted * (a.activity.price - b.activity.price)
	}

	useEffect(() => {
		if (!store.user)
			navigate("/login")
		else if (store.user.needs_filling == true)
			navigate("/completeuserform")
		const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
		const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
		loadInscriptions()
	}, [])



	return (
		<div className="container">
			<div className="bg-white shadow my-3 rounded">
				<div className="BgSecondary m-0 p-4 rounded-top shadow">
					<div className="container-fluid p-0">
						<div className="row justify-content-center">
							<div className="col-12 text-center mb-4">
								<h1 className="text-white fw-bold display-4 text-capitalize name-gradient font1 m-0">
									{store.user?.name + " " + store.user?.surname}
								</h1>
							</div>
						</div>

						<div className="row">
							<div className="col-8 col-md-3 justify-content-center align-content-center px-lg-2 ms-5">
								<img className="shadow img-fluid rounded-circle NoDeformImg my-auto"
									src={"/avatar/" + (store.user?.avatar_url ? store.user?.avatar_url : "0.jpg")} alt="avatar"
								/>
							</div>
							<div className="col-12 col-md-4 ms-auto d-flex flex-column align-items-center align-items-md-start my-3">

								<h4 className="text-white fs-5 fw-semibold font1 text-capitalize">
									<i className="fa-solid fa-user fa-sm me-2"></i>@{store.user?.username}
								</h4>

								{store.user.NID && (
									<p className="text-light fw-semibold">
										<i className="fa-solid fa-id-card me-2"></i> {store.user.NID}
									</p>
								)}

								{store.user.birthdate && (
									<p className="text-light fw-semibold text-capitalize">
										<i className="fa-solid fa-cake-candles me-2"></i>{" "}
										{new Date(store.user?.birthdate).toLocaleDateString("es-ES", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
									</p>
								)}

								{store.user.email && (
									<p className="text-light fw-semibold">
										<i className="fa-solid fa-at me-2"></i> {store.user?.email}
									</p>
								)}

								{store.user.telephone && (
									<p className="text-light fw-semibold">
										<i className="fa-solid fa-phone me-2"></i> {store.user?.telephone}
									</p>
								)}

								{store.user?.professional?.business_name && (
									<h4 className="text-white fs-5 fw-semibold font1 text-capitalize">
										<i className="fa-solid fa-briefcase me-2"></i>
										{store.user?.professional?.business_name}
									</h4>
								)}
							</div>

							<div className="col-12 col-md-4 d-flex flex-column align-items-center align-items-md-start my-lg-3">
								<p className="text-light font1">
									<i className="fa-solid fa-map-location-dot me-2"></i>
									{(store.user?.city || "") + (store.user?.country ? ", " + store.user.country : "")}
								</p>

								<p className="text-light font1">
									<i className="fa-solid fa-house me-2"></i>
									{store.user?.address}
								</p>

								<p className="text-light font1 text-capitalize text-center text-md-start">
									<i className="fa-solid fa-people-group me-2"></i>
									Miembro desde <br />
									{new Date(store.user?.creation_date).toLocaleDateString("es-ES", {
										weekday: "long",
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</p>

								<button
									type="button"
									className="btn text-white DarkButton mt-2"
									onClick={() => navigate("/edituser")}
								>
									<i className="fa-solid fa-pen-to-square me-2"></i>Editar datos
								</button>
							</div>
						</div>
					</div>
				</div>

				<ul className="nav nav-underline d-flex justify-content-evenly mt-4">
					<li className="nav-item">
						<button
							className={`nav-link ${activeTab === 'inscripciones' ? 'active' : ''}`}
							onClick={() => setActiveTab('inscripciones')}
						>
							<i className="fa-solid fa-book me-2"></i>Inscripciones
						</button>
					</li>
					<li className="nav-item">
						<button
							className={`nav-link ${activeTab === 'favoritos' ? 'active' : ''}`}
							onClick={() => setActiveTab('favoritos')}
						>
							<i className="fa-solid fa-star me-2 text-warning"></i>Favoritos
						</button>
					</li>
					<li className="nav-item">
						<button
							className={`nav-link ${activeTab === 'reseñas' ? 'active' : ''}`}
							onClick={() => setActiveTab('reseñas')}
						>
							<i className="fa-solid fa-comments me-2"></i>Reseñas
						</button>
					</li>
				</ul>

				<div className="tab-content">
					{activeTab === 'inscripciones' && (
						<div className="py-4">
							<h4 className="TextDark text-center fs-3 fw-semibold mb-4">Mis inscripciones</h4>
							{inscriptions ? (
								inscriptions.length > 0 ? (
									<div className="table-responsive mx-1 mx-md-5">
										<table className="table table-hover y-4 p-2 BgBackground">
											<thead>
												<tr className="BgSecondary">
													<th scope="col" className="text-start ps-3 w-50 TextDark text-nowrap" onClick={() => handleClickHead("name")}>
														Nombre {order === "name" ? (inverted > 0 ? '▲' : '▼') : ""}
													</th>
													<th scope="col" className="text-center TextDark text-nowrap" onClick={() => handleClickHead("start")}>
														Fecha inicio {order === "start" ? (inverted > 0 ? '▲' : '▼') : ""}
													</th>
													<th scope="col" className="text-center TextDark text-nowrap" onClick={() => handleClickHead("end")}>
														Fecha fin {order === "end" ? (inverted > 0 ? '▲' : '▼') : ""}
													</th>
													<th scope="col" className="text-center TextDark text-nowrap" onClick={() => handleClickHead("price")}>
														Precio {order === "price" ? (inverted > 0 ? '▲' : '▼') : ""}
													</th>
													<th scope="col" className="text-center TextDark">
														<i className="fa-solid fa-star"></i>
													</th>
												</tr>
											</thead>
											<tbody className="table-group-divider">
												{inscriptions
													.sort(compareFunction)
													.filter((item, i) => i < limit)
													.map((item, i) => (
														<tr key={i}>
															<td className="ps-4">
																<Link className="text-decoration-none fw-semibold" to={"/activity/" + item.activity.id}>
																	{item.activity.info_activity.name}
																</Link>
															</td>
															<td className="text-center fw-semibold align-middle">
																{formatDate(new Date(item.activity.start_date))}
															</td>
															<td className="text-center fw-semibold align-middle">
																{formatDate(new Date(item.activity.end_date))}
															</td>
															<td className="text-center fw-semibold align-middle">
																{item.activity.price.toFixed(2) + "€"}
															</td>
															{formatDate(new Date(item.activity.end_date)) < formatDate(new Date()) ? (
																<td className="text-center fw-semibold align-middle">
																	<Link className="text-decoration-none" to="">
																		Reseñar
																	</Link>
																</td>
															) : (
																<td className="text-center fw-semibold align-middle">
																	<a className="text-decoration-none text-secondary" data-bs-toggle="tooltip" data-bs-title="Esta actividad aún no ha terminado">
																		Reseñar
																	</a>
																</td>
															)}
														</tr>
													))}
											</tbody>
										</table>
										<div className="row mx-auto">
											{limit < inscriptions.length ? (
												<button className="mx-auto btn w-auto text-decoration-none text-dark fw-semibold border-white" onClick={handleSeeMore}>
													Ver más
												</button>
											) : (
												""
											)}
										</div>
									</div>
								) : (
									<p className="text-center">No estás inscrito a ninguna actividad</p>
								)
							) : (
								<div className="text-center">
									<div className="spinner-grow LoadingSpinner" role="status">
										<span className="visually-hidden">Loading...</span>
									</div>
								</div>
							)}
						</div>
					)}

					{activeTab === 'favoritos' && (
						<div className="py-4">
							<div className="row d-flex justify-content-around px-4 py-3">
								{store.user.favourites.map((el, i) => {
									return <div key={i} className="col-sm-12 col-md-6 col-lg-3">
										<ActivityCard title={el.activity.name} description={el.activity.desc} img={el.activity.media}
											origin={el.activity.location} />
									</div>
								})}
							</div>
						</div>
					)}

					{activeTab === 'reseñas' && (
						<div className="py-4">
							<CommentBox/>
						</div>
					)}
				</div>

				<div>

					{store.user.is_professional ? "" : <div className="rounded-bottom overflow-hidden"><NewProfessionalBox /></div>}
				</div>
			</div>
		</div>
	);
}; 