import ReactTable from "../../../components/ReactTable/ReactTable.js";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import { fetchGroupe, ChangerEtat } from "../../../Redux/groupeReduce";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verification } from "../../../Redux/usersReduce";
import NotificationAlert from "react-notification-alert";

// core components
function ListGroupe() {
  document.title = "Liste des groupes budgets";
  var anneeLocal = localStorage.getItem("annee");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [entities, setEntities] = React.useState([]);
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
  const [alert, setAlert] = React.useState(null);
  const notificationAlertRef = React.useRef(null);
  function ajouter() {
    navigate("/ajouterGroupe");
  }

  const getGroupe = useCallback(
    async (titre) => {
      var annee = await dispatch(fetchGroupe(anneeLocal));
      setEntities(annee.payload);
    },
    [dispatch,anneeLocal]
  );

  //verif token
  const verifToken = useCallback(async () => {
    var response = await dispatch(verification());
    if (response.payload === false) {
      localStorage.clear();
      window.location.replace("/login");
    }
  }, [dispatch]);

  function changeEtatt(id,e) {
    dispatch(ChangerEtat( id )).then(e1=>{
      getGroupe();
      switch(e){
        case 0: notify("tr", "Groupe activer avec succes", "success");break; 
        case 1:notify("tr", "Groupe désactiver avec succes", "success");break;
        default:break;
      }  
    });         
  }

  useEffect(() => {
    verifToken();
    getGroupe();
  }, [getGroupe, verifToken]); //now shut up eslint
  
  

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
              Ajouter Groupe Budget
            </Button>
          </Col>
          <Col md="12">
            <h4 className="title">Liste des Groupes Budgets</h4>
            <Card>
              <Card.Body>
                <ReactTable
                  data={entities}
                  columns={[
                    {
                      Header: "nom",
                      accessor: "nom",
                    },
                    {
                      Header: "actions",
                      accessor: "id",
                      Cell: ({ cell }) => (
                        <div className="actions-right block_action">
                          <Button
                            onClick={() => {
                              navigate("/groupe/update/" + cell.row.values.id);
                            }}
                            variant="warning"
                            size="sm"
                            className="text-warning btn-link edit"
                          >
                            <i className="fa fa-edit" />
                          </Button>
                          <Button
                            id={"idLigne_" + cell.row.original.id}
                            onClick={(event) => {
                              changeEtatt(cell.row.values.id,cell.row.original.etat);
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

export default ListGroupe;
