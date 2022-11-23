import ReactTable from "../../../../components/ReactTable/ReactTable.js";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React,{useEffect,useCallback} from "react";
import { getDetailThemeVis } from "../../../../Redux/themeReduce";
import { useDispatch } from "react-redux";
import NotificationAlert from "react-notification-alert";
import { useNavigate,useParams } from "react-router-dom";
import { verification } from "../../../../Redux/usersReduce";

// core components
function DetailThemePL() {
  var annee = localStorage.getItem("annee");
  const [entities, setEntities] = React.useState([]);
  const [titre, setTitre] = React.useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useParams();
  var id =location.id; 
   var idUser =location.idUser;
  const notificationAlertRef = React.useRef(null);

  const getBudjet = useCallback(async () => {
    var response = await dispatch(getDetailThemeVis({annee:annee,id:id,idUser:idUser}));
    setEntities(response.payload.detail);
    setTitre(response.payload.titre);
  }, [dispatch,annee,id,idUser]);
  
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
    getBudjet();
  }, [getBudjet,verifToken])
  const listeTheme = useCallback(
    async () => {
      var red = localStorage.getItem("redirect")
      navigate(red);
    },
    [navigate]
  );
  function Budjet({entities}){
    var list = [];
    for (const key in entities) {
      const element = entities[key];
      const sujet = element[0].sujets.num+" : "+element[0].sujets.sujet;
      let som = 0;
      element.forEach(val=>{
        som+=val.total;
      })
      list.push(
        <Card className="budjet" key={"key-"+key}>
          <Card.Body>
              <h3>{sujet} (Total : {Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(som)} TND) </h3>
              <ReactTable
                data={element}
                columns={[
                  {
                    Header: "Utilisateur",
                    accessor: "",                    
                    Cell: ({ cell }) => (cell.row.original.budjets.user_sujets.users.nom_prenom),
                  },
                  {
                    Header: "Nom Budget",
                    accessor: "",                    
                    Cell: ({ cell }) => (cell.row.original.budjets.user_sujets.titre),
                  },
                  {
                    Header: "Item N° (Description)",
                    accessor: "id",                    
                    Cell: ({ cell }) => (cell.row.original.arborecences.num +":"+cell.row.original.arborecences.description),
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
                        {Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(cell.row.values.anneePrec)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "total",
                    accessor: "total",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(cell.row.values.total)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "Janvier",
                    accessor: "jan",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(cell.row.values.jan)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "Février",
                    accessor: "feb",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(cell.row.values.feb)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "Mars",
                    accessor: "mars",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(cell.row.values.mars)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "q1",
                    accessor: "q1",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(cell.row.values.q1)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "Avril",
                    accessor: "apr",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(cell.row.values.apr)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "Mai",
                    accessor: "mai",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(cell.row.values.mai)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "Juin",
                    accessor: "juin",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(cell.row.values.juin)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "Q2",
                    accessor: "q2",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(cell.row.values.q2)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "juillet",
                    accessor: "july",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(cell.row.values.july)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "Août",
                    accessor: "aug",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(cell.row.values.aug)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "septembre",
                    accessor: "sep",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(cell.row.values.sep)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "q3",
                    accessor: "q3",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(cell.row.values.q3)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "octobre",
                    accessor: "oct",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(cell.row.values.oct)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "novembre",
                    accessor: "nov",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(cell.row.values.nov)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "decembre",
                    accessor: "dec",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(cell.row.values.dec)} TND
                      </div>
                    ),
                  },
                  {
                    Header: "q4",
                    accessor: "q4",
                    Cell: ({ cell }) => (
                      <div>
                        {Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(cell.row.values.q4)} TND
                      </div>
                    ),
                  },
                ]}
                className="-striped -highlight primary-pagination"
              />
          </Card.Body>
        </Card>
      ) 
    }
    return (list)
  }
  return (
    <>
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
              onClick={listeTheme}
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
            <h4 className="title">Détail {titre} </h4>
          </Col>
        </Row>
        <Budjet entities={entities}></Budjet>
      </Container>
    </>
  );
}

export default DetailThemePL;
