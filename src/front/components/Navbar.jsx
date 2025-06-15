import { Link, useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { useEffect, useState } from "react"
import collection from "../services/collection"

export const Navbar = () => {

	const [search, setSearch] = useState("")
	const [searchResults, setSearchResults] = useState({professionals: [], activities: []})
	const navigate = useNavigate()
	const {store,dispatch} = useGlobalReducer()

	const handleSearch = async (e) => {
		setSearch(e.target.value)
		setSearchResults({...searchResults, professionals: [], activities: []})
	}

	const searchText = async (text) => {
		if(search.length > 2){
			const data = await collection.search(search)
			setSearchResults({...searchResults, professionals: data.professionals, activities: data.activities})
		}
	}
	useEffect(()=>{searchText(search)},[search])

	return (
		<nav className="navbar navbar-expand-md navbar-light navbg p-0">
			<div className="container-fluid text-white">
				<a className="navbar-brand" href="#">
					<img className="img-fluid logo" src="src/front/assets/img/Logo_Nomadik.png" alt="Logo" />
				</a>

				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<div className="navbar-nav me-auto mb-0 gap-3">
						<Link className="nav-item nav-link active text-white fs-6" to={"/"}>Home</Link>
						<div class="nav-item dropdown">
							<a class="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Excursiones</a>
							<ul class="dropdown-menu">
								<li><a class="dropdown-item" href="#">Deporte</a></li>
								<li><a class="dropdown-item" href="#">Ocio</a></li>
								<li><a class="dropdown-item" href="#">Turismo</a></li>
							</ul>
						</div>
						<Link className="nav-item nav-link active text-white fs-6" to={"/"}>Equipo</Link>
						<Link className="nav-item nav-link active text-white fs-6" to={"/"}>Contacto</Link>
					</div>

					<div className="d-flex justify-content-evenly my-2 gap-3">
						<form className="mx-auto busquedaBarra input-group">
							<input className="form-control dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false" type="search" placeholder="Buscar..." aria-label="Search" value={search} onChange={handleSearch} />
							<ul className="dropdown-menu dropdown-menu-end NavbarSearch">
								{(searchResults.professionals.length > 0 || searchResults.activities.length > 0 ? 
								<>
									{searchResults.professionals.map((item, i)=>{
										return (<li className="px-2" key={i}>
											<Link className="text-decoration-none text-dark" to={"/professional/"+item.user_id}>
												<i class="fa-regular fa-user me-2"></i> {item.name}
											</Link>
										</li>)
									})}
									{searchResults.activities.map((item, i)=>{
										return (<li className="px-2" key={i}>
											<Link className="text-decoration-none text-dark" to={"/activity/"+item.id}>
												<i class="fa-regular fa-file-lines me-2"></i> {item.name}
											</Link>
										</li>)
									})}
								</>
								
								: <li className="px-2">No se encontraron resultados</li>)}
							</ul>
							{/* <button className="btn btn-light" type="submit"><i className="fa-solid fa-magnifying-glass"></i></button> */}
						</form>
						{!store.user.id ?<>
							<div className="nav-item">
								<button className="btn navbarButton" onClick={()=>{navigate("/login")}}>Login</button>
							</div>
							<div className="nav-item">
								<button className="btn navbarButton text-nowrap" onClick={()=>{navigate("/signup")}}>Sign up</button>
							</div>
						</>
						: 	<div className="nav-item rounded-pill d-flex NavbarUserPill" onClick={()=>{dispatch({type: "closeSession"})}}>
								<img className="rounded-circle" src={store.user.avatar_url} alt=""/>
								<span className="text-white text-capitalize fs-5 ms-3 me-5 align-self-center">{store.user.username}</span>
							</div>
						}
					</div>
				</div>
			</div>
		</nav>
	);
};