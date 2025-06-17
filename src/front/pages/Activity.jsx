import { useEffect } from "react"
import { useParams } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"
import collection from "../services/collection"

export const Activity = () => {

const {store, dispatch} = useGlobalReducer()

const params = useParams()


const chosen = params.id;

let value = 0;

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
        </div>

    </div>
)
}