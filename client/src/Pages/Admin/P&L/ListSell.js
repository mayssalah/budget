import ReactTable from "../../../components/ReactTable/ReactTable.js";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import {
  getSell,
  deleteSell,
  saveGroup,
  getGroupeSell,
  deleteGroupe,
} from "../../../Redux/sellReduce";
import { useDispatch } from "react-redux";
import NotificationAlert from "react-notification-alert";
import { useNavigate } from "react-router-dom";
import { verification } from "../../../Redux/usersReduce";
import SweetAlert from "react-bootstrap-sweetalert";
import Select from "react-select";

// core components
function ListSell() {
  var anneeLocal = localStorage.getItem("annee");
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const [entities, setEntities] = React.useState([]);
  const [entitiesGroupe, setEntitiesGroupe] = React.useState([]);
  const [options, setOptions] = React.useState([
    {
      value: "",
      label: "Sells",
      isDisabled: true,
    },
  ]);
  const [sell, setSell] = React.useState([]);
  const [revenu, setRevenu] = React.useState(0);
  const [titre, setTitre] = React.useState("");
  const [alert, setAlert] = React.useState(null);
  const getSells = useCallback(async () => {
    var response = await dispatch(getSell({ annee: anneeLocal }));
    setEntities(response.payload);

    var arrayOption = [];
    response.payload.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.titre });
    });
    setOptions(arrayOption);
  }, [dispatch, anneeLocal]);

  const getGroupe = useCallback(async () => {
    var response = await dispatch(getGroupeSell({ annee: anneeLocal }));
    var groupesells=response.payload;
    if(groupesells)setEntitiesGroupe(response.payload);
  }, [dispatch, anneeLocal]);

  const hideAlert = () => {
    setAlert(null);
  };
  function ajouter() {    
    localStorage.setItem("redirect", "/listSell");
    navigate("/creationSell/0/0");
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
    getSells();
    getGroupe();
  }, [verifToken, getSells, getGroupe]);
  const deleteMessage = useCallback(
    async (id) => {
      setAlert(
        <SweetAlert
          showCancel
          style={{ display: "block", marginTop: "-100px" }}
          title="Étes vous sure de supprimer cette ligne?"
          onConfirm={() => deleteSells(id)}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          confirmBtnText="Oui"
          cancelBtnText="Non"
        ></SweetAlert>
      );
    },
    [dispatch]
  );
  function deleteSells(id) {
    dispatch(deleteSell(id)).then((e) => {
      if (e.payload === true) {
        notify("tr", "Supprimer avec succes", "success");
        getSells();
        hideAlert();
      } else {
        notify("tr", "Vérifier vos données", "danger");
      }
    });
  }
  /** groupe **/

  async function submitForm() {
    if (titre !== "" && sell.length > 0 && parseFloat(revenu) > 0) {
      dispatch(
        saveGroup({
          titre: titre,
          sell: sell,
          annee: anneeLocal,
          revenu:revenu
        })
      ).then(() => {
        notify("tr", "Insertion avec succes", "success");
        getGroupe();
      });
    } else {
      notify("tr", "Vérifier vos données", "danger");
    }
  }

  function removeGroupe(id) {
    dispatch(deleteGroupe(id)).then((e) => {
      notify("tr", "Supprimer avec succes", "success");
      getGroupe();      
      getSells();
      hideAlert();
    });
  }
  const confirmRemove = (id) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Étes vous sure de supprimer cette ligne?"
        onConfirm={() => removeGroupe(id)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      ></SweetAlert>
    );
  };
  const pop_up = (val) => {
    var array = val.split(",");
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Détaill"
        onConfirm={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
      >
        <ul>
          {array.map((e) => {
            return <li>{e}</li>;
          })}
        </ul>
      </SweetAlert>
    );
  };
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
              onClick={ajouter}
            >
              <span className="btn-label">
                <i className="fas fa-plus"></i>
              </span>
              Ajouter sell
            </Button>
          </Col>
          <Col md="12">
            <Card className="card-header">
              <Card.Body>
                <h4 className="title">Gross sales groupé</h4>
                <Row>
                  <Col md="12">
                    <ReactTable
                      data={entitiesGroupe}
                      columns={[
                        {
                          Header: "Titre",
                          accessor: "groupes.titre",
                        },
                        
                        {
                          Header: "Total",
                          accessor: "groupes.total",
                        },
                        {
                          Header: "Revenu",
                          accessor: "groupes.revenu",
                        },
                        {
                          Header: "Année",
                          accessor: "groupes.annee",
                        },
                        {
                          Header: "Détail",
                          accessor: "sell",
                          Cell: ({ cell }) => (
                            <div className="block_action">
                              <Button
                                id={"idLigneC_" + cell.row.values.id}
                                onClick={() => {
                                  pop_up(cell.row.values.sell);
                                }}
                                className="btn btn-success ml-1"
                              >
                                Visualiser
                                <i
                                  className="fa fa-eye"
                                  id={"idLigneD_" + cell.row.values.id}
                                />
                              </Button>
                            </div>
                          ),
                        },
                        {
                          Header: "Action",
                          accessor: "groupes.id",
                          Cell: ({ cell }) => (
                            <div className="block_action">
                              <Button
                                id={"idLigneC_" + cell.row.values.id}
                                className="btn btn-danger ml-1"
                                onClick={() => {
                                  confirmRemove(cell.row.original.groupes.id);
                                }}
                              >
                                <i
                                  className="fas fa-trash"
                                  id={"idLigneD_" + cell.row.values.id}
                                />
                              </Button>
                            </div>
                          ),
                        },
                      ]}
                      className="-striped -highlight primary-pagination"
                    />
                  </Col>
                </Row>
                {entitiesGroupe.length === 0 ? (
                  <div className="text-center">Aucun donnée trouvé</div>
                ) : ""}
              </Card.Body>
            </Card>
          </Col>
          <Col md="12">
            <h4 className="title">Liste des gros sells</h4>
            <Card className="card-header">
              <Card.Body>
                <ReactTable
                  data={entities}
                  columns={[
                    {
                      Header: "titre",
                      accessor: "titre",
                    },
                    {
                      Header: "pays",
                      accessor: "pays.nom",
                    },
                    {
                      Header: "année",
                      accessor: "annee",
                    },
                    {
                      Header: "total",
                      accessor: "total",
                      Cell: ({ cell }) => (
                        <div className="actions-right block_action">
                          {Intl.NumberFormat("fr-FR", {
                            maximumSignificantDigits: 15,
                          }).format(cell.row.values.total)} TND
                        </div>
                      ),
                    },
                    {
                      Header: "Détail",
                      accessor: "id_groupe",
                      Cell: ({ cell }) => (
                        <div className="block_action">
                          <Button
                            id={"idLigneC_" + cell.row.values.id}
                            onClick={() => {
                              localStorage.setItem("redirect", "/listSell");
                              navigate("/creationSell/" + cell.row.values.id+'/0');
                            }}
                            className="btn btn-success ml-1"
                          >
                            Visualiser <i className="fa fa-eye" id={"idLigneD_" + cell.row.values.id_groupe} /> 
                          </Button>
                        </div>
                      ),
                    },
                    {
                      Header: "actions",
                      accessor: "id",
                      Cell: ({ cell }) => (
                        <div className="actions-right block_action">
                          <Button
                            onClick={() => {
                              deleteMessage(cell.row.values.id);
                            }}
                            variant="danger"
                            size="sm"
                            className="text-danger btn-link delete"
                          >
                            <i className="fa fa-trash" />
                          </Button>
                        </div>
                      ),
                    },
                  ]}
                  className="-striped -highlight primary-pagination"
                />
                {entities.length === 0 ? (
                  <div className="text-center">Aucun donnée trouvé</div>
                ) : (
                  ""
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ListSell;
