import { BrowserRouter, Route, Routes, Navigate  } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/style.css";
import "./assets/css/responsive.css";
import "./assets/scss/style.scss?v=2.0.0";
import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom";
import store from "./store";
import Sidebar from "./components/Sidebar/Sidebar.js";
import AdminNavbar from "./components/Navbars/AdminNavbar.js";
import LoginPage from "./Pages/Settings/User/LoginPage.js";
import AdminFooter from "./components/Footers/AdminFooter.js";
import { getSettings } from "./Redux/settingsReduce";
import { getRootByRole } from "./Redux/rootBaseReduce";
import RootBase from "./RootBase";
import jwt from "jsonwebtoken";

var token = "";
var loginStorage = null;
var idrole = null;
var hrefURL = window.location.pathname;
token = localStorage.getItem("x-access-token");

try {
  store.dispatch(getSettings(1));
} catch (error) {
  console.log("settings",error);  
}

if(token !== null){
  /* console.log(jwt_decode(token)) */
    try {
      const decoded = jwt.verify(token, "mySecretKeyabs");
      loginStorage = decoded.nom;
      idrole = decoded.idRole;
    store.dispatch(getRootByRole(idrole));
    } catch (err) {
      localStorage.removeItem("x-access-token");
      console.log("eee",err)
    }
  /*  */
}
if(hrefURL==="/login"){
  document.title = "login";
}
/* document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});
document.onkeydown = function(e) {
  if(e.keyCode === 123) {
    e.preventDefault();
  }
  if(e.ctrlKey && e.shiftKey && e.keyCode === 'I'.charCodeAt(0)) {
    e.preventDefault();
  }
  if(e.ctrlKey && e.shiftKey && e.keyCode === 'C'.charCodeAt(0)) {
    e.preventDefault();
  }
  if(e.ctrlKey && e.shiftKey && e.keyCode === 'J'.charCodeAt(0)) {
    e.preventDefault();
  }
  if(e.ctrlKey && e.keyCode === 'S'.charCodeAt(0)) {
    e.preventDefault();
  }
  if(e.ctrlKey && e.keyCode === 'U'.charCodeAt(0)) {
    e.preventDefault();
  }
} */
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      {loginStorage !==null?
        <div className="wrapper">
          <Sidebar />
          <div className="main-panel">
            <AdminNavbar />
            <div className={"content display-"+hrefURL.replace('/', '')}>
              <RootBase idRole={idrole}/>
            </div>
            <AdminFooter />
            <div className="close-layer"
              onClick={() =>
                document.documentElement.classList.toggle("nav-open")
              }
            />
          </div>
        </div>
      :
      
      <div className="wrapper wrapper-full-page">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path='/*' element={<Navigate replace to="/login" />} />
        </Routes>
      </div> 
      }
        
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
