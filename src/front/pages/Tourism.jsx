import { useEffect } from "react"
import { useParams } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { ActivityCard } from "../components/ActivityCard"
import collection from "../services/collection"
import { Link } from "react-router-dom";

export const Tourism = () => {



const GOOGLE_MAPS_API = import.meta.env.VITE_GOOGLE_MAPS_API

    
function mostValuatedActivity(){

    let newArray = []
    let counter = 0
    
    let mostRated

    for(let i = 0;i<returnActive().length;i++){

        for(let k =0;k<returnActive().length;k++){

            if(returnActive()[i].info_activity.rating<returnActive()[k].info_activity.rating){
                counter++
            }

        }
            newArray.push(counter)
            counter = 0
        if(i>=returnActive().info_activity.rating.length){
            mostRated.push(returnActive()[newArray.indexOf(Math.max(...newArray))])
        }

    }

    return mostRated

}



function returnCounter(fecha){


var fechaEnMiliseg = Date.now();

var fechaActual = new Date(fechaEnMiliseg)



var resultado = new Date(fecha) - fechaActual

var diferencia = resultado / (86400000)

var dias = Math.floor(diferencia)

var horas = Math.floor((diferencia - dias) * 24)

if(dias== 0){
    return (horas>1 ? `Faltan ${horas} horas` : `Falta ${horas}  hora`)
}
else{
    return (dias>1 ? `Faltan ${dias}  días` : `Falta  ${dias}  día`) + (horas>1 ? ` y  ${horas}  horas` : ` y  ${horas}  hora`)
}

}


const {store, dispatch} = useGlobalReducer()


useEffect(()=>{

    collection.returnActivities().then(data=>dispatch({type: 'activities', payload: data}))

},[])



function returnActive(){

    let newArray = []

    for(let i = 0; i<returnAllSportActivities().length;i++){

        if(returnAllSportActivities()[i].is_finished==false){
            
            newArray.push(returnAllSportActivities()[i])

        }
    }
    
    return newArray
}

function returnAllSportActivities(){

    let newArray = []

    for(let i = 0; i<store.all_activities.length;i++){

        if(store.all_activities[i].info_activity.type=="TOURISM"){
            
            newArray.push(store.all_activities[i])

        }
    }
    
    return newArray
}

return(

    <div className="pb-5 container bg-white my-5 rounded myActivityCard fontFamily">


        <h1 className="font1 p-5 text-center">Actividad más valorada</h1>
                                
        <Link className="text-decoration-none valor-card2 col-lg-4 col-md-6 col-sm-12 mt-4" to={'/activities/' + store.all_activities[0]?.id}> <ActivityCard img={store.all_activities[0]?.info_activity.media[0]} title={store.all_activities[0]?.info_activity.name} origin={store.all_activities[0]?.meeting_point} description={store.all_activities[0]?.info_activity.desc.slice(0, 100)}></ActivityCard></Link>

        <h1 className="font1 p-5 mt-5 text-center">Actividades deportivas activas</h1>

        <div className="row justify-content-around">
           {returnActive().map((activity,i) => <Link className="text-decoration-none valor-card2 col-lg-4 col-md-6 col-sm-12 mt-4" to={'/activities/' + activity.id}><ActivityCard className="mw-100" img={activity.info_activity.media[0]} title={activity.info_activity.name} origin={activity.meeting_point} description={activity.info_activity.desc.slice(0,40)} timeleft={returnCounter(returnActive()[i]?.start_date)}></ActivityCard></Link>)}
        </div>
    </div>

)




}