import React, { useEffect, useCallback } from "react";
import Select from "react-select";
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import {
  updateUserSujet,
  userSujetGetById,
  getSujetEquipe,
  updateEquipe,
} from "../../../Redux/userSujetReduce";
import { getEquipeActive } from "../../../Redux/usersReduce";
import { useDispatch } from "react-redux";
import jwt_decode from "jwt-decode";
import SweetAlert from "react-bootstrap-sweetalert";
import NotificationAlert from "react-notification-alert";
import { verification } from "../../../Redux/usersReduce";
function Partager() {
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  var idPere = decoded.id;
  var nom_prenom = decoded.nom;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [entities, setEntities] = React.useState([]);
  const [save, setSave] = React.useState(true);
  const [entitiesEquipe, setEntitiesEquipe] = React.useState([]);
  const location = useParams();
  var id = location.id;
  //input
  const notificationAlertRef = React.useRef(null);
  const [alert, setAlert] = React.useState(null);

  const [optionSujet, setOptionSujet] = React.useState([
    {
      value: "",
      label: "Sujet",
      isDisabled: true,
    },
  ]);
  const [optionSujetAll, setOptionSujetAll] = React.useState([]);
  const [sujetSelect, setSujetSelect] = React.useState([]);

  const [optionUser, setOptionUser] = React.useState([
    {
      value: "",
      label: "Sujet",
      isDisabled: true,
    },
  ]);
  const [userSelect, setUserSelect] = React.useState([]);

  function AjoutLigne() {
    if (save === false) {
      notify("tr", "Il faut enregistrer avant ajouter une ligne", "danger");
    } else {
      var list = [...entities];
      list[list.length] = {
        id_user: null,
        id_sujets: [],
      };
      setEntities(list);

      var listUser = [...userSelect];
      listUser[listUser.length] = [];
      setUserSelect(listUser);

      var listSujet = [...sujetSelect];
      listSujet[listSujet.length] = [];
      setSujetSelect(listSujet);
      setSave(false);
    }
  }
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
  async function submitForm() {
    var count = entities.length + entitiesEquipe.length;
    if (count !== 0) {
      var verif = true;
      entities.forEach((data) => {
        var test = Object.keys(data).length;
        if ((data.id_user === null || data.id_sujets.length === 0) && test > 0)
          verif = false;
      });
      if (!verif) {
        notify("tr", "Vérifier vos donnée", "danger");
      } else {
        dispatch(
          updateUserSujet({
            entities: entities[0],
            idPere: idPere,
            id: id,
          })
        ).then(() => {
          notify("tr", "Enregistrer avec succes", "success");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        });
      }
    } else notify("tr", "Il faut contient au moins une ligne", "warning");
  }

  const getUser = useCallback(async () => {
    var user = await dispatch(getEquipeActive(idPere));
    var entities = user.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.usersf.id, label: e.usersf.nom_prenom });
    });
    arrayOption.push({ value: idPere, label: nom_prenom });
    setOptionUser(arrayOption);
  }, [dispatch, idPere, nom_prenom]);

  const getSujet = useCallback(
    async (r) => {
      var arrayOptionEquipe = {};
      var showUser = await dispatch(getSujetEquipe(id));
      var res = showUser.payload;
      setEntitiesEquipe(res);
      res.forEach((e) => {
        var num = e.num.split(",");
        num.forEach((v) => {
          arrayOptionEquipe[v] = v;
        });
      });

      var sujet = await dispatch(userSujetGetById(id));
      var data = await sujet.payload.findLigne;
      var arrayOption = [];
      data.forEach((e) => {
        if (!arrayOptionEquipe[e.sujets.num])
          arrayOption.push({ value: e.sujets.id, label: e.sujets.sujet });
      });
      setOptionSujet(arrayOption);
      setOptionSujetAll(arrayOption);
    },
    [dispatch, id]
  );
  function deleteSujet(key, i) {
    var list = [...entities];
    var listUser = [...userSelect];
    var listSujet = [...sujetSelect];
    var listEquipe = [...entitiesEquipe];
    if (i === 0) {
      setSave(true);
      list.splice(parseInt(key), 1);
      setEntities(list);
      if (listUser.length !== 0) {
        listUser.splice(parseInt(key), 1);
        setUserSelect(listUser);
      }
      if (listSujet.length !== 0) {
        listSujet.splice(parseInt(key), 1);
        compare(listSujet);
        setSujetSelect(listSujet);
      }
      notify("tr", "Supprimer avec succes", "success");
    } else {
      listEquipe.splice(parseInt(key), 1);
      setEntitiesEquipe(listEquipe);
      dispatch(updateEquipe({ i, id })).then((e) => {
        setSave(true);
        notify("tr", "Supprimer avec succes", "success");
        getSujet();
      });
    }
    hideAlert();
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
    getSujet();
    getUser();
  }, [verifToken, getSujet, getUser]);

  function listeUserSujet() {
    navigate("/sousTache");
  }
  const confirmRemove = (key, i) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Étes vous sure de supprimer cette ligne?"
        onConfirm={() => deleteSujet(key, i)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      ></SweetAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };
  function compare(array) {
    var result = optionSujetAll.filter(
      ({ value: id1 }) => !array.some(({ value: id2 }) => id2 === id1)
    );
    setOptionSujet(result);
  }
  const pop_up = useCallback(
    async (list) => {
      var data = list.split(",")
      setAlert(
        <SweetAlert
          style={{ display: "block", marginTop: "-100px" }}
          title={"Sujet"}
          onConfirm={() => hideAlert()}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          confirmBtnText="Oui"
          cancelBtnText="Non"
        >
          <ul>
            {data.map((e,k)=>{              
              return(<li key={"Sujet"+k}>{e}</li>)
            })}
          </ul>
        </SweetAlert>
      );
    },
    []
  );
  return (
    <>
      <Container fluid>
        {alert}
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
                          Partager
                          <Button
                            className="btn-fill pull-right btn-question"
                            type="button"
                            variant="success"
                            name="redac"
                            onClick={() => AjoutLigne()}
                          >
                            <i className="fa fa-plus mr-2"></i>Ajouter
                            utilisateur
                          </Button>
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <br></br>
                      <br></br>
                      {entitiesEquipe.map((val, key) => {
                        return (
                          <div key={"row-" + key}>
                            <Row>
                              <Col md="2">
                                <Button
                                  onClick={() => {
                                    pop_up(val.sujet)
                                  }}
                                  className="btn btn-info ml-1"
                                >                          
                                  Détail sujets
                                </Button>
                              </Col>
                              <Col md="5">
                                Utilisateur : {val.users.nom_prenom}
                              </Col>
                              <Col md="1">
                                <Button
                                  className="btn-fill"
                                  type="button"
                                  variant="danger"
                                  name="redac"
                                  onClick={() =>
                                    confirmRemove(key, val.users.id)
                                  }
                                >
                                  <i className="fa fa-trash"></i>
                                </Button>
                              </Col>
                            </Row>
                            <br></br>
                            <hr></hr>
                            <br></br>
                          </div>
                        );
                      })}

                      {entities.map((val, key) => {
                        return (
                          <div key={"ligne-" + key}>
                            <Row>
                              <Col className="pr-1" md="5">
                                <Form.Group id="roleClass">
                                  <label>Utilisateur* </label>
                                  <div>
                                    <br></br>
                                  </div>
                                  <Select
                                    placeholder="Utilisateur"
                                    className="react-select primary"
                                    classNamePrefix="react-select"
                                    value={userSelect[key]}
                                    onChange={(value) => {
                                      var e = [...entities];
                                      var select = [...userSelect];
                                      e[key].id_user = value.value;
                                      select[key] = value;
                                      setUserSelect(select);
                                      setEntities(e);
                                    }}
                                    options={optionUser}
                                  />
                                </Form.Group>
                              </Col>
                              <Col className="pl-1" md="5">
                                <Form.Group id="roleClass">
                                  <label>Sujet* </label>
                                  <Form.Check>
                                    <Form.Check.Label>
                                      <Form.Check.Input
                                        type="checkbox"
                                        onClick={(value) => {
                                          var e = [...entities];
                                          var select = [...sujetSelect];
                                          var array = [];

                                          if (value.target.checked) {
                                            optionSujet.forEach((e1) => {
                                              array.push(e1.value);
                                            });
                                            e[key].id_sujets = array;
                                            select[key] = optionSujet;
                                            setSujetSelect(select);
                                            setEntities(e);
                                           /*  select.forEach(function (value) {
                                              value.forEach((val) => {
                                                array.push(val);
                                              });
                                            });
                                            compare(array); */
                                          } else {
                                            e[key].id_sujets = [];
                                            select[key] = [];
                                            setSujetSelect(select);
                                            setEntities(e);
                                            //compare([]);
                                          }
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
                                    value={sujetSelect[key]}
                                    onChange={(value) => {
                                      var e = [...entities];
                                      var select = [...sujetSelect];
                                      var array = [];
                                      value.forEach((e) => {
                                        array.push(e.value);
                                      });
                                      e[key].id_sujets = array;
                                      select[key] = value;
                                      setSujetSelect(select);
                                      setEntities(e);
                                      /* array = [];
                                      select.forEach(function (value) {
                                        value.forEach((val) => {
                                          array.push(val);
                                        });
                                      });
                                      compare(array); */
                                    }}
                                    options={optionSujet}
                                  />
                                </Form.Group>
                              </Col>
                              <Col className="pl-1" md="2">
                                <br></br>
                                <br></br>
                                <Button
                                  className="btn-fill"
                                  type="button"
                                  variant="danger"
                                  name="redac"
                                  onClick={() => confirmRemove(key, 0)}
                                >
                                  <i className="fa fa-trash"></i>
                                </Button>
                                <Button
                                  className="btn-fill pull-right"
                                  type="button"
                                  variant="info"
                                  onClick={() => {
                                    submitForm();
                                  }}
                                >
                                  <i className="fa fa-save"></i>
                                </Button>
                              </Col>
                            </Row>{" "}
                            <br></br>
                            <hr></hr>
                            <br></br>{" "}
                          </div>
                        );
                      })}
                      <br></br>
                      <br></br>
                      <br></br>
                      {/* <Button
                        className="btn-fill pull-right"
                        type="button"
                        variant="info"
                        onClick={()=>{
                          submitForm()
                        }}
                      >
                        Enregistrer
                      </Button> */}
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

export default Partager;
