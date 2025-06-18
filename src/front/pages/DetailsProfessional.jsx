import React from 'react';
import { CommentBox } from "../components/CommentBox"

export const DetailsProfessional = () => {

    return (
        <div className="container mt-3 p-0 d-flex flex-column mb-3">
            <div className="profile d-flex justify-content-around">
                <img className="imagen" src="https://static.wikia.nocookie.net/the-incredibles/images/9/97/Mr-Incredible-GD.png/revision/latest?cb=20231210181752" />
                <div className="professional p-0">
                    <h3>Guillermo Fernández Hernández</h3>
                    <h6>Miembro desde Septiembre, 2019</h6>
                    <h2 className="stars">★★★★★</h2>
                </div>
                <div>
                    <h5 className="float-end"><strong>Contacto</strong></h5>
                    <p>guillermo_fer@gmail.com</p>
                    <p>+34 219 45 78 89</p>
                </div>
            </div>
            <div className="biography m-5">
                <h5><strong>Sobre mi</strong></h5>
                <p>
                    ¡Hola! Soy Guillermo, guía profesional de deportes de aventura con más de 5 años de experiencia en crear experiencias inolvidables al aire libre.
                    Estudié Turismo Activo y Deporte en la Universidad de Barcelona y me especialicé en actividades como escalada, barranquismo, kayak, vía ferrata y rutas de senderismo en entornos naturales únicos.
                    Mi pasión por la montaña y el mar me llevó a convertir mi afición en una forma de vida. Me dedico a organizar y guiar grupos de todos los niveles, siempre priorizando la seguridad, la diversión y el respeto por la naturaleza.
                    Si te apetece salir de la rutina, conocer gente nueva y superarte mientras disfrutas de paisajes increíbles, estás en el lugar adecuado. Tanto si es tu primera vez como si buscas un nuevo reto, tengo una aventura para ti.
                    ¡Súmate a la próxima salida y descubre todo lo que eres capaz de hacer!
                </p>
            </div>
            <div class="container text-center activities">
                <div class="row g-2">
                    <h3 className="d-flex justify-content-start m-3">Actividades organizadas por Guillermo</h3>
                    <div class="col-6">
                        <div class="p-3 activity">
                            <h4>Piragüismo en Lozoya</h4>
                            <p>
                                Únete a nuestra actividad de piragüismo por el río Lozoya en la zona de Buitrago (Madrid). La actividad dura aproximadamente unas 3 horas y podremos ir rodeando...
                            </p>
                            <h3 className="stars">★★★★★</h3>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="p-3 activity">
                            <h4>Rapel en Cerro Alcántara</h4>
                            <p>
                                Disfruta de una sesión de rapel en Cerro Alcántara en la Comunidad de Madrid. La actividad dura aproximadamente 3 horas y podremos ir rodeando toda la montaña para apreciar mas
                            </p>
                            <h3 className="stars">★★★★★</h3>
                        </div>
                    </div>
                    <h6 className="more m-3">ver mas</h6>
                </div>
            </div>
            <div className="commnetBox m-5">
                <h3 className="m-3">Comentarios de otros Usuarios</h3>
                <CommentBox />
                <CommentBox />
                <h6 className="more m-4">ver mas</h6>
            </div>
            <div className="d-flex justify-content-end m-5"><button type="button" className="btn btn-danger report ">Report</button></div>
        </div>
    );
}



