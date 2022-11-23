import ReactTable from "../../../../components/ReactTable/ReactTable.js";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React,{useEffect,useCallback} from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { getBudgetUsers } from "../../../../Redux/userSujetReduce";
import { verification } from "../../../../Redux/usersReduce";
import { exportExcels } from "../../../../Redux/budgetReduce";
import ExcelJs from "exceljs";

// core components
function SuiviResponsble() {
  var token = localStorage.getItem("x-access-token");
  var anneeLocal =localStorage.getItem("annee");
  var decoded = jwt_decode(token);
  var id = decoded.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [entitiesUser, setEntitiesUser] = React.useState([]);

  const getBudjetUser = useCallback(async () => {
    var response = await dispatch(getBudgetUsers({idUser:id,annee:anneeLocal})); 
    setEntitiesUser(response.payload);
   
  }, [dispatch,anneeLocal,id]);
  //verif token
  const verifToken = useCallback(async () => {
    var response = await dispatch(verification());
    if(response.payload === false){
      localStorage.clear();
      window.location.replace("/login");
    }
  }, [dispatch]);

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

  const getDetail = useCallback(async (idUserSujet,idUser,titre) => {
    /* var response = await dispatch(exportExcels({idUserSujet:idUserSujet,idUser:[]}));  */
    var response = await dispatch(exportExcels({idUserSujet:idUserSujet,idUsers:idUser,annee:anneeLocal})); 
    var res = (response.payload);
    exportToExcel(res,titre);
  }, [dispatch,exportToExcel,anneeLocal]);
  useEffect(() => {
    verifToken();
    getBudjetUser();
  }, [getBudjetUser,verifToken])
  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <h4 className="title">Suivi Budget</h4>
            <Card className="card-header">
              <Card.Body>
                  <ReactTable
                    data={entitiesUser}
                    columns={[
                      {
                        Header: "Titre",
                        accessor: "titre",
                      },
                      {
                        Header: "Année",
                        accessor: "annee",
                      },
                      {
                        Header: "Détail",
                        accessor: "id",
                        Cell: ({ cell }) => (
                          <div className="block_action">
                            <Button
                              id={"idLigneC_" + cell.row.values.id}
                              onClick={() => {
                                localStorage.setItem("redirect","/suivi");
                                navigate('/userBudget/'+cell.row.values.id);                                
                              }}
                              className="btn btn-success ml-1"
                            >
                              Visualisation <i className="fa fa-eye" id={"idLigneD_" + cell.row.values.id} /> 
                            </Button>
                          </div>
                        ),
                      },
                      {
                        Header: "export",
                        accessor: "",
                        Cell: ({ cell }) => (
                          <div className="block_action">
                            <Button
                              id={"idLigneC_" + cell.row.values.id}
                              onClick={() => {
                                getDetail(cell.row.original.id,cell.row.original.users.id,cell.row.values.titre);                              
                              }}
                              className="btn btn-success ml-1"
                            >
                              export <i className="fa fa-file" id={"idLigneD_" + cell.row.values.id} /> 
                            </Button>
                          </div>
                        ),
                      },
                    ]} 
                    className="-striped -highlight primary-pagination"
                  />
               
                {entitiesUser.length === 0 ? (
                  <div className="text-center">Aucun donnée trouvé</div>
                ) : ""}
              </Card.Body>
            </Card>
          </Col>
        </Row>
     
      </Container>
    </>
  );
}

export default SuiviResponsble;
