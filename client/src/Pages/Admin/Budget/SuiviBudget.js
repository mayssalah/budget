import ReactTable from "../../../components/ReactTable/ReactTable.js";
import { Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import NotificationAlert from "react-notification-alert";
import { verification } from "../../../Redux/usersReduce";

// core components
function SuiviBudget() {
  const dispatch = useDispatch();
  const notificationAlertRef = React.useRef(null);
  const [entities, setEntities] = React.useState([]);

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
  }, [verifToken]);
  return (
    <>
      <Container fluid>
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>

        <Row>
          <Col lg="4" md="6" sm="4">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="fas fa-chart-line"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Budget année 2023</p>
                      <Card.Title as="h4">0.000 TND</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="4" md="6" sm="4">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="fas fa-chart-line"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Budget restant 2023</p>
                      <Card.Title as="h4">0.000 TND</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="4" md="6" sm="4">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="fas fa-chart-line"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Total</p>
                      <Card.Title as="h4">0.000 TND</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <h4 className="title">Suivi des dépenses</h4>
            <Card className="card-header">
              <Card.Body>
                <ReactTable
                  data={entities}
                  columns={[
                    {
                      Header: "Direction",
                      accessor: "Direction",
                    },
                    {
                      Header: "Sujet",
                      accessor: "sujet",
                    },
                    {
                      Header: "Item",
                      accessor: "item",
                    },
                    {
                      Header: "Date de demande",
                      accessor: "date",
                    },
                    {
                      Header: "Date de payment",
                      accessor: "datePaymet",
                    },
                    {
                      Header: "Référence devis",
                      accessor: "devis",
                    },
                    {
                      Header: "Référence facture",
                      accessor: "numero",
                    },
                    {
                      Header: "etat",
                      accessor: "etat",
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

export default SuiviBudget;
