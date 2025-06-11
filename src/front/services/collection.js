import storeReducer from "../store";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const collection = {}

collection.returnActivities = async () => {

    try{

        const resp = await fetch(BACKEND_URL + "api/activities");
        const data = await resp.json();
        return data

    }catch(error){
        console.log(error)
    }

}


export default collection