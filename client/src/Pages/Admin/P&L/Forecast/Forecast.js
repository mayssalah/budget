import React, { useEffect,useCallback } from "react";
import NotificationAlert from "react-notification-alert";
import Select from "react-select";
// react-bootstrap components
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { useParams,useNavigate } from "react-router-dom";
import { addForecast,getForcastDetails,getGroupes,Reduction } from "../../../../Redux/sellReduce";
import { verification } from "../../../../Redux/usersReduce";
import { getBudgetFinal } from "../../../../Redux/userSujetReduce";
import { getThemeBudget } from "../../../../Redux/themeReduce";
import { useDispatch } from "react-redux";

function Forecast() {
  var annee = localStorage.getItem("annee");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useParams();
  var idForc=location.id!= undefined?location.id:0;
  //input
  const [total, setTotal] = React.useState(0);
  const [type, setType] = React.useState(null);
  const [actual, setActual] = React.useState(0);
  const [revenu, setRevenu] = React.useState(0);
  const [include, setInclude] = React.useState(0);
  const [discount, setDiscount] = React.useState(0);
  const [forecast, setForecast] = React.useState(0);
  const [actualDis, setActualDis] = React.useState(0);
  const [forecastDis, setForecastDis] = React.useState(0);
  const [actualRev, setActualRev] = React.useState(0);
  const [forecastRev, setForecastRev] = React.useState(0);
  const notificationAlertRef = React.useRef(null);

  const [options, setOptions] = React.useState([
    {
      value: "",
      label: "Groupe",
      isDisabled: true,
    },
  ]);
  const [sell, setSell] = React.useState({
    value: 0,
    label: "Groupe",    
  });

  const [optionsBudget, setOptionsBudget] = React.useState([
    {
      value: "",
      label: "Budget",
      isDisabled: true,
    },
  ]);
  const [budget, setBudget] = React.useState({
    value: 0,
    label: "Budget",    
  });

  //Market
  const [optionsType] = React.useState([
    {
      value: "",
      label: "Type",
      isDisabled: true,
    },
    {
      value: 0,
      label: "Groupe",
    },
    {
      value: 1,
      label: "Budget",
    },
    {
      value: 2,
      label: "Theme",
    },
  ]);
  const [typeSelect, setTypeSelect] = React.useState({
    value: 0,
    label: "Groupe",
  });

  const [optionsTheme, setOptionsTheme] = React.useState([
    {
      value: "",
      label: "Theme",
      isDisabled: true,
    },
  ]);
  const [theme, setTheme] = React.useState({
    value: 0,
    label: "Theme",    
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
  async function submitForm() {
    if((typeSelect.value === 0 && sell.value !==0)||(typeSelect.value === 1 && budget.value !==0) || (typeSelect.value === 2 && theme.value !==0)) {
      var id_budjet = null;
      var id_groupe = null;
      var id_theme = null;
      if(typeSelect.value === 0) {
        id_groupe = sell.id_groupe;
        id_budjet = null;
        id_theme = null;
      } else if(typeSelect.value === 1){
        id_theme = null;
        id_groupe = null;
        id_budjet = budget.value;
      } else {
        id_theme = theme.value;
        id_groupe = null;
        id_budjet = null;
      }
      dispatch(addForecast({ forecast:forecast,actual:actual,id_groupe:id_groupe,id_budjet:id_budjet,id_theme:id_theme,forecastDis:forecastDis,forecastRev:forecastRev,actualDis:actualDis,actualRev:actualRev,id:idForc })).then((e) => {
        notify("tr", "Insertion avec succes", "success");
      });
    } else {
      notify("tr", "Vérifier vos données", "danger");
    }
  }

  const getDiscount = useCallback(async () =>{
    var resultat = await dispatch(Reduction(annee));  
    var res = await resultat.payload;
    setDiscount(res.reductiont);
  }, [dispatch,annee])
  
  const getForcast = useCallback(async (id) =>{
    var resultat = await dispatch(getForcastDetails(id));  
    var res = await resultat.payload;
    var ty=0;
    var label="";
    if(res.id_groupe!==null){
      setTotal(res.groupes.total)
      setType(res.groupes.type );
      ty=0;
      label="Groupe";
      setRevenu(res.groupes.revenu)
      setSell({ value: res.groupes.id, label: res.groupes.titre, id_groupe: res.groupes.id, id_sell:null,total:res.groupes.total,type:res.groupes.type ,revenu:res.groupes.revenu});}
    if(res.id_theme!==null){
       ty=2;
      label="Theme"
      setBudget({ value: res.themes.id, label: res.themes.titre ,total:res.themes.total,type:null})
      setTotal(res.themes.total)
    }   
    if(res.id_user_sujet!==null){ 
      ty=1;
      label="Budget"
      setBudget({ value: res.user_sujets.id, label: res.user_sujets.titre ,total:res.user_sujets.total,type:null})
       setTotal(res.user_sujets.total)
    }
   
    setTypeSelect({value:ty,label:label})
    setForecast(res.forecast)
    setActual(res.actual)
    setForecastDis(res.forecastdis!=null?res.forecastdis:0)
    setActualDis(res.actualdis!=null?res.actualdis:0)
    setForecastRev(res.forecastrev!=null?res.forecastrev:0)
    setActualRev(res.actualrev!=null?res.actualrev:0)
   // setDiscount(res.reductiont);
  }, [dispatch])

  const getGrosSell = useCallback(async () =>{
    var resultat = await dispatch(getGroupes({annee}));  
    var res = await resultat.payload;
    var arrayOption = [];
    res.forEach((e) => {
      if(e.id_user_sujet)
        arrayOption.push({ value: e.groupes.id, label: e.groupes.titre, id_groupe: e.groupes.id, id_sell:null,total:e.groupes.total,type:e.groupes.type ,revenu:e.groupes.revenu,include:e.groupes.include });
      else 
        arrayOption.push({ value: e.groupes.id, label: e.groupes.titre, id_groupe: e.groupes.id, id_sell:null,total:e.groupes.total,type:e.groupes.type,revenu:e.groupes.revenu,include:e.groupes.include });
    });
    setOptions(arrayOption);
  }, [dispatch,annee])
  
  const getTheme = useCallback(async () =>{
    var resultat = await dispatch(getThemeBudget({annee}));  
    var res = await resultat.payload;
    var arrayOption = [];
    res.forEach((e) => {
      arrayOption.push({ value: e.themes.id, label: e.themes.titre ,total:e.themes.total,type:null});
    });
    setOptionsTheme(arrayOption);
  }, [dispatch,annee])

  const getBudjet = useCallback(async () => {
    var resultat = await dispatch(getBudgetFinal({annee:annee})); 
    var res = await resultat.payload;
    var arrayOption = [];
    res.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.titre ,total:e.total,type:null});
    });
    setOptionsBudget(arrayOption);
  }, [dispatch,annee]);

  //verif token
  const verifToken = useCallback(async () => {
    var response = await dispatch(verification());
    if(response.payload === false){
      localStorage.clear();
      window.location.replace("/login");
    }
  }, [dispatch]);

  useEffect(() => {
    verifToken();
    getGrosSell();
    getBudjet();
    if(type===1)getDiscount();
    if(location.id!==undefined){getForcast(location.id)}
  }, [getGrosSell,verifToken,getBudjet,type,getDiscount,location.id]);
  function listeUserSujet() {
    navigate('/forecast');
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
                            ? "Ajouter Forecast"
                            : "Modifier Forecast"}
                        </Card.Title>
                      </Card.Header>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group id="roleClass">
                            <label>Type </label>
                            <Select
                              placeholder="Type"
                              className="react-select primary"
                              classNamePrefix="react-select"
                              value={typeSelect}
                              onChange={(value) => {
                                setTypeSelect(value);                                
                                setTotal(0);
                                if (value.value === 0) {
                                  setBudget({
                                    value: 0,
                                    label: "Budget",
                                  });
                                } else if (value.value === 1) {
                                  setSell({
                                    value: 0,
                                    label: "Gross sales",
                                  });
                                } else {
                                  getTheme();
                                }
                              }}
                              options={optionsType}
                            />
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group id="roleClass">
                            <label>
                              {typeSelect.value === 0
                                ? "Groupe*"
                                : typeSelect.value === 1
                                ? "Budget*"
                                : "Theme*"}{" "}
                            </label>
                            {typeSelect.value === 0 ? (
                              <Select
                                placeholder="Groupe"
                                className="react-select primary"
                                classNamePrefix="react-select"
                                value={sell}
                                onChange={(value) => {
                                  setSell(value);
                                  setInclude(value.include);
                                  setType(value.type);     
                                  setRevenu(value.revenu);                                  
                                  setTotal(value.total);
                                }}
                                options={options}
                              />
                            ) : typeSelect.value === 1 ? (
                              <Select
                                placeholder="Budget"
                                className="react-select primary"
                                classNamePrefix="react-select"
                                value={budget}
                                onChange={(value) => {
                                  setBudget(value);
                                  setTotal(value.total);
                                }}
                                options={optionsBudget}
                              />
                            ) : (
                              <Select
                                placeholder="Budget"
                                className="react-select primary"
                                classNamePrefix="react-select"
                                value={theme}
                                onChange={(value) => {
                                  setTheme(value);
                                  setTotal(value.total);
                                }}
                                options={optionsTheme}
                              />
                            )}
                          </Form.Group>
                        </Col>
                        
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Total* </label>
                            <Form.Control
                              value={total}
                              placeholder="Total"
                              disabled
                              type="text"
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Forecast* </label>
                            <Form.Control
                              value={forecast}
                              placeholder="Forecast"
                              type="text"
                              onChange={(value) => {
                                setForecast(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group id="roleClass">
                            <label>Actual* </label>
                            <Form.Control
                              value={actual}
                              placeholder="actual"
                              type="text"
                              onChange={(value) => {
                                setActual(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
              {(type===1 && include===1)?(
                <div>

                      <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>Total Discount* </label>
                            <Form.Control
                              value={discount}
                              placeholder="Total"
                              disabled
                              type="text"
                            ></Form.Control>
                          </Form.Group>
                        </Col><br clear="all"></br>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Forecast Discount* </label>
                            <Form.Control
                              value={forecastDis}
                              placeholder="Forecast Discount"
                              type="text"
                              onChange={(value) => {
                                setForecastDis(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group id="roleClass">
                            <label>Actual Discount* </label>
                            <Form.Control
                              value={actualDis}
                              placeholder="actual Discount"
                              type="text"
                              onChange={(value) => {
                                setActualDis(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Col className="pl-1" md="6">
                          <Form.Group>
                            <label>Total Revenu* </label>
                            <Form.Control
                              value={revenu}
                              placeholder="Total"
                              disabled
                              type="text"
                            ></Form.Control>
                          </Form.Group>
                        </Col><br clear="all"></br>
                      <Row>
                        <Col className="pr-1" md="6">
                          <Form.Group>
                            <label>Forecast Revenu* </label>
                            <Form.Control
                              value={forecastRev}
                              placeholder="Forecast Revenu"
                              type="text"
                              onChange={(value) => {
                                setForecastRev(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col className="pl-1" md="6">
                          <Form.Group id="roleClass">
                            <label>Actual Revenu* </label>
                            <Form.Control
                              value={actualRev}
                              placeholder="actual Revenu"
                              type="text"
                              onChange={(value) => {
                                setActualRev(value.target.value);
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                </div>
              ):""}
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

export default Forecast;
