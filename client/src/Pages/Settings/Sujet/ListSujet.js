import ReactTable from "../../../components/ReactTable/ReactTable.js";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React,{useEffect,useCallback} from "react";
import { fetchSujet,sujetChangeEtat } from "../../../Redux/sujetReduce";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import NotificationAlert from "react-notification-alert";
import { verification } from "../../../Redux/usersReduce";

// core components
function ListSujet() {
  document.title = "Liste des sujets";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [entities, setEntities] = React.useState([]);
  const notificationAlertRef = React.useRef(null);
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
    navigate('/ajouterSujet');
  }

  const getSujet = useCallback(async (titre) => {
    var sujet = await dispatch(fetchSujet());
    setEntities(sujet.payload);
  }, [dispatch]);
  function changeEtat(id) {
    dispatch(sujetChangeEtat( id )).then(e=>{      
      getSujet();
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
    getSujet()
  }, [getSujet,verifToken]) //now shut up eslint
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
              Ajouter un sujet
            </Button>
          </Col>
          <Col md="12">
            <h4 className="title">Liste des sujets</h4>
            <Card>
              <Card.Body>
                <ReactTable
                  data={entities}
                  columns={[
                    {
                      Header: "Numéro",
                      accessor: "num",
                    },
                    {
                      Header: "type",
                      accessor: "types.nom",
                    },
                    {
                      Header: "Sujet",
                      accessor: "sujet",
                    },
                    {
                      Header: "Etat",
                      accessor: "etat",
                      Cell: ({ cell }) => (cell.row.values.etat === 1?"Activé":"Désactivé"),
                    },
                    {
                      Header: "actions",
                      accessor: "id",
                      Cell: ({ cell }) => (
                        <div className="actions-right block_action">
                          <Button
                            onClick={() => {
                              navigate("/sujet/update/" + cell.row.values.id);
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
                            className={cell.row.original.etat === 1?"text-success btn-link delete":"text-danger btn-link delete"}
                          >
                            <i className={cell.row.original.etat === 1?"fa fa-check":"fa fa-times"} id={"idLigne_" + cell.row.values.id}/>
                          </Button>
                        </div>
                      ),
                    },
                  ]}
                  className="-striped -highlight primary-pagination"
                />
                {entities.length === 0 ? (
                  <div className="text-center">Aucun donnée trouvé</div>
                ) : (
                  ""
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ListSujet;
