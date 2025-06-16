import { useEffect } from "react"
import { useParams } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"
import collection from "../services/collection"

export const Activity = () => {

const {store, dispatch} = useGlobalReducer()

const params = useParams()


const chosen = params.id;


useEffect(()=>{

    collection.returnActivity(chosen).then(data=>dispatch({type: 'activity', payload: data}))

},[])


useEffect(()=>{

    console.log(store.activity)
    

},[store])

return(
    <div className="pb-5 container bg-white my-5 rounded myActivityCard">
        <h1 className="font1 p-5">{store.activity?.info_activity?.name}</h1>
        <p>{store.activity?.info_activity?.desc}</p>
    </div>
)
}