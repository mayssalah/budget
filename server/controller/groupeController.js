const express = require("express");
const router = express.Router();
var groupe_budget = require("../models/groupe_budget");
var groupe = require("../models/groupe");
var user_sujet = require("../models/user_sujet");
const auth = require("../middlewares/passport");
const { Op } = require("sequelize");
var Sequelize = require("sequelize");
var configuration = require("../config");
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

// Desplay all lignes of groupe_budget ...
router.post("/addGroupe", auth, (req, res) => {
  var id = req.body.id;
  if (id == 0) {
    groupe_budget
      .create({
        nom: req.body.nom,
        revenu: req.body.revenu,
        type: req.body.type,
        annee: req.body.annee,
        include: req.body.include,
        ordre: req.body.ordre,

      })
      .then((r) => {
        groupe
          .create({
            id_groupeb: r.id,
            titre: req.body.nom,
            etat: 0,
            annee: req.body.annee,
            total: 0,
            type: req.body.type,
            revenu: parseFloat(req.body.revenu),
            include: req.body.include,
            ordre: req.body.ordre,
          })
          .then((r) => {

            return res.status(200).send(true);
          })

      })
      .catch((error) => {
        return res.status(403).send(false);
      });
  } else {
    groupe_budget.findOne({ where: { id: id } }).then(function (r1) {
      if (!r1) {
        return res.status(403).send(false);
      } else {
        groupe_budget
          .update({
            nom: req.body.nom,
            revenu: parseFloat(req.body.revenu),
            include: req.body.include,
            type: req.body.type,
            annee: req.body.annee,
            ordre: req.body.ordre,
          }, { where: { id: id } })
          .then(function () {
            groupe.findOne({ where: { id_groupeb: id, annee: r1.dataValues.annee } }).then(function (upd) {
              groupe
                .update({
                  titre: req.body.nom,
                  annee: req.body.annee,
                  type: req.body.type,
                  revenu: parseFloat(req.body.revenu),
                  include: req.body.include,
                  ordre: req.body.ordre,
                }, { where: { id: upd.id } })
              return res.status(200).send(true);

            }).catch((error) => {
              return res.status(403).send(false);
            });
          })
          .catch((error) => {
            return res.status(403).send(false);
          });
      }
    });
  }
});
router.post("/allGroupe", auth, (req, res) => {
  var annee = req.body.annee;
  groupe_budget.findAll({ where: { annee: annee },order: ["id"] }).then(function (r) {
    return res.status(200).send(r);
  });
});

router.put("/changerEtat/:id", auth, (req, res) => {
  var id = req.params.id;
  groupe_budget.findOne({ where: { id: id } }).then(function (r1) {
    var etat = 0;
    if (r1.dataValues.etat == 0)
      etat = 1;
    if (!r1) {
      return res.status(403).send(false);
    } else {
      groupe_budget.update({
        etat: etat
      }, { where: { id: id } })
        .then((r2) => {
          return res.status(200).send(true);
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});

router.post("/getActive", auth, (req, res) => {
  groupe_budget.findAll({ where: { etat: 1, type: req.body.type, annee: req.body.annee } }).then(function (r) {
    return res.status(200).send(r);
  });
});

router.post("/getActiveUsers", auth, (req, res) => {
  user_sujet.findOne({
    group: ["id_user"],
    attributes: [
      [sequelize.fn("GROUP_CONCAT", sequelize.col("id_groupe")), "idgroupes"],
    ], where: { id_user: req.body.users }
  }).then((usersujet) => {
    if(usersujet){var arrayGroupeUser= usersujet.dataValues.idgroupes.split(','); 
    groupe_budget.findAll({ where: { etat: 1, type: req.body.type, annee: req.body.annee,id:arrayGroupeUser } }).then(function (r) {
      return res.status(200).send(r);
    });}
    else{ return res.status(200).send([]);}
  })

});

router.post("/getGroupe", auth, (req, res) => {
  var id = req.headers["id"];
  groupe_budget.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      return res.status(200).json(r1.dataValues);
    }
  });
});

module.exports = router;
