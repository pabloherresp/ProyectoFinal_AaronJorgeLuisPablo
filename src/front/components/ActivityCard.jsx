import React from "react"

export const ActivityCard = (props) => {


    return (

        <div>
            <div className="card cardFormat p-0 rounded d-flex">

                <div className="imgCardFormat">
                
                    <img src={props.img} className="rounded-top-1 imageCard"></img>

                </div>

                <div className="p-3 textCardFormat">
                
                    <h5 className="titleFormat">{props.title}</h5>

                    <p className="titleFormat">{props.origin}</p>

                    <p className="textFormat">{props.description}</p>

                    <p className="titleFormat text-center">{props.timeleft}</p>

                </div>

            </div>
        </div>

    )




}