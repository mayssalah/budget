import React, { useEffect,useCallback  } from "react";
import NotificationAlert from "react-notification-alert";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate} from "react-router-dom";
import { sujetAdded, sujetGetById } from "../../../Redux/sujetReduce";

import { useDispatch } from "react-redux";
import { verification } from "../../../Redux/usersReduce";
import { getActiveType } from "../../../Redux/typeReduce";
import Select from "react-select";

function AjouterSujet() {
  const dispatch = useDispatch();
  const location = useParams();
  const navigate = useNavigate();
  if (isNaN(location.id) === true) document.title = "Ajouter un sujet";
  else  document.title = "Modifier le sujet";
  const [num, setNum] = React.useState("");
  const [sujet, setSujet] = React.useState("");
  const [id, setId] = React.useState(0);
  
  const [optionType, setOptionType] = React.useState([
    {
      value: 0,
      label: "Type",
      isDisabled: true,
    },
  ]);
  const [typeSelect, setTypeSelect] = React.useState({
    value: 0,
    label: "Type",
  });

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
    var type = typeSelect.value;
    if (isNaN(location.id) === true) {
      dispatch(sujetAdded({ num,sujet, id,type }));
      notify("tr", "Insertion avec succes", "success");
    } else {
      dispatch(sujetAdded({ num,sujet, id,type }));
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
  
  const getType = useCallback(async (r) =>{
    var type = await dispatch(getActiveType(r));  
    var entities = type.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nom });
    });
    setOptionType(arrayOption);
  }, [dispatch])

  useEffect(() => {
    async function getSujet() {
      if (isNaN(location.id) === false) {
        var sujet = await dispatch(sujetGetById(location.id));
        var entities = sujet.payload;
        if(entities === false){
          navigate('/sujetListe');
        } 
        else {
          setNum(entities.num);
          setSujet(entities.sujet);
          setId(location.id);
          setTypeSelect({ value: entities.types.id, label: entities.types.nom })
        }
      }
    }
    verifToken();
    getSujet();
    getType();
  }, [location.id,dispatch,navigate,verifToken,getType]);

  function listeSujet() {
    navigate('/sujetListe');
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
                  onClick={listeSujet}
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
                            ? "Ajouter sujet"
                            : "Modifier sujet"}
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Num * </label>
                            <Form.Control
                              defaultValue={num}
                              placeholder="Num"
                              type="text"
                              onChange={(value) => {
                                setNum(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Sujet * </label>
                            <Form.Control
                              defaultValue={sujet}
                              placeholder="Sujet"
                              type="text"
                              onChange={(value) => {
                                setSujet(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group id="roleClass">
                            <label>Type* </label>
                            <Select
                              placeholder="Type"
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={typeSelect}
                              onChange={(value) => {
                                setTypeSelect(value);
                              }}
                              options={optionType}
                            />
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

export default AjouterSujet;
