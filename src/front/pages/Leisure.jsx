import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { ActivityCard } from "../components/ActivityCard"
import collection from "../services/collection"
import { Link } from "react-router-dom";

export const Leisure = () => {

    function returnCounter(fecha){


    var fechaEnMiliseg = Date.now() + 7200000;

    var fechaActual = new Date(fechaEnMiliseg)



    var resultado = new Date(fecha) - fechaActual

    var diferencia = resultado / (86400000)

    var dias = Math.floor(diferencia)

    var horas = Math.floor((diferencia - dias) * 24)

    if(dias<0){

        return "Actividad finalizada"

        
    }
else{
    if(dias== 0){
            return (horas>1 ? `Faltan ${horas} horas` : `Falta ${horas}  hora`)
        }
        else{
            return (dias>1 ? `Faltan ${dias}  días` : `Falta  ${dias}  día`) + (horas>1 ? ` y  ${horas}  horas` : ` y  ${horas}  hora`)
        }
    }
}


const {store, dispatch} = useGlobalReducer()

useEffect(()=>{

collection.returnActivities().then(data=>dispatch({type: 'activities', payload: data}))

},[])



function returnAllLeisureActivities(){

     let newArray = []

     for(let i = 0; i<store?.all_activities.length;i++){

         if(store?.all_activities[i]?.info_activity?.type=="LEISURE" && store?.all_activities[i]?.is_finished==false){

            
             newArray.push(store?.all_activities[i])

         }

     }
     return newArray
 }

 function mostValuatedActivities(){

    return returnAllLeisureActivities().sort((a,b) => b.info_activity.rating - a.info_activity.rating).filter((item,index) => index < 3)

 }

  function lastChance(){

var fechaEnMiliseg = Date.now() + 7200000;

var fechaActual = new Date(fechaEnMiliseg)

    return returnAllLeisureActivities().sort((a,b) => new Date(a.start_date) - new Date(b.start_date)).filter((item,index) => new Date(item.start_date) > fechaActual).slice(0,3)

 }

 mostValuatedActivities()

return(

    <div className="pb-5 container bg-white my-5 rounded myActivityCard fontFamily">
        <h1 className="font1 p-5 text-center">Actividad más valorada</h1>
         <div className="row justify-content-around">
           {mostValuatedActivities()?.map((activity,i) => <Link key={i} className="text-decoration-none valor-card2 col-lg-4 col-md-6 col-sm-12 mt-4" to={'/activities/' + activity.id}><ActivityCard className="mw-100" img={activity.info_activity.media[0]} title={activity.info_activity.name} origin={activity.meeting_point} description={activity.info_activity.desc.slice(0,40)}></ActivityCard></Link>)}
        </div>  
        <h1 className="font1 p-5 text-center">Última oportunidad</h1>
         <div className="row justify-content-around">
           {lastChance()?.map((activity,i) => <Link key={i} className="text-decoration-none valor-card2 col-lg-4 col-md-6 col-sm-12 mt-4" to={'/activities/' + activity.id}><ActivityCard className="mw-100" img={activity.info_activity.media[0]} title={activity.info_activity.name} origin={activity.meeting_point} description={activity.info_activity.desc.slice(0,40)} timeleft={returnCounter(activity.start_date)}></ActivityCard></Link>)}
        </div>  
        <h1 className="font1 p-5 mt-5 text-center">Actividades de ocio activas</h1>

        <div className="row justify-content-around">
           {returnAllLeisureActivities()?.map((activity,i) => <Link key={i} className="text-decoration-none valor-card2 col-lg-4 col-md-6 col-sm-12 mt-4" to={'/activities/' + activity.id}><ActivityCard className="mw-100" img={activity.info_activity.media[0]} title={activity.info_activity.name} origin={activity.meeting_point} description={activity.info_activity.desc.slice(0,40)} timeleft={returnCounter(returnAllLeisureActivities()[i]?.start_date)}></ActivityCard></Link>)}
        </div>
    </div>

)




}