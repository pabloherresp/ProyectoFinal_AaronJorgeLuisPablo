import React, { useEffect } from "react"

export const ActivityCard = (props) => {

    function formatDate(fecha) {
        var fechaActual = new Date(Date.now())
        var diff_dias = (new Date(fecha) - fechaActual) / 86400000
        var dias = Math.floor(diff_dias)
        var horas = Math.floor((diff_dias - dias) * 24)

        if(dias > 0)
            return (dias > 1 ? `Faltan ${dias}  días` : `Falta  ${dias}  día`) + (horas>1 ? ` y  ${horas}  horas` : ` y  ${horas}  hora`)
        else if (dias == 0 && horas > 0)
            return (horas>1 ? `Faltan ${horas} horas` : `Falta ${horas}  hora`)
        else if (dias == 0 && horas < 0)
            return (horas < -1 ? `Comenzado hace ${Math.abs(horas)} horas` : `Falta ${Math.abs(horas)}  hora`)
        else
            return (dias < -1 ? `Comenzado hace ${Math.abs(dias)}  días` : `Comenzado hace ${Math.abs(dias)} día`) + (horas < 1 ? ` y  ${Math.abs(horas)}  horas` : ` y  ${Math.abs(horas)}  hora`)
        
    }

    return (
        (props.activity != null ?
            < div className="card cardFormat p-0 rounded d-flex" >
                <div className="imgCardFormat">
                    <img src={props.activity.info_activity.media[0]} className="rounded-top-1 imageCard"></img>
                </div>
                <div className="p-3 textCardFormat">
                    <h5 className="titleFormat">{props.activity.info_activity.name}</h5>
                    <p className="titleFormat">{props.activity.meeting_point}</p>
                    <p className="textFormat">{props.activity.info_activity.description}</p>
                    <p className="titleFormat text-center">{formatDate(props.activity.start_date)}</p>
                    <p className="titleFormat text-center">{props.timeleft}</p>
                </div>
            </div>
            :
            <div className="card cardFormat p-0 rounded d-flex">
                <div className="imgCardFormat">
                    <img src={props.img} className="rounded-top-1 imageCard"></img>
                </div>
                <div className="p-3 textCardFormat">
                    <h5 className="titleFormat">{props.title}</h5>
                    <p className="titleFormat">{props.origin}</p>
                    <p className="textFormat">{props.description}</p>
                    <p className="titleFormat text-center">{props.timeleft}</p>
                </div>
            </div>
        )
    )
}