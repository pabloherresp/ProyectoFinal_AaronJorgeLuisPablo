import { useEffect } from "react"
import { useParams } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { ActivityCard } from "../components/ActivityCard"
import collection from "../services/collection"
import { Link } from "react-router-dom";
import React, { useState } from "react";

export const Activities = () => {

	const [counter1, setCounter1] = useState(0);
	const [counter4, setCounter4] = useState(0);



const {store, dispatch} = useGlobalReducer()


useEffect(()=>{

    collection.returnActivities().then(data=>dispatch({type: 'activities', payload: data}))
    

},[])

useEffect(()=>{

    console.log(store.all_activities)
    

},[store])


function returnActive(){

    let newArray = []

    for(let i = 0; i<store.all_activities.length;i++){

        if(store.all_activities[i].is_finished==false){
            
            newArray.push(store.all_activities[i])

        }
    }
    
    return newArray
}

function handleClickLess1(counter){

    if(counter != 0){
        let contador1 = counter1
        setCounter1(contador1-1)
    }

}

function handleClickLess2(counter){

    if(counter != 0){
        let contador4 = counter4
        setCounter4(contador4-1)
    }

}

function handleClickMore1(counter){

    if(counter <= (store.all_activities.length -4)){
        let contador1 = counter1
        setCounter1(contador1+1)
    }

}

function handleClickMore2(counter){

    if(counter <= (returnActive().length -4)){
        let contador4 = counter4
        setCounter4(contador4+1)
    }

}

return(

    <div className="pb-5 container bg-white my-5 rounded myActivityCard fontFamily">


        <h1 className="font1 p-5 text-center">Actividades por tipo</h1>

        <div className="d-flex justify-content-around">

            <button className="buttonStyle rounded-circle invisible"><i className="fa-solid fa-arrow-left"></i></button>

           <Link className="text-decoration-none valor-card2"  to={'/activities/sport'}><ActivityCard img={"src/front/assets/img/Padel.webp"} title={"Actividades deportivas"} description={"Apúntate a diversas actividades deportivas para mantenerte sano y en forma"}></ActivityCard></Link>
           

           <Link className="text-decoration-none valor-card2" to={'/activities/tourism'}><ActivityCard img={"src/front/assets/img/Ruinas.jpeg"} title={"Actividades turísticas"} description={"Recorre el mundo descubriendo nuevas ubicaciones con un encanto exótico"}></ActivityCard></Link>


           <Link className="text-decoration-none valor-card2" to={'/activities/leisure'}><ActivityCard img={"src/front/assets/img/Poker.webp"} title={"Actividades recreativas"} description={"No te quedes sin sitio en nuestras actividades recreativas donde puedes pasar un buen rato"}></ActivityCard></Link>

            <button className="buttonStyle rounded-circle invisible"><i className="fa-solid fa-arrow-right"></i></button>

        </div>


        <h1 className="font1 p-5 mt-5 text-center">Excursiones</h1>

        <div className="d-flex justify-content-around">

            <button className="buttonStyle rounded-circle" onClick={(e)=>handleClickLess1(counter1)}><i class="fa-solid fa-arrow-left"></i></button>

           <Link className="text-decoration-none valor-card2"  to={'/activities/' + store.all_activities[counter1]?.id}><ActivityCard img={store.all_activities[counter1]?.info_activity.media[0]} title={store.all_activities[counter1]?.info_activity.name} origin={store.all_activities[counter1]?.meeting_point} description={store.all_activities[counter1]?.info_activity.desc.slice(0,100)}></ActivityCard></Link>

           <Link className="text-decoration-none valor-card2"  to={'/activities/' + store.all_activities[counter1+1]?.id}> <ActivityCard img={store.all_activities[counter1+1]?.info_activity.media[0]} title={store.all_activities[counter1+1]?.info_activity.name} origin={store.all_activities[counter1+1]?.meeting_point} description={store.all_activities[counter1+1]?.info_activity.desc.slice(0,100)}></ActivityCard></Link>

           <Link className="text-decoration-none valor-card2"  to={'/activities/' + store.all_activities[counter1+2]?.id}><ActivityCard img={store.all_activities [counter1+2]?.info_activity.media[0]} title={store.all_activities[counter1+2]?.info_activity.name} origin={store.all_activities[counter1+2]?.meeting_point} description={store.all_activities[counter1+2]?.info_activity.desc.slice(0,100)}></ActivityCard></Link>

            <button className="buttonStyle rounded-circle" onClick={(e)=>handleClickMore1(counter1)}><i class="fa-solid fa-arrow-right"></i></button>

        </div>

        <h1 className="font1 p-5 mt-5 text-center">Actividades de ocasión</h1>

        <div className="d-flex justify-content-around">

            <button className="buttonStyle rounded-circle" onClick={()=>handleClickLess2(counter4)}><i class="fa-solid fa-arrow-left"></i></button>

            <Link className="text-decoration-none valor-card2"  to={'/activities/' + returnActive()[counter4]?.id}><ActivityCard img={returnActive()[counter4]?.info_activity.media[0]} title={returnActive()[counter4]?.info_activity.name} origin={returnActive()[counter4]?.meeting_point} description={returnActive()[counter4]?.info_activity.desc.slice(0,100)} timeleft={"Faltan 3 horas"}></ActivityCard></Link>

            <Link className="text-decoration-none valor-card2"  to={'/activities/' + returnActive()[counter4+1]?.id}><ActivityCard img={returnActive()[counter4+1]?.info_activity.media[0]} title={returnActive()[counter4+1]?.info_activity.name} origin={returnActive()[counter4+1]?.meeting_point} description={returnActive()[counter4+1]?.info_activity.desc.slice(0,100)} timeleft={"Faltan 15 horas"}></ActivityCard></Link>

            <Link className="text-decoration-none valor-card2"  to={'/activities/' + returnActive()[counter4+2]?.id}><ActivityCard img={returnActive()[counter4+2]?.info_activity.media[0]} title={returnActive()[counter4+2]?.info_activity.name} origin={returnActive()[counter4+2]?.meeting_point} description={returnActive()[counter4+2]?.info_activity.desc.slice(0,100)} timeleft={"Faltan 2 días"}></ActivityCard></Link>
            
            <button className="buttonStyle rounded-circle" onClick={()=>handleClickMore2(counter4)}><i class="fa-solid fa-arrow-right"></i></button>

        </div>
    </div>

)




}