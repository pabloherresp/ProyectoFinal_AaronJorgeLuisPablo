import React, { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { useNavigate } from "react-router-dom"
import collection from "../services/collection"
import StarRating from "./StarRating"

export const ActivityCard = (props) => {


    const { store, dispatch } = useGlobalReducer()
    const navigate = useNavigate()

    function formatDate(fecha) {
        var fechaActual = new Date(Date.now() + 7200000)
        var diff_dias = (new Date(fecha) - fechaActual) / 86400000
        var dias = Math.floor(diff_dias)
        var horas = Math.floor((diff_dias - dias) * 24)

        if (dias > 0)
            return (dias > 1 ? `Faltan ${dias}  días` : `Falta  ${dias}  día`) + (horas > 1 ? ` y  ${horas}  horas` : ` y  ${horas}  hora`)
        else if (dias == 0 && horas > 0)
            return (horas > 1 ? `Faltan ${horas} horas` : `Falta ${horas}  hora`)
        else if (diff_dias < 0)
            return "Actividad finalizada"
    }

    const favItem = async () => {
        const resp = await collection.createFav(props.activity.info_activity.id)
        if (resp.success) {
            setTimeout(()=>dispatch({ type: "loadUser", payload: resp.user }), 200)
        }
    }

    const delItem = async () => {
        const resp = await collection.deleteFav(props.activity.info_activity.id)
        if (resp.success) {
            setTimeout(()=>dispatch({ type: "loadUser", payload: resp.user }), 200)
        }
    }
    
    return (
        (props.activity != null ?
            < div className="card cardFormat p-0 rounded d-flex MoveUpAnimation" onClick={() => {navigate("/activities/" + props.activity.id)}}>
                <div className="imgCardFormat position-relative h-50">
                    {store.user.id != null && (store.user.favourites?.map((item) => item.id).includes(props.activity.info_activity.id) ?
                        <button className="btn FavButton position-absolute top-0 end-0" onClick={((e) => {
                            e.stopPropagation()
                            if (store.user.needs_filling == true)
                                navigate("/completeuserform")
                            else
                                delItem()
                        })}>
                            <img src="/media/heart-full.svg" alt="" />
                        </button>
                        :
                        <button className="btn FavButton position-absolute top-0 end-0" onClick={((e) => {
                            e.stopPropagation()
                            if (store.user.needs_filling == true)
                                navigate("/completeuserform")
                            else
                            favItem()
                        })}>
                            <img src="/media/heart-empty.svg" alt="" />
                        </button>
                    )}
                    <img src={(props.activity?.info_activity.media.length > 0 ?
                        (props.activity?.info_activity.media[0].includes("http") ? props.activity.info_activity.media[0] : "/events/" + props.activity?.info_activity.media[0])
                        : "/events/0.jpg")} className="rounded-top-1 imageCard"></img>
                </div>
                <div className="p-3 textCardFormat h-50">
                    {<StarRating rating={props.activity.info_activity.rating} variable={false}/>}
                    <h6 className="fw-bold mt-3">{props.activity.info_activity.name}</h6>
                    <p className="fw-medium">{props.activity.meeting_point}</p>
                    <p className="textFormat">{props.activity.info_activity.desc}</p>
                    <p className="text-center">{formatDate(props.activity.start_date)}</p>
                </div>
            </div>
            :
            <div className="card cardFormat p-0 rounded d-flex MoveUpAnimation">
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