import ReactTable from "../../../components/ReactTable/ReactTable.js";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React,{useEffect,useCallback} from "react";
import { getBudjetByUserSujet } from "../../../Redux/budgetReduce";
import { useDispatch } from "react-redux";
import { useNavigate,useParams } from "react-router-dom";
import { verification } from "../../../Redux/usersReduce";

// core components
function DetailBudget() {
  const [entities, setEntities] = React.useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useParams();
  var id =location.id;
  const getBudjet = useCallback(async () => {    
    var response3 = await dispatch(getBudjetByUserSujet(id));
    setEntities(response3.payload);
    if(document.getElementById("loaderTable") !== null){
      document.getElementById("loaderTable").classList.add("hidden");
    }
  }, [dispatch,id]);
  
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
  const listeBudget = useCallback(
    async () => {
      var red = localStorage.getItem("redirect");
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
              <h3>{sujet} (Total : {Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 20 }).format(som)} TND) </h3>
              <ReactTable
                data={element}
                columns={[
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
              Retour à la liste
            </Button>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <h4 className="title">Détail budget </h4>
          </Col>
        </Row>
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
        {Object.keys(entities).length === 0?<h3 className="text-center">Aucun détail</h3>:""}
      </Container>
    </>
  );
}

export default DetailBudget;
