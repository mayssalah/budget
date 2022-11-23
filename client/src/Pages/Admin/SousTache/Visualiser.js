import ReactTable from "../../../components/ReactTable/ReactTable.js";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React,{useEffect,useCallback} from "react";
import { fetchUserSujet,userSujetGetById } from "../../../Redux/userSujetReduce";
import { useDispatch } from "react-redux";
import NotificationAlert from "react-notification-alert";
import { useNavigate } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import jwt_decode from "jwt-decode";
import { verification } from "../../../Redux/usersReduce";

// core components
function ListTache() {
  var token = localStorage.getItem("x-access-token");
  var annee = localStorage.getItem("annee");
  var decoded = jwt_decode(token);
  var idPere = decoded.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notificationAlertRef = React.useRef(null);
  const [entities, setEntities] = React.useState([]);
  const [alert, setAlert] = React.useState(null);
  const hideAlert = () => {
    setAlert(null);
  };
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
  const getUserSujet = useCallback(async () => {
    var response = await dispatch(fetchUserSujet({idPere:idPere,annee:annee,etat:0})); 
    setEntities(response.payload);
  }, [dispatch,annee,idPere]);
  
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
  return (
    <>
      {alert}
      <Container fluid>
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Row>
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
                      Header: "Partager",
                      accessor: "",
                      Cell: ({ cell }) => (
                        <div className="block_action">
                          <Button
                            id={"idLigneC_" + cell.row.values.id}
                            onClick={() => {
                              navigate('/partager/'+cell.row.values.id);
                            }}
                            className="btn btn-success ml-1"
                          >
                            déléguer la tache <i className="fa fa-plus" id={"idLigneD_" + cell.row.values.id} /> 
                          </Button>
                        </div>
                      ),
                    },
                    {
                      Header: "Détail",
                      accessor: "id",
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
