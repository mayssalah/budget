import React, { useEffect,useCallback } from "react";
import NotificationAlert from "react-notification-alert";
import validator from "validator";
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { produitAdded, produitGetById,produitDeleted } from "../../../Redux/produitReduce";
import { getActiveLigne } from "../../../Redux/ligneImsReduce";
import { getActiveMarche } from "../../../Redux/marcheImsReduce";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { useParams, useNavigate } from "react-router-dom";

function AjouterProduit() {
  const dispatch = useDispatch();
  const location = useParams();
  const navigate = useNavigate();
  //input
  const [designation, setDesignation] = React.useState("");
  const [code, setCode] = React.useState("");
  const [prix, setPrix] = React.useState("");
  const [desigims, setDesigims] = React.useState(0);
  const [ligne, setLigne] = React.useState(0);
  const [id, setId] = React.useState(0);
  const notificationAlertRef = React.useRef(null);
  
  //Marché
  const [optionsMarche, setOptionsMarche] = React.useState([
    {
      value: "",
      label: "Marché",
      isDisabled: true,
    },
  ]);
  const [marcheSelect, setMarcheSelect] = React.useState({
    value: 0,
    label: "Marché",
  });
  //Ligne
  const [optionsLigne, setOptionsLigne] = React.useState([
    {
      value: "",
      label: "Ligne",
      isDisabled: true,
    },
  ]);
  const [ligneSelect, setLigneSelect] = React.useState({
    value: 0,
    label: "Ligne",
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
  function submitForm(event) {
    
    var required = document.getElementsByClassName("required");
    for (var i = 0; i < required.length+1; i++) {  
      if(required[i] !== undefined){
        document.getElementsByClassName("error")[i].innerHTML="";  
        //condition required      
        if (validator.isEmpty(required[i].value)) {
          document.getElementsByClassName("error")[i].innerHTML=required[i].name+" est obligatoire";
          notify("tr", required[i].name + " doit être non vide", "danger");     
        }
      }
    }
    if(desigims === 0) {
      notify("tr", "Marché doit être non vide", "danger"); 
    }

    if(ligne === 0) {
      notify("tr", "Ligne doit être non vide", "danger"); 
    }
    if (
      !validator.isEmpty(designation) &&
      !validator.isEmpty(prix.toString()) &&
      (parseInt(desigims) > 0) &&
      (parseInt(ligne) > 0)
    ){
      var idProd = localStorage.getItem("idProd");
      if(idProd!==null){
        dispatch(produitDeleted( {id:idProd} ));
      }
      dispatch(produitAdded({ designation, code, prix, desigims, ligne, id })).then(e=>{
        if(e.payload ===true){
          if(isNaN(location.id) === true)
            notify("tr", "Insertion avec succes", "success")
          else  
            notify("tr", "Modifier avec succes", "success");
          setTimeout(async () => {
            listeProduit();
          }, 1500);
        } else {
          notify("tr", "Problème de connexion", "danger");          
        }
      });

    }
    
  }
  
  const getMarche = useCallback(async (p) =>{  
    var type = await dispatch(getActiveMarche());  
    var entities = type.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.lib });
      if (e.id === p) {
        setMarcheSelect({ value: e.id, label: e.lib });
      }
    });
    setOptionsMarche(arrayOption);
  }, [dispatch])
  
  const getLigne = useCallback(async (p) =>{  
    var type = await dispatch(getActiveLigne());  
    var entities = type.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nom });
      if (e.id === p) {
        setLigneSelect({ value: e.id, label: e.nom });
      }
    });
    setOptionsLigne(arrayOption);
  }, [dispatch])
  useEffect(() => {
    var nomProd = localStorage.getItem("nomProd");
    if(nomProd){
      setDesignation(nomProd);
    }
    const promise = new Promise((resolve,reject) => {
      setTimeout(async () => {
        if (isNaN(location.id) === false) {
          var produit = await dispatch(produitGetById(location.id));
          var entities = produit.payload;
          if(entities === false){
            navigate('/produitList');
          }
          else{
            setId(location.id);
            setPrix(entities.prix);
            setDesignation(entities.designation);
            setDesigims(entities.desigims);
            setLigne(entities.ligne);
            setCode(entities.code);
            resolve(entities);
          }
        } else {
          resolve(0);
        }
      }, 300);
    });

    promise.then((value) => {
      var desigims1 =0;
      var ligneims1 =0;
      var idProd =0;
      if(value){
        desigims1 = value.desigims
        ligneims1 = value.ligne
        idProd = value.parent
      }
      getMarche(desigims1);
      getLigne(ligneims1);
    });
  }, [dispatch,getLigne,getMarche,location.id,navigate]);

  function listeProduit() {
    navigate('/produitList');
    /* if(extracter===0)
      window.location.replace("/produitList");
    else
      window.location.replace("/produitListFour"); */
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
                  onClick={listeProduit}
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
                            ? "Ajouter produit"
                            : "Modifier produit"}
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Designation* </label>
                            <Form.Control
                              defaultValue={designation}
                              placeholder="Designation"
                              name="Designation"
                              className="required"
                              type="text"
                              onChange={(value) => {
                                setDesignation(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>Code </label>
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
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Prix* </label>
                            <Form.Control
                              defaultValue={prix}
                              placeholder="Prix"
                              name="Prix"
                              type="number"
                              className="required"
                              onChange={(value) => {
                                setPrix(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                          <div className="error"></div>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group id="roleClass">
                            <label>Ligne* </label>
                            <Select
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={ligneSelect}
                              onChange={(value) => {
                                setLigneSelect(value);
                                setLigne(value.value);
                              }}
                              options={optionsLigne}
                            />
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group id="roleClass">
                            <label>Marché* </label>
                            <Select
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={marcheSelect}
                              onChange={(value) => {
                                setMarcheSelect(value);
                                setDesigims(value.value);
                              }}
                              options={optionsMarche}
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

export default AjouterProduit;
