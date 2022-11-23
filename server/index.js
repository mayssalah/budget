// Importing the packages required for the project.
// {alter:true }
const express = require("express");
var app = express();
const path = require("path");
app.use(express.json({limit: '205mb'}));

/*var cors = require("cors"); 
app.use(cors());*/

app.use(express.static(path.join(__dirname, "../client/build")));
// Used for sending the Json Data to Node API 
app.use(express.json());
/* sequelize.sync() cette commande pour alter table dans n import model*/
app.use("/role/", require("./controller/roleController"));
app.use("/user/", require("./controller/userController"));
app.use("/settings/", require("./controller/settingsController"));
app.use("/root/", require("./controller/rootController"));
app.use("/sujet/", require("./controller/sujetController"));
app.use("/arborecence/", require("./controller/arborecenceController"));
app.use("/userSujet/", require("./controller/userSujetController"));
app.use("/budjet/", require("./controller/budjetController"));
app.use("/notification/", require("./controller/notificationController"));
app.use("/type/", require("./controller/typeController"));
app.use("/theme/", require("./controller/themeController"));
app.use("/annee/", require("./controller/anneeController"));
app.use("/ligneIms/", require("./controller/ligneImsController"));
app.use("/marcheIms/", require("./controller/marcheImsController"));
app.use("/produit/", require("./controller/produitController"));
app.use("/categorie/", require("./controller/categorieController"));
app.use("/pays/", require("./controller/paysController"));
app.use("/sell/", require("./controller/sellController"));
app.use("/groupe_budget/", require("./controller/groupeController"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
}); 

const PORT = 4002 || 5000 || 6000; 
app.listen(PORT, (err) =>
  err ? console.log(err) : console.log(`app listening on port ${PORT}!`)
);
