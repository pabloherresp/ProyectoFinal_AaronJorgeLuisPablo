import React, { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import collection from "../services/collection"
import { ModalReport } from "../components/ModalReport"
import { ModalReview } from "./ModalReview"

export const UserInscriptions = () => {
	const [inscriptions, setInscriptions] = useState(null)
	const [order, setOrder] = useState("start")
	const [inverted, setInverted] = useState(-1)
	const [limit, setLimit] = useState(15)

	const [activityReport, setActivityReport] = useState(null)
	const [activityReview, setActivityReview] = useState(null)


	const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
	const tooltipList = [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el))


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

	const formatDate = (date) => {
		return date.toLocaleString("en-GB", { timeZone: "UTC" }).slice(0, -3).replace(",", "")
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
		loadInscriptions()
	}, [])

	return (
		<div className="py-4">
			<h4 className="TextDark text-center fs-3 fw-semibold mb-4">Mis inscripciones</h4>
			{inscriptions ? (
				inscriptions.length > 0 ? (
					<div className="table-responsive mx-1 mx-md-5">
						<table className="table table-hover p-2 BgBackground">
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
								{inscriptions
									.sort(compareFunction)
									.filter((item, i) => i < limit)
									.map((item, i) => (
										<React.Fragment key={i}>
											<tr>
												<td className="ps-4 align-content-center d-none d-md-table-cell">
													<Link className="text-decoration-none fw-semibold" to={"/activities/" + item.activity.id}>
														{item.activity.info_activity.name}
													</Link>
												</td>
												<td className="align-content-center d-table-cell d-md-none" rowSpan={2}>
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
													{formatDate(new Date(item.activity.end_date)) < formatDate(new Date()) ? (
														<Link className="text-decoration-none" data-bs-toggle="modal" data-bs-target="#reviewModal" onClick={()=>setActivityReview(item.activity)}>
															Reseñar
														</Link>
													) : (
														<a className="text-decoration-none text-secondary" data-bs-toggle="tooltip" data-bs-title="Esta actividad aún no ha terminado">
															Reseñar
														</a>
													)}
													<Link className="text-decoration-none text-danger" data-bs-toggle="modal" data-bs-target="#reportModal" onClick={()=>setActivityReport(item.activity)}>
														Reportar
													</Link>
													{/* <ModalReport id={"modalReport" + i.toString()} /> */}
												</td>
											</tr>
											<tr className="d-md-none d-table-row">
												<td className="text-center fw-semibold align-middle PriceTD">
													{item.activity.price.toFixed(2) + "€"}
												</td>
												<td className="text-center fw-semibold align-middle InscriptionsTableEndDate">
													{formatDate(new Date(item.activity.end_date)) < formatDate(new Date()) ? (<>
														<Link className="text-decoration-none me-2" data-bs-toggle="modal" data-bs-target="#reviewModal" onClick={()=>setActivityReview(item.activity)}>
															Reseñar
														</Link>
													</>
													) : (
														<a className="text-decoration-none text-secondary me-2" data-bs-toggle="tooltip" data-bs-title="Esta actividad aún no ha terminado">
															Reseñar
														</a>
													)}
													<Link className="text-decoration-none text-danger" data-bs-toggle="modal" data-bs-target="#reportModal" onClick={()=>setActivityReport(item.activity)}>
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

		</div>
	)
}