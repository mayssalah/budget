const express = require("express");
const router = express.Router();
var annee = require("../models/annee");
const auth = require("../middlewares/passport");
const { Op } = require("sequelize");

// Desplay all lignes of client ...
router.post("/addAnnee", auth, (req, res) => {
  var id = req.body.id;
  if (id == 0) {
    annee
      .create({
        annee: req.body.annee,
        selected: req.body.selected,
      })
      .then((r) => {
        return res.status(200).send(true);
      })
      .catch((error) => {
        return res.status(403).send(false);
      });
  } else {
    annee.findOne({ where: { id: id } }).then(function (r1) { 
      if (!r1) {
        return res.status(403).send(false);
      } else {
        annee
          .update({
            annee: req.body.annee,
            selected: req.body.selected,
          },{ where: { id: id } })
          .then((r2) => {
            if(req.body.selected === 1)
              annee
                .update({
                  selected:0,
                },{ where: { id: {[Op.ne]:req.body.id} } })
            return res.status(200).send(true);
          })
          .catch((error) => {
            return res.status(403).send(false);
          });
      }
    });
  }
});
router.post("/allAnnee",auth, (req, res) => {
  annee.findAll({order:["id"]}).then(function (r) {
    return res.status(200).send(r);
  });
});

//Delete client
router.delete("/deleteAnnee/:id", auth, (req, res) => {
  var id = req.params.id;
  annee.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      annee.destroy({ where: { id: id } })
        .then((r2) => {
          return res.status(200).send(true);
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});
router.post("/getAnnee",auth, (req, res) => {
  var id = req.headers["id"];
  annee.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      return res.status(200).json(r1.dataValues);
    }
  });
});

module.exports = router;
