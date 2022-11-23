import ReactTable from "../../../components/ReactTable/ReactTable.js";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import NotificationAlert from "react-notification-alert";
import { verification } from "../../../Redux/usersReduce";
import {
  getSell,
  saveGroup,
  getGroupeSell,
  deleteGroupe,
} from "../../../Redux/sellReduce";
import Select from "react-select";
import SweetAlert from "react-bootstrap-sweetalert";

// core components
function GroupeSell() {
  var anneeLocal = localStorage.getItem("annee");
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
  const dispatch = useDispatch();
  const notificationAlertRef = React.useRef(null);
  const [alert, setAlert] = React.useState(null);
  const [entities, setEntities] = React.useState([]);
  const [options, setOptions] = React.useState([
    {
      value: "",
      label: "Role",
      isDisabled: true,
    },
  ]);
  const [sell, setSell] = React.useState([]);
  const [titre, setTitre] = React.useState("");

  const getGroupe = useCallback(async () => {
    var response = await dispatch(getGroupeSell({ annee: anneeLocal }));
    setEntities(response.payload);
  }, [dispatch, anneeLocal]);

  const getSells = useCallback(async () => {
    var resultat = await dispatch(getSell({ annee: anneeLocal }));
    var res = await resultat.payload;

    var arrayOption = [];
    res.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.titre });
    });
    setOptions(arrayOption);
  }, [dispatch]);

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
    getGroupe();
    getSells();
  }, [verifToken, getSells]);

  async function submitForm() {
    if (titre !== "" && sell.length > 0) {
      dispatch(
        saveGroup({
          titre: titre,
          sell: sell,
          annee: anneeLocal,
        })
      ).then(() => {
        notify("tr", "Insertion avec succes", "success");
        getGroupe();
      });
    } else {
      notify("tr", "Vérifier vos données", "danger");
    }
  }

  const hideAlert = () => {
    setAlert(null);
  };

  function removeGroupe(id) {
    dispatch(deleteGroupe(id)).then((e) => {
      setTimeout(async () => {
        notify("tr", "Supprimer avec succes", "success");
        getGroupe();
        getSells();
        hideAlert();
      }, 1000);
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
      <Container fluid>
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        {alert}
        <Card className="card-header">
          <Card.Body>
            <h4 className="title">Gross sales groupé</h4>
          
            <Row>
              <Col md="12">
                <ReactTable
                  data={entities}
                  columns={[
                    {
                      Header: "Titre",
                      accessor: "groupes.titre",
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
                            Visualiser{" "}
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
            {entities.length === 0 ? (
              <div className="text-center">Aucun donnée trouvé</div>
            ) : (
              ""
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default GroupeSell;
