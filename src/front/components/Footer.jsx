import { Link } from "react-router-dom";

export const Footer = () => (
	<footer className="footer mt-auto py-3 text-center">
		<div className="container">
			<div className="row">
				<div className="col-sm-12 col-md-4 col-lg-4 mb-3">
					<h6 className="text-decoration-none text-white fw-bold">Nuestras redes:</h6>
					<div className="container-fluid d-flex justify-content-center align-items-center gap-4">
						<a className="iconoFace" href="https://www.facebook.com/?locale=es_ES"><i className="fa-brands fa-square-facebook"></i></a>
						<a className="iconoInsta" href="https://www.instagram.com/"><i className="fa-brands fa-instagram"></i></a>
						<a className="iconoLinkdin" href="https://www.linkedin.com/login/es"><i className="fa-brands fa-linkedin"></i></a>
						<a className="iconoYoutube" href="https://www.youtube.com/?app=desktop&hl=es"><i className="fa-brands fa-youtube"></i></a>
					</div>
				</div>
				<div className="col-sm-12 col-md-4 col-lg-4 mb-3">
					<h6 className="text-decoration-none text-white fw-bold">Explora</h6>
					<div className="container-fluid d-flex flex-column justify-content-center align-items-center">
						<Link className="text-decoration-none text-white" to="/sport">Rutas Deportivas</Link>
						<Link className="text-decoration-none text-white" to="/leisure">Actividades de Ocio</Link>
						<Link className="text-decoration-none text-white" to="/tourism">Viajes turisticos</Link>
					</div>
				</div>
				<div className="col-sm-12 col-md-4 col-lg-4 mb-3">
					<h6 className="text-decoration-none text-white fw-bold">Acerca de Nomadik</h6>
					<div className="container-fluid d-flex flex-column justify-content-center align-items-center">
						<Link to={"/nosotros"} className="text-decoration-none text-white">Sobre Nosotros</Link>
						<Link to={"/misionyvision"} className="text-decoration-none text-white">Mision y Vision</Link>
						<Link to={"/contacto"} className="text-decoration-none text-white">Contacto</Link>
					</div>
				</div>
			</div>
		</div>
	</footer>
);
