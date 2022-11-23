import React from "react";
// react component used to create alerts
// react-bootstrap components
import {
  Container, 
} from "react-bootstrap";

function VisualisationBi() {
  document.title = "Visualisation BI"
  return (
    <>
     
      <Container fluid className="page404">
      <iframe src="https://app.powerbi.com/view?r=eyJrIjoiZDk5OTgxYWUtNmEzNC00Y2IxLTk0NDktYWJhNTAxOGZiMzc5IiwidCI6ImU0YmQ2OWZmLWU2ZjctNGMyZS1iMjQ3LTQxYjU0YmEyNDkwZSIsImMiOjh9&pageName=ReportSectionbb9bd563882312ae753b" width={"100%"} height="1000px"></iframe>
      </Container>
    </>
  );
}

export default VisualisationBi;
