import React from 'react';
import useGlobalReducer from '../hooks/useGlobalReducer';

export const CommentBox = (props) => {
  const {store, dispatch} = useGlobalReducer();
  return (
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
  );
}

export default CommentBox