import ReactTable from "../../../components/ReactTable/ReactTable.js";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import { fetchAnnee, deleteAnnee } from "../../../Redux/anneeReduce";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verification } from "../../../Redux/usersReduce";
import SweetAlert from "react-bootstrap-sweetalert";
import NotificationAlert from "react-notification-alert";

// core components
function ListAnnee() {
  document.title = "Liste des annees";
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
    navigate("/ajouterAnnee");
  }

  const getAnnee = useCallback(
    async (titre) => {
      var annee = await dispatch(fetchAnnee());
      setEntities(annee.payload);
    },
    [dispatch]
  );

  //verif token
  const verifToken = useCallback(async () => {
    var response = await dispatch(verification());
    if (response.payload === false) {
      localStorage.clear();
      window.location.replace("/login");
    }
  }, [dispatch]);
  useEffect(() => {
    verifToken();
    getAnnee();
  }, [getAnnee, verifToken]); //now shut up eslint
  const deleteMessage = useCallback(
    async (id) => {
      setAlert(
        <SweetAlert
          showCancel
          style={{ display: "block", marginTop: "-100px" }}
          title="Étes vous sure de supprimer cette ligne?"
          onConfirm={() => deleteAnnees(id)}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          confirmBtnText="Oui"
          cancelBtnText="Non"
        ></SweetAlert>
      );
    },
    [dispatch]
  );
  const hideAlert = () => {
    setAlert(null);
  };
  function deleteAnnees(id) {
    dispatch(deleteAnnee(id)).then((e) => {
      if (e.payload === true) {
        notify("tr", "Supprimer avec succes", "success");
        getAnnee();
        hideAlert();
      } else {
        notify("tr", "Vérifier vos données", "danger");
      }
    });
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
              Ajouter un annee
            </Button>
          </Col>
          <Col md="12">
            <h4 className="title">Liste des annees</h4>
            <Card>
              <Card.Body>
                <ReactTable
                  data={entities}
                  columns={[
                    {
                      Header: "annee",
                      accessor: "annee",
                    },
                    {
                      Header: "actions",
                      accessor: "id",
                      Cell: ({ cell }) => (
                        <div className="actions-right block_action">
                          <Button
                            onClick={() => {
                              navigate("/annee/update/" + cell.row.values.id);
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
                            <i className="fa fa-trash" />
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

export default ListAnnee;
