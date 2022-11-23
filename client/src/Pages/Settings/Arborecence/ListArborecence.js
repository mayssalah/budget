import ReactTable from "../../../components/ReactTable/ReactTable.js";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React,{useEffect,useCallback} from "react";
import { fetchArborecence,arborecencesChangeEtat } from "../../../Redux/arborecenceReduce";
import { useDispatch } from "react-redux";
import NotificationAlert from "react-notification-alert";
import { useNavigate } from "react-router-dom";
import { verification } from "../../../Redux/usersReduce";

// core components
function ListArborecence() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notificationAlertRef = React.useRef(null);
  const [entities, setEntities] = React.useState([]);
  /* const [verif, setVerif] = React.useState(false); */
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

  const getArborecence = useCallback(async () => {
    var response = await dispatch(fetchArborecence());
    setEntities(response.payload);
  }, [dispatch]);

  //verif token
  const verifToken = useCallback(async () => {
    var response = await dispatch(verification());
    if(response.payload === false){
      localStorage.clear();
      window.location.replace("/login");
    }
  }, [dispatch]);
  function changeEtat(id) {
    dispatch(arborecencesChangeEtat( id )).then(e=>{      
      getArborecence();
      switch(e){
        case 0: notify("tr", "Arborecence activer avec succes", "success");break; 
        case 1:notify("tr", "Arborecence désactiver avec succes", "success");break;
        default:break;
      }  
    })
  }
  function ajouter() {
    navigate('/ajouterArborecence');
  }
  
  useEffect(() => {
    verifToken();
    getArborecence();
  }, [getArborecence,verifToken])
  /* var { entities } = useSelector((state) => state.arborecences); */
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
              Ajouter un arborecence
            </Button>
          </Col>
          <Col md="12">
            <h4 className="title">Liste des arborecences</h4>
            <Card className="card-header">
              <Card.Body>
                <ReactTable
                  data={entities}
                  columns={[
                    {
                      Header: "Numéro",
                      accessor: "num",
                    },
                    {
                      Header: "Arborecences",
                      accessor: "description",
                    },
                    {
                      Header: "Sujets",
                      accessor: "sujets.sujet",
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
                              navigate("/arborecence/update/" + cell.row.values.id);
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

export default ListArborecence;
