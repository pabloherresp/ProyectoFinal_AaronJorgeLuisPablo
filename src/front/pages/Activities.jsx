import { useEffect } from "react"
import { useParams } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { ActivityCard } from "../components/ActivityCard"
import collection from "../services/collection"
import { Link } from "react-router-dom";
import React, { useState } from "react";

export const Activities = () => {
    const {store, dispatch} = useGlobalReducer()

    const [counter1, setCounter1] = useState(0);
    const [counter4, setCounter4] = useState(0);

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
    useEffect(() => {

        const scrollContainer2 = document.querySelector('.scroll2');

        scrollContainer2.addEventListener('wheel',(e) => {
            e.preventDefault();
            scrollContainer2.scrollLeft += e.deltaY;
        });

        const scrollContainer1 = document.querySelector('.scroll1');

        scrollContainer1.addEventListener('wheel' ,(e) => {
            e.preventDefault();
            scrollContainer1.scrollLeft += e.deltaY;
        });

        collection.returnActivities().then(data => dispatch({ type: 'activities', payload: data }))


    }, [])


    function returnActive() {

        let newArray = []

        for (let i = 0; i < store.all_activities.length; i++) {

            if (store.all_activities[i].is_finished == true) {

                newArray.push(store.all_activities[i])

            }
        }

        return newArray
    }

    function handleClickLess1(counter) {

        if (counter != 0) {
            let contador1 = counter1
            setCounter1(contador1 - 1)
        }

    }

    function handleClickLess2(counter) {

        if (counter != 0) {
            let contador4 = counter4
            setCounter4(contador4 - 1)
        }

    }

    function handleClickMore1(counter) {

        if (counter <= (store.all_activities.length - 4)) {
            let contador1 = counter1
            setCounter1(contador1 + 1)
        }

    }

    function handleClickMore2(counter) {

        if (counter <= (returnActive().length - 4)) {
            let contador4 = counter4
            setCounter4(contador4 + 1)
        }

    }

    return (

        <div className="pb-5 container bg-white my-5 rounded myActivityCard fontFamily">


            <h1 className="font1 p-5 text-center">Actividades por tipo</h1>
            <div className="d-flex justify-content-around">
                <button className="buttonStyle rounded-circle invisible"><i className="fa-solid fa-arrow-left"></i></button>

                <div className="row">


                    <Link className="text-decoration-none valor-card2 col-lg-4 col-md-6 col-sm-12 mt-4" to={'/activities/sport'}><ActivityCard img={"src/front/assets/img/Padel.webp"} title={"Actividades deportivas"} description={"Apúntate a diversas actividades deportivas para mantenerte sano y en forma"}></ActivityCard></Link>

                    <Link className="text-decoration-none valor-card2 col-lg-4 col-md-6 col-sm-12 mt-4" to={'/activities/tourism'}> <ActivityCard img={"src/front/assets/img/Ruinas.jpeg"} title={"Actividades turísticas"} description={"Recorre el mundo descubriendo nuevas ubicaciones con un encanto exótico"}></ActivityCard></Link>

                    <Link className="text-decoration-none valor-card2 col-lg-4 col-md-6 col-sm-12 mt-4" to={'/activities/leisure'}><ActivityCard img={"src/front/assets/img/Poker.webp"} title={"Actividades recreativas"} description={"No te quedes sin sitio en nuestras actividades recreativas donde puedes pasar un buen rato"}></ActivityCard></Link>


                </div>
                <button className="buttonStyle rounded-circle invisible"><i className="fa-solid fa-arrow-right"></i></button>

            </div>


            <h1 className="font1 p-5 mt-5 text-center">Excursiones</h1>

            <div className="d-flex overflow-auto gap-3 p-3 scroll-horizontal scroll2 d-block d-lg-none">

                {store.all_activities?.map((item,index) => <Link key={index} className="text-decoration-none valor-card2 mt-4" to={'/activities/' + item.id}><ActivityCard img={item.info_activity.media[0]} title={item.info_activity.name} origin={item.meeting_point} description={item.info_activity.desc.slice(0, 100)}></ActivityCard></Link>)}

            </div>

            <div className="d-none d-lg-block">
                <div className="d-flex justify-content-around gap-3">
                    <button className="buttonStyle rounded-circle" onClick={(e) => handleClickLess1(counter1)}><i className="fa-solid fa-arrow-left"></i></button>
                    <div className="row">


                        <Link className="text-decoration-none valor-card2 col-lg-4 col-md-6 col-sm-12 mt-4" to={'/activities/' + store.all_activities[counter1]?.id}><ActivityCard img={store.all_activities[counter1]?.info_activity.media[0]} title={store.all_activities[counter1]?.info_activity.name} origin={store.all_activities[counter1]?.meeting_point} description={store.all_activities[counter1]?.info_activity.desc.slice(0, 100)}></ActivityCard></Link>

                        <Link className="text-decoration-none valor-card2 col-lg-4 col-md-6 col-sm-12 mt-4" to={'/activities/' + store.all_activities[counter1 + 1]?.id}> <ActivityCard img={store.all_activities[counter1 + 1]?.info_activity.media[0]} title={store.all_activities[counter1 + 1]?.info_activity.name} origin={store.all_activities[counter1 + 1]?.meeting_point} description={store.all_activities[counter1 + 1]?.info_activity.desc.slice(0, 100)}></ActivityCard></Link>

                        <Link className="text-decoration-none valor-card2 col-lg-4 col-md-6 col-sm-12 mt-4" to={'/activities/' + store.all_activities[counter1 + 2]?.id}><ActivityCard img={store.all_activities[counter1 + 2]?.info_activity.media[0]} title={store.all_activities[counter1 + 2]?.info_activity.name} origin={store.all_activities[counter1 + 2]?.meeting_point} description={store.all_activities[counter1 + 2]?.info_activity.desc.slice(0, 100)}></ActivityCard></Link>


                    </div>

                    <button className="buttonStyle rounded-circle" onClick={(e) => handleClickMore1(counter1)}><i className="fa-solid fa-arrow-right"></i></button>
                </div>
            </div>


            <h1 className="font1 p-5 mt-5 text-center">Actividades realizadas previamente</h1>

            <div className="d-flex overflow-auto gap-3 p-3 scroll-horizontal scroll1 d-block d-lg-none">

                {returnActive()?.map((item,index) => <Link key={index} className="text-decoration-none valor-card2 mt-4" to={'/activities/' + item.id}><ActivityCard img={item.info_activity.media[0]} title={item.info_activity.name} origin={item.meeting_point} description={item.info_activity.desc.slice(0, 40)} timeleft={returnCounter(item.start_date)}></ActivityCard></Link>)}

            </div>

            <div className="d-none d-lg-block">
                <div className="d-flex justify-content-around gap-3">
                    <button className="buttonStyle rounded-circle" onClick={(e) => handleClickLess2(counter4)}><i className="fa-solid fa-arrow-left"></i></button>
                    <div className="row">


                        <Link className="text-decoration-none valor-card2 col-lg-4 col-md-6 col-sm-12 mt-4" to={'/activities/' + returnActive()[counter4]?.id}><ActivityCard img={returnActive()[counter4]?.info_activity.media[0]} title={returnActive()[counter4]?.info_activity.name} origin={returnActive()[counter4]?.meeting_point} description={returnActive()[counter4]?.info_activity.desc.slice(0, 40)} timeleft={returnCounter(returnActive()[counter4]?.start_date)}></ActivityCard></Link>

                        <Link className="text-decoration-none valor-card2 col-lg-4 col-md-6 col-sm-12 mt-4" to={'/activities/' + returnActive()[counter4 + 1]?.id}> <ActivityCard img={returnActive()[counter4 + 1]?.info_activity.media[0]} title={returnActive()[counter4 + 1]?.info_activity.name} origin={returnActive()[counter4 + 1]?.meeting_point} description={returnActive()[counter4 + 1]?.info_activity.desc.slice(0, 40)} timeleft={returnCounter(returnActive()[counter4 + 1]?.start_date)}></ActivityCard></Link>

                        <Link className="text-decoration-none valor-card2 col-lg-4 col-md-6 col-sm-12 mt-4" to={'/activities/' + returnActive()[counter4 + 2]?.id}><ActivityCard img={returnActive()[counter4 + 2]?.info_activity.media[0]} title={returnActive()[counter4 + 2]?.info_activity.name} origin={returnActive()[counter4 + 2]?.meeting_point} description={returnActive()[counter4 + 2]?.info_activity.desc.slice(0, 40)} timeleft={returnCounter(returnActive()[counter4 + 2]?.start_date)}></ActivityCard></Link>


                    </div>

                    <button className="buttonStyle rounded-circle" onClick={(e) => handleClickMore2(counter4)}><i className="fa-solid fa-arrow-right"></i></button>
                </div>
            </div>
        </div>

    )




}