import React from 'react';

export const CommentBox = () => {
  return (
    <div className="comentario-card mt-3">
      <div className="contenido">
        <div className="estrellas">
          ★★★★★
        </div>
        <h4>Titulo</h4>
        <p>Review Body</p>
        <div className="autor-info">
          <img src="https://static.wikia.nocookie.net/the-incredibles/images/9/97/Mr-Incredible-GD.png/revision/latest?cb=20231210181752" alt="avatar" className="avatar" />
          <div>
            <div className="nombre m-2">Reviewer Name</div>
            <div className="fecha m-2">Date</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentBox