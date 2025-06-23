import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { ActivityCard } from "../components/ActivityCard"
import collection from "../services/collection"
import { Link } from "react-router-dom";

export const Tourism = () => {

    function returnCounter(fecha) {


        var fechaEnMiliseg = Date.now() + 7200000;

        var fechaActual = new Date(fechaEnMiliseg)



        var resultado = new Date(fecha) - fechaActual

        var diferencia = resultado / (86400000)

        var dias = Math.floor(diferencia)

        var horas = Math.floor((diferencia - dias) * 24)

        if (dias < 0) {

            return "Actividad finalizada"


        }
        else {
            if (dias == 0) {
                return (horas > 1 ? `Faltan ${horas} horas` : `Falta ${horas}  hora`)
            }
            else {
                return (dias > 1 ? `Faltan ${dias}  días` : `Falta  ${dias}  día`) + (horas > 1 ? ` y  ${horas}  horas` : ` y  ${horas}  hora`)
            }
        }
    }


    const { store, dispatch } = useGlobalReducer()

    useEffect(() => {

        collection.returnActivities().then(data => dispatch({ type: 'activities', payload: data }))

    }, [])



    function returnAllTourismActivities() {

        let newArray = []

        for (let i = 0; i < store?.all_activities.length; i++) {

            if (store?.all_activities[i]?.info_activity?.type == "TOURISM" && store?.all_activities[i]?.is_finished == false) {


                newArray.push(store?.all_activities[i])

            }

        }
        return newArray
    }

    function mostValuatedActivities() {

        return returnAllTourismActivities().sort((a, b) => b.info_activity.rating - a.info_activity.rating).filter((item, index) => index < 3)

    }

    function lastChance() {

        var fechaEnMiliseg = Date.now() + 7200000;

        var fechaActual = new Date(fechaEnMiliseg)

        return returnAllTourismActivities().sort((a, b) => new Date(a.start_date) - new Date(b.start_date)).filter((item, index) => new Date(item.start_date) > fechaActual).slice(0, 3)

    }

    mostValuatedActivities()

    return (

        <div className="pb-5 container px-5 bg-white my-5 rounded myActivityCard fontFamily">
            <h1 className="font1 p-5 text-center">Actividades más valoradas</h1>
            <div className="row justify-content-around">
                {mostValuatedActivities()?.map((activity, i) => {
                    return <div key={i} className="col-lg-4 col-md-6 col-sm-12 mt-4">
                        <ActivityCard activity={activity} />
                    </div>
                })}
            </div>
            <h1 className="font1 p-5 text-center">Última oportunidad</h1>
            <div className="row justify-content-around">
                {store.all_activities?.filter((item) => item.info_activity.type == "TOURISM" && new Date(item.start_date) > new Date(Date.now() + 7200000)).sort((a, b) => new Date(a.start_date) - new Date(b.start_date)).slice(0, 3).map((item, i) => {
                    return <div key={i} className="col-lg-4 col-md-6 col-sm-12 mt-4">
                        <ActivityCard activity={item} />
                    </div>
                }
                )}
            </div>
            <h1 className="font1 p-5 mt-5 text-center">Actividades de ocio activas</h1>

            <div className="row justify-content-around">
                {returnAllTourismActivities()?.map((activity, i) =>
                    <div key={i} className="col-lg-4 col-md-6 col-sm-12 mt-4">
                        <ActivityCard activity={activity} />
                    </div>)}
            </div>
        </div>

    )




}