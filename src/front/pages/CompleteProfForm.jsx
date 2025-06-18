import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"
import collection from "../services/collection"

export const CompleteUserForm = () => {
	const [user,setUser] = useState(null)
	const [formData, setFormdata] = useState({ name: "", surname: "", NID: "", telephone: "", birthdate: null, username: "", city: "", country: "", address: "", gender: "MALE", avatar: ""})
	const [messages, setMessages] = useState({ username: "", usernameClass: "", usernameStatus: false, email: "", emailClass: "", password: "", passwordClass: "" })

	const navigate = useNavigate()

	const handleCompleteClient = async (e) => {
		e.preventDefault()
		if (formData.email != formData.confirmEmail)
			setMessages({ ...messages, email: "Las direcciones de email no coinciden." })
		else if (formData.password != formData.confirmPassword)
			setMessages({ ...messages, password: "Las contraseñas no coinciden." })
		else if (formData.avatar.width != formData.avatar.width)
			setMessages({ ...formData, response: "La imagen debe ser cuadrada" })
		else {
			const request_body = new FormData()
			Object.entries(formData).forEach(([clave, valor]) => {
				request_body.append(clave, valor)
			});
			const resp = await collection.signupUser(request_body)
			console.log(resp)
				if (!resp.success)
					setFormdata({ ...formData, response: resp.response, error: true })
				else {
					setFormdata({ ...formData, error: false, response: "Usuario creado con éxito" })
					setTimeout(() => navigate("/login"), 2000)
				}
			}
	}

	const handleChange = async (e) => {
		setFormdata({
			...formData, [e.target.name]: e.target.value
		})
		if (e.target.name == "username") {
			let available = false
			let response = ""
			if (e.target.value.length > 3) {
				available = await collection.checkUser(e.target.value)
				response = (available ? "El nombre de usuario está dispomible" : "Ya existe un usuario con ese nombre")
			}
			else
				response = ""

			setMessages({ ...messages, usernameStatus: available, username: response })
		} else if (e.target.name == "email" || e.target.name == "confirmEmail")
			setMessages({ ...messages, email: "" })
		else if (e.target.name == "password" || e.target.name == "confirmPassword")
			setMessages({ ...messages, password: "" })
	}

	const handleCheckboxChange = (e) => {
		setFormdata({
			...formData, [e.target.name]: !formData[e.target.name]
		})
	}
	
	const getUser = async () => {
		const resp = await collection.getOneUser(id)
		if ("error" in resp)
			navigate("/")
		else {
			setUser({ ...resp, ...resp.professional })
			setEditUser({ ...editUser, is_professional: resp.is_professional })
		}
	}

	useEffect(() => {
		const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
		const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
		
		getUser()
	}, [])

	return (
		<div className="container bg-white rounded my-3">
			<div className="row p-0">
				<div className="col-md-2 m-0 BannerLogin BannerLoginLeft rounded-start"></div>
				<div className="col-12 col-md-8">
					<div className="row my-4 w-75 mx-auto">
						<div className="col-6 col-md-4 mx-auto">
							<img className="img-fluid" src="\src\front\assets\img\Logo_Nomadik.png" alt="" />
						</div>
						<div className="col-12 col-md-8 align-self-center">
							<h3 className="display-3 fw-bold text-center my-2 TextDark">Sign Up</h3>
							<p className="text-center fw-semibold mt-3">¿Ya tienes una cuenta? Haga click <Link className="text-decoration-none" to="/login">aquí</Link></p>
						</div>
					</div>
					<form className="m-3" onSubmit={handleCompleteClient}>
						<div className="col-6">
								<div className="col-12">
									<div className="form my-2 mx-auto">
										<label className="fs-6" htmlFor="bio">Biografía</label>
										<div id="bioHelpBlock" className="col-12 form-text">
											Una desripción sobre ti y lo que quieres que los usuarios puedan leer para conocerte.
										</div>
										<textarea name="bio" className="form-control mt-2" style={{ height: '140px' }} id="bio" placeholder="" onChange={handleChange} value={formData.bio} />
									</div>
								</div>
								<div className="col-12 col-md-6">
									<div className="form-floating my-2 mx-auto">
										<input type="text" name="tax_address" className="form-control" id="tax_address" placeholder="" onChange={handleChange} value={formData.tax_address} />
										<label className="fs-6" htmlFor="tax_address">Dirección fiscal</label>
									</div>
								</div>

								<div className="col-12 col-md-6">
									<div className="form-floating my-2 mx-auto">
										<input type="text" name="business_name" className="form-control" id="business_name" placeholder="" onChange={handleChange} value={formData.business_name} />
										<label className="fs-6" htmlFor="business_name">Nombre de la empresa</label>
									</div>
								</div>

								<div className="col-12 col-md-6">
									<div className="form-floating my-2 mx-auto">
										<input type="text" name="nuss" className="form-control" id="nuss" placeholder="" onChange={handleChange} value={formData.nuss} />
										<label className="fs-6" htmlFor="nuss">NUSS</label>
									</div>
								</div>
								<div className="col-12 col-lg-6">
									<div className="form-floating my-2 mx-auto">
										<select className="form-select" aria-label="Professional type" id="type" name="type" placeholder="" onChange={handleChange} value={formData.type}>
											<option value="FREELANCE" selected>Autónomo</option>
											<option value="BUSINESS">Empresa</option>
										</select>
										<label className="fs-6" htmlFor="gender">Tipo de profesional</label>
									</div>
								</div>
							<div className="row">
								<input type="submit" value="Crear usuario" className="btn btn-primary my-2 w-auto mx-auto fw-bold" />
								<p className="text-danger text-center fw-semibold">{formData.response}</p>
							</div>
						</div>
					</form>
				</div>
				<div className="col-md-2 col-0 m-0 BannerLogin BannerLoginRight rounded-end"></div>
			</div>
		</div>
	)
}