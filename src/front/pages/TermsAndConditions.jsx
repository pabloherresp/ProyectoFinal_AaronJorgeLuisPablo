import React from "react"

export const TermsAndConditions = () => {
	return (
		<div className="container my-3 py-5 bg-white rounded row">
			<div className="mx-auto col-10 col-md-8">
				
			<h1 className="mb-4 TextDark">Términos y Condiciones de Servicio</h1>
			<p><strong>Fecha de entrada en vigor:</strong> 17 de junio de 2025</p>

			<h4 className="mt-4 TextDark">1. Descripción del Servicio</h4>
			<p>
				Ofrecemos una plataforma para la reserva y gestión de actividades de ocio, deportivas, turísticas y recreativas.
				Usuarios y profesionales pueden registrarse, gestionar eventos, inscribirse o dejar reseñas.
			</p>

			<h4 className="mt-4 TextDark">2. Registro de Usuario</h4>
			<ul className="list-group list-group-flush">
				<li className="list-group-item">Debes proporcionar información veraz y actualizada al registrarte.</li>
				<li className="list-group-item">Eres responsable de mantener la confidencialidad de tus credenciales.</li>
				<li className="list-group-item">Podemos suspender cuentas por uso indebido o actividades sospechosas.</li>
			</ul>

			<h4 className="mt-4 TextDark">3. Uso Aceptable</h4>
			<p>No puedes:</p>
			<ul className="list-group list-group-flush">
				<li className="list-group-item">Usar la plataforma para fines ilegales o no autorizados.</li>
				<li className="list-group-item">Publicar contenido ofensivo, difamatorio o que infrinja derechos.</li>
				<li className="list-group-item">Manipular el sistema de reservas o reseñas.</li>
			</ul>

			<h4 className="mt-4 TextDark">4. Reservas y Pagos</h4>
			<ul className="list-group list-group-flush">
				<li className="list-group-item">Las reservas están sujetas a disponibilidad.</li>
				<li className="list-group-item">Los precios están en euros e incluyen impuestos aplicables.</li>
				<li className="list-group-item">Al reservar, aceptas nuestras políticas de cancelación.</li>
			</ul>

			<h4 className="mt-4 TextDark">5. Cancelaciones y Reembolsos</h4>
			<p>
				Las políticas pueden variar según la actividad y se mostrarán antes de confirmar la reserva. Nos reservamos el
				derecho de modificarlas en cualquier momento.
			</p>

			<h4 className="mt-4 TextDark">6. Reseñas y Reportes</h4>
			<p>
				Los usuarios pueden dejar reseñas tras completar una actividad. Nos reservamos el derecho a eliminar contenido
				inapropiado. Puedes reportar actividades o usuarios con comportamiento indebido.
			</p>

			<h4 className="mt-4 TextDark">7. Propiedad Intelectual</h4>
			<p>
				Todo el contenido de la plataforma está protegido por derechos de autor. No puedes copiar ni distribuir sin
				autorización.
			</p>

			<h4 className="mt-4 TextDark">8. Limitación de Responsabilidad</h4>
			<p>No somos responsables de:</p>
			<ul className="list-group list-group-flush">
				<li className="list-group-item">Cancelaciones por parte de los organizadores.</li>
				<li className="list-group-item">Información incorrecta proporcionada por terceros.</li>
				<li className="list-group-item">Problemas técnicos o de disponibilidad del sitio.</li>
			</ul>

			<h4 className="mt-4 TextDark">9. Modificaciones</h4>
			<p>
				Podemos modificar estos Términos en cualquier momento. Se notificará mediante correo o aviso en la plataforma.
			</p>

			<h4 className="mt-4 TextDark">10. Contacto</h4>
			<p>
				Para dudas o incidencias, contáctanos en:<br />
				📧 <a href="nomadik.help@gmail.com">nomadik.help@gmail.com</a><br />
			</p>
			</div>
		</div>
	)
}
