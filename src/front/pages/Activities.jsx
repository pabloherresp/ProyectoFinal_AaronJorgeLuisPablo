import { useEffect } from "react"
import { useParams } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { ActivityCard } from "../components/ActivityCard"
import collection from "../services/collection"

export const Activities = () => {



const {store, dispatch} = useGlobalReducer()

let counter1 = 0
let counter2 = 1
let counter3 = 2

useEffect(()=>{

    collection.returnActivities().then(data=>dispatch({type: 'activities', payload: data}))
    

},[])

useEffect(()=>{

    console.log(store.all_activities)
    

},[store])

function checkActive(int){

    let newArray = []

    for(let i = 0; i<store.all_activities.length;i++){

        if(store.all_activities[int].is_active==true){
            
            newArray.join(store.all_activities[int])

        }
    }
    
    return newArray
}



return(

    <div className="pb-5 backgroundBody">

        <img src="src/front/assets/img/Landscape.jpg" className="fixLandscape"></img>

        <h1 className="font1 p-5 text-center">Actividades por tipo</h1>

        <div className="d-flex justify-content-around">

            <ActivityCard img={"src/front/assets/img/Padel.webp"} title={"Actividades deportivas"} description={"Apúntate a diversas actividades deportivas para mantenerte sano y en forma"}></ActivityCard>

            <ActivityCard img={"src/front/assets/img/Ruinas.jpeg"} title={"Actividades turísticas"} description={"Recorre el mundo descubriendo nuevas ubicaciones con un encanto exótico"}></ActivityCard>

            <ActivityCard img={"src/front/assets/img/Poker.webp"} title={"Actividades recreativas"} description={"No te quedes sin sitio en nuestras actividades recreativas donde puedes pasar un buen rato, y de paso, conocer gente"}></ActivityCard>

        </div>


        <h1 className="font1 p-5 mt-5 text-center">Excursiones</h1>

        <div className="d-flex justify-content-around">

            <ActivityCard img={"src/front/assets/img/Dummy.jpg"} title={store.all_activities[counter1]?.info_activity.name} origin={store.all_activities[counter1]?.meeting_point} description={store.all_activities[counter1]?.info_activity.desc.slice(0,100)}></ActivityCard>

            <ActivityCard img={"src/front/assets/img/Dummy.jpg"} title={store.all_activities[counter2]?.info_activity.name} origin={store.all_activities[counter2]?.meeting_point} description={store.all_activities[counter2]?.info_activity.desc.slice(0,100)}></ActivityCard>

            <ActivityCard img={"src/front/assets/img/Dummy.jpg"} title={store.all_activities[counter3]?.info_activity.name} origin={store.all_activities[counter3]?.meeting_point} description={store.all_activities[counter3]?.info_activity.desc.slice(0,100)}></ActivityCard>


        </div>

        <h1 className="font1 p-5 mt-5 text-center">Actividades de ocasión</h1>

        <div className="d-flex justify-content-around">

            <ActivityCard img={"src/front/assets/img/Dummy.jpg"} title={"Actividad 1"} origin={"Unknown"} description={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus tempore cupiditate, blanditiis"} timeleft={"Faltan 3 horas"}></ActivityCard>

            <ActivityCard img={"src/front/assets/img/Dummy.jpg"} title={"Actividad 2"} origin={"Unknown"} description={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus tempore cupiditate, blanditiis"} timeleft={"Faltan 15 horas"}></ActivityCard>

            <ActivityCard img={"src/front/assets/img/Dummy.jpg"} title={"Actividad 3"} origin={"Unknown"} description={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus tempore cupiditate, blanditiis"} timeleft={"Faltan 2 días"}></ActivityCard>

        </div>
    </div>

)




}