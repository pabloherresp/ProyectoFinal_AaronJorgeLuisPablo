import React, { useEffect, useRef, useState } from 'react'
import collection from '../services/collection'

export const ModalReport = (props) => {
	const [message, setMessage] = useState("")
	const [result, setResult] = useState({ success: false, text: "" })
	const modalRepButton = useRef(null)

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (message.length > 0) {

			const resp = await collection.createReport(message, props.activity.info_activity.professional.id, props.activity.info_activity.id)
			if (resp.error) {
				setResult({ success: false, text: "No se pudo realizar el reporte" })
			}
			else {
				setResult({ success: true, text: "Reporte enviado con éxito" })
				setTimeout(() => {
					document.activeElement?.blur()
					modalRepButton.current.click()
					setResult({ success: false, text: "" })
					setMessage("")
				}, 1500)
			}
		}
	}


	return (
		<div className="modal fade" id="reportModal" tabIndex="-1" aria-labelledby="reportModal" aria-hidden="true">
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<form onSubmit={handleSubmit}>
						<div className="modal-header bg-secondary shadow" data-bs-theme="dark">
							<h1 className="modal-title fs-5 text-white" id="exampleModalLabel">Enviar reporte</h1>
							<button ref={modalRepButton} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => document.activeElement?.blur()}></button>
						</div>
						<div className="modal-body">
							{props.target == "activity" && <>
								<p className='fw-bold'>Actividad: <span className='fw-semibold'>{props.activity?.info_activity?.name}</span></p>
							</>}
							<p className='fw-bold'>Profesional: <span className='fw-semibold'>{props.activity?.info_activity?.professional?.user.name + " " + props.activity?.info_activity?.professional?.user?.surname}</span></p>
							<div className="mb-3">
								<label htmlFor="message" className="form-label fw-bold">Mensaje:</label>
								<textarea required name="message" className="form-control mt-2" style={{ height: '180px' }} id="message" placeholder="" onChange={(e) => setMessage(e.target.value)} value={message} />
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