import { useEffect } from "react"
import { useParams } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { ActivityCard } from "../components/ActivityCard"

export const Activities = () => {


const {store, dispatch} = useGlobalReducer()



/* useEffect(()=>{

   

},[])

*/

return(

    <div className="p5 backgroundBody">

        <img src="src/front/assets/img/Landscape.jpg" className="fixLandscape"></img>

        <h1 className="font1 p-5 text-center">Actividades por tipo</h1>

        <div className="d-flex justify-content-around">

            <ActivityCard img={"src/front/assets/img/Padel.webp"} title={"Actividades deportivas"} description={"Apúntate a diversas actividades deportivas para mantenerte sano y en forma"}></ActivityCard>

            <ActivityCard img={"src/front/assets/img/Ruinas.jpeg"} title={"Actividades turísticas"} description={"Recorre el mundo descubriendo nuevas ubicaciones con un encanto exótico"}></ActivityCard>

            <ActivityCard img={"src/front/assets/img/Poker.webp"} title={"Actividades recreativas"} description={"No te quedes sin sitio en nuestras actividades recreativas donde puedes pasar un buen rato, y de paso, conocer gente"}></ActivityCard>

        </div>


        <h1 className="font1 p-5 text-center">Excursiones</h1>

        <div className="d-flex justify-content-around">

            <ActivityCard img={"src/front/assets/img/Dummy.jpg"} title={"Actividad 1"} origin={"Unknown"} description={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus tempore cupiditate, blanditiis"}></ActivityCard>

            <ActivityCard img={"src/front/assets/img/Dummy.jpg"} title={"Actividad 2"} origin={"Unknown"} description={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus tempore cupiditate, blanditiis"}></ActivityCard>

            <ActivityCard img={"src/front/assets/img/Dummy.jpg"} title={"Actividad 3"} origin={"Unknown"} description={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus tempore cupiditate, blanditiis"}></ActivityCard>

        </div>

        <h1 className="font1 p-5 text-center">Actividades de ocasión</h1>

        <div className="d-flex justify-content-around">

            <ActivityCard img={"src/front/assets/img/Dummy.jpg"} title={"Actividad 1"} origin={"Unknown"} description={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus tempore cupiditate, blanditiis"}></ActivityCard>

            <ActivityCard img={"src/front/assets/img/Dummy.jpg"} title={"Actividad 2"} origin={"Unknown"} description={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus tempore cupiditate, blanditiis"}></ActivityCard>

            <ActivityCard img={"src/front/assets/img/Dummy.jpg"} title={"Actividad 3"} origin={"Unknown"} description={"Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus tempore cupiditate, blanditiis"}></ActivityCard>

        </div>
    </div>

)




}