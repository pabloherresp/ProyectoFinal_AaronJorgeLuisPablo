import React from 'react';
import useGlobalReducer from '../hooks/useGlobalReducer';
import StarRating from './StarRating'

export const CommentBox = (props) => {
  const {store, dispatch} = useGlobalReducer();
  return ( props.review ? 
    <div className="comentario-card mt-3 shadow h-100">
      <div className="contenido">
        <div className="estrellas">
          <StarRating rating={props.review.activity_rating || 0} variable={false}/>
        </div>
        <h6 className='fw-semibold'>{props.review.info_activity.name}</h6>
        <p>
          {props.review.activity_message}
        </p>
        <div className="autor-info">
          <img src={"/avatar/" + props.review.user.avatar_url} alt="avatar" className="avatar" />
          <div>
            <div className="nombre m-2">{props.review.user.username}</div>
            <div className="fecha m-2">{props.review.creation_date.split("T")[0]}</div>
          </div>
        </div>
      </div>
    </div>
      :
    <div className="comentario-card mt-3">
      <div className="contenido">
        <div className="estrellas">
          ★★★★★<h1>{props.rating}</h1>
        </div>
        <h4>{props.titulo}</h4>
        <p>
          {props.comment}
        </p>
        <div className="autor-info">
          <img src={"/avatar/" + props.img} alt="avatar" className="avatar" />
          <div>
            <div className="nombre m-2">{props.Reviewer_Name}</div>
            <div className="fecha m-2">{props.Date.replace(" ","")}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommentBox