import React, { useEffect, useCallback } from "react";

import NotificationAlert from "react-notification-alert";

import { CSVReader } from "react-papaparse";
import { useDispatch } from "react-redux";

import { Container } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import { getActiveArborecence } from "../../../Redux/arborecenceReduce";
import { updateBudjetExcel } from "../../../Redux/budgetReduce";
const buttonRef = React.createRef();

function ImportIms({id}) {
  const dispatch = useDispatch();
  const [arb, setArb] = React.useState([]);
  const [noTrouver, setNoTrouver] = React.useState([]);
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

  const handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };
  //get Produit
  const getArborecences = useCallback(async () => {
    var prod = await dispatch(getActiveArborecence());
    var entities = prod.payload;
    var arrayOption = {};
    entities.forEach((e) => {
      if (e.num !== null) arrayOption[e.num] = { id: e.id, num: e.num };
    });
    setArb(arrayOption);
  }, [dispatch]);

  const handleOnFileLoad = (data) => {
    var array = [];
    var arraImport = [];
    Object.keys(data).forEach((element) => {
      if (arb[data[element].data[0]]) {
        var anneePrec= 0;
        var jan= 0;
        var feb= 0;
        var mars= 0;
        var apr= 0;
        var mai= 0;
        var juin= 0;
        var july= 0;
        var aug= 0;
        var sep= 0;
        var oct= 0;
        var nov= 0;
        var dec= 0;

        if(data[element].data[3] !==""){
          anneePrec=data[element].data[3];
          anneePrec =  data[element].data[3].indexOf(",")>-1?anneePrec.replace(",","."):data[element].data[3];
          anneePrec =  data[element].data[3].indexOf(" ")>-1?anneePrec.replace(" ",""):data[element].data[3];
        }

        if(data[element].data[4] !=="") {
          jan=data[element].data[4];
          jan = data[element].data[4].indexOf(",")>-1?jan.replace(",","."):data[element].data[4];
          jan = data[element].data[4].indexOf(" ")>-1?jan.replace(" ",""):data[element].data[4];

        }

        if(data[element].data[5] !==""){
          feb=data[element].data[5];
          feb = data[element].data[5].indexOf(",")>-1?feb.replace(",","."):data[element].data[5];
          feb = data[element].data[5].indexOf(" ")>-1?feb.replace(" ",""):data[element].data[5];

        }

        if(data[element].data[6] !==""){
          mars=data[element].data[6];
          mars = data[element].data[6].indexOf(",")>-1?mars.replace(",","."):data[element].data[6];
          mars = data[element].data[6].indexOf(" ")>-1?mars.replace(" ",""):data[element].data[6];
        }
        var q1= parseFloat(jan)+parseFloat(feb)+parseFloat(mars);
        q1 = q1.toFixed(3)

        if(data[element].data[7] !==""){
          apr=data[element].data[7];
          apr =  data[element].data[7].indexOf(",")>-1?apr.replace(",","."):data[element].data[7];
          apr =  data[element].data[7].indexOf(" ")>-1?apr.replace(" ",""):data[element].data[7];

        }

        if(data[element].data[8] !==""){
          mai=data[element].data[8];
          mai =  data[element].data[8].indexOf(",")>-1?mai.replace(",","."):data[element].data[8];
          mai =  data[element].data[8].indexOf(" ")>-1?mai.replace(" ",""):data[element].data[8];

        }
        if(data[element].data[9] !==""){
          juin=data[element].data[9];
          juin =  data[element].data[9].indexOf(",")>-1?juin.replace(",","."):data[element].data[9];
          juin =  data[element].data[9].indexOf(" ")>-1?juin.replace(" ",""):data[element].data[9];

        }
        var q2= parseFloat(apr)+parseFloat(mai)+parseFloat(juin);
        q2 = q2.toFixed(3)

        if(data[element].data[10] !==""){
          july=data[element].data[10];
          july =  data[element].data[10].indexOf(",")>-1?july.replace(",","."):data[element].data[10];
          july =  data[element].data[10].indexOf(" ")>-1?july.replace(" ",""):data[element].data[10];

        }

        if(data[element].data[11] !==""){
          aug=data[element].data[11];
          aug =  data[element].data[11].indexOf(",")>-1?aug.replace(",","."):data[element].data[11];
          aug =  data[element].data[11].indexOf(" ")>-1?aug.replace(" ",""):data[element].data[11];

        }

        if(data[element].data[12] !==""){
          sep=data[element].data[12];
          sep = data[element].data[12].indexOf(",")>-1?sep.replace(",","."):data[element].data[12];
          sep = data[element].data[12].indexOf(" ")>-1?sep.replace(" ",""):data[element].data[12];

        }
        var q3= parseFloat(july)+parseFloat(aug)+parseFloat(sep);
        q3 = q3.toFixed(3)

        if(data[element].data[13] !==""){
          oct=data[element].data[13];
          oct = data[element].data[13].indexOf(",")>-1?oct.replace(",","."):data[element].data[13];
          oct = data[element].data[13].indexOf(" ")>-1?oct.replace(" ",""):data[element].data[13];

        }

        if(data[element].data[14] !==""){
          nov=data[element].data[14];
          nov = data[element].data[14].indexOf(",")>-1?nov.replace(",","."):data[element].data[14];
          nov = data[element].data[14].indexOf(" ")>-1?nov.replace(" ",""):data[element].data[14];

        }

        if(data[element].data[15] !==""){
          dec=data[element].data[15];
          dec = data[element].data[15].indexOf(",")>-1?dec.replace(",","."):data[element].data[15];
          dec = data[element].data[15].indexOf(" ")>-1?dec.replace(" ",""):data[element].data[15];

        }
        var q4= parseFloat(oct)+parseFloat(nov)+parseFloat(dec);
        q4 = q4.toFixed(3)

        var total= parseFloat(q1)+parseFloat(q2)+parseFloat(q3)+parseFloat(q4);
        total = total.toFixed(3)

        let obj = {
          commentaire: data[element].data[2],
          anneePrec: anneePrec,
          total: total,
          jan: jan,
          feb: feb,
          mars: mars,
          q1: q1,
          apr: apr,
          mai: mai,
          juin: juin,
          q2: q2,
          july: july,
          aug: aug,
          sep: sep,
          q3: q3,
          oct: oct,
          nov: nov,
          dec: dec,
          q4: q4,
          id_arbo:arb[data[element].data[0]]?arb[data[element].data[0]].id:null
        };
        arraImport.push(obj);
      }
    });
    setNoTrouver(array);
    if (Object.keys(arraImport).length !== 0) {
      notify("tr", "Imporation avec succes", "success");
      dispatch(updateBudjetExcel({ id:id,insert: arraImport })).then(val=>{
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      });
    } else {
      notify("tr", "Vérifier votre fichier", "danger");
    }
  };

  const handleOnError = (err) => {
    console.log(err);
  };

  const handleOnRemoveFile = () => {};

  const handleRemoveFile = (e) => {
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
  };

  useEffect(() => {
    getArborecences();
  }, [getArborecences]); //now shut up eslint
  return (
    <>
      <Container fluid>
        <h4 className="title">Import Excel</h4>
        {noTrouver.length !== 0 ? (
          <Alert variant="danger">
            {noTrouver.map((val, key) => {
              return <div key={"alert" + key}>{val}</div>;
            })}
          </Alert>
        ) : (
          ""
        )}
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <div className="importCSV">
          <CSVReader
            ref={buttonRef}
            onFileLoad={handleOnFileLoad}
            onError={handleOnError}
            noClick
            noDrag
            onRemoveFile={handleOnRemoveFile}
          >
            {({ file }) => (
              <aside
                className="uploadCSV"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: 10,
                }}
              >
                <button
                  type="button"
                  onClick={handleOpenDialog}
                  className="btn-wd btn-line float-left btn btn-info"
                >
                  Import Excel (CSV)
                </button>
                <div
                  style={{
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "#ccc",
                    height: 45,
                    lineHeight: 2.5,
                    marginTop: 5,
                    marginBottom: 5,
                    paddingLeft: 13,
                    paddingTop: 3,
                    width: "60%",
                  }}
                >
                  {file && file.name}
                </div>
                <button
                  className="btn-wd btn-line float-left btn btn-danger"
                  onClick={handleRemoveFile}
                >
                  Supprimer
                </button>
              </aside>
            )}
          </CSVReader>
        </div>
      </Container>
    </>
  );
}

export default ImportIms;
