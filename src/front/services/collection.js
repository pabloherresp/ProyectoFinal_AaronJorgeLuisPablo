const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const get_token = () => {
    return "Bearer " + localStorage.getItem("token")
}

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

collection.returnActivity = async (id) => {
    try{
        const resp = await fetch(BACKEND_URL + "api/activities/" + id);
        const data = await resp.json();
        return data
    }catch(error){
        console.log(error)
    }
}

collection.checkUser = async (name) => {
    try {
        const resp = await fetch(BACKEND_URL + "api/users/", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
			body: JSON.stringify({name: name})
        })
        return resp.ok
    } catch (error) {
        console.log(error)
    }
}

collection.getOneUser = async (id) => {
    try {
        const resp = await fetch(BACKEND_URL + "api/users/" + id, {
            headers: {"Authorization": get_token()}
        })
        const data = await resp.json()
        return data
    } catch (error) {
        console.log(error)
    }
}

collection.loginUser = async (userdata) => {
    try{
        const resp = await fetch(BACKEND_URL + "api/login", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
			body: JSON.stringify(userdata)
        })
        
		if(resp.status == 400) throw Error("Missing data")
		else if (resp.status == 401) throw Error("User/Email and Password don't match")
		else if(resp.status == 404) throw Error("User with given credentials couldn't be found")
		else if(!resp.ok) throw Error("Unknown error")

        const data = await resp.json()
        return data

    }catch(error) {
		console.log(error)
		return {success: false, response: error.message}
    }
}

collection.loginToken = async (token) => {
    try {
        const resp = await fetch(BACKEND_URL + "api/user", {
            headers: {"Authorization": get_token()}
        })
        const data = await resp.json()

        if(resp.status == 404) throw Error("Usuario no encontrado")
        return data
    } catch (error) {
        console.log(error)
        return {success: false, response: error.message}
    }
}

collection.signupUser = async (userdata) => {
    try{
        const resp = await fetch(BACKEND_URL + "api/signup", {
            method: "POST",
			body: userdata
        })
        const data = await resp.json()
		if(resp.status == 400) throw Error("Missing data")
		else if(resp.status == 409) throw Error("El email introducido ya existe en la base de datos")
		else if(!resp.ok) throw Error("Error desconocido")
        return data

    }catch(error) {
		console.log(error)
		return {success: false, response: error.message}
    }
}

collection.createClient = async (userdata) => {
    try {
        const resp = await fetch(BACKEND_URL + "api/clients", {
            method: "POST",
            headers: {"Authorization": get_token()},
			body: userdata
        })
        const data = await resp.json()
        return data
    } catch (error) {
        console.log(error)
        return {success: false, response: error.message}
    }
}

collection.editUser = async (userdata) => {
    try {
        const resp = await fetch(BACKEND_URL + "api/users", {
            method: "PUT",
            headers: {"Authorization": get_token()},
			body: userdata
        })
        const data = await resp.json()
        return data
    } catch (error) {
        console.log(error)
        return {success: false, response: error.message}
    }
}

collection.createProf = async (userdata) => {
    try {
        const resp = await fetch(BACKEND_URL + "api/professionals", {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                "Authorization": get_token()
            }, body: JSON.stringify(userdata)
        })
        const data = await resp.json()
        return data
    } catch (error) {
        console.log(error)
        return {success: false, response: error.message}
    }
}

collection.getInscriptionsForUser = async () => {
    try {
        const resp = await fetch(BACKEND_URL + "api/inscriptions", {
            headers: {"Authorization": get_token()}
        })
        const data = resp.json()
        return data
    } catch (error) {
        
    }
}

collection.search = async (text) => {
    try {
        const resp = await fetch(BACKEND_URL + "api/search/" + text)
        const data = resp.json()

        if(resp.status == 404) throw Error("Results not found")
        else if (!resp.ok) throw Error("Unknown error")

        return data
    } catch (error) {
        console.log(error)
        return {error: error}
    }
}

export default collection