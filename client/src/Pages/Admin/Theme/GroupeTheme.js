import ReactTable from "../../../components/ReactTable/ReactTable.js";
import { Button, Card, Container, Row, Col,Form } from "react-bootstrap";
import React,{useEffect,useCallback} from "react";
import { useDispatch } from "react-redux";
import NotificationAlert from "react-notification-alert";
import { verification,getUserByRole } from "../../../Redux/usersReduce";
import { getNumSujet } from "../../../Redux/sujetReduce";
import { saveTheme,getThemeBudget,themeDeleted,exportExcel } from "../../../Redux/themeReduce";
import ExcelJs from "exceljs";
import Select from "react-select";
import SweetAlert from "react-bootstrap-sweetalert";
import { useNavigate } from "react-router-dom";

// core components
function GroupeTheme() {
  var anneeLocal =localStorage.getItem("annee");
  const navigate = useNavigate();
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
      label: "Sujet",
      isDisabled: true,
    },
  ]);
  const [num, setNum] = React.useState([]);
  const [optionsUser, setOptionsUser] = React.useState([
    {
      value: "",
      label: "Utilisateurs",
      isDisabled: true,
    },
  ]);
  const [users, setUsers] = React.useState([]);
  const [titre, setTitre] = React.useState("");

  //verif token
  const getNum = useCallback(async (v) => {
   var joinuser=[]
   var arrayOption = [];
   if(v.length > 0){ v.forEach((e) => {
      joinuser.push(e.value);
    })
    var response = await dispatch(getNumSujet({users:joinuser,annee:anneeLocal}));
    var res = response.payload;
    
    res.forEach((e) => {
      arrayOption.push({ value: e.sujets.id, label: e.sujets.num});
    });
    }
    setOptions(arrayOption)
  }, [dispatch]);

  const getTheme = useCallback(async () => {
    var response = await dispatch(getThemeBudget({annee:anneeLocal}));
    setEntities(response.payload);
  }, [dispatch,anneeLocal]);
  
  //verif token
  const verifToken = useCallback(async () => {
    var response = await dispatch(verification());
    if(response.payload === false){
      localStorage.clear();
      window.location.replace("/login");
    }
  }, [dispatch]);
  
  
  const getUser = useCallback(async () =>{
    var user = await dispatch(getUserByRole(0));  
    var entities = user.payload;
    var arrayOption = [];
    entities.forEach((e) => {
      arrayOption.push({ value: e.id, label: e.nom_prenom });
    });
    setOptionsUser(arrayOption);
  }, [dispatch])

  useEffect(() => {
    verifToken();
   // getNum();
    getTheme();
    getUser();
  }, [getTheme,verifToken])
  
  async function submitForm() {
    if(titre !== "" && num.length > 0 && users.length >0){
      dispatch(
        saveTheme({
          titre: titre,
          num: num, 
          users: users,
          annee:anneeLocal
        })
      ).then(()=>{
        notify("tr", "Insertion avec succes", "success");
        getTheme();
      });
    } else {
      notify("tr", "Vérifier vos données", "danger");
    }
  }
  const hideAlert = () => {
    setAlert(null);
  };
  function removeTheme(id) {
    dispatch(themeDeleted(id)).then((e) => {
      notify("tr", "Supprimer avec succes", "success");
      getTheme();
      hideAlert()
    });
  }
  const confirmRemove = (id) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Étes vous sure de supprimer cette ligne?"
        onConfirm={() => removeTheme(id)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      ></SweetAlert>
    );
  };


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
  const getDetail = useCallback(async (id,titre) => {
    var response = await dispatch(exportExcel({id:id,annee:anneeLocal})); 
    var res = (response.payload);
    var nb = Object.keys(res).length;
    if (nb > 0) {
      exportToExcel(res,titre);
    }
  }, [dispatch,anneeLocal,exportToExcel]);
  return (
    <>
      <Container fluid>
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        {alert}        
        <Card className="card-header">
          <Card.Body>
            <h4 className="title">Numero sujet</h4>
            <Row>
            <Col className="pr-1" md="4">
              
            <Form.Check>
                  <Form.Check.Label>
                    <Form.Check.Input
                      type="checkbox"
                      onClick={(value) => {
                        if (value.target.checked) {
                          setUsers(optionsUser);                          
                           getNum(optionsUser)
                        } else {
                          setUsers([]);                        
                          getNum([])
                        }
                      }}
                    ></Form.Check.Input>
                    <span className="form-check-sign"></span>
                    Sélectionner tous
                  </Form.Check.Label>
                </Form.Check>
                <Form.Group id="roleClass">
                  <Select
                    isMulti
                    placeholder="Users"
                    className="react-select primary"
                    classNamePrefix="react-select"
                    value={users}
                    onChange={(value) => {
                      setUsers(value);
                      getNum(value)
                    }}
                    options={optionsUser}
                  />
                </Form.Group>
              </Col>
              <Col className="pr-1" md="4">
             
                <Form.Group id="roleClass">
                 Sujet 
                  <Select
                    isMulti
                    placeholder="Sujet"
                    className="react-select primary"
                    classNamePrefix="react-select"
                    value={num}
                    onChange={(value) => {
                      setNum(value);
                    }}
                    options={options}
                  />
                </Form.Group>
              </Col>
              <Col className="pr-1" md="4">
                <Form.Group>
                  Titre groupé
                  <Form.Control
                    defaultValue={titre}
                    placeholder="Titre groupé"
                    className="required"
                    name="Titre"
                    type="text"
                    onChange={(value) => {
                      setTitre(value.target.value);
                    }}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col className="pr-1" md="4">
                <Button
                    className="btn btn-success ml-1"
                    onClick={submitForm}
                  >
                    Enregistrer
                    <i
                      className="fas fa-save"
                    />
                </Button> 
              </Col>

            </Row>
            <br></br>
            <br></br>
            <Row>
              <Col md="12">
                <ReactTable
                  data={entities}
                  columns={[
                    {
                      Header: "Titre",
                      accessor: "themes.titre",
                    },
                    {
                      Header: "Année",
                      accessor: "themes.annee",
                    },
                    {
                      Header: "Détail",
                      accessor: "",
                      Cell: ({ cell }) => (
                        <div className="block_action">
                          <Button
                            id={"idLigneC_" + cell.row.values.id}
                            onClick={() => {
                              navigate("/detailTheme/"+cell.row.original.themes.id);
                            }}
                            className="btn btn-success ml-1"
                          >
                            Détail <i className="fa fa-plus" id={"idLigneD_" + cell.row.values.id} /> 
                          </Button>
                        </div>
                      ),
                    },
                    {
                      Header: "Export",
                      accessor: "id",
                      Cell: ({ cell }) => (
                        <div className="block_action">
                          <Button
                            id={"idLigneC_" + cell.row.values.id}
                            className="btn btn-success ml-1"
                            onClick={()=>{
                              getDetail(cell.row.original.themes.id,cell.row.original.themes.titre);
                            }}
                          >
                            Export excel
                            <i
                              className="fas fa-file-excel"
                              id={"idLigneD_" + cell.row.values.id}
                            />
                          </Button>
                        </div>
                      ),
                    },
                    {
                      Header: "Action",
                      accessor: "themes.id",
                      Cell: ({ cell }) => (
                        <div className="block_action">
                          <Button
                            id={"idLigneC_" + cell.row.values.id}
                            className="btn btn-danger ml-1"
                            onClick={()=>{
                              confirmRemove(cell.row.original.themes.id);
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
            ) : ""}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default GroupeTheme;
