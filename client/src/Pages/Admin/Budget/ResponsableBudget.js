import ReactTable from "../../../components/ReactTable/ReactTable.js";
import { Alert, Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import { getDetailBudjet, budgetChangeEtat, budjetGetById, getDetailGroupe } from "../../../Redux/budgetReduce";
import { userSujetGetById } from "../../../Redux/userSujetReduce";
import { useDispatch } from "react-redux";
import NotificationAlert from "react-notification-alert";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";
import SweetAlert from "react-bootstrap-sweetalert";
import { verification } from "../../../Redux/usersReduce";

// core components
function DetailBudget() {
  var token = localStorage.getItem("x-access-token");
  var annee = localStorage.getItem("annee");
  const [entities, setEntities] = React.useState([]);
  const [alert, setAlert] = React.useState(null);
  const [note, setNote] = React.useState(null);
  var decoded = jwt_decode(token);
  var idRole = decoded.idRole;

  const [titre, setTitre] = React.useState("");
  const [etatBudjet, setEtatBudjet] = React.useState(0);
  const [totalbudget, setTotalbudget] = React.useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useParams();
  var hrefURL = useLocation();
  var id = location.id;
  var idUserSujet = location.idUserSujet;
  var idEquipe = location.idEquipe;
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
  const getBudjet = useCallback(async () => {
    if (hrefURL.pathname.includes("detailGroupe") === false) {
      var response = await dispatch(getDetailBudjet({ id, idRole, idUserSujet }));
      var res = (response.payload);
      var keysRes = Object.keys(res);
      setTitre(res[parseInt(keysRes[0])][0].budjets.user_sujets.titre)
      setEntities(res);
    } else {
      var response2 = await dispatch(getDetailGroupe({ id, annee }));
      var res2 = (response2.payload);
      setEntities(res2);
      setTitre(localStorage.getItem('titre'))
    }
    if (idRole !== 1) {

      var response1 = await dispatch(budjetGetById(id));
      setEtatBudjet(response1.payload.etat)
      setNote(response1.payload.user_sujets.note)
    } else {
      if (hrefURL.pathname.includes("detailGroupe") === false) {
        var response3 = await dispatch(userSujetGetById(idUserSujet));
        setEtatBudjet(response3.payload.userSujet.etat);
        //setTitre(response.payload.userSujet.titre)
      }
    }
  }, [dispatch, id, idRole, idUserSujet, annee, hrefURL.pathname]);

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
    getBudjet();
  }, [getBudjet, verifToken])
  const listeBudget = useCallback(
    async () => {
      if (location.view === "0") {
        var red = localStorage.getItem("redirect");
        navigate(red);
      }
      else
        navigate('/exportExcel');
    },
    [navigate, location]
  );
  const changeEtat = useCallback(
    async (valid) => {
      var etat = 0;
      var note = localStorage.getItem("note") !== "" ? localStorage.getItem("note") : null;
      var total = (localStorage.getItem("total") !== "" && localStorage.getItem("total") !== "0") ? localStorage.getItem("total") : 0;
      if (idRole !== 1)
        etat = valid === 1 ? 2 : 0;
      else
        etat = valid === 1 ? 3 : 2;
      dispatch(budgetChangeEtat({ idBudget: id, id: idUserSujet, idEquipe: idEquipe, etat: etat, note: note, idRole: idRole, total: total })).then((e) => {
        if (e.payload === true) {
          notify("tr", "Envoyer avec succes", "success");
          hideAlert()
          setTimeout(() => {
            listeBudget();
          }, 1500);
        } else {
          notify("tr", "V??rifier vos donn??es!", "danger");
        }
      });
    },
    [dispatch, idEquipe, idRole, idUserSujet, listeBudget, id]
  );
  function Budjet({ entities }) {
    var list = [];
    var tot = 0;
    var taux = 0;
    for (const key in entities) {
      const element = entities[key];
      const sujet = element[0].sujets.num + " : " + element[0].sujets.sujet;
      let som = 0;
      element.forEach(val => {
        som += val.total;
        taux += val.anneePrec;
      })
      tot += som
      list.push(
        <Card className={(location.view == "0") ? "budjet" : ""} key={"key-" + key}>
          <Card.Body>
            <h3>{sujet} (Total : {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(som)} TND) <br></br>

            </h3>
            {(location.view == "0") ? (
              <ReactTable
                data={element}
                columns={[
                  {
                    Header: "Item N?? (Description)",
                    accessor: "id",
                    Cell: ({ cell }) => (cell.row.original.arborecences.num + ":" + cell.row.original.arborecences.description),
                  },
                  {
                    Header: "commentaire",
                    accessor: "commentaire",
                  },
                  {
                    Header: "anneePrec",
                    accessor: "anneePrec",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.values.anneePrec)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "total",
                    accessor: "total",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.values.total)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "Janvier",
                    accessor: "jan",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.values.jan)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "F??vrier",
                    accessor: "feb",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.values.feb)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "Mars",
                    accessor: "mars",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.values.mars)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "q1",
                    accessor: "q1",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.values.q1)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "Avril",
                    accessor: "apr",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.values.apr)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "Mai",
                    accessor: "mai",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.values.mai)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "Juin",
                    accessor: "juin",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.values.juin)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "Q2",
                    accessor: "q2",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.values.q2)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "juillet",
                    accessor: "july",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.values.july)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "Ao??t",
                    accessor: "aug",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.values.aug)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "septembre",
                    accessor: "sep",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.values.sep)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "q3",
                    accessor: "q3",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.values.q3)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "octobre",
                    accessor: "oct",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.values.oct)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "novembre",
                    accessor: "nov",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.values.nov)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "decembre",
                    accessor: "dec",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.values.dec)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "q4",
                    accessor: "q4",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.values.q4)} TND
                      </div>
                    ),
                  },
                ]}
                className="-striped -highlight primary-pagination"
              />) : ""}
          </Card.Body>
        </Card>

      )

    }

    localStorage.setItem("total", tot);
    localStorage.setItem("taux", taux);
    if (document.getElementById("loaderTable") !== null) {
      document.getElementById("loaderTable").classList.add("hidden");
    }
    if (document.getElementById("save") !== null)
      document.getElementById("save").classList.remove("hidden");
    if (document.getElementById("responsable") !== null)
      document.getElementById("responsable").classList.remove("hidden");
    return (list)
  }
  const hideAlert = () => {
    setAlert(null);
  };


  const confirmMessage = useCallback(
    async (valid) => {
      localStorage.setItem("note", "");
      setAlert(
        <SweetAlert
          style={{ display: "block", marginTop: "-100px" }}
          title={valid === 1 ? "??tes-vous sur de valider le budget???" : "Vous ??tes sure de refuser ?"}
          onConfirm={() => changeEtat(valid)}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          confirmBtnText="Oui"
          cancelBtnText="Non"
          showCancel
        >
          {parseInt(valid) === 0 ? (
            <div>
              <Form.Group className="input-comment">
                <label>Note</label>
                <textarea
                  className="form-control"
                  onChange={(value) => {
                    localStorage.setItem("note", value.target.value);
                  }}
                  rows="5"
                ></textarea>
              </Form.Group>
            </div>
          ) : ""}
        </SweetAlert>
      );
    },
    [changeEtat]
  );
  return (
    <>
      {alert}
      <Container fluid>
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Row>
          <Col md="12">
            <Button
              id="saveBL"
              className="btn-wd btn-outline mr-1 float-left"
              type="button"
              variant="info"
              onClick={listeBudget}
            >
              <span className="btn-label">
                <i className="fas fa-list"></i>
              </span>
              Retour ?? la liste
            </Button>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <h4 className="title">D??tail budget {titre} </h4>
            <h3><strong>Total {localStorage.getItem('total')} TND <br></br>
              Taux d???evolution  {parseFloat(localStorage.getItem('taux')) > 0 ? parseFloat(((parseFloat(localStorage.getItem('total')) - parseFloat(localStorage.getItem('taux')) ) / parseFloat(localStorage.getItem('taux')) ) * 100).toFixed(2) : 0} %  </strong>
            </h3>
          </Col>
        </Row>
        {note !== null && note !== "" ? (
          <Alert variant="danger">
            <span>{note}</span>
          </Alert>
        ) : ""}

        <Budjet entities={entities}></Budjet>
        <div className="text-center">
          <img
            id="loaderTable"
            className=""
            src={require("../../../assets/img/loader.gif").default}
            alt="loader"
          />
        </div>
        <br></br>
        <Row>
          <Col md="12">
            {(etatBudjet === 1 && idRole !== 1) || (etatBudjet === 1 && idRole === 1) ? (
              <div>
                <Button
                  id="responsable"
                  className="btn-wd mr-1 float-right"
                  type="button"
                  variant="danger"
                  onClick={() => {
                    confirmMessage(0);
                  }}
                >
                  refuser
                </Button>
                <br></br>
                <br clear="all"></br>
                <Button
                  id="save"
                  className="btn-wd mr-1 float-right"
                  type="button"
                  variant="success"
                  onClick={() => {
                    confirmMessage(1);
                  }}
                >
                  <span className="btn-label">
                    <i className="fas fa-check"></i>
                  </span>
                  Valider
                </Button>
              </div>
            ) : ""}
          </Col>
        </Row>
      </Container>
      {/* <button
        onClick={() => {
          exportToExcel(mockData);
        }}
      >
        Export to Excel
      </button> */}
    </>
  );
}

export default DetailBudget;
