import ReactTable from "../../../components/ReactTable/ReactTable.js";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React,{useEffect,useCallback} from "react";
import { fetchUserSujet,userSujetGetById,deleteBudget } from "../../../Redux/userSujetReduce";
import { getForcastUserSujet } from "../../../Redux/sellReduce";
import { useDispatch } from "react-redux";
import NotificationAlert from "react-notification-alert";
import { useNavigate } from "react-router-dom";
import { verification } from "../../../Redux/usersReduce";
import SweetAlert from "react-bootstrap-sweetalert";

// core components
function ListTache() {
  var anneeLocal =localStorage.getItem("annee");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notificationAlertRef = React.useRef(null);
  const notify = (place, msg, type) => {
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>{msg}</div>
        </div>
      ),
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };
  const [entities, setEntities] = React.useState([]);
  const [alert, setAlert] = React.useState(null);
  const getUserSujet = useCallback(async () => {
    var response = await dispatch(fetchUserSujet({idPere:1,annee:anneeLocal,etat:0}));
    setEntities(response.payload);
  }, [dispatch,anneeLocal]);
  const confirmMessage = useCallback(
    async (id) => {
      var det = await dispatch(userSujetGetById(id));
      var data = await det.payload.findLigne;
      setAlert(
        <SweetAlert
          style={{ display: "block", marginTop: "-100px" }}
          title={"Sujet"}
          onConfirm={() => hideAlert()}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          confirmBtnText="Oui"
          cancelBtnText="Non"
        >
          <ul>
            {data.map((e,k)=>{              
              return(<li key={"Sujet"+k}>{e.sujets.num} : {e.sujets.sujet}</li>)
            })}
          </ul>
        </SweetAlert>
      );
    },
    [dispatch]
  );
  const hideAlert = () => {
    setAlert(null);
  };
  function ajouter() {
    navigate('/ajouterTache');
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
    getUserSujet();
  }, [verifToken,getUserSujet])
  const deleteMessage = useCallback(
    async (id) => {
      setAlert(
        <SweetAlert
        showCancel
          style={{ display: "block", marginTop: "-100px" }}
          title="Étes vous sure de supprimer cette ligne?"
          onConfirm={() => deleteBudg(id)}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          confirmBtnText="Oui"
          cancelBtnText="Non"
        >
        </SweetAlert>
      );
    },
    [dispatch]
  );
  function deleteBudg(id) {    
    dispatch(deleteBudget(id)).then((e) => {
      if(e.payload===true){
        setTimeout(async () => {
        notify("tr", "Supprimer avec succes", "success");       
        getUserSujet();
        }, 200);
        hideAlert();
      }
      else {
        notify("tr", "Vérifier vos données", "danger");
      }
    });
    /* dispatch(getForcastUserSujet(id)).then((e) => {
      if(e.payload.data === null){
        dispatch(deleteBudget(id)).then((e) => {
          if(e.payload===true){
            notify("tr", "Supprimer avec succes", "success");
            getUserSujet();
            hideAlert();
          }
          else {
            notify("tr", "Vérifier vos données", "danger");
          }
        });
      } else {
        notify("tr", "Il faut supprimer forcast & actuel", "danger");
        hideAlert();
      }
    }); */

  }
  return (
    <>
      {alert}
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
              Ajouter une tache
            </Button>
          </Col>
          <Col md="12">
            <h4 className="title">Liste des taches</h4>
            <Card className="card-header">
              <Card.Body>
                <ReactTable
                  data={entities}
                  columns={[
                    {
                      Header: "titre",
                      accessor: "titre",
                    },
                    {
                      Header: "Utilisateur",
                      accessor: "users.nom_prenom",
                    },
                    {
                      Header: "Sujet",
                      accessor: "",
                      Cell: ({ cell }) => (
                        <div className="block_action">
                          <Button
                            id={"idLigneC_" + cell.row.values.id}
                            onClick={() => {
                              confirmMessage(cell.row.values.id)
                            }}
                            className="btn btn-info ml-1"
                          >                          
                            Détail <i className="fa fa-eye" id={"idLigneD_" + cell.row.values.id} /> 
                          </Button>
                        </div>
                      ),
                    },
                    {
                      Header: "actions",
                      accessor: "id",
                      Cell: ({ cell }) => (
                        <div className="actions-right block_action">
                          <Button
                            onClick={() => {
                              navigate("/tache/update/" + cell.row.values.id);
                            }}
                            variant="warning"
                            size="sm"
                            className="text-warning btn-link edit"
                          >
                            <i className="fa fa-edit" />
                          </Button>
                          <Button
                            onClick={() => {
                              deleteMessage(cell.row.values.id);
                            }}
                            variant="danger"
                            size="sm"
                            className="text-danger btn-link delete"
                          >
                            <i className="fa fa-trash"/>
                          </Button>
                        </div>
                      ),
                    },
                  ]} 
                  className="-striped -highlight primary-pagination"
                />
                {entities.length === 0 ? (
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

export default ListTache;
