import ReactTable from "../../../../components/ReactTable/ReactTable.js";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import NotificationAlert from "react-notification-alert";
import { verification } from "../../../../Redux/usersReduce";
import { getLigneGroup } from "../../../../Redux/budgetReduce";
import { useParams, useNavigate } from "react-router-dom";

// core components
function DetailGroupe() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  var anneeLocal = localStorage.getItem("annee");
  const location = useParams();
  const notificationAlertRef = React.useRef(null);
  const [entities, setEntities] = React.useState([]);

  const getGroupe = useCallback(async () => {
    var response = await dispatch(getLigneGroup({ id: location.id }));
    setEntities(response.payload);
  }, [dispatch, anneeLocal]);

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
    getGroupe();
  }, [verifToken, getGroupe]);

  return (
    <>
      <Container fluid>
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Row>
          <Col md="12">
            <Button
              className="btn-wd btn-outline mr-1 float-left"
              type="button"
              variant="info"
              onClick={() => {
                navigate("/visualisation");
              }}
            >
              <span className="btn-label">
                <i className="fas fa-list"></i>
              </span>
              Retour à la liste
            </Button>
          </Col>
        </Row>
        <Card className="card-header">
          <Card.Body>
            <h4 className="title">Détail</h4>
            <Row>
              <Col md="12">
                <ReactTable
                  data={entities}
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
                      Header: "Budget final",
                      accessor: "total",
                      Cell: ({ cell }) => (
                        <div>
                          {Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(cell.row.values.total)} TND
                        </div>
                      ),
                    },
                    {
                      Header: "forecast",
                      accessor: "forecast",
                      Cell: ({ cell }) => (
                        <div>
                          {Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(cell.row.values.forecast)} TND
                        </div>
                      ),
                    },
                    {
                      Header: "Budget final forecast",
                      accessor: "final",
                      Cell: ({ cell }) => (
                        <div>
                        {cell.row.values.forecast > 0
                          ? Intl.NumberFormat("fr-FR", {
                              maximumSignificantDigits: 15,
                            }).format(
                              cell.row.values.total - cell.row.values.forecast
                            ) + " TND"
                          : "0 TND"}
                        </div>
                      ),
                    },
                    {
                      Header: "Budget final forecast %",
                      accessor: "finall",
                      Cell: ({ cell }) => (
                        <div>
                        {cell.row.values.forecast > 0
                          ? Intl.NumberFormat("fr-FR", {
                              maximumSignificantDigits: 6,
                            }).format(
                              ((cell.row.values.total - cell.row.values.forecast)/cell.row.values.forecast)*100
                            ) + " %"
                          : "0 %"}
                        </div>
                      ),
                    },
                    {
                      Header: "actual",
                      accessor: "actual",
                      Cell: ({ cell }) => (
                        <div>
                          {Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(cell.row.values.actual)} TND
                        </div>
                      ),
                    },
                    {
                      Header: "Forecast actual",
                      accessor: "forecasta",
                      Cell: ({ cell }) => (
                        <div>
                        {cell.row.values.actual > 0
                          ? Intl.NumberFormat("fr-FR", {
                              maximumSignificantDigits: 15,
                            }).format(
                              cell.row.values.forecast - cell.row.values.actual
                            ) + " TND"
                          : "0 TND"}
                        </div>
                      ),
                    },
                    {
                      Header: "Forecast actual %",
                      accessor: "forecasta1",
                      Cell: ({ cell }) => (
                        <div>
                        {cell.row.values.actual > 0
                          ? Intl.NumberFormat("fr-FR", {
                              maximumSignificantDigits: 6,
                            }).format(
                              ((cell.row.values.forecast - cell.row.values.actual)/cell.row.values.actual)*100
                            ) + " %"
                          : "0 %"}
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
                              navigate("/budgetResponsable/" + cell.row.original.id+"/" + cell.row.original.id + "/0/0");
                              localStorage.setItem("redirect","/detailVis/" + location.id);
                            }}
                            className="btn btn-success ml-1"
                          >                            
                            <i
                              className="fa fa-eye"
                              id={"idLigneD_" + cell.row.values.id}
                            />
                          </Button>
                        </div>
                      ),
                    },
                  ]}
                  className="-striped -highlight primary-pagination"
                />
              </Col>
            </Row>
            {entities.length === 0 ? (
              <div className="text-center">Aucun donnée trouvé</div>
            ) : ""}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default DetailGroupe;
