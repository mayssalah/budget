import React,{useCallback} from "react";
// react-bootstrap components
import { Button, Navbar, Nav, Container, Dropdown,Col } from "react-bootstrap";
import { getAllAnnee } from "../../Redux/userSujetReduce";
import { anneeAdded } from "../../Redux/anneeReduce";
import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { getNotification, updateNotif } from "../../Redux/notificationReduce";

function AdminNavbar() {
  var token = localStorage.getItem("x-access-token");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [annee, setAnnee] = React.useState();
  const [nb, setNb] = React.useState(0);
  const [notification, setNotification] = React.useState([]);
  const [optionsAnnee, setOptionsAnnee] = React.useState([
    {
      value: "",
      label: "Annee",
      isDisabled: true,
    },
  ]);
  var decoded = null;
  var nom = "";
  var idRole = null;
  var idUser = null;
  if (token != null) {
    decoded = jwt_decode(token); 
    if (typeof decoded.idRole != "undefined") {
      nom = decoded.nom
      idRole = decoded.idRole;
      idUser = decoded.id
    }
  } 
  const getAnnes = React.useCallback(async (anneeLocal) => {
    var year = await dispatch(getAllAnnee());
    var arrayOption = [];
    year.payload.forEach(element => {
      arrayOption.push({ value: element.annee, label: element.annee,selected:element.selected,id:element.id })
      if(element.selected === 1){setAnnee({ value: element.annee, label: element.annee })    
      localStorage.setItem("annee",element.annee);
    }
    });
   /*  if(!testA)
     { arrayOption.push({ value: date, label: date })
       if(parseInt(anneeLocal)=== date){setAnnee({ value: date, label: date })}
    } */
  
    setOptionsAnnee(arrayOption);
  }, [dispatch]);
  function LogOut(e) {
    e.preventDefault();
    localStorage.clear();
    window.location.replace("/login");
  }
  const changeEtat = useCallback(async (id,etat) => {
    dispatch(updateNotif({
      id:id,
      idUser:idUser
    })).then(e=>{
      switch(etat){
        case 1:window.location.replace("/sousTache");break;
        case 2:case 4:case 5: window.location.replace("/redigerBudget");break;
        case 3:case 6:case 7:case 8: window.location.replace("/verifierBudget");break;
        default:getNotif();break;
        /* case -1:getNotif();break;
        default:window.location.replace("/budget");break; */
      }
      /* switch(etat){
        case 1:case 3:navigate("/ValidationBl");break;
        case 2:navigate("/visualisationBl");break;
        case 4:navigate("/produitListFour");break;
        case 5:case 6:case 7:case 8:case 9:case 10:case 11:navigate("/listAction");break;
        default:break;
      }      
      getAction(); */
    });
    
  }, [dispatch,idUser,navigate]);
  const getNotif = useCallback(async () => {
    var res = await dispatch(getNotification());
    var notif = res.payload;
    var array = [];
    array.push(
      <Dropdown.Item
        className="enteteDropDown"
        href="#"
        key={"entet"+notif.length}
      >
        {notif.length} notification 
      </Dropdown.Item>
    );
    var arrayDiv=[];
    notif.forEach(element => {
      arrayDiv.push(
        <Dropdown.Item
          className={element.lu === 0 ? "nonlu" : ""}
          href="#"
          key={"notif"+element.id}
          onClick={()=>{changeEtat(element.id,element.etat)}}
        >
          {element.text}
        </Dropdown.Item>
      );
    });
    array.push(<div key="onScroll" className={arrayDiv.length>7?"onScroll":""}>{arrayDiv}</div>)
    if(notif.length===0){
      array.push(
        <Dropdown.Item
          href="#"
          key={0}
        >
         Aucun notification trouver
        </Dropdown.Item>
      );
    }
    array.push(
      <Dropdown.Item
        className="footerDropDown"
        href="#"
        key={"footer"+array.length}
        onClick={() => {
          changeEtat(0,-1)
        }}
      >
        Lire toutes les notifications
      </Dropdown.Item>
    );
    setNb(notif.length);
    setNotification(array);
  }, [dispatch,changeEtat]);
  React.useEffect(() => {
    getNotif()
    getAnnes();
  }, [getAnnes,getNotif]);
  function updateAnnee(value) {
    dispatch(anneeAdded({ annee:value.annee, id:value.id,selected:1 }));
    localStorage.setItem("annee",value.value)
    window.location.reload();
  }
  return (
    <>
      <Navbar expand="lg">
        <Container fluid>
          <div className="navbar-wrapper">
            <div className="navbar-minimize">
              <Button
                className="btn-fill btn-round btn-icon d-none d-lg-block bg-dark border-dark"
                variant="dark"
                onClick={() => document.body.classList.toggle("sidebar-mini")}
              >
                <i className="fas fa-ellipsis-v visible-on-sidebar-regular"></i>
                <i className="fas fa-bars visible-on-sidebar-mini"></i>
              </Button>
              <Button
                className="btn-fill btn-round btn-icon d-block d-lg-none bg-dark border-dark"
                variant="dark"
                onClick={() =>
                  document.documentElement.classList.toggle("nav-open")
                }
              >
                <i className="fas fa-list"></i>
                <i className="fas fa-bars visible-on-sidebar-mini"></i>
              </Button>
            </div>
            <Navbar.Brand
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            ></Navbar.Brand>
          </div>
          <Col md="3">
            <Select
              className="react-select primary"
              classNamePrefix="react-select"
              name="singleSelect"
              value={annee}
              onChange={(value) => {
                setAnnee(value);
                updateAnnee(value)
                /* localStorage.setItem("annee",value.value)
                window.location.reload(); */
              }}
              options={optionsAnnee}
              placeholder="Annee"
            />
          </Col>
          <Col md="7">
            <Dropdown as={Nav.Item} className="dropdown-profile">
              <Dropdown.Toggle
                as={Nav.Link}
                id="dropdown-41471887333"
                variant="default"
              >
                <span className="float-left">
                  <i className="nc-icon nc-single-02"></i>
                  <span className="hidden-header">{nom}</span>                
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu aria-labelledby="navbarDropdownMenuLink">
                <Dropdown.Item
                  href="#"
                  onClick={(e) => {
                    navigate("/profile");
                    /* window.location.replace("/profile") */
                  }}
                >
                  <i className="fas fa-user"></i>
                  profile
                </Dropdown.Item>
                {idRole===1?
                  <Dropdown.Item
                        href="#"
                        onClick={(e) => {
                          navigate("/settings");
                          /* window.location.replace("/settings") */
                        }}
                      >
                      <i className="fas fa-cog"></i>
                  Paramétre
                  </Dropdown.Item>
                :""} 
                <div className="divider"></div>
                <Dropdown.Item className="text-danger" href="#" onClick={LogOut}>
                  <i className="nc-icon nc-button-power"></i>
                  Déconnecter
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown as={Nav.Item} className="dropdown-notification">
              <Dropdown.Toggle
                as={Nav.Link}
                id="dropdown-1"
                variant="default"
              >
                <i className="fas fa-bell"></i>
                <span className="notification">{nb}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="noScroll">
                {notification}
                {/* <Notification data={data} /> */}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Container>
      </Navbar>
    </>
  );
}

export default AdminNavbar;
