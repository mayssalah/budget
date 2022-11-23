import ReactTable from "../../../../components/ReactTable/ReactTable.js";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import NotificationAlert from "react-notification-alert";
import { verification } from "../../../../Redux/usersReduce";
import { getLigneThemeS } from "../../../../Redux/themeReduce";
import { useParams, useNavigate } from "react-router-dom";

// core components
function DetailThemeVisS() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  var anneeLocal = localStorage.getItem("annee");
  const location = useParams();
  const idSujet = location.idSujet;
  const notificationAlertRef = React.useRef(null);
  const [entities, setEntities] = React.useState([]);

  const getTheme = useCallback(async () => {
    var response = await dispatch(getLigneThemeS({ id: location.id,annee:anneeLocal,idSujet:idSujet}));
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
    getTheme();
  }, [verifToken, getTheme]);

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
                  navigate("/detailThemeVis/" + location.id);
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
                      Header: "Nom Budget",
                      accessor: "nom",
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
                      Header: "Détail",
                      accessor: "id",
                      Cell: ({ cell }) => (
                        <div className="block_action">
                          <Button
                            id={"idLigneC_" + cell.row.values.id}
                            onClick={() => {
                              navigate("/detailThemePL/" + cell.row.original.id+'/'+cell.row.original.id_budjet); 
                              localStorage.setItem("redirect","/detailThemeVisS/" + location.id+'/'+idSujet);
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

export default DetailThemeVisS;
