import ReactTable from "../../../components/ReactTable/ReactTable.js";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React,{useEffect,useCallback} from "react";
import { getBudjetUser } from "../../../Redux/budgetReduce";
import { useDispatch } from "react-redux";
import NotificationAlert from "react-notification-alert";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { fetchUserSujet,getBudgetUsers } from "../../../Redux/userSujetReduce";
import { verification } from "../../../Redux/usersReduce";

// core components
function ListeBudget() {
  var token = localStorage.getItem("x-access-token");
  var anneeLocal =localStorage.getItem("annee");
  var decoded = jwt_decode(token);
  var id = decoded.id;
  var idRole = decoded.idRole;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notificationAlertRef = React.useRef(null);
  const [entities, setEntities] = React.useState([]);
  const [entitiesUser, setEntitiesUser] = React.useState([]);

  //get budget
  const getBudjet = useCallback(async () => {
    var response = null
    if(idRole === 1){
      response = await dispatch(fetchUserSujet({idPere:1,annee:anneeLocal}));
      setEntities(response.payload);
    } else {      
      response = await dispatch(getBudjetUser({id:id,idRole:idRole,annee:anneeLocal})); 
      setEntities(response.payload);
    }
  }, [dispatch,idRole,anneeLocal,id]);

  const getBudjetUserss = useCallback(async () => {
    var response = null
        
      response = await dispatch(getBudgetUsers({idUser:id,annee:anneeLocal})); 
      setEntitiesUser(response.payload);
   
  }, [dispatch,anneeLocal,id]);
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
    getBudjet();
    if(idRole !== 1 && idRole !== 6) {
      getBudjetUserss()
    }
  }, [getBudjet,verifToken])
  return (
    <>
      <Container fluid>
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div> 
        {idRole !== 1 && idRole !== 6? 
        <Row>
          <Col md="12">
            <h4 className="title">Suivi Budget</h4>
            <Card className="card-header">
              <Card.Body>
                  <ReactTable
                    data={entitiesUser}
                    columns={[
                      {
                        Header: "Titre",
                        accessor: "titre",
                      },
                      {
                        Header: "Année",
                        accessor: "annee",
                      },
                      {
                        Header: "Détail",
                        accessor: "id",
                        Cell: ({ cell }) => (
                          <div className="block_action">
                            <Button
                              id={"idLigneC_" + cell.row.values.id}
                              onClick={() => {                               
                                  navigate('/userBudget/'+cell.row.values.id);
                                
                              }}
                              className="btn btn-success ml-1"
                            >
                              Visualisation <i className="fa fa-eye" id={"idLigneD_" + cell.row.values.id} /> 
                            </Button>
                          </div>
                        ),
                      },
                    ]} 
                    className="-striped -highlight primary-pagination"
                  />
               
                {entitiesUser.length === 0 ? (
                  <div className="text-center">Aucun donnée trouvé</div>
                ) : ""}
              </Card.Body>
            </Card>
          </Col>
        </Row>:""}
       
        <Row>
          <Col md="12">
            <h4 className="title">Budget</h4>
            <Card className="card-header">
              <Card.Body>
                {idRole !==1?
                  <ReactTable
                    data={entities}
                    columns={[
                      {
                        Header: "Titre",
                        accessor: "user_sujets.titre",
                      },
                      {
                        Header: "Nom",
                        accessor: "users.nom_prenom",
                      },
                      {
                        Header: "Année",
                        accessor: "annee",
                      },
                      {
                        Header: "Détail",
                        accessor: "id",
                        Cell: ({ cell }) => (
                          <div className="block_action">
                            <Button
                              id={"idLigneC_" + cell.row.values.id}
                              onClick={() => {
                                if(idRole>5)
                                  navigate('/detailBudget/'+cell.row.values.id+"/"+cell.row.original.user_sujets.id+"/"+cell.row.original.id_equipe);
                                else 
                                  navigate('/budgetResponsable/'+cell.row.values.id+"/"+cell.row.original.user_sujets.id+"/"+cell.row.original.id_equipe+"/0");
                                
                              }}
                              className="btn btn-success ml-1"
                            >
                              Visualisation <i className="fa fa-eye" id={"idLigneD_" + cell.row.values.id} /> 
                            </Button>
                          </div>
                        ),
                      },
                      {
                        Header: "etat",
                        accessor: "etat",
                        Cell: ({ cell }) => (cell.row.values.etat === 0?"En cours":cell.row.values.etat === 1?"Vérification":cell.row.values.etat === 2?"Vérification Admin":"Confirmer"),
                      },
                    ]} 
                    className="-striped -highlight primary-pagination"
                  />
                :
                  <ReactTable
                    data={entities}
                    columns={[
                      {
                        Header: "Titre",
                        accessor: "titre",
                      },
                      {
                        Header: "Nom",
                        accessor: "users.nom_prenom",
                      },
                      {
                        Header: "Année",
                        accessor: "annee",
                      },
                      {
                        Header: "Détail",
                        accessor: "id",
                        Cell: ({ cell }) => (
                          <div className="block_action">
                          {(cell.row.values.etat > 0 && cell.row.values.etat < 3) ? (
                            <Button
                              id={"idLigneC_" + cell.row.values.id}
                              onClick={() => {
                                navigate("/budgetResponsable/" +cell.row.values.id +"/" +cell.row.original.id +"/0/0");
                              }}
                              className="btn btn-success ml-1"
                            >
                              Visualisation
                              <i
                                className="fa fa-eye"
                                id={"idLigneD_" + cell.row.values.id}
                              />
                            </Button>
                          ) : ""}
                          </div>
                        ),
                      },
                      {
                        Header: "etat",
                        accessor: "etat",
                        Cell: ({ cell }) => (cell.row.values.etat === 0?"En cours":cell.row.values.etat === 1?"Vérification":cell.row.values.etat === 2?"Confirmer":"En cours"),
                      },
                    ]} 
                    className="-striped -highlight primary-pagination"
                  />
                }
                
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

export default ListeBudget;
