import ReactTable from "../../../../components/ReactTable/ReactTable.js";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React,{useEffect,useCallback} from "react";
import { getBudjetByIdUser } from "../../../../Redux/budgetReduce";
import { useDispatch } from "react-redux";
import NotificationAlert from "react-notification-alert";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { verification } from "../../../../Redux/usersReduce";

// core components
function VerifierBudget() {
  var token = localStorage.getItem("x-access-token");
  var anneeLocal =localStorage.getItem("annee");
  var decoded = jwt_decode(token);
  var id = decoded.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notificationAlertRef = React.useRef(null);
  const [entities, setEntities] = React.useState([]);

  //get budget
  const getBudjet = useCallback(async () => {
    var response = await dispatch(getBudjetByIdUser({id:id,annee:anneeLocal})); 
    setEntities(response.payload);
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
  }, [getBudjet,verifToken])
  return (
    <>
      <Container fluid>
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
       
        <Row>
          <Col md="12">
            <h4 className="title">Budget</h4>
            <Card className="card-header">
              <Card.Body>
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
                              localStorage.setItem("redirect","/redigerBudget");
                              navigate('/detailBudget/'+cell.row.values.id+"/"+cell.row.original.user_sujets.id+"/"+cell.row.original.id_equipe);                          
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
                      Cell: ({ cell }) => (cell.row.values.etat === 0?"En cours":cell.row.values.etat === 1?"Vérification":cell.row.values.etat === 2?"Vérification admin":"Confirmer"),
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

export default VerifierBudget;
