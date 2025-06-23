import { useNavigate, useParams } from "react-router-dom"

export const ReportCard = (props) => {

    const navigate = useNavigate()


    
    return (
        <div className="card p-3 m-3 fontFamily">
            <h1>{props.message}</h1> 
            <br></br>
                <p>ID del reporte: {props.report}</p>
            {props.professional != null ?

                <p>Usuario reportado: {props.professional}</p> 
                :
                <p>Actividad reportada: {props.activity}</p>
            }
            <p>Enviado por {props.user} el día {props.date}</p>
            <div className="d-flex justify-content-center p-2 m-2">
                <button className="btn adminStyle" onClick={()=>navigate("/report/" + props.route)}>Examinar</button>
            </div>

        </div>
    )
}