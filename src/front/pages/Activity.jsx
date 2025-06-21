import { useEffect } from "react"
import { useParams } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"
import collection from "../services/collection"
import CommentBox from "../components/CommentBox"

export const Activity = () => {

const {store, dispatch} = useGlobalReducer()

const params = useParams()


const chosen = params.id;

let value = 0;


const GOOGLE_MAPS_API = import.meta.env.VITE_GOOGLE_MAPS_API



function parseDate(date){

    const utcDate1 = new Date(date);
    const options = {
        year: "numeric",
        month: "short",
        day: "numeric",

    };

    return utcDate1.toLocaleString("es-ES", options)

}

function parseFullDate(date){

    const utcDate1 = new Date(date);
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",

    };

    return utcDate1.toLocaleString("es-ES", options)

}

function parseTime(date){

    const utcDate1 = new Date(date);
    const options = {
        hour: "numeric",
        minute: "numeric"

    };

    return utcDate1.toLocaleString("es-ES", options)

}



function returnType(){
    
    let type = ""

    if(store?.activity?.info_activity?.type==="SPORT"){

        type = "deportiva"

    }
    else if(store?.activity?.info_activity?.type==="TOURISM"){

        type = "turística"
    }
    else if(store?.activity?.info_activity?.type==="LEISURE"){

        type = "lúdica"

    }

    return type

}

useEffect(()=>{

    collection.returnActivity(chosen).then(data=>dispatch({type: 'activity', payload: data}))

},[])


useEffect(()=>{

    console.log(store.activity)
    

},[store])


return(
    <div className="p-0 container bg-white my-5 rounded myActivityCard d-flex fontFamily">

        <div className="container1Activity">

        <h1 className="font1 px-5 pt-5">{store.activity?.info_activity?.name}</h1>
        <p className="activityTextFormat p-5">{store.activity?.info_activity?.desc}</p>
        <img className="px-5 pb-5" src={store.activity?.info_activity?.media[value]}></img>
        <h3 className="px-5 pt-5">Comentarios</h3>

        <CommentBox/>
        
        </div>

        <div className="container2Activity rounded-end">
            <p className="mt-5"><span className="font2 mx-3 p-1 rounded">Actividad {returnType()}</span></p>
            <div className="d-flex mx-3">
                <p className="mt-3"><span className="font2 p-1 rounded">Publicado </span></p>
                <p className="mt-3"><span className="font2 mx-3 p-1 rounded">{parseFullDate(store?.activity?.creation_date)}</span></p>
            </div>
            <div className="mt-3 mx-3 p-1 d-flex">
                <div className="proActivityPhoto">
                    <img className="imgProfessionalAct rounded-circle" src={"/public/avatar/" + store?.activity?.info_activity?.professional?.user?.avatar_url}></img>
                </div>
                <div className="proActivityName d-flex">
                    <p className="mt-3"><span className="font2 mx-3 p-1 rounded">{store?.activity?.info_activity?.professional?.user?.name} {store?.activity?.info_activity?.professional?.user?.surname}</span></p>
                    <p className="mt-3"><span className="font2 p-1 rounded">{store?.activity?.info_activity?.professional?.rating?.toFixed(2)}</span></p>
                </div>
            </div>
            <div className="d-flex">
                <p className="mt-3"><span className="font2 mx-3 p-1 rounded">Fecha inicio</span></p>
                <p className="mt-3"><span className="font2 p-1 rounded">{parseDate(store?.activity?.start_date)}</span></p>
                <p className="mt-3"><span className="font2 mx-3 p-1 rounded">{parseTime(store?.activity?.start_date)}</span></p>
            </div>
            <div className="d-flex">
                <p className="mt-3"><span className="font2 mx-3 p-1 rounded">Fecha fin</span></p>
                <p className="mt-3"><span className="font2 p-1 rounded">{parseDate(store?.activity?.end_date)}</span></p>
                <p className="mt-3"><span className="font2 mx-3 p-1 rounded">{parseTime(store?.activity?.end_date)}</span></p>
            </div>

            <div className="d-flex">
                <p className="mt-3"><span className="font2 mx-3 p-1 rounded">Precio </span></p>
                <p className="mt-3"><span className="font2 p-1 rounded">{store?.activity?.price}€</span></p>
            </div>
            <div className="d-flex">
                <p className="mt-3"><span className="font2 mx-3 p-1 rounded">Plazas </span></p>
                <p className="mt-3"><span className="font2 p-1 rounded">{store?.activity?.slots}</span></p>
            </div>
            <p className="font2 mx-3 p-1 mt-3 rounded text-center">Location meeting</p>
            <div className="containerMap mt-3 mx-3">
                <iframe className="theMap rounded"
                width="100%"
                height="100%"
                frameBorder="0" style={{border:0}}
                referrerPolicy="no-referrer-when-downgrade"
                src={"https://www.google.com/maps/embed/v1/place?key="+ GOOGLE_MAPS_API +"&q=" + store?.activity?.meeting_point}
                allowFullScreen>
                </iframe>
            </div>
            <p className="font2 mx-3 p-1 mt-3 rounded text-center">{store?.activity?.meeting_point}</p>
        <CommentBox/>
            
        </div>

    </div>
)
}