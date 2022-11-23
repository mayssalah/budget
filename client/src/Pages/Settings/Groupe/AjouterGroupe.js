import React, { useEffect, useCallback } from "react";
import NotificationAlert from "react-notification-alert";
import Select from "react-select";

// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import {groupeAdded, getGroupe } from "../../../Redux/groupeReduce";
import { fetchAnnee } from "../../../Redux/anneeReduce";
import { useDispatch } from "react-redux";
import { verification } from "../../../Redux/usersReduce";

function AjouterGroupe() {  
  var annee =localStorage.getItem("annee");
  const dispatch = useDispatch();
  const location = useParams();
  const navigate = useNavigate();
  if (isNaN(location.id) === true) document.title = "Ajouter groupe";
  else document.title = "Modifier le groupe";

  const [nom, setNom] = React.useState();
  const [ordre, setOrdre] = React.useState(0);
  const [typeS, setTypeS] = React.useState(
     {
        value: "",
        label: "Type",
        isDisabled: true,
     });
  const [option,setOption] = React.useState([
    {
      value: "",
      label: "Type",
      isDisabled: true,
    }, 
     {
      value: 0,
      label: "Groupe budget"
    }, 
    {
     value: 1,
     label: "Gross sales"
   },
   {
    value: 2,
    label: "Théme"
  },
  ]);
  //annee
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

  const [revenu, setRevenu] = React.useState(0);
  const [include, setInclude] = React.useState(0);
  const [id, setId] = React.useState(0);
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
  function submitForm() {
    if(nom && ordre > 0)
    { dispatch(groupeAdded({ nom:nom, id:id,revenu:revenu,annee:anneeSelect.value ,type:typeS.value,include:include,ordre:ordre}));
        if (isNaN(location.id) === true) {
          notify("tr", "Insertion avec succes", "success");
        } else {
          notify("tr", "Modifier avec succes", "success");
        }
   }else{ notify("tr", "Vérifier vos données", "danger");}
  }

  //verif token
  const verifToken = useCallback(async () => {
    var response = await dispatch(verification());
    if (response.payload === false) {
      localStorage.clear();
      window.location.replace("/login");
    }
  }, [dispatch]);

  const getAnnee = useCallback(async () => {
    var ann = await dispatch(fetchAnnee());
    var entities = ann.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.annee, label: e.annee });
    });
    setOptionAnnee(arrayOption);
  }, [dispatch])


  useEffect(() => {
    async function getGroupee() {
      if (isNaN(location.id) === false) {
        var groupe = await dispatch(getGroupe(location.id));
        var entities = groupe.payload;
        if (entities === false) {
          navigate("/listGroupe");
        } else {
        
          setNom(entities.nom);
          setOrdre(entities.ordre);
          setRevenu(entities.revenu);
          setInclude(entities.include);
          setId(location.id);
          setTypeS({value:entities.type,label:entities.type===0?'Groupe Budget':entities.type==1?'Gross sales':"Théme"});
          setAnneeSelect({ value: entities.annee, label: entities.annee })
        }
      }
    }
    verifToken();
    getGroupee();    
    getAnnee();
  }, [location.id, dispatch, navigate, verifToken]);

  function listeGroupe() {
    navigate("/listGroupe");
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
                  onClick={listeGroupe}
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
                            ? "Ajouter Groupe budget"
                            : "Modifier Groupe budget"}
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                {typeS.value === 1?      <Row>
                  <Col className="pl-1 pull-right" md="12">   
                   <Form.Check className="pull-right">
                  <Form.Check.Label>
                    <Form.Check.Input
                     value='1'
                      type="checkbox"
                      defaultChecked={include===1?"checked=checked":""}                      
                      onClick={(value) => {
                        if (value.target.checked) {               
                          setInclude(1);        
                        } else {               
                          setInclude(0);      
                        }
                      }}
                    ></Form.Check.Input>
                    <span className="form-check-sign"></span>
                    <label>Include in sales</label>
                  </Form.Check.Label>
                </Form.Check>
                    </Col>
                    </Row>:""}      
          
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
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Revenu  </label>
                            <Form.Control
                              value={revenu}
                              placeholder="Revenu"
                              type="text"
                              onChange={(value) => {
                                setRevenu(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                       </Row>
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
                              }}
                              options={optionAnnee}
                            />
                          </Form.Group>
                        </Col>
                      <Col className="pr-1" md="4">
                          <Form.Group id="roleClass">
                            <label>Type  </label>
                            <Select
                              placeholder="Type"
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={typeS}
                              onChange={(value) => {
                                setTypeS(value);
                                if(value.value==1){setInclude(1);}
                              }}
                              options={option}
                            />
                          </Form.Group>
                     </Col>
                      </Row>
                      <Row>
                      <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Ordre*  </label>
                            <Form.Control
                              value={ordre}
                              placeholder="Ordre"
                              type="numbre"
                              onChange={(value) => {
                                setOrdre(value.target.value);
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

export default AjouterGroupe;
