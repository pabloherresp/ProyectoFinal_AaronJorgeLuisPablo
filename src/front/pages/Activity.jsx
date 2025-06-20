import { useEffect } from "react"
import { useParams } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"
import collection from "../services/collection"

export const Activity = () => {

const {store, dispatch} = useGlobalReducer()

const params = useParams()


const chosen = params.id;

let value = 0;


const GOOGLE_MAPS_API = import.meta.env.VITE_GOOGLE_MAPS_API



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

function filterActivityReview(){
    let newArray = []

    for(let i = 0; i<store?.activity?.info_activity?.reviews.length;i++){

        if(store.activity?.info_activity?.reviews[i]?.activity_rating != null){
            
            newArray.push(store.activity.info_activity.reviews[i])

        }
    }
    
    return newArray
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
       {filterActivityReview().map((review, i) =><div className="m-5 card reviewCard" key={i}> 
            <div className="d-flex">
                <h5 className="p-2 fixSizeTitleActivity">{review.user.username} · {review.activity_rating}</h5>   
            </div>
            <p className="px-2 pt-2">{review.activity_message}</p> 
            <p className="px-2 fst-italic fixSizeDateActivity">Creado el {review.creation_date.slice(0,10)} a las {review.creation_date.slice(11,16)}</p>
        </div>)} 
        
        </div>

        <div className="container2Activity">
            <p className="mt-5"><span className="font2 mx-3 p-1 rounded">Actividad {returnType()}</span></p>
            <p className="mt-3"><span className="font2 mx-3 p-1 rounded">Publicada el {store?.activity?.creation_date?.slice(0,10)} a las {store?.activity?.creation_date?.slice(11,16)}</span></p>
            <div className="mt-3 mx-3 p-1 d-flex">
                <div className="proActivityPhoto">
                    <img className="imgProfessionalAct rounded-circle" src={"/public/avatar/" + store?.activity?.info_activity?.professional?.user?.avatar_url}></img>
                </div>
                <div className="proActivityName d-flex">
                    <p className="mt-3"><span className="font2 mx-3 p-1 rounded">{store?.activity?.info_activity?.professional?.user?.name} {store?.activity?.info_activity?.professional?.user?.surname}</span></p>
                    <p className="mt-3"><span className="font2 p-1 rounded">{store?.activity?.info_activity?.professional?.rating?.toFixed(2)}</span></p>
                </div>
            </div>
            <p className="mt-3"><span className="font2 mx-3 p-1 rounded">Empieza el {store?.activity?.start_date?.slice(0,10)} a las {store?.activity?.start_date?.slice(11,16)}</span></p>
            <p className="mt-3"><span className="font2 mx-3 p-1 rounded">Termina el {store?.activity?.end_date?.slice(0,10)} a las {store?.activity?.end_date?.slice(11,16)}</span></p>

            <div className="d-flex">
            <p className="mt-3"><span className="font2 mx-3 p-1 rounded">Precio {store?.activity?.price}€</span></p>
            <p className="mt-3"><span className="font2 p-1 rounded">Plazas {store?.activity?.slots}</span></p>
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
            
        </div>

    </div>
)
}