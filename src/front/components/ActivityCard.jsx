import React from "react"

export const ActivityCard = (props) => {







    return (

        <div>
            <div className="card cardFormat p-0 rounded">

                <img src={props.img} className="rounded-top-1"></img>

                <h5>{props.title}</h5>

                <p>{props.origin}</p>

                <p>{props.description}</p>

                <p>{props.timeleft}</p>

            </div>
        </div>

    )




}