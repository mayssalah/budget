import React, { useEffect,useCallback } from "react";
import NotificationAlert from "react-notification-alert";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate} from "react-router-dom";
import { paysAdded, paysUpdated, paysGetById } from "../../../Redux/paysReduce";

import { useDispatch } from "react-redux";
import { verification } from "../../../Redux/usersReduce";

function AjouterPays() {
  const dispatch = useDispatch();
  const location = useParams();
  const navigate = useNavigate();
  if (isNaN(location.id) === true) document.title = "Ajouter un pays";
  else  document.title = "Modifier le pays";
  const [id, setId] = React.useState(0);
  const [alpha2, setAlpha2] = React.useState("");
  const [alpha3, setAlpha3] = React.useState("");
  const [nomEn, setNomEn] = React.useState("");
  const [nom, setNom] = React.useState("");
  const [code, setCode] = React.useState("");

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
  function submitForm(event) {
    dispatch(paysAdded({ code, nom, nomEn, alpha2, alpha3, id }));
    if (isNaN(location.id) === true) {
      notify("tr", "Insertion avec succes", "success");
    } else {
      notify("tr", "Modifier avec succes", "success");
    }
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
    async function getPays() {
      if (isNaN(location.id) === false) {
        var pays = await dispatch(paysGetById(location.id));
        var entities = pays.payload;
        if(entities === false){
          navigate('/paysList');
        } 
        else {
          setNom(entities.nom);
          setAlpha2(entities.alpha2);
          setAlpha3(entities.alpha3);
          setCode(entities.code);
          setNomEn(entities.nom_en);
          setId(location.id);
        }
      }
    }
    verifToken();
    getPays();
  }, [location.id,dispatch,navigate,verifToken]);

  function listePays() {
    navigate('/paysList');
  }
  return (
    <>
      <Container fluid>
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <div className="section-image">
          <Container>
            <Row>
              <Col md="12">
                <Button
                  id="saveBL"
                  className="btn-wd btn-outline mr-1 float-left"
                  type="button"
                  variant="info"
                  onClick={listePays}
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
                <Form action="" className="form" method="">
                  <Card>
                    <Card.Header>
                      <Card.Header>
                        <Card.Title as="h4">
                          {typeof location.id == "undefined"
                            ? "Ajouter pays"
                            : "Modifier pays"}
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Nom * </label>
                            <Form.Control
                              defaultValue={nom}
                              placeholder="Nom"
                              type="text"
                              onChange={(value) => {
                                setNom(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>Nom en anglais* </label>
                            <Form.Control
                              defaultValue={nomEn}
                              placeholder="Nom en anglais"
                              type="text"
                              onChange={(value) => {
                                setNomEn(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Alpha2 * </label>
                            <Form.Control
                              defaultValue={alpha2}
                              placeholder="Nom"
                              type="text"
                              onChange={(value) => {
                                setAlpha2(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>Alpha3 * </label>
                            <Form.Control
                              defaultValue={alpha3}
                              placeholder="Nom en anglais"
                              type="text"
                              onChange={(value) => {
                                setAlpha3(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Code * </label>
                            <Form.Control
                              defaultValue={code}
                              placeholder="Code"
                              type="text"
                              onChange={(value) => {
                                setCode(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Button
                        className="btn-fill pull-right"
                        type="button"
                        variant="info"
                        onClick={submitForm}
                      >
                        Enregistrer
                      </Button>
                      <div className="clearfix"></div>
                    </Card.Body>
                  </Card>
                </Form>
              </Col>
            </Row>
          </Container>
        </div>
      </Container>
    </>
  );
}

export default AjouterPays;
