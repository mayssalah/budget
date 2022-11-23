import React, { useState, useCallback } from "react";
import { ExcelRenderer } from "react-excel-renderer";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { getActiveProduit } from "../../../Redux/produitReduce";
import { getActiveCategorie } from "../../../Redux/categorieReduce";
import { addLigne, addSell, detailSell } from "../../../Redux/sellReduce";
import { getActiveGroupe } from "../../../Redux/groupeReduce";
import { getActivePays } from "../../../Redux/paysReduce";
import { fetchAnnee } from "../../../Redux/anneeReduce";
import { useDispatch } from "react-redux";
import Select from "react-select";
import NotificationAlert from "react-notification-alert";
import { useNavigate,useParams } from "react-router-dom";

function CreationSell() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useParams();  
  var id = location.id;
  var idgroupe = location.idgroupe!==undefined?location.idgroupe:0;
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
  const notificationAlertRef = React.useRef(null);
  const [file, setFile] = useState("Choisir fichier");
  //groupe
  const [optionGroupe, setOptionGroupe] = React.useState([
    {
      value: "",
      label: "Groupe budget",
      isDisabled: true,
    },
  ]);
  const [groupeSelect, setGroupeSelect] = React.useState(0);


  //Pays
  const [optionsPays, setOptionsPays] = React.useState([
    {
      value: "",
      label: "Pays",
      isDisabled: true,
    },
  ]);
  const [paysSelect, setPaysSelect] = React.useState({
    value: 0,
    label: "Pays",
  });

  //Market
  const [optionsMarket] = React.useState([
    {
      value: "",
      label: "Market",
      isDisabled: true,
    },
    {
      value: 0,
      label: "Privé",
    },
    {
      value: 1,
      label: "Hopital Public",
    },
    {
      value: 2,
      label: "Military Public",
    },
    {
      value: 3,
      label: "Export",
    },
  ]);
  const [marketSelect, setMarketSelect] = React.useState({
    value: "",
    label: "Market",
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
  const [data, setData] = useState([]);
  const [produit, setProduit] = React.useState([]);
  const [category, setCategory] = React.useState([]);
  const [budget, setBudget] = useState({
    titre: "",
    total: 0,
    type: "",
    pays: null,
    annee: null,
    id_groupe: 0
  });

  //get Produit
  const getProduit = useCallback(async () => {
    var prod = await dispatch(getActiveProduit());
    var entities = prod.payload;
    var arrayOption = {};
    entities.forEach((e) => {
      if (e.code !== null) arrayOption[e.code] = { id: e.id, code: e.code };
    });
    setProduit(arrayOption);
  }, [dispatch]);

  //get Produit
  const getCategory = useCallback(async () => {
    var cat = await dispatch(getActiveCategorie());
    var entities = cat.payload;
    var arrayOption = {};
    entities.forEach((e) => {
      arrayOption[e.nom] = { id: e.parent, nom: e.nom };
    });
    setCategory(arrayOption);
  }, [dispatch]);

  const getPays = useCallback(
    async (p) => {
      var pays = await dispatch(getActivePays());
      var entities = pays.payload;
      var arrayOption = [];
      entities.forEach((e) => {
        arrayOption.push({ value: e.id, label: e.nom });
      });
      setOptionsPays(arrayOption);
    },
    [dispatch]
  );

  const getAnnee = useCallback(async () => {
    var ann = await dispatch(fetchAnnee());
    var entities = ann.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.annee, label: e.annee });
    });
    setOptionAnnee(arrayOption);
  }, [dispatch]);

  const getGroupe = useCallback(async (annee) => {
    var groupe = await dispatch(getActiveGroupe({type:1,annee:annee}));
    var entities = groupe.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nom });
    });
    setOptionGroupe(arrayOption);
  }, [dispatch]);

  function DoubleScroll(element) {
    var scrollbar = document.createElement('div');
    scrollbar.appendChild(document.createElement('div'));
    scrollbar.style.overflow = 'auto';
    scrollbar.style.overflowY = 'hidden';
    scrollbar.style.height = '10px';
    scrollbar.style.marginBottom = '5px';
    scrollbar.firstChild.style.width = element.scrollWidth+'px';
    scrollbar.firstChild.style.paddingTop = '1px';
    scrollbar.firstChild.appendChild(document.createTextNode('\xA0'));
    scrollbar.onscroll = function() {
        element.scrollLeft = scrollbar.scrollLeft;
    };
    element.onscroll = function() {
        scrollbar.scrollLeft = element.scrollLeft;
    };
    element.parentNode.insertBefore(scrollbar, element);
  }
  const fileHandler = (e) => {
    let fileObj = e.target.files[0];
    setFile(fileObj.name);
    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        let newRows = [];
        let budg = null;
        var nb = 0;
        resp.rows.slice(1).map((row, index) => {
          if (row && row !== "undefined") {
            if (nb === 0) {
              budg = row[31];
              nb++;
            }
            newRows.push({
              code: row[0],
              prix: parseFloat(row[1]) ? parseFloat(row[1]).toFixed(3) : 0,
              produit: row[2],
              category: row[4],
              qte_jan: parseInt(row[5]) ? parseInt(row[5]) : 0,
              qte_feb: parseInt(row[6]) ? parseInt(row[6]) : 0,
              qte_mars: parseInt(row[7]) ? parseInt(row[7]) : 0,
              qte_apr: parseInt(row[8]) ? parseInt(row[8]) : 0,
              qte_mai: parseInt(row[9]) ? parseInt(row[9]) : 0,
              qte_juin: parseInt(row[10]) ? parseInt(row[10]) : 0,
              qte_july: parseInt(row[11]) ? parseInt(row[11]) : 0,
              qte_aug: parseInt(row[12]) ? parseInt(row[12]) : 0,
              qte_sep: parseInt(row[13]) ? parseInt(row[13]) : 0,
              qte_oct: parseInt(row[14]) ? parseInt(row[14]) : 0,
              qte_nov: parseInt(row[15]) ? parseInt(row[15]) : 0,
              qte_dec: parseInt(row[16]) ? parseInt(row[16]) : 0,
              qte: parseInt(row[17]) ? parseInt(row[17]) : 0,

              jan: parseFloat(row[18]) ? parseFloat(row[18]).toFixed(3) : 0,
              feb: parseFloat(row[19]) ? parseFloat(row[19]).toFixed(3) : 0,
              mars: parseFloat(row[20]) ? parseFloat(row[20]).toFixed(3) : 0,
              apr: parseFloat(row[21]) ? parseFloat(row[21]).toFixed(3) : 0,
              mai: parseFloat(row[22]) ? parseFloat(row[22]).toFixed(3) : 0,
              juin: parseFloat(row[23]) ? parseFloat(row[23]).toFixed(3) : 0,
              july: parseFloat(row[24]) ? parseFloat(row[24]).toFixed(3) : 0,
              aug: parseFloat(row[25]) ? parseFloat(row[25]).toFixed(3) : 0,
              sep: parseFloat(row[26]) ? parseFloat(row[26]).toFixed(3) : 0,
              oct: parseFloat(row[27]) ? parseFloat(row[27]).toFixed(3) : 0,
              nov: parseFloat(row[28]) ? parseFloat(row[28]).toFixed(3) : 0,
              dec: parseFloat(row[29]) ? parseFloat(row[29]).toFixed(3) : 0,
              total: parseFloat(row[30]) ? parseFloat(row[30]).toFixed(3) : 0,
              id_produit: produit[row[0]] ? produit[row[0]].id : null,
              id_categorie: category[row[4]] ? category[row[4]].id : null,
            });
          }
          return true;
        });
        var list = { ...budget, total: budg };
        setBudget(list);
        setData(newRows);
        /* setFile({
          cols: resp.cols,
          rows: resp.rows
        }); */
      }
    });
  };  

  const getSells = useCallback(async () => {
    var res = await dispatch(detailSell({id,idgroupe}));
    var ligne = res.payload.ligne;
    var sells = res.payload.sells;
    var array = [];
    ligne.forEach(e=>{
      var obj = e;
      obj.code = e.produits.code;
      obj.prix = e.produits.prix;
      obj.produit = e.produits.designation;
      obj.id_produit = e.produits.id;
      obj.category = e.categories.nom;
      obj.id_categorie = e.categories.id;
      array.push(obj);
    });
    var t = null;
    if(sells.type === 0) 
      t = { value: 0, label: "Privé" }
    else if(sells.type === 1) 
      t = { value: 1, label: "Hopital Public" }
    else if(sells.type === 2) 
      t = { value: 2, label: "Military Public" }
    else if(sells.type === 3) 
      t = { value: 3, label: "Export" }
    /* var t = sells.type === 0 ? { value: 0, label: "Privé" }:{ value: 1, label: "Public" } */
    setBudget({
      titre: sells.titre,
      total: sells.total,
      type: t,
      pays: {
        value: sells.pays.id,
        label: sells.pays.nom,
      },
      id_groupe:sells.id_groupe,
      annee: sells.annee,
    })    
    setGroupeSelect({ value: sells.id_groupe, label: sells.groupe_budgets.nom });
    setPaysSelect({ value: sells.pays.id, label: sells.pays.nom });
    setAnneeSelect({ value: sells.annee, label: sells.annee });
    setMarketSelect(t);
    setData(ligne);
  }, [dispatch,id]);

  React.useEffect(() => {
    getProduit();
    getCategory();
    getPays();
    getAnnee();    
    DoubleScroll(document.getElementById('doublescroll'));

    if(id != 0){
      getSells();
    }
  }, [getProduit, getCategory, getPays, getAnnee,id]);

  function submitForm() {
    if ( paysSelect.value !== 0 && budget.titre !== "" && budget.type !== "" && data.length > 0 ) {
      dispatch(addSell({ budget })).then((e) => {
        var list = data;
       list.forEach((val,key)=>{          
          var valF = { ...val, id_sell: e.payload.id };
          if(val.id_produit!==null){list[key] = valF; 
          }
        })
      
       dispatch(addLigne({ list })).then((e) => {
          notify("tr", "Insertion avec succes", "success");
          setTimeout(async () => {
            navigate("/listSell");
          }, 1500);
        });
     });
    } else {
      notify("tr", "Vérifier vos données", "danger");
    }
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
                  className="btn-wd btn-outline mr-1 float-left"
                  type="button"
                  variant="info"
                  onClick={()=>{
                    navigate(localStorage.getItem("redirect"));
                    localStorage.removeItem('redirect');
                  }}
                >
                  <span className="btn-label">
                    <i className="fas fa-list"></i>
                  </span>
                  Retour à la liste
                </Button>
              </Col>
            </Row>
            <Card className="card-import">
              <Card.Body>

                <Row>
                  <Col className="pr-1" md="6">
                    <Form.Group id="roleClass">
                      <label>Total budget* </label>
                      <Form.Control
                        value={budget.total}
                        placeholder="Total budget"
                        type="text"
                        onChange={(value) => {
                          var list = { ...budget, total: value.target.value };
                          setBudget(list);
                        }}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="pl-1" md="6">
                    <Form.Group id="roleClass">
                      <label>Titre* </label>
                      <Form.Control
                        value={budget.titre}
                        placeholder="Titre"
                        type="text"
                        onChange={(value) => {
                          var list = { ...budget, titre: value.target.value };
                          setBudget(list);
                        }}
                      ></Form.Control>
                    </Form.Group>
                  </Col>      
                    <Col className="pl-1" md="6">
                    <Form.Group id="roleClass">
                      <label>Annee* </label>
                      <Select
                        placeholder="Annee"
                        className="react-select primary"
                        classNamePrefix="react-select"
                        value={anneeSelect}
                        onChange={(value) => {
                          var list = { ...budget, annee: value.value };
                          setBudget(list);
                          setAnneeSelect(value);
                           getGroupe(value.value);
                        }}
                        options={optionAnnee}
                      />
                    </Form.Group>
                  </Col>
                
                  <Col className="pr-1" md="6">
                    <Form.Group id="roleClass">
                      <label>Type market* </label>
                      <Select
                        className="react-select primary"
                        classNamePrefix="react-select"
                        value={marketSelect}
                        onChange={(value) => {
                          var list = { ...budget, type: value.value };
                          setBudget(list);
                          setMarketSelect(value);
                        }}
                        options={optionsMarket}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-1" md="6">
                    <Form.Group id="roleClass">
                      <label>Pays* </label>
                      <Select
                        className="react-select primary"
                        classNamePrefix="react-select"
                        value={paysSelect}
                        onChange={(value) => {
                          var list = { ...budget, pays: value.value };
                          setBudget(list);
                          setPaysSelect(value);
                        }}
                        options={optionsPays}
                      />
                    </Form.Group>
                  </Col>
                  <Col className="pr-1" md="6">
                    <Form.Group id="roleClass">
                      <label>Groupe* </label>
                      <Select
                        className="react-select primary"
                        classNamePrefix="react-select"
                        value={groupeSelect}
                        placeholder="Groupe"
                        onChange={(value) => {
                          var list = { ...budget, id_groupe: value.value };
                          setBudget(list);
                          setGroupeSelect(value);
                        }}
                        options={optionGroupe}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <br></br>
                <Row>
                  <Col md="12">
                    <div className="App">
                      {parseInt(location.id) === 0 ? (
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span
                              className="input-group-text"
                              id="inputGroupFileAddon01"
                            >
                              Import fichier
                            </span>
                          </div>
                          <div className="custom-file">
                            <input
                              type="file"
                              className="custom-file-input"
                              id="inputGroupFile01"
                              aria-describedby="inputGroupFileAddon01"
                              onChange={fileHandler}
                            />
                            <label className="custom-file-label">{file}</label>
                          </div>
                        </div>
                      ) : ""}
                      {/* <input className="form-control" type="file" onChange={fileHandler} /> */}
                      <br></br>
                      <div className="div-scroll">
                        <Row>
                          <Col md="6">
                            <div className="div1">
                              <table className="table table-bordered table-scroll">
                                <thead>
                                  <tr>
                                    <th>code</th>
                                    <th>produit </th>
                                    {/* <th>marche </th> */}
                                    <th>Categorie </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {data.map((item, key) => {
                                    return (
                                      <tr
                                        key={"tr" + key}
                                        className={
                                          !item.id_produit ? "danger" : ""
                                        }
                                      >
                                        <td>{item?.code}</td>
                                        <td>{item?.produit}</td>
                                        {/* <td>{item?.marche}</td> */}
                                        <td>{item?.category}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="div2" id="doublescroll">
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th>Quantité janvier </th>
                                    <th>Quantité fevrier </th>
                                    <th>Quantité mars </th>
                                    <th>Quantité avril </th>
                                    <th>Quantité mai </th>
                                    <th>Quantité juin </th>
                                    <th>Quantité juillet </th>
                                    <th>Quantité aout </th>
                                    <th>Quantité septembre </th>
                                    <th>Quantité octobre </th>
                                    <th>Quantité novembre </th>
                                    <th>Quantité decembre </th>
                                    
                                    <th>Total Quantité </th>
                                    <th>Total janvier </th>
                                    <th>Total fevrier </th>
                                    <th>Total mars </th>
                                    <th>Total avril </th>
                                    <th>Total mai </th>
                                    <th>Total juin </th>
                                    <th>Total juillet </th>
                                    <th>Total aout </th>
                                    <th>Total septembre </th>
                                    <th>Total octobre </th>
                                    <th>Total novembre </th>
                                    <th>Total decembre </th>
                                    <th>Total </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {data.map((item, key) => {
                                    return (
                                      <tr
                                        key={"tr" + key}
                                        className={
                                          !item.id_produit ? "danger" : ""
                                        }
                                      >
                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.qte_jan)}</td>
                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.qte_feb)}</td>
                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.qte_mars)}</td>
                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.qte_apr)}</td>
                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.qte_mai)}</td>
                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.qte_juin)}</td>
                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.qte_july)}</td>
                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.qte_aug)}</td>
                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.qte_sep)}</td>
                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.qte_oct)}</td>
                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.qte_nov)}</td>
                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.qte_dec)}</td>
                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.qte)}</td>

                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.jan)}</td>
                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.feb)}</td>
                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.mars)}</td>
                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.apr)}</td>
                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.mai)}</td>
                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.juin)}</td>
                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.july)}</td>
                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.aug)}</td>
                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.sep)}</td>
                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.oct)}</td>
                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.nov)}</td>
                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.dec)}</td>
                                        <td>{Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(item?.total)}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Col>
                </Row>
                <br clear="all"></br>
                {parseInt(location.id) === 0 ? (
                  <Button
                    className="btn-fill pull-right"
                    type="button"
                    variant="info"
                    onClick={submitForm}
                  >
                    Enregistrer
                  </Button>
                ) : ""}
              </Card.Body>
            </Card>
          </Container>
        </div>
      </Container>
    </>
  );
}

export default CreationSell;
