import React from "react";

export const Contacto = () => {
    return (
        <>
            <div className="container p-lg-2 p-4">
                <div className="row mb-5 mt-5">
                    <div className="col-sm-12 col-md-6 col-lg-6 p-0">
                        <img src="./src/front/assets/img/contacto.png" className="img-fluid img-contactanos" alt="" />
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6 bg-contacto">
                        <h3 className="p-4 fw-bold">Nos encanta escucharte.
                            <br/>¿Tienes dudas, ideas o simplemente quieres decir hola? ¡Contáctanos!</h3>
                        <form action="" className="px-4">
                            <div className="row">
                                <div className="col-sm-12 col-lg-10 mb-lg-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">Nombre completo</label>
                                    <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Ingresar nombre" />
                                </div>
                                <div className="col-sm-12 col-lg-10 mb-lg-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">E-mail</label>
                                    <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="mb-3 mt-2">
                                        <label htmlFor="exampleFormControlTextarea1" className="form-label">Example textarea</label>
                                        <textarea className="form-control no-resize" id="exampleFormControlTextarea1" rows="3"></textarea>
                                    </div>
                                </div>
                                <div className="col-12 text-lg-end text-center">
                                    <button className="btn btn-primary my-2 w-auto mx-auto fw-bold" >Enviar</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
