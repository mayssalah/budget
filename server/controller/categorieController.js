const express = require("express");
const router = express.Router();
var categorie = require("../models/categorie");
const auth = require("../middlewares/passport");

// Desplay all lignes of client ...
router.post("/addCategorie", auth, (req, res) => {
  var id = req.body.id;
  if (id == 0) {
    categorie
      .create({
        nom: req.body.nom,
        pourcent: req.body.pourcent,
      })
      .then((r) => {
        var idInsert = req.body.categorySelect.value == 0 ? r.id : req.body.categorySelect.value;
        categorie.update({
          parent: idInsert,
        },{ where: { id: r.id } });
        return res.status(200).send(true);
      })
      .catch((error) => {
        return res.status(403).send(false);
      });
  } else {
    categorie.findOne({ where: { id: id } }).then(function (r1) { 
      if (!r1) {
        return res.status(403).send(false);
      } else {
        categorie
          .update({
            nom: req.body.nom,
            pourcent: req.body.pourcent,
            parent: req.body.categorySelect.value,
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
router.post("/allCategorie",auth, (req, res) => {
  categorie.findAll({order:["id"]}).then(function (r) {
    return res.status(200).send(r);
  });
});

//Delete client
router.delete("/deleteCategorie/:id", auth, (req, res) => {
  var id = req.params.id;
  categorie.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      categorie.destroy({ where: { id: id } })
        .then((r2) => {
          return res.status(200).send(true);
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});
router.post("/getCategorie",auth, (req, res) => {
  var id = req.headers["id"];
  categorie.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      return res.status(200).json(r1.dataValues);
    }
  });
});
router.post("/getActive", auth, (req, res) => { 
  categorie
    .findAll({
      where: { etat: 1 }
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});

module.exports = router;
