import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-expand-lg navbar-light navbg">
			<div className="container-fluid">
				<a className="navbar-brand" href="#">
					<img className="img-fluid logo" src="src/front/assets/img/Logo_Nomadik.png" alt="Logo" />
				</a>

				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse text-center text-lg-start w-100" id="navbarSupportedContent">
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						<li className="nav-item"><Link className="nav-link active" to={"/"}>Home</Link></li>
						<li className="nav-item dropdown">
							<a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">Excursion</a>
							<ul className="dropdown-menu text-center text-lg-start" aria-labelledby="navbarDropdown">
								<li><a className="dropdown-item" href="#">Turismo</a></li>
								<li><a className="dropdown-item" href="#">Deportiva</a></li>
								<li><a className="dropdown-item" href="#">Ocio</a></li>
							</ul>
						</li>
						<li className="nav-item"><a className="nav-link" href="#">Team</a></li>
						<li className="nav-item"><a className="nav-link" href="#">Contact</a></li>
					</ul>

					<form className="d-flex align-items-center mx-auto px-2 busquedaBarra my-2 my-lg-0">
						<input className="form-control me-2 flex-grow-1" type="search" placeholder="Search" aria-label="Search" />
						<button className="btn btn-outline-success" type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
					</form>

					<ul className="navbar-nav ms-auto d-flex align-items-center gap-lg-4 gap-3 flex-column flex-lg-row justify-content-center mt-3 mt-lg-0 pe-lg-5">
						<li className="nav-item d-flex align-items-center">
							<i className="fa-solid fa-globe me-3"></i><span>EN/ES</span>
						</li>
						<li className="nav-item">
							<button className="btn btn-success myBtn d-flex align-items-center">
								<i className="fa-solid fa-user me-2"></i>Login
							</button>
						</li>
						<li className="nav-item">
							<button className="btn btn-success myBtn">Sign up</button>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};