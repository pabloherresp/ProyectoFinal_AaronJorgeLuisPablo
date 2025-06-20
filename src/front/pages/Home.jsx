import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"
import { NewProfessionalBox } from "../components/NewProfessionalBox.jsx"
import collection from "../services/collection"
import Fuse from 'fuse.js';
import { ActivityCard } from "../components/ActivityCard.jsx"
import { Link } from "react-router-dom"

export const Home = () => {
	const { store, dispatch } = useGlobalReducer()
	const [activities, setActivities] = useState([])
	const [locations,setLocations] = useState([])

	const fuse = new Fuse(activities, {  //// BORRAR??????????????????????????????????????????????????????????????
		includeScore: true,
		threshold: 1,
		isCaseSensitive: false,
		keys: ['info_activity.location', 'meeting_point'] 
	})

	const loadActivities = async () => {
		const resp = await collection.returnActivities()
		setActivities(resp)
		let lo = resp.map((item)=>item.info_activity.location)
		setLocations(lo)
	}

	useEffect(() => {
		loadActivities()
	}, [])

	return (
			<div className="container-fluid p-0">
				<div id="homeCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
					<div className="carousel-indicators">
						<button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
						<button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
						<button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
					</div>
					<div className="carousel-inner">
						<div className="carousel-item active HomeCarSlide" data-bs-interval="9000">
							<div className="carousel-caption d-block">
								<h5>Vive experiencias inolvidables</h5>
								<p className="w-50 mx-auto">Descubre y vive experiencias únicas, únete a la comunidad donde cada evento es una nueva historia.</p>
							</div>
						</div>
						<div className="carousel-item HomeCarSlide" data-bs-interval="9000">
							<div className="carousel-caption d-block">
								<h5>Conoce gente haciendo lo que más te gusta</h5>
								<p className="w-50 mx-auto">Ya sea una escapada al aire libre, una clase creativa o un tour por la ciudad, aquí encontrarás momentos para disfrutar y nuevas amistades por descubrir.</p>
							</div>
						</div>
						<div className="carousel-item HomeCarSlide" data-bs-interval="9000">
							<div className="carousel-caption d-block">
								<h5>Recuerda valorar el servicio</h5>
								<p className="w-50 mx-auto">Tanto nosotros como los profesionales que depositan su confianza en nuestro servicio agradecemos vuestras valoraciones.</p>
							</div>
						</div>
					</div>
					<button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
						<span className="carousel-control-prev-icon" aria-hidden="true"></span>
						<span className="visually-hidden">Previous</span>
					</button>
					<button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
						<span className="carousel-control-next-icon" aria-hidden="true"></span>
						<span className="visually-hidden">Next</span>
					</button>
				</div>
				<div className="container my-2">
					<div className="bg-white rounded overflow-hidden">
        				<h1 className="font1 p-5 text-center">Algunas de nuestras actividades</h1>
						<div className="row row-cols-md-3 mx-2">
							{activities?.filter((item)=>item.is_active && !item.is_finished).filter((item,index)=>index < 9).map((item,index,arr)=>
								<div key={index} className={"col-12 col-md-6 col-lg-4 my-2" + (index == (arr.length - 1) && index % 2 != 0 ? " d-block d-md-none d-lg-block" : "")}>
									<Link className="text-decoration-none valor-card2" to={'/activities/' + item.id}><ActivityCard img={item.info_activity.media[0]} title={item.info_activity.name} origin={item.meeting_point} description={item.info_activity.desc} timeleft={item.start_date}></ActivityCard></Link>
								</div>
								)}
						<Link className="mx-auto my-auto col-3 btn w-auto text-decoration-none text-dark fw-semibold fs-4" to="/activities">Ver más</Link>
						</div>
        				<h1 className="font1 p-5 text-center">Algunos usuarios satisfechos</h1>

						<NewProfessionalBox/>
					</div>
				</div>
			</div>
	);
};
