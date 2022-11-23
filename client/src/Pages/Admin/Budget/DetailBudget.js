import ReactTable from "../../../components/ReactTable/ReactTable.js";
import { Alert,Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import React,{useEffect,useCallback} from "react";
import { getDetailBudjet,updateBudjet,budgetChangeEtat,budjetGetById,exportExcelUser } from "../../../Redux/budgetReduce";
import { verification } from "../../../Redux/usersReduce";
import { useDispatch } from "react-redux";
import NotificationAlert from "react-notification-alert";
import { useNavigate,useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import SweetAlert from "react-bootstrap-sweetalert";
import ExcelJs from "exceljs";
import ImportExcel from "./ImportExcel";
// core components
function DetailBudget() {
  var token = localStorage.getItem("x-access-token");
  var anneeLocal = localStorage.getItem("annee");
  const [alert, setAlert] = React.useState(null);
  var decoded = jwt_decode(token);
  var idRole = decoded.idRole;
  const [etatBudjet, setEtatBudjet] = React.useState(0);
  const [note, setNote] = React.useState(null);
  const [titre, setTitre] = React.useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useParams();
  var id =location.id;
  var idUserSujet =location.idUserSujet;
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
  const [entities, setEntities] = React.useState([]);
  const getBudjet = useCallback(async () => {
    var response = await dispatch(getDetailBudjet({id,idRole,idUserSujet})); 
    var res = (response.payload);
    setEntities(res);

    var response1 = await dispatch(budjetGetById(id));
    setEtatBudjet(response1.payload.etat)
    setNote(response1.payload.note)
    setTitre(response1.payload.user_sujets.titre)
  }, [dispatch,id,idRole,idUserSujet]);
  
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
  function sommeQ1(list){
    var jan = list.jan;
    var feb = list.feb;
    var mars = list.mars;
    var tot = parseFloat(jan)+parseFloat(feb)+parseFloat(mars);
    var q1= document.getElementById(list.id+"-q1");
    q1.value=tot;
    return tot;
  }
  function sommeQ2(list){
    var apr = list.apr;
    var mai = list.mai;
    var juin = list.juin;
    var tot = parseFloat(apr)+parseFloat(mai)+parseFloat(juin);
    var q2= document.getElementById(list.id+"-q2");
    q2.value=tot;
    return tot;

  }

  function sommeQ3(list){
    var july = list.july;
    var aug = list.aug;
    var sep = list.sep;
    var tot = parseFloat(july)+parseFloat(aug)+parseFloat(sep);
    var q3= document.getElementById(list.id+"-q3");
    q3.value=tot;
    return tot;

  }
  function sommeQ4(list){
    var oct = list.oct;
    var nov = list.nov;
    var dec = list.dec;
    var tot = parseFloat(oct)+parseFloat(nov)+parseFloat(dec);
    var q4= document.getElementById(list.id+"-q4");
    q4.value=tot;
    return tot;

  }
  function sommeTotal(list){
    var q1 = list.q1;
    var q2 = list.q2;
    var q3 = list.q3;
    var q4 = list.q4;
    var tot = parseFloat(q1)+parseFloat(q2)+parseFloat(q3)+parseFloat(q4);
    var total= document.getElementById(list.id+"-total");
    total.value=tot;
    return tot;

  }
  function Budjet({entities}){
    var list = [];
    
    for (const key in entities) {
      const element = entities[key];
      const sujet = element[0].sujets.num+" : "+element[0].sujets.sujet;
      let som = 0;
      element.forEach(val=>{
        som = som + parseFloat(val.total);
      })
      
      list.push(
        <Card className="budjet" key={"key-"+key}>
          <Card.Body>
              <h3>{sujet} (Total : {Intl.NumberFormat('fr-FR',{ maximumSignificantDigits: 15 }).format(som)} TND) </h3>
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
                    Cell: ({ cell }) => (
                      <div>
                        <Form.Group>
                          <Form.Control
                            defaultValue={cell.row.values.commentaire}
                            type="text"
                            onBlur={(val) => {
                              var e = {};
                              e = entities;
                              e[key][cell.row.id] = {...e[key][cell.row.id],commentaire:(val.target.value)}
                              setEntities(e);
                            }}
                          ></Form.Control>
                        </Form.Group>
                      </div>
                    ),
                  },
                  {
                    Header: "anneePrec",
                    accessor: "anneePrec",
                    Cell: ({ cell }) => (
                      <div>
                        <Form.Group>
                          <Form.Control
                            defaultValue={cell.row.values.anneePrec}
                            placeholder="0"
                            type="text"
                            min={"0"}
                            id={cell.row.values.id+"-anneePrec"}
                            onBlur={(val) => {
                              var e = {};
                              e = entities;
                              var valFinal = val.target.value.trim()!==""?parseFloat((val.target.value).replace(" ","")):0;
                              e[key][cell.row.id] = {...e[key][cell.row.id],anneePrec:valFinal}
                              setEntities(e);
                            }}
                          ></Form.Control>
                        </Form.Group>
                      </div>
                    ),
                  },
                  {
                    Header: "total",
                    accessor: "total",
                    Cell: ({ cell }) => (
                      <div>
                        <Form.Group>
                          <Form.Control
                            readOnly
                            defaultValue={cell.row.values.total}
                            placeholder="0"
                            type="text"
                            min={"0"}
                            id={cell.row.values.id+"-total"}
                          ></Form.Control>
                        </Form.Group>
                      </div>
                    ),
                  },
                  {
                    Header: "Janvier",
                    accessor: "jan",
                    Cell: ({ cell }) => (
                      <div>
                        <Form.Group>
                          <Form.Control
                            defaultValue={cell.row.values.jan}
                            placeholder="0"
                            type="text"
                            min={"0"}
                            onBlur={(val) => { 
                               var e = {};
                              e = entities;//set value janvier
                              var valFinal = val.target.value.trim()!==""?parseFloat((val.target.value).replace(" ","")):0;
                              e[key][cell.row.id] = {...e[key][cell.row.id],jan:valFinal};

                              //somme q1
                              var tot = sommeQ1(e[key][cell.row.id]);
                              e[key][cell.row.id] = {...e[key][cell.row.id],q1:tot};

                              //some total
                              var total = sommeTotal(e[key][cell.row.id]);
                              e[key][cell.row.id] = {...e[key][cell.row.id],total:total};
                              setEntities(e);
                           
                            }}
                          ></Form.Control>
                        </Form.Group>
                      </div>
                    ),
                  },
                  {
                    Header: "Février",
                    accessor: "feb",
                    Cell: ({ cell }) => (
                      <div>
                        <Form.Group>
                          <Form.Control
                            defaultValue={cell.row.values.feb}
                            placeholder="0"
                            type="text"
                            min={"0"}
                            onBlur={(val) => {
                              var e = {};
                              e = entities;
                              var valFinal = val.target.value.trim()!==""?parseFloat((val.target.value).replace(" ","")):0;
                              e[key][cell.row.id] = {...e[key][cell.row.id],feb:valFinal}

                              var tot = sommeQ1(e[key][cell.row.id])
                              e[key][cell.row.id] = {...e[key][cell.row.id],q1:tot}                              

                              //some total
                              var total = sommeTotal(e[key][cell.row.id]);
                              e[key][cell.row.id] = {...e[key][cell.row.id],total:total};
                              setEntities(e);
                            }}
                          ></Form.Control>
                        </Form.Group>
                      </div>
                    ),
                  },
                  {
                    Header: "Mars",
                    accessor: "mars",
                    Cell: ({ cell }) => (
                      <div>
                        <Form.Group>
                          <Form.Control
                            defaultValue={cell.row.values.mars}
                            placeholder="0"
                            type="text"
                            min={"0"}
                            onBlur={(val) => {
                              var e = {};
                              e = entities;
                              var valFinal = val.target.value.trim()!==""?parseFloat((val.target.value).replace(" ","")):0;
                              e[key][cell.row.id] = {...e[key][cell.row.id],mars:valFinal}

                              var tot = sommeQ1(e[key][cell.row.id])
                              e[key][cell.row.id] = {...e[key][cell.row.id],q1:tot}

                              //some total
                              var total = sommeTotal(e[key][cell.row.id]);
                              e[key][cell.row.id] = {...e[key][cell.row.id],total:total};
                              setEntities(e);
                            }}
                          ></Form.Control>
                        </Form.Group>
                      </div>
                    ),
                  },
                  {
                    Header: "q1",
                    accessor: "q1",
                    Cell: ({ cell }) => (
                      <div>
                        <Form.Group>
                          <Form.Control
                            readOnly
                            defaultValue={cell.row.values.q1}
                            placeholder="0"
                            type="text"
                            min={"0"}
                            id={cell.row.values.id+"-q1"}
                          ></Form.Control>
                        </Form.Group>
                      </div>
                    ),
                  },
                  {
                    Header: "Avril",
                    accessor: "apr",
                    Cell: ({ cell }) => (
                      <div>
                        <Form.Group>
                          <Form.Control
                            defaultValue={cell.row.values.apr}
                            placeholder="0"
                            type="text"
                            min={"0"}
                            onBlur={(val) => {
                              var e = {};
                              e = entities; 
                              var valFinal = val.target.value.trim()!==""?parseFloat((val.target.value).replace(" ","")):0;
                              e[key][cell.row.id] = {...e[key][cell.row.id],apr:valFinal}

                              var tot = sommeQ2(e[key][cell.row.id])
                              e[key][cell.row.id] = {...e[key][cell.row.id],q2:tot}

                              //some total
                              var total = sommeTotal(e[key][cell.row.id]);
                              e[key][cell.row.id] = {...e[key][cell.row.id],total:total};
                              setEntities(e);
                            }}
                          ></Form.Control>
                        </Form.Group>
                      </div>
                    ),
                  },
                  {
                    Header: "Mai",
                    accessor: "mai",
                    Cell: ({ cell }) => (
                      <div>
                        <Form.Group>
                          <Form.Control
                            defaultValue={cell.row.values.mai}
                            placeholder="0"
                            type="text"
                            min={"0"}
                            onBlur={(val) => {
                              var e = {};
                              e = entities;
                              var valFinal = val.target.value.trim()!==""?parseFloat((val.target.value).replace(" ","")):0;
                              e[key][cell.row.id] = {...e[key][cell.row.id],mai:valFinal}

                              var tot = sommeQ2(e[key][cell.row.id])
                              e[key][cell.row.id] = {...e[key][cell.row.id],q2:tot}

                              //some total
                              var total = sommeTotal(e[key][cell.row.id]);
                              e[key][cell.row.id] = {...e[key][cell.row.id],total:total};
                              setEntities(e);
                            }}
                          ></Form.Control>
                        </Form.Group>
                      </div>
                    ),
                  },
                  {
                    Header: "Juin",
                    accessor: "juin",
                    Cell: ({ cell }) => (
                      <div>
                        <Form.Group>
                          <Form.Control
                            defaultValue={cell.row.values.juin}
                            placeholder="0"
                            type="text"
                            min={"0"}
                            onBlur={(val) => {
                              var e = {};
                              e = entities;
                              var valFinal = val.target.value.trim()!==""?parseFloat((val.target.value).replace(" ","")):0;
                              e[key][cell.row.id] = {...e[key][cell.row.id],juin:valFinal}

                              var tot = sommeQ2(e[key][cell.row.id])
                              e[key][cell.row.id] = {...e[key][cell.row.id],q2:tot}

                              //some total
                              var total = sommeTotal(e[key][cell.row.id]);
                              e[key][cell.row.id] = {...e[key][cell.row.id],total:total};
                              setEntities(e);
                            }}
                          ></Form.Control>
                        </Form.Group>
                      </div>
                    ),
                  },
                  {
                    Header: "Q2",
                    accessor: "q2",
                    Cell: ({ cell }) => (
                      <div>
                        <Form.Group>
                          <Form.Control
                            readOnly
                            defaultValue={cell.row.values.q2}
                            placeholder="0"
                            type="text"
                            min={"0"}
                            id={cell.row.values.id+"-q2"}
                          ></Form.Control>
                        </Form.Group>
                      </div>
                    ),
                  },
                  {
                    Header: "juillet",
                    accessor: "july",
                    Cell: ({ cell }) => (
                      <div>
                        <Form.Group>
                          <Form.Control
                            defaultValue={cell.row.values.july}
                            placeholder="0"
                            type="text"
                            min={"0"}
                            onBlur={(val) => {
                              var e = {};
                              e = entities;
                              var valFinal = val.target.value.trim()!==""?parseFloat((val.target.value).replace(" ","")):0;
                              e[key][cell.row.id] = {...e[key][cell.row.id],july:valFinal}
                              
                              var tot = sommeQ3(e[key][cell.row.id])
                              e[key][cell.row.id] = {...e[key][cell.row.id],q3:tot}

                              //some total
                              var total = sommeTotal(e[key][cell.row.id]);
                              e[key][cell.row.id] = {...e[key][cell.row.id],total:total};
                              setEntities(e);
                            }}
                          ></Form.Control>
                        </Form.Group>
                      </div>
                    ),
                  },
                  {
                    Header: "Août",
                    accessor: "aug",
                    Cell: ({ cell }) => (
                      <div>
                        <Form.Group>
                          <Form.Control
                            defaultValue={cell.row.values.aug}
                            placeholder="0"
                            type="text"
                            min={"0"}
                            onBlur={(val) => {
                              var e = {};
                              e = entities;
                              var valFinal = val.target.value.trim()!==""?parseFloat((val.target.value).replace(" ","")):0;
                              e[key][cell.row.id] = {...e[key][cell.row.id],aug:valFinal}
                              
                              var tot = sommeQ3(e[key][cell.row.id])
                              e[key][cell.row.id] = {...e[key][cell.row.id],q3:tot}
  
                              //some total
                              var total = sommeTotal(e[key][cell.row.id]);
                              e[key][cell.row.id] = {...e[key][cell.row.id],total:total};
                              setEntities(e);
                            }}
                          ></Form.Control>
                        </Form.Group>
                      </div>
                    ),
                  },
                  {
                    Header: "septembre",
                    accessor: "sep",
                    Cell: ({ cell }) => (
                      <div>
                        <Form.Group>
                          <Form.Control
                            defaultValue={cell.row.values.sep}
                            placeholder="0"
                            type="text"
                            min={"0"}
                            onBlur={(val) => {
                              var e = {};
                              e = entities;
                              var valFinal = val.target.value.trim()!==""?parseFloat((val.target.value).replace(" ","")):0;
                              e[key][cell.row.id] = {...e[key][cell.row.id],sep:valFinal}
                              
                              var tot = sommeQ3(e[key][cell.row.id])
                              e[key][cell.row.id] = {...e[key][cell.row.id],q3:tot}
  
                              //some total
                              var total = sommeTotal(e[key][cell.row.id]);
                              e[key][cell.row.id] = {...e[key][cell.row.id],total:total};
                              setEntities(e);
                            }}
                          ></Form.Control>
                        </Form.Group>
                      </div>
                    ),
                  },
                  {
                    Header: "q3",
                    accessor: "q3",
                    Cell: ({ cell }) => (
                      <div>
                        <Form.Group>
                          <Form.Control
                            readOnly
                            defaultValue={cell.row.values.q3}
                            placeholder="0"
                            type="text"
                            min={"0"}
                            id={cell.row.values.id+"-q3"}
                          ></Form.Control>
                        </Form.Group>
                      </div>
                    ),
                  },
                  {
                    Header: "octobre",
                    accessor: "oct",
                    Cell: ({ cell }) => (
                      <div>
                        <Form.Group>
                          <Form.Control
                            defaultValue={cell.row.values.oct}
                            placeholder="0"
                            type="text"
                            min={"0"}
                            onBlur={(val) => {
                              var e = {};
                              e = entities;
                              var valFinal = val.target.value.trim()!==""?parseFloat((val.target.value).replace(" ","")):0;
                              e[key][cell.row.id] = {...e[key][cell.row.id],oct:valFinal}
                              
                              var tot = sommeQ4(e[key][cell.row.id])
                              e[key][cell.row.id] = {...e[key][cell.row.id],q4:tot}
  
                              //some total
                              var total = sommeTotal(e[key][cell.row.id]);
                              e[key][cell.row.id] = {...e[key][cell.row.id],total:total};
                              setEntities(e);
                            }}
                          ></Form.Control>
                        </Form.Group>
                      </div>
                    ),
                  },
                  {
                    Header: "novembre",
                    accessor: "nov",
                    Cell: ({ cell }) => (
                      <div>
                        <Form.Group>
                          <Form.Control
                            defaultValue={cell.row.values.nov}
                            placeholder="0"
                            type="text"
                            min={"0"}
                            onBlur={(val) => {
                              var e = {};
                              e = entities;
                              var valFinal = val.target.value.trim()!==""?parseFloat((val.target.value).replace(" ","")):0;
                              e[key][cell.row.id] = {...e[key][cell.row.id],nov:valFinal}
                              
                              var tot = sommeQ4(e[key][cell.row.id])
                              e[key][cell.row.id] = {...e[key][cell.row.id],q4:tot}
  
                              //some total
                              var total = sommeTotal(e[key][cell.row.id]);
                              e[key][cell.row.id] = {...e[key][cell.row.id],total:total};
                              setEntities(e);
                            }}
                          ></Form.Control>
                        </Form.Group>
                      </div>
                    ),
                  },
                  {
                    Header: "decembre",
                    accessor: "dec",
                    Cell: ({ cell }) => (
                      <div>
                        <Form.Group>
                          <Form.Control
                            defaultValue={cell.row.values.dec}
                            placeholder="0"
                            type="text"
                            min={"0"}
                            onBlur={(val) => {
                              var e = {};
                              e = entities;
                              var valFinal = val.target.value.trim()!==""?parseFloat((val.target.value).replace(" ","")):0;
                              e[key][cell.row.id] = {...e[key][cell.row.id],dec:valFinal}
                              
                              var tot = sommeQ4(e[key][cell.row.id])
                              e[key][cell.row.id] = {...e[key][cell.row.id],q4:tot}
  
                              //some total
                              var total = sommeTotal(e[key][cell.row.id]);
                              e[key][cell.row.id] = {...e[key][cell.row.id],total:total};
                              setEntities(e);
                            }}
                          ></Form.Control>
                        </Form.Group>
                      </div>
                    ),
                  },
                  {
                    Header: "q4",
                    accessor: "q4",
                    Cell: ({ cell }) => (
                      <div>
                        <Form.Group>
                          <Form.Control
                            readOnly
                            defaultValue={cell.row.values.q4}
                            placeholder="0"
                            type="text"
                            min={"0"}
                            id={cell.row.values.id+"-q4"}
                          ></Form.Control>
                        </Form.Group>
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
    if(document.getElementById("loaderTable") !== null){
      document.getElementById("loaderTable").classList.add("hidden");
    }
    if(document.getElementById("save") !== null)
      document.getElementById("save").classList.remove("hidden");
    if(document.getElementById("responsable") !== null)
      document.getElementById("responsable").classList.remove("hidden");
      
    return (list)
  }
  const listeBudget = useCallback(
    async () => {
      var red = localStorage.getItem("redirect");
      navigate(red);
    },
    [navigate]
  );
  const saveTable = useCallback(
    async (list) => {
    dispatch(updateBudjet({ entities: list, id:id})).then((e) => {
      if(e.payload===true){
        notify("tr", "Insertion avec succes", "success");
        setTimeout(() => {
          getBudjet();
        }, 1500);
      }else{                
        notify("tr", "Vérifier vos données!", "danger");
      }
    });
  },
  [dispatch,getBudjet,id]
);
  const changeEtat = useCallback(
    async (valid,list) => {
      /* var etat = 0;
      if(idRole > 5){
        etat=1;
      } else {
        etat=valid===1?2:0;
      } */
      var etat = 1;
      dispatch(budgetChangeEtat({ idBudget:id,id:idUserSujet,idEquipe:idEquipe, etat:etat,note:null })).then((e) => {
        if(e.payload===true){
          notify("tr", "Envoyer avec succes", "success");
          hideAlert();
          saveTable(list);
        }else{                
          notify("tr", "Vérifier vos données!", "danger");
        }
      });
    },
    [idEquipe,idUserSujet,dispatch,saveTable,id]
  );
  /* function listeBudget() {
    navigate('/budget');
  } */
  const hideAlert = () => {
    setAlert(null);
  };
  const confirmMessage = useCallback(
    async (valid,list) => {
      setAlert(
        <SweetAlert
          style={{ display: "block", marginTop: "-100px" }}
          title={valid===1?"Êtes-vous sûr d'envoyer le budget ?":"Vous êtes sure de refuser ?"}
          onConfirm={() => changeEtat(valid,list)}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          confirmBtnText="Oui"
          cancelBtnText="Non"
          showCancel
        >
        </SweetAlert>
      );
    },
    [changeEtat]
  );
  //exportEcel
  const exportToExcel = useCallback(async(res,titre) => {
    var first = Object.keys(res)[0]

    let sheetName = `Budget_${titre}_${anneeLocal}.xlsx`;
    let headerName = "RequestsList";

    // showGridLines: false 
    let workbook = new ExcelJs.Workbook();
    let sheet = workbook.addWorksheet(sheetName, {
      views: [{ showGridLines: true }]
    });
    // let sheet2 = workbook.addWorksheet("Second sheet", { views: [{ showGridLines: false }] });

    // header
    let columnArr = [];
    for (let i in res[first][0]) {
      if(i !=="sujet" && i !== "titre"){
        let tempObj = { name: "" };
        tempObj.name = i;
        columnArr.push(tempObj);
      }
    }
    sheet.addTable({
      name: `Header`,
      ref: "F1",
      headerRow: true,
      totalsRow: false,
      style: {
        theme: "",
        showRowStripes: false,
        showFirstColumn: true,
        width: 200
      },
      columns: [{ name: "Budget : "+anneeLocal }],
      rows: [[``]]
    });
    sheet.addTable({
      name: `Header`,
      ref: "A1",
      headerRow: true,
      totalsRow: false,
      style: {
        theme: "",
        showRowStripes: false,
        showFirstColumn: true,
        width: 200
      },
      columns: [{ name: titre }],
      rows: [[``]]
    });
    var i=3;
    var arrayStyle = [];
    for (const key in res) {
      const element = res[key];
      sheet.addTable({
        name: `Header`,
        ref: "A"+i,
        headerRow: true,
        totalsRow: false,
        style: {
          theme: "",
          showRowStripes: true,
          showFirstColumn: true,
          width: 200
        },
        columns: [{ name: element[0].sujet }],
        rows: [[``]]
      });
      sheet.getCell("A"+i).font = { size: 25, bold: true };
      i+=2;
      arrayStyle.push(i)
  
      sheet.addTable({
        name: headerName+i,
        ref: "A"+i, 
        headerRow: true,
        totalsRow: false,
        style: {
          theme: "TableStyleMedium2",
          showRowStripes: false,
          width: 1600
        },
        columns: columnArr ? columnArr : [{ name: "" }],
        rows: element.map((e) => {
          let arr = [];
          for (let i in e) {
            if(i !== "sujet" && i !== "titre")
              arr.push(e[i]);
          }
          return arr;
        })
      });
      i+=element.length+2;
    }

    sheet.getCell("F1").font = { size: 25, bold: true };
    sheet.getCell("A1").font = { size: 25, bold: true };

    for (let index = 0; index < arrayStyle.length; index++) {
      var element = arrayStyle[index]; 
      var table = sheet.getTable(headerName+element);
      for (let i = 0; i < table.table.columns.length; i++) {
        for (let j = 0; j < table.table.rows.length; j++) {
          let rowCell = sheet.getCell(`${String.fromCharCode(65 + i)}${element + 1+j}`);
          rowCell.alignment = { vertical: 'top', horizontal: 'left' };
        }
      }
      table.commit();
    }

    const writeFile = (fileName, content) => {
      const link = document.createElement("a");
      const blob = new Blob([content], {
        type: "application/vnd.ms-excel;charset=utf-8;"
      });
      link.download = fileName;
      link.href = URL.createObjectURL(blob);
      link.click();
    };

    workbook.xlsx.writeBuffer().then((buffer) => {
      writeFile(sheetName, buffer);
    });
  }, [anneeLocal]);
  const getDetail = useCallback(async (titre) => {
    var response = await dispatch(exportExcelUser({id:id,idUsers:idEquipe,annee:anneeLocal})); 
    var res = response.payload;
    exportToExcel(res,titre);
  }, [dispatch,exportToExcel,anneeLocal,idEquipe,id]);
  
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
              Retour à la liste
            </Button>
          </Col>
        </Row>
        {etatBudjet===0?<ImportExcel id={id}></ImportExcel>:""}
        <Row>
          <Col md="12">
            <h4 className="title  float-left">Détail budget {titre} </h4>
            {etatBudjet===0?
              <Button
                className="btn btn-success mt-4 float-right"
                onClick={()=>{
                  getDetail(titre);
                }}
              >
                Export excel
                <i
                  className="fas fa-file-excel"
                />
              </Button>
            :""}
          </Col>
        </Row>
        {note !== null && note!== "" ? (
          <Alert variant="danger">
            <span>{note}</span>
          </Alert>
        ) : ""}

        <div className="text-center">
          <img
            id="loaderTable"
            className=""
            src={require("../../../assets/img/loader.gif").default} 
            alt="loader"
          />
        </div>
        <br></br>
        <Budjet entities={entities}></Budjet>
        <Row>
          <Col md="12">
            {etatBudjet===0?
              <div>
                <Button
                  id="save"
                  className="btn-wd mr-1 float-right hidden"
                  type="button"
                  variant="info"
                  onClick={() =>
                    saveTable(entities)
                  }
                >
                  <span className="btn-label">
                    <i className="fas fa-save"></i>
                  </span>
                  Enregistrer
                </Button>
                <br></br>
                <br clear="all"></br>
                <Button
                  id="responsable"
                  className="btn-wd mr-1 float-right hidden"
                  type="button"
                  variant="success"
                  onClick={() =>{
                    confirmMessage(1,entities);
                  }}
                >
                  <span className="btn-label">
                    <i className="fas fa-check"></i>
                  </span>
                  Envoyer responsable
                </Button>
              </div>
            :""}
            
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default DetailBudget;
