import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import collection from "../services/collection"
import useGlobalReducer, { StoreProvider } from "../hooks/useGlobalReducer.jsx"

export const Report = () => {

    const { store, dispatch } = useGlobalReducer()

    const params = useParams()
    const chosen = params.id;
    const navigate = useNavigate()

    const [check, setCheck] = useState(false)

    function parseDate(date) {

        const utcDate1 = new Date(date);
        const options = {
            year: "numeric",
            month: "short",
            day: "numeric",

        };

        return utcDate1.toLocaleString("es-ES", options)
    }

    useEffect(() => {

        collection.returnSingleReport(chosen).then(data => dispatch({ type: 'report', payload: data }))

    }, [])


    async function handleSubmit(e) {
        e.preventDefault()

        collection.deleteReport(store.report?.id)
        
        setTimeout(() => {

        }, "1000");

        navigate("/admin")

    }


    return (
        <div className="container rounded-end rounded fontFamily bg-white my-5 p-0">
            <div className="p-3">
                <h1 className="pb-3">Report ID: {store.report.id}</h1>
                <hr></hr>
                <p className="msgText">"{store.report.message}"</p>
                {store.report.info_activity == null ? <p><strong>Profesional reportado: </strong><Link className="text-decoration-none reportLinkFormat" to={"/detailsprofessional/" + store.report?.professional?.id}>{store.report?.professional?.username}</Link></p> : <p><strong>Actividad reportada: </strong><Link className="text-decoration-none reportLinkFormat" to={"/activities/" + store.report?.info_activity?.id}>{store.report?.info_activity.name}</Link></p>}
                {store.report.info_activity == null ? <p><strong>Usuario que reportó al profesional: </strong><Link className="text-decoration-none reportLinkFormat" to={"/user/" + store.report?.user?.id}>{store.report?.user?.username}</Link></p> : <p><strong>Usuario que reportó la actividad: </strong><Link className="text-decoration-none reportLinkFormat" to={"/user/" + store.report?.user?.id}>{store.report?.user?.username}</Link></p>}
                <p><strong>Fecha del reporte: </strong>{parseDate(store.report?.creation_date)}</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-check form-switch pb-3">
                        <input onChange={(e) => setCheck(!check)} value={check} className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                        <label className="form-check-label" for="flexSwitchCheckDefault">Actividad revisada</label>
                    </div>
                <hr></hr>
                    {check
                        ?
                        <button type="submit" className="btn reportButtonFormat mt-3">Enviar revisión</button>
                        :
                        <button type="submit" className="btn reportButtonFormat mt-3" disabled>Enviar revisión</button>}

                </form>
            </div>
        </div>
    )
}