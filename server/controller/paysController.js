const express = require("express");
const router = express.Router();
var pays = require("../models/pays");
const auth = require("../middlewares/passport");

// Desplay all lignes of client ...
router.post("/addPays", auth, (req, res) => {
  var id = req.body.id;
  if (id == 0) {
    pays
      .create({
        nom: req.body.nom,
        code: req.body.code,
        nom_en: req.body.nomEn,
        alpha2: req.body.alpha2,
        alpha3: req.body.alpha3,
      })
      .then((r) => {
        return res.status(200).send(true);
      })
      .catch((error) => {
        return res.status(403).send(false);
      });
  } else {
    pays.findOne({ where: { id: id } }).then(function (r1) { 
      if (!r1) {
        return res.status(403).send(false);
      } else {
        pays
          .update({
            nom: req.body.nom,
            code: req.body.code,
            nom_en: req.body.nomEn,
            alpha2: req.body.alpha2,
            alpha3: req.body.alpha3,
          },{ where: { id: id } })
          .then((r2) => {
            return res.status(200).send(true);
          })
          .catch((error) => {
            return res.status(403).send(false);
          });
      }
    });
  }
});
router.post("/allPays",auth, (req, res) => {
  pays.findAll({order:["id"]}).then(function (r) {
    return res.status(200).send(r);
  });
});
router.post("/getActive", auth, (req, res) => {
  pays
    .findAll({where: { etat: 1 }})
    .then(function (r) {
      return res.status(200).send(r);
    });
});

//Delete client
router.delete("/deletePays/:id", auth, (req, res) => {
  var id = req.params.id;
  pays.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      pays.destroy({ where: { id: id } })
        .then((r2) => {
          return res.status(200).send(true);
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});
router.post("/getPays",auth, (req, res) => {
  var id = req.headers["id"];
  pays.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      return res.status(200).json(r1.dataValues);
    }
  });
});

module.exports = router;
