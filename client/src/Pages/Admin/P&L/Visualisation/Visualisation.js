import ReactTable from "../../../../components/ReactTable/ReactTable.js";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import { visualisation, changeOrdre, Reduction } from "../../../../Redux/sellReduce";
import { visualisationT, changeOrdreT } from "../../../../Redux/themeReduce";
import { useDispatch } from "react-redux";
import NotificationAlert from "react-notification-alert";
import { useNavigate } from "react-router-dom";
import { verification } from "../../../../Redux/usersReduce";

// core components
function Visualisation() {
  var annee = localStorage.getItem("annee");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notificationAlertRef = React.useRef(null);
  const [entities, setEntities] = React.useState([]);
  const [grandtotal, setGrandtotal] = React.useState(0);
  const [forcastsell, setForcastsell] = React.useState(0);
  const [actualsell, setActualsell] = React.useState(0);
  const [rep, setRep] = React.useState(0);

  const getTable = useCallback(async () => {
    var resultat = await dispatch(visualisation({ annee }));
    var res1 = await resultat.payload;
    var resultat1 = await dispatch(visualisationT({ annee }));
    var res = await [...resultat1.payload, ...res1];
    res.sort(function (a, b) {
      return a.ordre - b.ordre;
    });
    setEntities(res);
  }, [dispatch, annee]);

  function GetReduction({ idgroupe }) {

    const promise = new Promise((resolve, reject) => {
      setTimeout(async () => {
        var response = await dispatch(Reduction({ annee: annee, idgroupe: idgroupe }))
        resolve(response.payload.reductiont);
      }, 0);
    });

    promise.then((value) => {
      setRep(value);
    });
    return <div>{Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(rep)} MD</div>;
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
    getTable();
  }, [verifToken, getTable]);
  function updateOrdre(ordre, id) {
    dispatch(changeOrdre({ ordre, id })).then(e => {
      getTable();
      window.location.reload()
    });
  }
  function updateOrdreT(ordre, id) {
    dispatch(changeOrdreT({ ordre, id })).then(e => {
      getTable();
    });
  }
  return (
    <>
      <Container fluid>
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Row>
          <Col md="12">
            <h4 className="title text-center">Operating Income Statements<br></br>
              Monthly Budget Final - {annee}<br></br>
              Full Cost<br></br>
              Farmaceutico Tunisia</h4>
            <Card className="budget-final visualisation">
              <Card.Body>
              <Button
                              id={"idLigneC_print" }
                              onClick={() => {
                                window.print();
                              }}
                              className="btn btn-success ml-1 right btn-print"
                            >
                              Imprimer <i className="fa fa-print" id={"idLigneD_1000"} />
                            </Button>
          <br clear="all"></br>
                {entities.length === 0 ? (
                  <div className="text-center">Aucun donnée trouvé</div>
                ) : <ReactTable
                  data={entities}
                  columns={[
                    {
                      Header: "titre",
                      accessor: "titre",
                      Cell: ({ cell }) => (
                        <div >
                          <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}>{cell.row.original.titre}</div>
                          {(cell.row.original.id_sell && cell.row.original.id_sell !== null && cell.row.original.include === 1) ? (<div>
                            <br></br> <br></br>{"Discounts"}
                            <hr></hr>
                            <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}>{"SALES"}</div>
                            <br></br> <br></br>
                            {"Royalties"}
                             <br></br> <br></br>
                            <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}>      {"Net Revenu"}</div></div>) : ""}
                        </div>
                      ),
                    },
                    {
                      Header: "Monthly Budget final",
                      accessor: "total",
                      Cell: ({ cell }) => (
                        <div >
                          <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}> {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.values.total)} MD</div>

                          {(cell.row.original.id_sell && cell.row.original.id_sell !== null && cell.row.original.include === 1) ? (<div>
                            {setForcastsell(cell.row.values.forecast)}  {setActualsell(cell.row.values.actual)}
                            {setGrandtotal(cell.row.original.grandtotal)}
                            <br></br> <br></br>{Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(parseFloat(cell.row.original.discount))} MD
                            <hr></hr>
                            <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}> {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(parseFloat(cell.row.original.royalties))} MD</div>
                            <br></br> <br></br>
                            {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(parseFloat(cell.row.original.revenu))} MD  
                            <br></br> <br></br>
                            <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}>
                              {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(parseFloat(cell.row.original.netrevenu))} MD</div></div>
                          ) : ""}
                        </div>
                      ),
                    },
                    {
                      Header: "% on Gross sales",
                      accessor: "pourcentage_total",
                      Cell: ({ cell }) =>
                      ((cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ?
                        (<div>
                          <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}>{parseFloat(cell.row.original.pourcentage_total).toFixed(2)}%</div>
                          {(cell.row.original.id_sell && cell.row.original.id_sell !== null && cell.row.original.include === 1) ? (<div>
                            <br></br> <br></br>{parseFloat((cell.row.original.discount / cell.row.values.total) * 100).toFixed(2)} %
                            <hr></hr>
                            <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}>      {parseFloat((cell.row.original.royalties / cell.row.values.total) * 100).toFixed(2)} %</div>
                            <br></br> <br></br>
                            {parseFloat((cell.row.original.revenu / cell.row.values.total) * 100).toFixed(2)} %   
                            <br></br> <br></br>
                            <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}>
                              {parseFloat((cell.row.original.netrevenu / cell.row.values.total) * 100).toFixed(2)} %</div></div>) : ""}
                        </div>) : (parseFloat((cell.row.original.total / parseFloat(grandtotal)) * 100).toFixed(2) + '%')),
                    },
                    {
                      Header: "forecast 9+3",
                      accessor: "forecast",
                      Cell: ({ cell }) => (
                        <div >
                          <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}> {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.values.forecast)} MD</div>
                          {(cell.row.original.id_sell && cell.row.original.id_sell !== null && cell.row.original.include === 1) ? (<div>
                            <br></br>  <br></br> {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.original.forecastdis)} MD
                            <hr></hr>
                            <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}>  {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.original.forecast - cell.row.original.forecastdis)} MD</div>
                            <br></br> <br></br>
                            <div >
                            
                              {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.original.forecastrev)} MD</div>
                              <br></br> 
                              <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}>
{Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.original.forecastrev + (cell.row.original.forecast - cell.row.original.forecastdis))} MD</div> </div>) : ""}
                        </div>
                      ),
                    },
                    {
                      Header: "% on Gross sales",
                      accessor: "pourcentage_forcast",
                      Cell: ({ cell }) =>
                        <div >
                          <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}> {((cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ?
                            parseFloat(cell.row.original.pourcentage_forcast).toFixed(2) + " %"
                            : parseFloat((cell.row.original.forecast / forcastsell) * 100).toFixed(2) + '%')
                          }</div>
                          {(cell.row.original.id_sell && cell.row.original.id_sell !== null && cell.row.original.include === 1) ? (<div>
                            <br></br> <br></br>{parseFloat((cell.row.original.forecastdis / cell.row.original.forecast) * 100).toFixed(2)} %
                            <hr></hr>
                            <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}>    {parseFloat(((cell.row.original.forecast - cell.row.original.forecastdis) / cell.row.values.forecast) * 100).toFixed(2)} %</div>
                            <br></br> <br></br>
                            {parseFloat((cell.row.original.forecastrev / cell.row.values.forecast) * 100).toFixed(2)} %   
                            <br></br> <br></br>
                            <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}>      {parseFloat(parseFloat((cell.row.original.forecastrev + parseFloat(cell.row.original.forecast - cell.row.original.forecastdis)) / cell.row.original.forecast) * 100).toFixed(2)} %</div></div>) : ""}
                        </div>
                    },
                    {
                      Header: "actual",
                      accessor: "actual",
                      Cell: ({ cell }) => (
                        <div >
                          <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}> {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.values.actual)} MD
                          </div>{(cell.row.original.id_sell && cell.row.original.id_sell !== null && cell.row.original.include === 1) ? (<div>
                            <br></br> <br></br>{Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.original.actualdis)} MD
                            <hr></hr>
                            <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}> {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.original.actual - cell.row.original.actualdis)} MD</div>

                            <br></br> <br></br>
                            {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.original.actualrev)} MD
                            <br></br> <br></br>
                            <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}>      {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.original.actualrev + (cell.row.original.actual - cell.row.original.actualdis))} MD
                            </div>        </div>) : ""}
                        </div>
                      ),
                    },
                    {
                      Header: "% on Gross sales",
                      accessor: "pourcentage_actual",
                      Cell: ({ cell }) => (
                        (cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? <div >
                          <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}> {parseFloat(cell.row.original.pourcentage_actual).toFixed(2)}%</div>
                          {(cell.row.original.id_sell && cell.row.original.id_sell !== null && cell.row.original.include === 1) ? (<div>
                            <br></br> <br></br>{parseFloat((cell.row.original.actualdis / cell.row.original.actual) * 100).toFixed(2)} %
                            <hr></hr>
                            <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}> {parseFloat(((cell.row.original.actual - cell.row.original.actualdis) / cell.row.original.actual) * 100).toFixed(2)} %</div>

                            <br></br> <br></br>
                            {parseFloat((cell.row.original.actualrev / cell.row.original.actual) * 100).toFixed(2)} %
                            <br></br> <br></br>
                            <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}>   {parseFloat(((cell.row.original.actualrev + (cell.row.original.actual - cell.row.original.actualdis)) / cell.row.original.actual) * 100).toFixed(2)} %
                            </div>        </div>) : ""}
                        </div> : parseFloat((cell.row.original.actual / actualsell) * 100).toFixed(2) + '%'),
                    },
                    {
                      Header: "Delta Monthly Budget final forecast 9+3",
                      accessor: "final",
                      Cell: ({ cell }) => (
                        <div >
                          <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}>  {cell.row.values.forecast > 0
                            ? Intl.NumberFormat("fr-FR", {
                              maximumSignificantDigits: 15,
                            }).format(
                              cell.row.values.total - cell.row.values.forecast
                            ) + " MD"
                            : "0 MD"}</div>
                          {(cell.row.original.id_sell && cell.row.original.id_sell !== null && cell.row.original.include === 1) ? (<div>
                            <br></br> <br></br>{Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.original.discount - cell.row.original.forecastdis)} MD
                            <hr></hr>
                            <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}>   {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format((cell.row.values.total - cell.row.original.discount) - (cell.row.original.forecast - cell.row.original.forecastdis))} MD</div>
                            <br></br> <br></br>
                            {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.original.revenu - cell.row.original.forecastrev)} MD
                            <br></br> <br></br>
                            <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}>{Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(((cell.row.values.total - cell.row.original.discount) - (cell.row.original.forecast - cell.row.original.forecastdis)) + (cell.row.original.revenu - cell.row.original.forecastrev))} MD</div>
                          </div>

                          ) : ""}

                        </div>
                      ),
                    },
                    {
                      Header: "Delta Monthly Budget final forecast 9+3 %",
                      accessor: "finall",
                      Cell: ({ cell }) => (
                        <div >
                          <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}>

                            {cell.row.values.forecast > 0
                              ? Intl.NumberFormat("fr-FR", {
                                maximumSignificantDigits: 4,
                              }).format(
                                ((cell.row.values.total - cell.row.values.forecast) / cell.row.values.forecast) * 100
                              ) + " %"
                              : "0 %"}
                          </div>
                          {(cell.row.original.id_sell && cell.row.original.id_sell !== null && cell.row.original.include === 1) ? (<div>
                            <br></br> <br></br>{cell.row.original.discount > 0 ? Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 6 }).format((((cell.row.original.discount - cell.row.original.forecastdis) / cell.row.original.discount) * 100).toFixed(3)) : 0} %
                            <hr></hr>
                            <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}> {(cell.row.original.forecast - cell.row.original.forecastdis) > 0 ? Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format((((cell.row.values.total - cell.row.original.discount) - (cell.row.original.forecast - cell.row.original.forecastdis)) / (cell.row.original.forecast - cell.row.original.forecastdis) * 100).toFixed(3)) : 0} % </div>
                            <br></br> <br></br>
                            {cell.row.original.revenu > 0 ? Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 6 }).format(((cell.row.original.revenu - cell.row.original.forecastrev) / cell.row.original.revenu * 100).toFixed(3)) : 0} %
                            <br></br> <br></br>
                            <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}>
                              {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(((((cell.row.values.total - cell.row.original.discount) - (cell.row.original.forecast - cell.row.original.forecastdis)) + (cell.row.original.revenu - cell.row.original.forecastrev)) / (cell.row.original.forecastrev + (cell.row.original.forecast - cell.row.original.forecastdis)) * 100).toFixed(3))} %
                            </div>            </div>) : ""}

                        </div>
                      ),
                    },
                    {
                      Header: "Delta Forecast 9+3 actual",
                      accessor: "forecasta",
                      Cell: ({ cell }) => (
                        <div >
                          <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}>
                            {cell.row.values.actual > 0
                              ? Intl.NumberFormat("fr-FR", {
                                maximumSignificantDigits: 15,
                              }).format(
                                cell.row.values.forecast - cell.row.values.actual
                              ) + " MD"
                              : "0 MD"} </div>
                          {(cell.row.original.id_sell && cell.row.original.id_sell !== null && cell.row.original.include === 1) ? (<div>
                            <br></br> <br></br>{Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.original.forecastdis - cell.row.original.actualdis)} MD
                            <hr></hr>
                            <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}>
                              {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format((cell.row.original.forecast - cell.row.original.forecastdis) - (cell.row.original.actual - cell.row.original.actualdis))} MD</div>
                              <br></br> <br></br>
                            {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(cell.row.original.forecastrev - cell.row.original.actualrev)} MD
                            <br></br> <br></br>
                            <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}>

                              {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(((cell.row.original.forecast - cell.row.original.forecastdis) - (cell.row.original.actual - cell.row.original.actualdis)) + (cell.row.original.forecastrev - cell.row.original.actualrev))} MD
                            </div>      </div>) : ""}
                        </div>
                      ),
                    },
                    {
                      Header: "Delta Forecast 9+3 actual %",
                      accessor: "forecasta1",
                      Cell: ({ cell }) => (
                        <div >
                          <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}>
                            {cell.row.values.actual > 0
                              ? Intl.NumberFormat("fr-FR", {
                                maximumSignificantDigits: 6,
                              }).format(
                                ((cell.row.values.forecast - cell.row.values.actual) / cell.row.values.actual) * 100
                              ) + " %"
                              : "0 %"}</div>
                          {(cell.row.original.id_sell && cell.row.original.id_sell !== null && cell.row.original.include === 1) ? (<div>
                            <br></br> <br></br>{cell.row.original.actualdis > 0 ? Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 6 }).format((((cell.row.original.forecastdis - cell.row.original.actualdis) / cell.row.original.actualdis) * 100).toFixed(3)) : 0} %
                            <hr></hr>
                            <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}>
                              {(cell.row.original.actual - cell.row.original.actualdis) > 0 ? Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format((((cell.row.original.forecast - cell.row.original.forecastdis) - (cell.row.original.actual - cell.row.original.actualdis)) / (cell.row.original.actual - cell.row.original.actualdis) * 100).toFixed(3)) : 0} %</div>
                              <br></br> <br></br>
                            {cell.row.original.actualrev > 0 ? Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 6 }).format(((cell.row.original.forecastrev - cell.row.original.actualrev) / cell.row.original.actualrev * 100).toFixed(3)) : 0} %
                            <br></br> <br></br>
                            <div className={(cell.row.original.id_sell !== null && cell.row.original.id_sell !== undefined) || (cell.row.original.id_themeG !== null && cell.row.original.id_sell !== undefined) ? "fontbold" : ""}>
                              {Intl.NumberFormat('fr-FR', { maximumSignificantDigits: 15 }).format(((((cell.row.original.forecast - cell.row.original.forecastdis) - (cell.row.original.actual - cell.row.original.actualdis)) + (cell.row.original.forecastrev - cell.row.original.actualrev)) / (cell.row.original.actualrev + (cell.row.original.actual - cell.row.original.actualdis)) * 100).toFixed(3))} %
                            </div>
                          </div>) : ""}

                        </div>
                      ),
                    },
                    {
                      Header: "Détail",
                      accessor: "id_groupe",
                      Cell: ({ cell }) => (
                        cell.row.original.id_groupe !== null ?
                          (<div className="block_action">
                            <Button
                              id={"idLigneC_" + cell.row.values.id}
                              onClick={() => {
                                if (cell.row.original.id_sell === null && cell.row.original.id_themeG === null)
                                  navigate("/detailVis/" + cell.row.values.id_groupe);
                                else if (cell.row.original.id_sell) {
                                  if (cell.row.original.include === 1)
                                    navigate("/grossSells/" + cell.row.values.id_groupe);
                                  else {
                                    navigate("/creationSell/cogs/" + cell.row.values.id_groupe);
                                    localStorage.setItem("redirect", "/visualisation");
                                  }
                                }
                                else if (cell.row.original.id_theme)
                                  navigate("/detailThemeVis/" + cell.row.original.id_theme);
                                else { if (cell.row.original.id_groupe !== null) navigate("/detailThemeGroupe/" + cell.row.original.id_groupe); }

                              }}
                              className="btn btn-success ml-1"
                            >
                              <i className="fa fa-eye" id={"idLigneD_" + cell.row.values.id_groupe} />
                            </Button>
                          </div>) : ""
                      ),
                    },
                    {
                      Header: "ordre",
                      accessor: "ordre",
                      Cell: ({ cell }) => (
                        cell.row.original.id_groupe !== null ?
                          (
                            <div>
                              <Form.Group>
                                <Form.Control
                                  defaultValue={cell.row.values.ordre}
                                  type="number"
                                  onBlur={(val) => {
                                    if (cell.row.original.id_theme === null)
                                      updateOrdre(val.target.value, cell.row.values.id_groupe)
                                    else
                                      updateOrdreT(val.target.value, cell.row.original.id_theme)
                                  }}
                                ></Form.Control>
                              </Form.Group>
                            </div>) : ""
                      ),
                    },
                  ]}
                  className="-striped -highlight primary-pagination"
                />}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Visualisation;
