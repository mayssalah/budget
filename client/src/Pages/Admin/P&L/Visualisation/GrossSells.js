import { Card, Container, Row, Col, Table, Button } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import { getSellFinal } from "../../../../Redux/sellReduce";
import { useDispatch } from "react-redux";
import { useNavigate,useParams } from "react-router-dom";
import { verification } from "../../../../Redux/usersReduce";

// core components
function GrossSells() {
  var annee = localStorage.getItem("annee");
  const dispatch = useDispatch();
  const location = useParams();
  const navigate = useNavigate();
  var id = location.id;
  const [entities, setEntities] = React.useState([]);
  const getSells = useCallback(async () => {
    var response = await dispatch(getSellFinal({ annee: annee,id:id }));
    setEntities(response.payload);
  }, [dispatch, annee, id]);

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
  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Button
              className="btn-wd btn-outline mr-1 float-left"
              type="button"
              variant="info"
              onClick={()=>{
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
        <Row>
          <Col md="12">
            <h4 className="title">Détail gros sells</h4>
            <Card className="card-header">
              <Card.Body>
                <Table className="w-full talbe-gross">
                  <thead>
                    <tr style={{ backgroundColor: "#31859b", color: "#000" }}>
                      <th style={{ color: "#fff", fontSize: "15px", fontWeight: "600" }}>Value / Units</th>
                      <th style={{ color: "#fff", fontSize: "15px", fontWeight: "600" }}>Budget</th>
                      <th style={{ color: "#fff", fontSize: "15px", fontWeight: "600" }}>Détail </th>
                    </tr>
                  </thead>
                  <tbody>
                    {entities.map((val, key) => {
                      return (
                        <tr key={"tr-" + key}>
                          <td
                            style={{
                              backgroundColor: val.background,
                              color: val.color,
                              fontSize: val.fontSize,
                              fontWeight: val.fontWeight,
                            }}
                          >
                            {val.titre}
                          </td>
                          <td
                            style={{
                              backgroundColor: val.background,
                              color: val.color,
                              fontSize: val.fontSize,
                              fontWeight: val.fontWeight,
                            }}
                          >
                            {val.total}
                          </td>
                          <td
                            style={{
                              backgroundColor: val.background,
                              color: val.color,
                              fontSize: val.fontSize,
                              fontWeight: val.fontWeight,
                            }}
                          >
                            {val.typeAffiche !== 0 ? (
                              <Button
                                type="button"
                                variant="success"
                                onClick={() => {
                                  localStorage.setItem("redirect","/grossSells/"+location.id);
                                  navigate("/detailSell/"+val.typeAffiche+"/"+val.pays);
                                }}
                              >
                                <span className="btn-label">
                                  <i className="fas fa-eye"></i>
                                </span>
                              </Button>
                            ) : ""}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default GrossSells;
