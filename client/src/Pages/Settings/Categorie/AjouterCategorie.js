import React, { useEffect, useCallback } from "react";
import NotificationAlert from "react-notification-alert";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import {
  categorieAdded,
  categorieUpdated,
  categorieGetById,
  getActiveCategorie,
} from "../../../Redux/categorieReduce";

import { useDispatch } from "react-redux";
import { verification } from "../../../Redux/usersReduce";
import Select from "react-select";

function AjouterCategorie() {
  const dispatch = useDispatch();
  const location = useParams();
  const navigate = useNavigate();
  if (isNaN(location.id) === true) document.title = "Ajouter un categorie";
  else document.title = "Modifier le categorie";
  const [pourcent, setPourcent] = React.useState("");
  const [nom, setNom] = React.useState("");
  const [id, setId] = React.useState(0);

  const [optionsCategory, setOptionsCategory] = React.useState([
    {
      value: "",
      label: "Category",
      isDisabled: true,
    },
  ]);
  const [categorySelect, setCategorySelect] = React.useState({
    value: 0,
    label: "Category",
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
  
  const getCategory = useCallback(async (p) =>{  
    var cat = await dispatch(getActiveCategorie());  
    var entities = cat.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nom });
      if (e.id === p) {
        setCategorySelect({ value: e.id, label: e.nom });
      }
    });
    setOptionsCategory(arrayOption);
  }, [dispatch])
  function submitForm(event) {
    dispatch(categorieAdded({ nom, pourcent, id, categorySelect }));
    if (isNaN(location.id) === true) {
      notify("tr", "Insertion avec succes", "success");
    } else {
      notify("tr", "Modifier avec succes", "success");
    }
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
    async function getCategorie() {
      var cat =0;
      if (isNaN(location.id) === false) {
        var categorie = await dispatch(categorieGetById(location.id));
        var entities = categorie.payload;
        if (entities === false) {
          navigate("/categorieList");
        } else {
          setNom(entities.nom);
          setPourcent(entities.pourcent);
          setId(location.id);
          cat = entities.parent;
        }
      }
      getCategory(cat);
    }
    verifToken();
    getCategorie();
  }, [location.id, dispatch, navigate, verifToken,getCategory]);

  function listeCategorie() {
    navigate("/categorieList");
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
                  onClick={listeCategorie}
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
                            ? "Ajouter categorie"
                            : "Modifier categorie"}
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
                            <label>Pourcent * </label>
                            <Form.Control
                              defaultValue={pourcent}
                              placeholder="pourcent"
                              type="text"
                              onChange={(value) => {
                                setPourcent(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group id="roleClass">
                            <label>Category parent </label>
                            <Select
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={categorySelect}
                              onChange={(value) => {
                                setCategorySelect(value);
                              }}
                              options={optionsCategory}
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

export default AjouterCategorie;
