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
        if (!resp.success)
            dispatch({ type: "closeSession" })
        else
            dispatch({ type: "loadUser", payload: resp })
    }

    const loadActivities = async () => {
        const resp = await collection.returnActivities()
        dispatch({ type: 'activities', payload: resp })
    }

    useEffect(() => {
        let token = localStorage.getItem("token")
        if (token) {
            login()
        }
        loadActivities()
    }, [])

    useEffect(() => {
        if (store.user.needs_filling == true)
            navigate("/completeuserform")
    },[store.user])

    return (
        <ScrollToTop>
            <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <main className="d-flex flex-column flex-grow-1 justify-content-center align-items-center">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </ScrollToTop>
    )
}