import { useEffect } from "react"
import { useParams } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { ActivityCard } from "../components/ActivityCard"
import collection from "../services/collection"
import { Link } from "react-router-dom";
import React, { useState } from "react";

export const Activities = () => {
    const { store, dispatch } = useGlobalReducer()

    const [counter1, setCounter1] = useState(0);
    const [counter4, setCounter4] = useState(0);

    function returnCounter(fecha) {
        var fechaEnMiliseg = Date.now() + 7200000;
        var fechaActual = new Date(fechaEnMiliseg)

        var resultado = new Date(fecha) - fechaActual
        var diferencia = resultado / (86400000)

        var dias = Math.floor(diferencia)
        var horas = Math.floor((diferencia - dias) * 24)

        if (dias < 0)
            return "Actividad finalizada"
        else {
            if (dias == 0)
                return (horas > 1 ? `Faltan ${horas} horas` : `Falta ${horas}  hora`)
            else
                return (dias > 1 ? `Faltan ${dias}  días` : `Falta  ${dias}  día`) + (horas > 1 ? ` y  ${horas}  horas` : ` y  ${horas}  hora`)
        }
    }

    useEffect(() => {
        const scrollContainer2 = document.querySelector('.scroll2');
        const scrollContainer1 = document.querySelector('.scroll1');

        scrollContainer2.addEventListener('wheel', (e) => {
            e.preventDefault();
            scrollContainer2.scrollLeft += e.deltaY;
        });
        scrollContainer1.addEventListener('wheel', (e) => {
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

        <div className="pb-5 container bg-white rounded myActivityCard fontFamily px-5 my-3">

            <h1 className="font1 mt-5 p-2 text-center">Actividades por tipo</h1>
            <div className="d-flex justify-content-around gap-3">
                <div className="CarouselFiller"></div>
                <div className="row">
                    <div className="col-lg-4 col-md-6 col-sm-12 mt-4"><ActivityCard img={"src/front/assets/img/Padel.webp"} title={"Actividades deportivas"} description={"Apúntate a diversas actividades deportivas para mantenerte sano y en forma"} /></div>

                    <div className="col-lg-4 col-md-6 col-sm-12 mt-4"><ActivityCard img={"src/front/assets/img/Ruinas.jpeg"} title={"Actividades turísticas"} description={"Recorre el mundo descubriendo nuevas ubicaciones con un encanto exótico"} /></div>

                    <div className="col-lg-4 col-md-6 col-sm-12 mt-4"><ActivityCard img={"src/front/assets/img/Poker.webp"} title={"Actividades recreativas"} description={"No te quedes sin sitio en nuestras actividades recreativas donde puedes pasar un buen rato"} /></div>
                </div>
                <div className="CarouselFiller"></div>
            </div>

            <h1 className="font1 p-2 mt-5 text-center">Excursiones</h1>

            <div className="d-flex overflow-auto gap-3 p-3 scroll-horizontal scroll2 d-block d-lg-none">

                {store.all_activities?.map((item, index) =>
                    <div key={index} className="my-2 py-3">
                        <ActivityCard activity={item} />
                    </div>
                )}
            </div>

            <div className="d-none d-lg-block">
                <div className="d-flex justify-content-around gap-3">
                    <button className="buttonStyle rounded-circle" onClick={(e) => handleClickLess1(counter1)}><i className="fa-solid fa-arrow-left"></i></button>
                    <div className="row">
                        <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
                            <ActivityCard activity={store.all_activities[counter1]} />
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
                            <ActivityCard activity={store.all_activities[counter1 + 1]} />
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
                            <ActivityCard activity={store.all_activities[counter1 + 2]} />
                        </div>
                    </div>

                    <button className="buttonStyle rounded-circle" onClick={(e) => handleClickMore1(counter1)}><i className="fa-solid fa-arrow-right"></i></button>
                </div>
            </div>


            <h1 className="font1 p-2 mt-5 text-center">Actividades realizadas previamente</h1>

            <div className="d-flex overflow-auto gap-3 p-3 scroll-horizontal scroll1 d-block d-lg-none">

                {returnActive()?.map((item, index) => <ActivityCard key={index} activity={item} />)}

            </div>

            <div className="d-none d-lg-block">
                <div className="d-flex justify-content-around gap-3">
                    <button className="buttonStyle rounded-circle" onClick={(e) => handleClickLess2(counter4)}><i className="fa-solid fa-arrow-left"></i></button>
                    <div className="row">
                        <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
                            <ActivityCard activity={returnActive()[counter4]} />
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
                            <ActivityCard activity={returnActive()[counter4 + 1]} />
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
                            <ActivityCard activity={returnActive()[counter4 + 2]} />
                        </div>
                    </div>
                    <button className="buttonStyle rounded-circle" onClick={(e) => handleClickMore2(counter4)}><i className="fa-solid fa-arrow-right"></i></button>
                </div>
            </div>
        </div>

    )
}