import React, { useEffect, useCallback } from "react";
import NotificationAlert from "react-notification-alert";
import Select from "react-select";
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { userSujetAdded, userSujetGetById } from "../../../Redux/userSujetReduce";
import { getSujetByType } from "../../../Redux/sujetReduce";
import { fetchAnnee } from "../../../Redux/anneeReduce";
import { getUserByType } from "../../../Redux/usersReduce";
import { getActiveType } from "../../../Redux/typeReduce";
import { useDispatch } from "react-redux";
import { verification } from "../../../Redux/usersReduce";
import { getActiveGroupe } from "../../../Redux/groupeReduce";
function AjouterTache() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useParams();
  //input
  const [id, setId] = React.useState(0);
  const [titre, setTitre] = React.useState("");
  const notificationAlertRef = React.useRef(null);

  const [optionSujet, setOptionSujet] = React.useState([
    {
      value: "",
      label: "Sujet",
      isDisabled: true,
    },
  ]);
  const [sujetSelect, setSujetSelect] = React.useState([]);

  const [optionGroupe, setOptionGroupe] = React.useState([
    {
      value: "",
      label: "Groupe budget",
      isDisabled: true,
    },
  ]);
  const [groupeSelect, setGroupeSelect] = React.useState({value: "",label: "Groupe budget",});

  //user
  const [optionUser, setOptionUser] = React.useState([
    {
      value: "",
      label: "Utilisateur",
      isDisabled: true,
    },
  ]);
  const [userSelect, setUserSelect] = React.useState({
    value: 0,
    label: "utilisateur",
  });

  //type
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

  //type
  const [optionAnnee, setOptionAnnee] = React.useState([
    {
      value: 0,
      label: "Annee",
      isDisabled: true,
    },
  ]);
  const [anneeSelect, setAnneeSelect] = React.useState({
    value: 0,
    label: "Annee",
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
    if (userSelect.value !== 0 && sujetSelect.length > 0 && groupeSelect.value !== "" && titre !== "" && anneeSelect.value !== 0) {
      dispatch(
        userSujetAdded({
          titre: titre,
          arraySujet: sujetSelect,
          id_user: userSelect.value,
          annee: anneeSelect.value,
          id: id,
          groupe: groupeSelect.value
        })
      );
      if (isNaN(location.id) === true) {
        setTimeout(async () => {
          navigate('/listTache');
        }, 1500);
        notify("tr", "Insertion avec succes", "success");
      } else {
        notify("tr", "Modifier avec succes", "success");
      }
    } else {
      notify("tr", "Vérifier vos données", "danger");

    }
  }

  const getGroupe = useCallback(async (annee) => {
    var groupe = await dispatch(getActiveGroupe({type:0,annee:annee}));
    var entities = groupe.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nom });
    });
    setOptionGroupe(arrayOption);
  }, [dispatch])

  const getUser = useCallback(async (idType) => {
    var user = await dispatch(getUserByType(idType));
    var entities = user.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nom_prenom });
    });
    setOptionUser(arrayOption);
  }, [dispatch])
  const getSujet = useCallback(async (idType) => {
    var sujet = await dispatch(getSujetByType(idType));
    var entities = sujet.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.sujets.id, label: e.sujets.sujet });
    });
    setOptionSujet(arrayOption);
  }, [dispatch])

  const getAnnee = useCallback(async () => {
    var ann = await dispatch(fetchAnnee());
    var entities = ann.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.annee, label: e.annee });
    });
    setOptionAnnee(arrayOption);
  }, [dispatch])

  //verif token
  const verifToken = useCallback(async () => {
    var response = await dispatch(verification());
    if (response.payload === false) {
      localStorage.clear();
      window.location.replace("/login");
    }
  }, [dispatch]);

  const getType = useCallback(async (r) => {
    var type = await dispatch(getActiveType(r));
    var entities = type.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nom });
    });
    setOptionType(arrayOption);
  }, [dispatch])
  useEffect(() => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(async () => {
        if (isNaN(location.id) === false) {
          var userSujet = await dispatch(userSujetGetById(location.id));
          var entities = userSujet.payload.userSujet;
          var ligne = userSujet.payload.ligne;
          setId(location.id);
          setTitre(entities.titre)
          setUserSelect({ value: entities.users.id, label: entities.users.nom_prenom })
          setAnneeSelect({ value: entities.annee, label: entities.annee })
          setSujetSelect(ligne); 
          setGroupeSelect({ value: entities.groupe_budgets.id, label: entities.groupe_budgets.nom });
          resolve(0);
        } else {
          resolve(0);
        }
      }, 0);
    });

    promise.then(() => {
      verifToken();
      getType();
      getAnnee();
    });

  }, [dispatch, location.id, getSujet, verifToken, getUser, getType, getAnnee, getGroupe]);

  function listeUserSujet() {
    navigate('/listTache');
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
                  onClick={listeUserSujet}
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
                            ? "Ajouter tache"
                            : "Modifier tache"}
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group id="roleClass">
                            <label>Annee* </label>
                            <Select
                              placeholder="Annee"
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={anneeSelect}
                              onChange={(value) => {
                                setAnneeSelect(value);
                                getGroupe(value.value);
                              }}
                              options={optionAnnee}
                            />
                          </Form.Group>
                        </Col>
                        {isNaN(location.id) === true ?
                          <Col className="pr-1" md="6">
                            <Form.Group id="roleClass">
                              <label>Groupe Budget * </label>
                              <Select
                                placeholder="Groupe Budget"
                                className="react-select primary"
                                classNamePrefix="react-select"
                                value={groupeSelect}
                                onChange={(value) => {
                                  setGroupeSelect(value);
                                }}
                                options={optionGroupe}
                              />
                            </Form.Group>
                          </Col>
                          : <Col className="pr-1" md="6">
                            <Form.Group id="roleClass">
                              <label>Groupe Budget :{groupeSelect.label} </label>
                            </Form.Group>
                          </Col>}

                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Titre * </label>
                            <Form.Control
                              defaultValue={titre}
                              placeholder="Titre"
                              type="text"
                              onChange={(value) => {
                                setTitre(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group id="roleClass">
                            <label>Type* </label>
                            <Select
                              placeholder="Type"
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={typeSelect}
                              onChange={(value) => {
                                setTypeSelect(value);
                                getUser(value.value);
                                getSujet(value.value);
                              }}
                              options={optionType}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group id="roleClass">
                            <label>Sujet* </label>
                            <Form.Check>
                              <Form.Check.Label>
                                <Form.Check.Input
                                  type="checkbox"
                                  onClick={(value) => {
                                    if (value.target.checked)
                                      setSujetSelect(optionSujet);
                                    else
                                      setSujetSelect([]);
                                  }}
                                ></Form.Check.Input>
                                <span className="form-check-sign"></span>
                                Sélectionner tous
                              </Form.Check.Label>
                            </Form.Check>
                            <Select
                              isMulti
                              placeholder="Sujet"
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={sujetSelect}
                              onChange={(value) => {
                                setSujetSelect(value);
                              }}
                              options={optionSujet}
                            />
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group id="roleClass">
                            <label>Utilisateur* </label>
                            <div><br></br></div>
                            <Select
                              placeholder="Utilisateur"
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={userSelect}
                              onChange={(value) => {
                                setUserSelect(value);
                              }}
                              options={optionUser}
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

export default AjouterTache;
