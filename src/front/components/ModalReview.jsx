import React, { useEffect, useRef, useState } from 'react'
import collection from '../services/collection'
import Rating from 'react-rating'

export const ModalReview = (props) => {
	const [profRating, setProfRating] = useState(null)
	const [professionalMessage, setProfessionalMessage] = useState("")
	const [actRating, setActRating] = useState(null)
	const [activityMessage, setActivityMessage] = useState("")
	const [result, setResult] = useState({ success: false, text: "" })
	const modalRevButton = useRef(null)

	const handleSubmit = async (e) => {
		e.preventDefault()
		const resp = await collection.createReview(props.activity.info_activity.id, actRating, activityMessage, props.activity.info_activity.professional.id, profRating, professionalMessage)
		if (resp.error) {
			setResult({ success: false, text: "No se pudo crear la reseña" })
		}
		else {
			setResult({ success: true, text: "Reseña enviada con éxito" })
			setTimeout(() => {
				document.activeElement?.blur()
				modalRevButton.current.click()
				setResult({ success: false, text: "" })
				setProfessionalMessage("")
				setActivityMessage("")
			}, 1500)
		}
	}
	return (
		<div className="modal fade" id="reviewModal" tabIndex="-1" aria-labelledby="reviewModal" aria-hidden="true">
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<form onSubmit={handleSubmit}>
						<div className="modal-header BgPrimary shadow" data-bs-theme="dark">
							<h1 className="modal-title fs-5 text-white" id="exampleModalLabel">Crear reseña</h1>
							<button ref={modalRevButton} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => document.activeElement?.blur()}></button>
						</div>
						<div className="modal-body">
							<p className='fw-bold'>Profesional: <span className='fw-semibold'>{props.activity?.info_activity.professional.user.name + " " + props.activity?.info_activity.professional.user.surname}</span></p>

							<Rating initialRating={profRating} className="TextSecondary fs-3" start={0} end={5}
								emptySymbol="fa-regular fa-star" fullSymbol="fa-solid fa-star" fractions={2} onChange={setProfRating} />

							<div className="my-3">
								<label htmlFor="professionalMessage" className="form-label fw-bold">Comentario sobre profesional:</label>
								<textarea name="professionalMessage" className="form-control mt-2" style={{ height: '150px' }} id="professionalMessage" placeholder="" onChange={(e) => setProfessionalMessage(e.target.value)} value={professionalMessage} />
							</div>

							<p className='fw-bold'>Actividad: <span className='fw-semibold'>{props.activity?.info_activity.name}</span></p>
							<Rating initialRating={actRating} className="TextSecondary fs-3" start={0} end={5}
								emptySymbol="fa-regular fa-star" fullSymbol="fa-solid fa-star" fractions={2} onChange={setActRating} />
							<div className="my-3">
								<label htmlFor="activityMessage" className="form-label fw-bold">Comentario sobre actividad:</label>
								<textarea name="activityMessage" className="form-control mt-2" style={{ height: '150px' }} id="activityMessage" placeholder="" onChange={(e) => setActivityMessage(e.target.value)} value={activityMessage} />
							</div>

							<div className={"text-center fw-semibold PlaceholderP " + (result.success ? "text-success" : "text-danger")}>
								{result.text}
							</div>
						</div>
						<div className="modal-footer">
							<button type="submit" className="btn Button fw-semibold">Enviar</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}