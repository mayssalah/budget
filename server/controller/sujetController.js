const express = require("express");
const router = express.Router();
var sujet = require("../models/sujet");
var ligne_budjet = require("../models/ligne_budjet");
var arborecence = require("../models/arborecence");
const auth = require("../middlewares/passport");
const jwt = require("jsonwebtoken");
const budjet = require("../models/budjet");
const privateKey = "mySecretKeyabs";
var configuration = require("../config");
var Sequelize = require("sequelize");
const user_sujet = require("../models/user_sujet");
const ligne_sujet = require("../models/ligne_sujet");
const { Op } = require("sequelize");
var Sequelize = require("sequelize");
const sequelize = new Sequelize(
  configuration.connection.base,
  configuration.connection.root,
  configuration.connection.password,
  {
    host: configuration.connection.host,
    port: configuration.connection.port,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    operatorsAliases: false,
  }
);

// Desplay all lignes of client ...
router.post("/addSujet", auth, (req, res) => {
  var token = req.headers["x-access-token"];
  const decoded = jwt.verify(token, privateKey);
  var idPere = decoded.id;
  var id = req.body.id;
  var text = req.body.sujet;
  var num = req.body.num;
  if (id == 0) {
    sujet
      .create({
        num: num,
        id_type: req.body.type,
        sujet: text,
      })
      .then((e) => {
        return res.status(200).send(true);
      })
      .catch((error) => {
        return res.status(403).send(false);
      });
  } else {
    sujet.findOne({ where: { id: id } }).then(function (r1) {
      if (!r1) {
        return res.status(403).send(false);
      } else {
        sujet
          .update(
            {
              num: num,
              id_type: req.body.type,
              sujet: text,
            },
            { where: { id: id } }
          )
          .then((e) => {
            return res.status(200).send(true);
          })
          .catch((error) => {
            return res.status(403).send(false);
          });
      }
    });
  }
});
router.post("/allSujet", auth, (req, res) => {
  sujet
    .findAll({ order: [["id", "desc"]], include: ["types"] })
    .then(function (r) {
      return res.status(200).send(r);
    });
});
router.post("/getActive", auth, (req, res) => {
  /* var annee = new Date().getFullYear();
  ligne_sujet.findAll({
    include:{
      model:user_sujet,
      as:"user_sujets",
      where:{annee:annee}
    }
     
  })
  .then(async function (val) {
    var ids=[]
    var array = await val.filter(value=>{
      ids.push(value.dataValues.id_sujet)
      return ids;
    })
    console.log("idsids",ids)
    sujet
      .findAll({
        where: { etat: 1,id:{ [Op.notIn]: ids } },
      })
      .then(function (r) {
        return res.status(200).send(r);
      });
  }); */
  sujet
    .findAll({
      where: { etat: 1 },
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});
router.put("/changeEtat/:id", auth, (req, res) => {
  var id = req.params.id;
  sujet.findOne({ where: { id: id } }).then(function (u) {
    var etat = 0;
    if (u.dataValues.etat == 0) etat = 1;
    if (!u) {
      return res.status(403).send(false);
    } else {
      sujet
        .update(
          {
            etat: etat,
          },
          { where: { id: id } }
        )
        .then((r2) => {
          return res.status(200).send(true);
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});

//Delete client
router.post("/getSujet", auth, (req, res) => {
  var id = req.headers["id"];
  sujet.findOne({ where: { id: id }, include: ["types"] }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      return res.status(200).json(r1.dataValues);
    }
  });
});
router.get("/getSujetByType/:type", auth, (req, res) => {
  var type = req.params.type;
  arborecence
    .findAll({
      where: { etat: 1 },
      include: {
        model: sujet,
        as: "sujets",
        where: { id_type: type, etat: 1 },
        include: ["types"],
      },
      group: ["id_sujet"],
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
  /* sujet
    .findAll({
      where: { id_type: type ,etat :1},
      include: ["types"],
    })
    .then(function (r) {
      return res.status(200).send(r);
    }); */
});

router.post("/getNumSujet", auth, (req, res) => {
  var annee=req.body.annee
  var users=req.body.users
  var id_groupe_budget=req.body.id_groupe_budget
  ligne_budjet
    .findAll({
        where: {
            [Op.and]: [
              { "$budjets.user_sujets.id_user$": users },
              { "$budjets.user_sujets.id_groupe$": id_groupe_budget }
            ]
          },
      include: [
        {
          model: sujet,
          as: "sujets",      
        },
        {
          model: budjet,
          as: "budjets",
          where: { etat: 3,annee:annee },
          include:[{            
            model: user_sujet,
            as: "user_sujets"
          }]
        },
      ],
      group: ["sujets.num"],
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});
module.exports = router;
