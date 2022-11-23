const express = require("express");
const router = express.Router();
var arborecence = require("../models/arborecence");
const auth = require("../middlewares/passport");

// Desplay all lignes of client ...
router.post("/addArborecence", auth, (req, res) => {
  var id = req.body.id;
  var id_sujet = req.body.sujetSelect.value;
  var num = req.body.num;
  var description = req.body.description;
  if (id == 0) {
    arborecence
      .create({
        id_sujet: id_sujet,
        num: num,
        description: description,
      })
      .then((e) => {
        return res.status(200).send(true);
      })
      .catch((error) => {
        return res.status(403).send(false);
      });
  } else {
    arborecence.findOne({ where: { id: id } }).then(function (r1) { 
      if (!r1) {
        return res.status(403).send(false);
      } else {
        arborecence
          .update({
            id_sujet: id_sujet,
            num: num,
            description: description,
          },{ where: { id: id } })
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
router.post("/allArborecence",auth, (req, res) => {
  arborecence.findAll({order:[["id","desc"]],include: ["sujets"]}).then(function (r) {
    return res.status(200).send(r);
  });
});
router.post("/getActive", auth, (req, res) => {
  arborecence
    .findAll({
      where: { etat: 1 }
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});

//Delete client
router.delete("/deleteArborecence/:id", auth, (req, res) => {
  var id = req.params.id;
  arborecence.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      arborecence.destroy({ where: { id: id } })
        .then((r2) => {
          return res.status(200).send(true);
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});
router.put("/changeEtat/:id", auth, (req, res) => { 
  var id = req.params.id;
  arborecence.findOne({ where: { id: id } }).then(function (u) {
    var etat = 0;
    if(u.dataValues.etat == 0)
      etat = 1;
    if (!u) {
      return res.status(403).send(false);
    } else {
      arborecence.update({
          etat: etat
        },{ where: { id: id } })
        .then((r2) => {
          return res.status(200).send(true);
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});
router.post("/getArborecence",auth, (req, res) => {
  var id = req.headers["id"];
  arborecence.findOne({ where: { id: id },include: ["sujets"] }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      return res.status(200).json(r1.dataValues);
    }
  });
});

module.exports = router;
