import { useEffect, useState } from "react"
import collection from "../services/collection"
import useGlobalReducer from "../hooks/useGlobalReducer"

export const Administration = () => {

    const { store, dispatch } = useGlobalReducer() 

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

        collection.returnAllReports().then(data => dispatch({ type: 'reports', payload: data }))

    }, [])


    return(

        <div className="container rounded-end fontFamily bg-white p-0">
            
                <div className="adminStyle shadow rounded-top">
                    <h1 className="text-center p-3">Ventana de administración</h1>
                <div className="nav nav-tabs justify-content-center pb-1" id="nav-tab" role="tablist">
                    <button className="nav-link active invisible" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Home</button>
                    <button className="nav-link adminStyle" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false"><strong>Reportes</strong></button>
                    <button className="nav-link adminStyle" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false"><strong>Usuarios</strong></button>
                    <button className="nav-link invisible" id="nav-home-tab2" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Home</button>
                </div>

                </div>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active d-flex justify-content-center m-5" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">
                        <img className="rounded shadow" src="src/front/assets/img/hacker.jpg"></img>
                    </div>
                    <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab" tabindex="0">
                        
                        {store.all_reports.map((item,i) => 
                            <div className="p-3">
                                <p>{item.message} - {parseDate(item.creation_date)}</p>
                            </div>
                        )}

                    </div>
                    <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab" tabindex="0">
                        
                        ...

                    </div>
                </div>


        </div>
    )
}