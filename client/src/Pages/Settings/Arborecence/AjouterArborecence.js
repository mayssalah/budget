import React, { useEffect,useCallback } from "react";
import NotificationAlert from "react-notification-alert";
import Select from "react-select";
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams,useNavigate } from "react-router-dom";
import { arborecenceAdded, arborecenceGetById } from "../../../Redux/arborecenceReduce";
import { getActiveSujet } from "../../../Redux/sujetReduce";
import { useDispatch } from "react-redux";
import { verification } from "../../../Redux/usersReduce";
function AjouterArborecence() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useParams();
  //input
  const [id, setId] = React.useState(0);
  const [num, setNum] = React.useState("");
  const [description, setDescription] = React.useState("");
  const notificationAlertRef = React.useRef(null);

  const [option, setOption] = React.useState([
    {
      value: "",
      label: "Sujet",
      isDisabled: true,
    },
  ]);
  const [sujetSelect, setSujetSelect] = React.useState({
    value: 0,
    label: "Sujet",
  });

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
  async function submitForm(event) {
    if (isNaN(location.id) === true) {
      dispatch(arborecenceAdded({ num,description,sujetSelect, id }));
      notify("tr", "Insertion avec succes", "success");
    } else {
      dispatch(arborecenceAdded({ num,description,sujetSelect, id }));
      notify("tr", "Modifier avec succes", "success");
    }
  }
  
  const getSujet = useCallback(async (r) =>{
    var sujet = await dispatch(getActiveSujet(r));  
    var entities = sujet.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.sujet });
    });
    setOption(arrayOption);
  }, [dispatch])

  const verifToken = useCallback(async () => {
    var response = await dispatch(verification());
    if(response.payload === false){
      localStorage.clear();
      window.location.replace("/login");
    }
  }, [dispatch]);
  useEffect(() => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(async () => {
        if (isNaN(location.id) === false) {
          var arborecence = await dispatch(arborecenceGetById(location.id));
          var entities = arborecence.payload;
          setId(location.id);
          setDescription(entities.description)
          setNum(entities.num)
          setSujetSelect({ value: entities.sujets.id, label: entities.sujets.sujet })
          resolve(entities);
        } else {
          resolve(0);
        }
      }, 0);
    });

    promise.then(() => {
      verifToken();
      getSujet();
    });
   
  }, [location.id,dispatch,verifToken,getSujet]);

  function listeArborecence() {
    navigate('/arborecenceListe');
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
                  onClick={listeArborecence}
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
                            ? "Ajouter arborecences"
                            : "Modifier arborecence"}
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
                            <label>Description * </label>
                            <Form.Control
                              defaultValue={description}
                              placeholder="Sujet"
                              type="text"
                              onChange={(value) => {
                                setDescription(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group id="roleClass">
                            <label>Sujet* </label>
                            <Select
                              placeholder="Sujet"
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={sujetSelect}
                              onChange={(value) => {
                                setSujetSelect(value);
                              }}
                              options={option}
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

export default AjouterArborecence;
