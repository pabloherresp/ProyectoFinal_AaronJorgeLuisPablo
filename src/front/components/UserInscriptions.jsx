import React, { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import collection from "../services/collection"
import { ModalReport } from "../components/ModalReport"
import { ModalReview } from "./ModalReview"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const UserInscriptions = () => {
	const [inscriptions, setInscriptions] = useState(null)
	const [order, setOrder] = useState("start")
	const [inverted, setInverted] = useState(-1)
	const [limit, setLimit] = useState(15)
	const [deleted, setDeleted] = useState(null)

	const [activityReport, setActivityReport] = useState(null)
	const [activityReview, setActivityReview] = useState(null)
	const [delMesssage, setDelMessage] = useState("")

	const modalDelButton = useRef(null)

	const { store, dispatch } = useGlobalReducer()

	const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
	const tooltipList = [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el))

	const loadInscriptions = async () => {
		const resp = await collection.getInscriptionsForUser()
		if ("error" in resp)
			setInscriptions([])
		else
			setInscriptions([...resp])
	}

	const login = async () => {
		const resp = await collection.loginToken()
		if (!resp.success)
			dispatch({ type: "closeSession" })
		else
			dispatch({ type: "loadUser", payload: resp })
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

	const formatDate = (date) => {
		let date2 = new Date(new Date(date).getTime() + 7200000)
		return date2.toLocaleString("en-GB", { timeZone: "UTC" }).slice(0, -3).replace(",", "")
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

	const handleDelete = async () => {
		const resp = await collection.deleteInscription(deleted)
		if (resp.error)
			setDelMessage(resp.error)
		else {
			loadInscriptions()
			login()
			modalDelButton.current.click()
		}
	}

	useEffect(() => {
		loadInscriptions()
	}, [])

	return (
		<div className="py-4">
			{inscriptions ? (
				inscriptions.length > 0 ? (
					<div className="mx-1 mx-md-5">
						<table className="table table-hover table-responsive p-2 BgBackground">
							<thead>
								<tr className="BgSecondary">
									<th scope="col" className="text-start ps-md-4 w-50 TextDark text-nowrap user-select-none" onClick={() => handleClickHead("name")}>
										Nombre {order === "name" ? (inverted > 0 ? '▲' : '▼') : ""}
									</th>
									<th scope="col" className="text-center TextDark text-nowrap user-select-none" onClick={() => handleClickHead("start")}>
										Fecha inicio {order === "start" ? (inverted > 0 ? '▲' : '▼') : ""}
									</th>
									<th scope="col" className="text-center TextDark text-nowrap user-select-none" onClick={() => handleClickHead("end")}>
										Fecha fin {order === "end" ? (inverted > 0 ? '▲' : '▼') : ""}
									</th>
									<th scope="col" className="text-center TextDark text-nowrap user-select-none d-none d-md-table-cell" onClick={() => handleClickHead("price")}>
										Precio {order === "price" ? (inverted > 0 ? '▲' : '▼') : ""}
									</th>
									<th scope="col" className="text-center TextDark d-none d-md-table-cell">
									</th>
								</tr>
							</thead>
							<tbody className="table-group-divider InscriptionsTable">
								{inscriptions?.sort(compareFunction)
									.filter((item, i) => i < limit)
									.map((item, i) => (
										<React.Fragment key={i}>
											<tr >
												<td className="ps-4 align-middle d-none d-md-table-cell">
													<Link className="text-decoration-none fw-semibold TextDark" to={"/activities/" + item.activity.id}>
														{item.activity.info_activity.name}
													</Link>
												</td>
												<td className="align-middle d-table-cell d-md-none" rowSpan={2}>
													<Link className="text-decoration-none fw-semibold" to={"/activities/" + item.activity.id}>
														{item.activity.info_activity.name}
													</Link>
												</td>
												<td className="text-center fw-semibold align-middle">
													{formatDate(new Date(item.activity.start_date))}
												</td>
												<td className="text-center fw-semibold align-middle d-none d-md-table-cell">
													{formatDate(new Date(item.activity.end_date))}
												</td>
												<td className="text-center fw-semibold align-middle d-md-none d-table-cell">
													{formatDate(new Date(item.activity.end_date))}
												</td>
												<td className="text-center fw-semibold align-middle PriceTD d-none d-md-table-cell">
													{item.activity.price.toFixed(2) + "€"}
												</td>
												<td className="text-center fw-semibold align-middle d-none d-md-flex flex-column">
													{store.user.reviews.includes(item.activity.info_activity.id) ?
														<a className="text-decoration-none text-secondary" data-bs-toggle="tooltip" data-bs-title="Esta actividad ya ha sido reseñada">
															Reseñar
														</a>
														: formatDate(new Date(item.activity.end_date)) < formatDate(new Date()) ? (
															<>
																<Link className="text-decoration-none" data-bs-toggle="modal" data-bs-target="#reviewModal" onClick={() => setActivityReview(item.activity)}>
																	Reseñar
																</Link>
															</>
														)
															: (
																// botón borrar inscripción
																<Link className="text-decoration-none text-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => setDeleted(item.id)}>
																	Eliminar
																</Link>
															)
													}
													<Link className="text-decoration-none text-danger-emphasis" data-bs-toggle="modal" data-bs-target="#reportModal" onClick={() => setActivityReport(item.activity)}>
														Reportar
													</Link>
												</td>
											</tr>
											<tr className="d-table-row d-md-none">
												<td className="text-center fw-semibold align-middle PriceTD">
													{item.activity.price.toFixed(2) + "€"}
												</td>
												<td className="text-center fw-semibold align-middle InscriptionsTableEndDate">
													{store.user.reviews.includes(item.activity.info_activity.id) ?
														<a className="text-decoration-none text-secondary me-2" data-bs-toggle="tooltip" data-bs-title="Esta actividad ya ha sido reseñada">
															Reseñar
														</a>
														: formatDate(new Date(item.activity.end_date)) < formatDate(new Date()) ? (
															<>
																<button className="btn Button text-decoration-none me-2" data-bs-toggle="modal" data-bs-target="#reviewModal" onClick={() => setActivityReview(item.activity)}>
																	Reseñar
																</button>
															</>
														)
															: (
																// botón borrar inscripción
																<Link className="text-decoration-none me-2 text-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => setDeleted(item.id)}>
																	Eliminar
																</Link>
															)
													}
													<Link className="text-decoration-none text-danger-emphasis" data-bs-toggle="modal" data-bs-target="#reportModal" onClick={() => setActivityReport(item.activity)}>
														Reportar
													</Link>
												</td>
											</tr>
										</React.Fragment>
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
			<ModalReport activity={activityReport} target="activity" />
			<ModalReview activity={activityReview} />
			<div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModal" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header BgPrimary shadow" data-bs-theme="dark">
							<h1 className="modal-title fs-5 text-white fw-semibold" id="exampleModalLabel">¿Desea dejar de participar en esta actividad?</h1>
							<button type="button" ref={modalDelButton} className="btn-close " data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							Usted dejará de participar en esta actividad y se realizará un reembolso en su cuenta.
						</div>
						<div className="modal-footer">
							<p className="text-danger me-auto">{delMesssage}</p>
							<button type="button" className="btn btn-danger" onClick={handleDelete}>Confirmar</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}