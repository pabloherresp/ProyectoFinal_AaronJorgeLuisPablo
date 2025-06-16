import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import collection from "../services/collection"

export const Inscriptions = () => {
	const {id} = useParams()
	const navigate = useNavigate()

	const [user, setUser] = useState({name: "", surname: "", NID: "", telephone: "", birthdate: null, username: "", email: "", confirmEmail: "", password: "", confirmPassword: "", city: "", address: "", gender: "MALE", avatar: "", is_professional: false, professional:{type: "", tax_address: "", business_name: "", bio: "", nuss: ""}})
	const [inscriptions, setInscriptions] = useState([])
	const [order, setOrder] = useState("start")
	const [inverted, setInverted] = useState(-1)

	const getUser = async () => {
		const resp = await collection.getOneUser(id)
		if("error" in resp)
			navigate("/")
		else{
			setUser({...resp,...resp.professional})
		}
	}

	const formatDate = (date) => {
		return date.toLocaleString("en-GB", { timeZone: "UTC" })
	}

	const loadInscriptions = async () => {
		const resp = await collection.getInscriptionsForUser(id)
		if("error" in resp)
			setInscriptions([])
		else
			setInscriptions([...resp])
	}

	const handleClickHead = (text) => {
		if(text == order)
			setInverted(-1*inverted)
		else{
			setOrder(text)
			setInverted(-1)
		}
	}

	const compareFunction = (a,b) => {
		if(order == "name")
			return inverted * a.activity.info_activity.name.localeCompare(b.activity.info_activity.name)
		else if(order == "start")
			return inverted * a.activity.start_date.localeCompare(b.activity.start_date)
		else if(order == "end")
			return inverted * a.activity.end_date.localeCompare(b.activity.end_date)
		else if(order == "price")
			return inverted * (a.activity.price - b.activity.price)
	}

	useEffect(() => {
		const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
		const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
		getUser()
	}, [])

	useEffect(()=>{
		loadInscriptions()
	},[user])

	return (
		<div className="container bg-white rounded my-3 py-5">
			<h4 className="TextDark text-center display-5 fw-semibold mb-5">Mis inscripciones</h4>
			{(inscriptions.length > 0 ?
				<div className="table-responsive mx-5">
					<table className="table table-bordered y-4 p-2 table-info rounded">
						<thead className="table-primary">
							<tr>
								<th scope="col" className="text-center w-50" onClick={()=>handleClickHead("name")}>Nombre {order == "name" ? (inverted > 0 ?  '▲' : '▼') : ""}</th>
								<th scope="col" className="text-center" onClick={()=>handleClickHead("start")}>Fecha inicio {order == "start" ? (inverted  > 0 ?  '▲' : '▼') : ""}</th>
								<th scope="col" className="text-center" onClick={()=>handleClickHead("end")}>Fecha fin {order == "end" ? (inverted  > 0 ?  '▲' : '▼') : ""}</th>
								<th scope="col" className="text-center" onClick={()=>handleClickHead("price")}>Precio {order == "price" ? (inverted  > 0 ?  '▲' : '▼') : ""}</th>
								<th scope="col" className="text-center"><i class="fa-solid fa-star"></i></th>
							</tr>
						</thead>
						<tbody className="table-group-divider">
						{inscriptions.sort(compareFunction).map((item, i)=>{
							return(
								<tr key={i}>
								<td className="ps-4"><Link className="text-decoration-none fw-semibold" to={"/activity/"+item.activity.id}>{item.activity.info_activity.name}</Link></td>
								<td className="text-center fw-semibold">{formatDate(new Date(item.activity.start_date))}</td>
								<td className="text-center fw-semibold">{formatDate(new Date(item.activity.end_date))}</td>
								<td className="text-center fw-semibold">{item.activity.price.toFixed(2) + "€"}</td>
								{formatDate(new Date(item.activity.end_date)) < formatDate(new Date()) ?
									<td className="text-center fw-semibold"><Link className="text-decoration-none" to="">Reseñar</Link></td>
								: <td className="text-center fw-semibold"><a className="text-decoration-none text-secondary" data-bs-toggle="tooltip" data-bs-title="Esta actividad aún no ha terminado">Reseñar</a></td>
								}
							</tr>)
							})}
						</tbody>
					</table>
				</div>
				: <p className="text-center">No estás inscrito a ninguna actividad</p>)}
			</div>
	);
}; 