import React, { useState, useCallback } from "react";
import { ExcelRenderer } from "react-excel-renderer";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { detailGrossSell } from "../../../../Redux/sellReduce";
import { useDispatch } from "react-redux";
import Select from "react-select";
import NotificationAlert from "react-notification-alert";
import { useNavigate,useParams } from "react-router-dom";

function DetailSell() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useParams();
  var annee = localStorage.getItem("annee");
  var pays = location.pays;
  var type = location.type;
  const [data, setData] = useState([]);

  const getSells = useCallback(async () => {
    var res = await dispatch(detailGrossSell({annee,pays,type}));
    var ligne = res.payload;
    /* var sells = res.payload.sells; */
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
    setData(array);
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

  React.useEffect(() => {
    getSells();
    DoubleScroll(document.getElementById('doublescroll'));
  }, [getSells]);

  return (
    <>
      <Container fluid>
        <div className="section-image">
          <Container>
            <Row>
              <Col md="12">
                <Button
                  className="btn-wd btn-outline mr-1 float-left"
                  type="button"
                  variant="info"
                  onClick={()=>{
                    var red = localStorage.getItem("redirect")
                    navigate(red);
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
                  <Col md="12">
                    <div className="App">
                      <div className="div-scroll">
                        <Row>
                          <Col md="6">
                            <div className="div1">
                              <table className="table table-bordered table-scroll">
                                <thead>
                                  <tr>
                                    <th>code</th>
                                    <th>produit </th>
                                    <th>Categorie </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {data.map((item, key) => {
                                    return (
                                      <tr>
                                        <td>{item?.code}</td>
                                        <td>{item?.produit}</td>
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
              </Card.Body>
            </Card>
          </Container>
        </div>
      </Container>
    </>
  );
}

export default DetailSell;
