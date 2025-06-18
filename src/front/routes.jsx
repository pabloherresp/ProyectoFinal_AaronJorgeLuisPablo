// Import necessary components and functions from react-router-dom.

import {
    createBrowserRouter,
    createRoutesFromElements,
	Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Activities } from "./pages/Activities";
import { SobreNosotros } from "./pages/SobreNosotros";
import {Login} from "./pages/Login"
import {Signup} from "./pages/Signup"
import {CompleteUserForm} from "./pages/CompleteUserForm"
import {PersonalSpace} from "./pages/PersonalSpace"
import {VisionMision} from "./pages/VisionMision"

export const router = createBrowserRouter(
    createRoutesFromElements(
      // Root Route: All navigation will start from here.
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
        <Route path= "/" element={<Home />} />
        <Route path= "/activities" element={<Activities />} />
        <Route path="/nosotros" element={<SobreNosotros/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/personalspace" element={<PersonalSpace />}/>
		    <Route path="/completeuserform/" element={<CompleteUserForm firstTime={true} />} />
		    <Route path="/edituser/" element={<CompleteUserForm firstTime={false} />} />
        <Route path="/misionyvision" element={<VisionMision/>} />
        <Route path="/personalspace" element={<PersonalSpace />}/>
      </Route>
    ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);