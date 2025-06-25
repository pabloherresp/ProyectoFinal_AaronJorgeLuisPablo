import React, { useEffect, useState } from 'react';
import { CommentBox } from "../components/CommentBox"
import { useParams } from 'react-router-dom';
import collection from '../services/collection';
import { ActivityCard } from '../components/ActivityCard';
import useGlobalReducer from '../hooks/useGlobalReducer';
import StarRating from '../components/StarRating';

export const DetailsProfessional = () => {
    const { id } = useParams();

    const {store,dispatch} = useGlobalReducer()
    const [professional, setProfessional] = useState(null);

    useEffect(() => {

        collection.getProfessionalDetails(id).then(data => {
            setProfessional(data)
        })

    }, [])
    if (!professional) return <h1>loading...</h1>

    return (
        <div className="container details mt-3 p-0 d-flex flex-column mb-3">
            <div className="profile d-flex justify-content-around text-white">
                <img className="imagen" src={professional.user.avatar_url} />
                <div className="professional p-0 text-white">
                    <h3 className='text-white'>{professional?.user.name + " " + professional.user.surname}</h3>
                    <h6>{"Miembro desde " +
											new Date(professional?.user?.creation_date).toLocaleDateString("es-ES", {
												year: "numeric",
												month: "long",
												day: "numeric",
											})}</h6>
                    <StarRating rating={professional.rating} variable={false} className='text-white'/>
                </div>
                <div className='d-flex flex-column align-items-end'>
                    <h5 className="float-end"><strong>Contacto</strong></h5>
                    <p>{professional.user.email}</p>
                    <p className='ms-auto'>{professional.user.telephone}</p>
                </div>
            </div>
            <div className="biography m-5">
						<h4 className="font1">Sobre mí</h4>
                <p>
                    {professional.bio}
                </p>
            </div>

            <div className="container text-center activities">
                <h3 className="d-flex justify-content-start m-3">{professional.business_name}</h3>
                <div className="row g-4">
						<h3 className="font1 pt-5 text-center">Mis actividades</h3>

                    {store.all_activities?.filter((item)=>item.info_activity.professional.id == professional.id) > 0 ? 
                        store.all_activities?.filter((item)=>item.info_activity.professional.id == professional.id).map((activity) => (
                            <div  key={activity.id} className="col-12 col-md-6 col-lg-4">
                                <ActivityCard activity={activity}/>
                            </div>
                        )) : <p className='text-center'>No hay actividades</p>
                    }

                </div>
            </div>
            <div className="commnetBox m-5">
						<h3 className="font1 pt-5 text-center">Reseñas sobre mí</h3>
                {professional.reviews > 0 ? 
                    professional.reviews.map((review) => (
                        <CommentBox key={review.id}
                            rating={review.professional_rating}
                            titulo={review.info_activity.name}
                            comment={review.activity_message}
                            img={review.user.avatar_url}
                            Reviewer_Name={review.user.name + " " + review.user.surname}
                            Date={review.creation_date.replace(" ","")}
                        />
                    )) : <p className='text-center'>No hay reseñas</p>
                }
            </div>
            <div className="d-flex justify-content-end m-5"><button type="button" className="btn btn-danger report ">Report</button></div>
        </div>
    );
}



