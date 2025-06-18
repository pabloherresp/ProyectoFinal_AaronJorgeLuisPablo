import React from "react"
import { useNavigate } from "react-router-dom"

export const NewProfessionalBox = () => {
	const navigate = useNavigate()

	return (
		<div className="p-0 NewProfessionalBanner d-flex flex-row-reverse" onClick={()=>navigate("/newprofessionalform")}>
			<p className="text-white fs-2 font1 col-12 col-md-6 text-center text-md-end">¿Quieres poder añadir tus propias actividades a la web y ayudar a otros a disfrutar de la experiencia de Nomadik?<br/>Haz click aquí</p>
		</div>
	)
}