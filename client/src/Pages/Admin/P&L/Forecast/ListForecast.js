import ReactTable from "../../../../components/ReactTable/ReactTable.js";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import {
  getForcast,
  deleteForcast,
} from "../../../../Redux/sellReduce";
import { useDispatch } from "react-redux";
import NotificationAlert from "react-notification-alert";
import { useNavigate } from "react-router-dom";
import { verification } from "../../../../Redux/usersReduce";
import SweetAlert from "react-bootstrap-sweetalert";

// core components
function ListForecast() {
  var anneeLocal = localStorage.getItem("annee");
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
  
  const getSells = useCallback(async () => {
    var response = await dispatch(getForcast({ annee: anneeLocal }));
    setEntities(response.payload);
  }, [dispatch, anneeLocal]);

  const hideAlert = () => {
    setAlert(null);
  };
  function ajouter() {
    navigate("/ajouterForecast");
  }

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
    getSells();
  }, [verifToken, getSells]);
  const deleteMessage = useCallback(
    async (id) => {
      setAlert(
        <SweetAlert
          showCancel
          style={{ display: "block", marginTop: "-100px" }}
          title="Étes vous sure de supprimer cette ligne?"
          onConfirm={() => deleteSells(id)}
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
  function deleteSells(id) {
    dispatch(deleteForcast(id)).then((e) => {
      if (e.payload === true) {
        notify("tr", "Supprimer avec succes", "success");
        getSells();
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
              Ajouter Forecast & actual
            </Button>
          </Col>
          <Col md="12">
            <h4 className="title">Forecast & actual</h4>
            <Card className="card-header">
              <Card.Body>
                <ReactTable
                  data={entities}
                  columns={[
                    {
                      Header: "Titre",
                      accessor: "",
                      Cell: ({ cell }) => (
                        <div className="">
                          {cell.row.original.groupes?cell.row.original.groupes.titre:cell.row.original.themes?cell.row.original.themes.titre:cell.row.original.user_sujets.titre}
                        </div>
                      ),
                    },
                    {
                      Header: "type",
                      accessor: "etat",
                      Cell: ({ cell }) => (
                        <div className="">
                          {cell.row.original.user_sujets?"Budget":"Groupe"}
                        </div>
                      ),
                    },
                    {
                      Header: "forecast",
                      accessor: "forecast",
                      Cell: ({ cell }) => (
                        <div>
                          {Intl.NumberFormat("fr-FR", {
                            maximumSignificantDigits: 15,
                          }).format(cell.row.values.forecast)} TND
                        </div>
                      ),
                    },
                    {
                      Header: "actual",
                      accessor: "actual",
                      Cell: ({ cell }) => (
                        <div>
                          {Intl.NumberFormat("fr-FR", {
                            maximumSignificantDigits: 15,
                          }).format(cell.row.values.actual)} TND
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
                              navigate("/forcast/update/" + cell.row.values.id);
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

export default ListForecast;
