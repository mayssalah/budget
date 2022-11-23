import ReactTable from "../../../components/ReactTable/ReactTable.js";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React,{useEffect,useCallback} from "react";
import { fetchUsers,userChangeEtat, allEquipe,verification } from "../../../Redux/usersReduce";
import { useDispatch } from "react-redux";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import NotificationAlert from "react-notification-alert";

// core components
function ListUser() {
  const navigate = useNavigate();
  const notificationAlertRef = React.useRef(null); 
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  var idPere = decoded.id;
  var idRole = decoded.idRole;
  const dispatch = useDispatch();
  const [entities, setEntities] = React.useState([]);
  const [entitiesE, setEntitiesE] = React.useState([]);
  const notify = (place, msg, type) => {
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>
            {msg}
          </div>
        </div>
      ),
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };
  function ajouter() {
    navigate('/ajouterUtilisateur');
  }

  const getUser = useCallback(async () => {
    var response= null
    if(idRole === 1){
      response = await dispatch(fetchUsers());
      setEntities(response.payload);
    }
    else {
      response = await dispatch(allEquipe({idPere}));
      setEntitiesE(response.payload);
    }
  }, [dispatch,idPere,idRole]);
  function changeEtat(id) {
    dispatch(userChangeEtat( id )).then(e=>{
      getUser();
      switch(e){
        case 0: notify("tr", "Activer avec succes", "success");break; 
        case 1:notify("tr", "Désactiver avec succes", "success");break;
        default:break;
      } 
    });
  }
  

  //verif token
  const verifToken = useCallback(async () => {
    var response = await dispatch(verification());
    if(response.payload === false){
      localStorage.clear();
      window.location.replace("/login");
    }
  }, [dispatch]);

  useEffect(() => {
    verifToken();
    getUser();
  }, [getUser,verifToken])
  /* var { entities } = useSelector((state) => state.users); */
  return (
    <>
      <Container fluid>
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Row>
          <Col md="12">
            <Button
              id="saveBL"
              className="btn-wd btn-outline mr-1 float-left"
              type="button"
              variant="info"
              onClick={ajouter}
            >
              <span className="btn-label">
                <i className="fas fa-plus"></i>
              </span>
              Ajouter un {idRole === 1?"utilisateur":"Equipe"}
            </Button>
          </Col>
          <Col md="12">
            <h4 className="title">Liste des {idRole === 1?"utilisateurs":"Equipes"}</h4>
            <Card className="card-header">
              <Card.Body>
                {idRole === 1?
                  <ReactTable
                    data={entities}
                    columns={[
                      {
                        Header: "Nom et Prenom",
                        accessor: "nom_prenom",
                      },
                      {
                        Header: "Login",
                        accessor: "login",
                      },
                      {
                        Header: "e-mail",
                        accessor: "email",
                      },
                      {
                        Header: "téléphone",
                        accessor: "tel",
                      },
                      {
                        Header: "Etat",
                        accessor: "etat",
                        Cell: ({ cell }) => (cell.row.values.etat === 1?"Activé":"Désactivé"),
                      },
                      {
                        Header: "role",
                        accessor: "roles",
                        Cell: ({ cell }) => (cell.row.values.roles.nom),
                      },

                      {
                        Header: "actions",
                        accessor: "id",
                        Cell: ({ cell }) => (
                          <div className="actions-right block_action">
                            <Button
                              onClick={() => {
                                navigate("/utilisateur/update/" + cell.row.values.id)
                              }}
                              variant="warning"
                              size="sm"
                              className="text-warning btn-link edit"
                            >
                              <i className="fa fa-edit" />
                            </Button>
                            <Button
                              id={"idLigne_" + cell.row.values.id}
                              onClick={(event) => {
                                changeEtat(cell.row.values.id,cell.row.values.etat);
                              }}
                              variant="danger"
                              size="sm"
                              className={cell.row.values.etat === 1?"text-success btn-link delete":"text-danger btn-link delete"}
                            >
                              <i className={cell.row.values.etat === 1?"fa fa-check":"fa fa-times"} id={"idLigne_" + cell.row.values.id}/>
                            </Button>
                          </div>
                        ),
                      },
                    ]} 
                    className="-striped -highlight primary-pagination"
                  />:
                  <ReactTable
                  data={entitiesE}
                  columns={[
                    {
                      Header: "Nom et Prenom",
                      accessor: "usersf.nom_prenom",
                    },
                    {
                      Header: "Login",
                      accessor: "usersf.login",
                    },
                    {
                      Header: "e-mail",
                      accessor: "usersf.email",
                    },
                    {
                      Header: "téléphone",
                      accessor: "usersf.tel",
                    },
                    {
                      Header: "Vusialisation",
                      accessor: "type",                      
                      Cell: ({ cell }) => (cell.row.original.type === 1?"Tous":"Moi"),
                    },
                    {
                      Header: "Etat",
                      accessor: "usersf.etat",
                      Cell: ({ cell }) => (cell.row.original.usersf.etat === 1?"Activé":"Désactivé"),
                    },
                    {
                      Header: "role",
                      accessor: "usersf.roles",
                      Cell: ({ cell }) => (cell.row.original.usersf.roles.nom),
                    },

                    {
                      Header: "actions",
                      accessor: "usersf.id",
                      Cell: ({ cell }) => (
                        <div className="actions-right block_action">
                          <Button
                            onClick={() => {
                              navigate("/utilisateur/update/" + cell.row.original.usersf.id);
                            }}
                            variant="warning"
                            size="sm"
                            className="text-warning btn-link edit"
                          >
                            <i className="fa fa-edit" />
                          </Button>
                          <Button
                            id={"idLigne_" + cell.row.original.usersf.id}
                            onClick={(event) => {
                              changeEtat(cell.row.original.usersf.id,cell.row.original.usersf.etat);
                            }}
                            variant="danger"
                            size="sm"
                            className={cell.row.original.usersf.etat === 1?"text-success btn-link delete":"text-danger btn-link delete"}
                          >
                            <i className={cell.row.original.usersf.etat === 1?"fa fa-check":"fa fa-times"} id={"idLigne_" + cell.row.original.usersf.id}/>
                          </Button>
                        </div>
                      ),
                    },
                  ]} 
                  className="-striped -highlight primary-pagination"
                />}
                
                {(entities.length === 0 && idRole === 1) || (entitiesE.length === 0 && idRole !== 1) ? (
                  <div className="text-center">Aucun donnée trouvé</div>
                ) : ""}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ListUser;
