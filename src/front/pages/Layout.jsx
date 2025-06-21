import { Outlet, useNavigate } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { useEffect } from "react"
import collection from "../services/collection"

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    const { store, dispatch } = useGlobalReducer()
    const navigate = useNavigate()

    const login = async () => {
        const resp = await collection.loginToken()
        if(!resp.success)
            dispatch({type: "closeSession"})
        else
            dispatch({type: "loadUser", payload: resp})
    }

    useEffect(()=>{
        let token = localStorage.getItem("token")
        if(token){
            login()
        }
    },[])

    useEffect(()=>{
        if(store.user.needs_filling == true)
            navigate("/completeuserform")
    },[store.user])

    return (
        <div className="Page">
            <ScrollToTop>
                <Navbar/>
                <main className="PageContent d-flex justify-content-center align-items-center">
                    <Outlet />
                </main>
                <Footer />
            </ScrollToTop>
        </div>
    )
}