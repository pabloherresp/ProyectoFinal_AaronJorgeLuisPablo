import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"
import collection from "../services/collection"
import CommentBox from "../components/CommentBox"
import Inputmask from 'inputmask';
import Cleave from 'cleave.js/react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ModalReport } from "../components/ModalReport"


export const Activity = () => {

    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [paymentError, setPaymentError] = useState("");
    const [paymentResponse, setPaymentResponse] = useState({ message: "", error: true })


    const [cardHolder, setCardHolder] = useState("")
    const [errorHolder, setErrorHolder] = useState("")


    const { store, dispatch } = useGlobalReducer()

    const params = useParams()
    const navigate = useNavigate()

    const chosen = params.id;

    const [counter1, setCounter1] = useState(0)
    const [activity, setActivity] = useState(null)


    const GOOGLE_MAPS_API = import.meta.env.VITE_GOOGLE_MAPS_API



    function parseDate(date) {

        const utcDate1 = new Date(date);
        const options = {
            year: "numeric",
            month: "short",
            day: "numeric",

        };

        return utcDate1.toLocaleString("es-ES", options)

    }

    function parseFullDate(date) {

        const utcDate1 = new Date(date);
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",

        };

        return utcDate1.toLocaleString("es-ES", options)

    }

    function parseTime(date) {

        const utcDate1 = new Date(date);
        const options = {
            hour: "numeric",
            minute: "numeric"

        };

        return utcDate1.toLocaleString("es-ES", options)

    }

    function handleClickMore1(counter) {
        if (counter >= 0 && counter < (store.activity?.info_activity?.media.length - 1)) {
            let contador1 = counter
            contador1++
            setCounter1(contador1)
        }
    }

    function handleClickLess1(counter) {

        if (counter > 0) {
            let contador1 = counter
            contador1--
            setCounter1(contador1)
        }
    }

    function returnType() {

        let type = ""

        if (store?.activity?.info_activity?.type === "SPORT") {

            type = "deportiva"

        }
        else if (store?.activity?.info_activity?.type === "TOURISM") {

            type = "turística"
        }
        else if (store?.activity?.info_activity?.type === "LEISURE") {

            type = "lúdica"

        }

        return type

    }


    const favItem = async () => {
        const resp = await collection.createFav(chosen)
        if (resp.success) {
            setTimeout(() => dispatch({ type: "loadUser", payload: resp.user }), 200)
        }
    }

    const delItem = async () => {
        const resp = await collection.deleteFav(chosen)
        if (resp.success) {
            setTimeout(() => dispatch({ type: "loadUser", payload: resp.user }), 200)
        }
    }

    const loadActivity = async () => {
        const resp = await collection.returnActivity(chosen)
        setActivity(resp)
        dispatch({ type: 'activity', payload: resp })
    }

    useEffect(() => {
        loadActivity()
        const scrollContainer3 = document.querySelector('.scroll3');

        scrollContainer3.addEventListener('wheel', (e) => {
            e.preventDefault();
            scrollContainer3.scrollLeft += e.deltaY;
        });
    }, [])

    async function handleSubmit(e) {
        e.preventDefault();
        setPaymentError("");
        setLoading(true);

        const amount = Math.round(store.activity.price * 100);

        const { clientSecret, error: backendError } = await fetch(`${import.meta.env.VITE_BACKEND_URL}api/payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ amount: amount, activity_id: store.activity.id })
        }).then(r => r.json());

        if (backendError) {
            setPaymentResponse({ message: backendError, error: true });
            setLoading(false);
            return;
        }

        const card = elements.getElement(CardElement);
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card, billing_details: { name: cardHolder } }
        });

        if (result.error) {
            setPaymentResponse({ message: result.error.message, error: true });
        } else if (result.paymentIntent.status === 'succeeded') {
            setPaymentResponse({ message: "Pago realizado con éxito", error: false })
            resetValues()
            setTimeout(() => navigate(0), 2000)
        }

        setLoading(false);
    }

    function resetValues() {
        setCardHolder("")
    }




    return (
        <div className="p-0 container bg-white my-5 rounded myActivityCard d-flex fontFamily">

            <div className="container1Activity">
                <div className="d-flex align-items-center pt-3">
                    <h1 className="font1 px-5">{store.activity?.info_activity?.name}</h1>


                    {store.user.id != null && (store.user.favourites?.map((item) => item.activity?.id).includes(store.activity?.info_activity?.id) ?
                        <button className="btn FavButton" onClick={((e) => {
                            e.stopPropagation()
                            if (store.user.needs_filling == true)
                                navigate("/completeuserform")
                            else
                                delItem()
                        })}>
                            <img src="/media/heart-full.svg" alt="" />
                        </button>
                        :
                        <button className="btn FavButton" onClick={((e) => {
                            e.stopPropagation()
                            if (store.user.needs_filling == true)
                                navigate("/completeuserform")
                            else
                                favItem()
                        })}>
                            <img src="/media/heart-empty.svg" alt="" />
                        </button>
                    )}

                    {store.user.id != null &&
                        <button type="button" className="btn FavButton align-self-center mx-3" data-bs-toggle="modal" data-bs-target="#reportModal">
                            <img src="/media/report.svg" alt="" />
                        </button>
                    }
                </div>
                <p className="activityTextFormat p-5">{store.activity?.info_activity?.desc}</p>
                <ModalReport target={"activity"} activity={store.activity} />

                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Formulario de pago</h1><i className="fa-brands fa-cc-stripe mx-3 display-6"></i>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="col-form-label">Detalles de tarjeta:</label>
                                        <div className="form-control">
                                            <CardElement options={{
                                                style: {
                                                    base: {
                                                        fontSize: '16px',
                                                        color: '#424770',
                                                        '::placeholder': { color: '#aab7c4' }
                                                    },
                                                    invalid: { color: '#9e2146' }
                                                }
                                            }} />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="col-form-label">Nombre del titular:</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={cardHolder}
                                            required
                                            maxLength={35}
                                            placeholder="Ingresa tu nombre"
                                            onChange={(e) => setCardHolder(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                                        />
                                        {errorHolder && <p className="fixingErrorsForm">{errorHolder}</p>}
                                    </div>
                                    {<p className={"text-center " + (paymentResponse.error ? "text-danger" : "text-success")}>{paymentResponse.message}</p>}

                                    <div className="modal-footer">
                                        <button type="button" onClick={resetValues} className="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                                        <button type="submit" className="btn btn-success" disabled={!stripe || loading}>
                                            {loading ? 'Procesando...' : 'Pagar'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="d-none d-lg-block">
                    <div className="d-flex justify-content-around gap-3">
                        <button className="buttonStyle rounded-circle mx-3" onClick={(e) => handleClickLess1(counter1)}><i className="fa-solid fa-arrow-left"></i></button>
                        <div className="d-flex justify-content-center">
                            <img className="px-5 pb-5 MediaActivity" src={activity?.info_activity?.media[counter1].includes("http") ? "/events/0.jpg" : "/events/" + activity?.info_activity?.media[counter1]}></img>
                        </div>
                        <button className="buttonStyle rounded-circle mx-3" onClick={(e) => handleClickMore1(counter1)}><i className="fa-solid fa-arrow-right"></i></button>
                    </div>
                </div>
                <div className="d-flex overflow-auto gap-3 p-3 scroll-horizontal scroll3 d-block d-lg-none">
                    {activity?.info_activity?.media.map((item, i) => <img className="MediaActivity" key={i} src={item.includes("http") ? "/events/0.jpg" : "/events/" + item}></img>)}
                </div>

                <h3 className="px-5 pt-5">Comentarios</h3>

                {store.activity?.reviews.map((item)=><CommentBox />)}

            </div>

            <div className="container2Activity rounded-end">
                <div className="d-flex align-items-center mt-3 mx-3">

                    <p className="my-auto"><span className="font3 fw-semibold rounded">Actividad {returnType()}</span></p>
                        {!store.user?.inscriptions?.map((item) => item.activity_id).includes(store.activity.id) ?
                            (store.user.id != null ?
                                <button type="button" className="ms-auto btn BuyButton align-self-center fw-semibold d-flex" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@getbootstrap">
                                    Inscribirse <img src="/media/shopping-cart.svg" width="22px" height="22px" alt="" />
                                </button>
                                :
                                <button type="button" onClick={() => navigate("/signup")} className="ms-auto btn FavButton align-self-center">
                                    <img src="/media/shopping-cart.svg" width="22px" height="22px" alt="" />
                                </button>)
                            : ""
                        }
                </div>
                <div className="d-flex mx-3">
                    <p className="mt-3 font2 p-1 rounded">Publicado</p>
                    <p className="mt-3 font2 ms-auto p-1 rounded">{parseFullDate(store?.activity?.creation_date)}</p>
                </div>
                <div className="mt-3 mx-3 p-1 d-flex">
                    <div className="proActivityPhoto">
                        <img className="imgProfessionalAct rounded-circle" src={"/public/avatar/" + store?.activity?.info_activity?.professional?.user?.avatar_url}></img>
                    </div>
                    <div className="proActivityName d-flex">
                        <p className="mt-3"><span className="font2 mx-3 p-1 rounded">{store?.activity?.info_activity?.professional?.user?.name} {store?.activity?.info_activity?.professional?.user?.surname}</span></p>
                        <p className="mt-3"><span className="font2 p-1 rounded">{store?.activity?.info_activity?.professional?.rating?.toFixed(2)}</span></p>
                    </div>
                </div>
                <div className="d-flex">
                    <p className="mt-3"><span className="font2 mx-3 p-1 rounded">Fecha inicio</span></p>
                    <p className="mt-3"><span className="font2 p-1 rounded">{parseDate(store?.activity?.start_date)}</span></p>
                    <p className="mt-3"><span className="font2 mx-3 p-1 rounded">{parseTime(store?.activity?.start_date)}</span></p>
                </div>
                <div className="d-flex">
                    <p className="mt-3"><span className="font2 mx-3 p-1 rounded">Fecha fin</span></p>
                    <p className="mt-3"><span className="font2 p-1 rounded">{parseDate(store?.activity?.end_date)}</span></p>
                    <p className="mt-3"><span className="font2 mx-3 p-1 rounded">{parseTime(store?.activity?.end_date)}</span></p>
                </div>

                <div className="d-flex">
                    <p className="mt-3"><span className="font2 mx-3 p-1 rounded">Precio </span></p>
                    <p className="mt-3"><span className="font2 p-1 rounded">{store?.activity?.price}€</span></p>
                </div>
                <div className="d-flex">
                    <p className="mt-3"><span className="font2 mx-3 p-1 rounded">Plazas </span></p>
                    <p className="mt-3"><span className="font2 p-1 rounded">{store?.activity?.slots}</span></p>
                </div>
                <p className="font2 mx-3 p-1 mt-3 rounded text-center">Location meeting</p>
                <div className="containerMap mt-3 mx-3">
                    <iframe className="theMap rounded"
                        width="100%"
                        height="100%"
                        frameBorder="0" style={{ border: 0 }}
                        referrerPolicy="no-referrer-when-downgrade"
                        src={"https://www.google.com/maps/embed/v1/place?key=" + GOOGLE_MAPS_API + "&q=" + store?.activity?.meeting_point}
                        allowFullScreen>
                    </iframe>

                </div>
                <p className="font2 mx-3 p-1 mt-3 rounded text-center">{store?.activity?.meeting_point}</p>

                <div className="mt-5 px-3 mb-5">
                    <p className="text-white fw-semibold">Reseñas del profesional:</p>
                    <CommentBox />

                </div>

            </div>

        </div>
    )
}