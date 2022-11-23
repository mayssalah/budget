const express = require("express");
const router = express.Router();
/** Star import model**/
var user_sujet = require("../models/user_sujet");
var ligne_sujet = require("../models/ligne_sujet");
var budjet = require("../models/budjet");
var ligne_budjet = require("../models/ligne_budjet");
var ligne_groupe = require("../models/ligne_groupe");
var groupeG = require("../models/groupe");
var arborecence = require("../models/arborecence");
var notif = require("../models/notification");
var user = require("../models/user");
var sujet_equipe = require("../models/sujet_equipe");
var forecast = require("../models/forecast");
/** end import model **/
const auth = require("../middlewares/passport");
const { Op } = require("sequelize");
var Sequelize = require("sequelize");
var configuration = require("../config");
const annee = require("../models/annee");
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

router.post("/addUserSujet", (req, res) => {
  var id = req.body.id;
  var id_user = req.body.id_user;
  var titre = req.body.titre;
  var type = req.body.type;
  var sujetSelect = req.body.arraySujet;
  var year = req.body.annee;
  var groupe = req.body.groupe;
  if (id == 0) {
    if (sujetSelect.length > 0)
     { user_sujet
        .create({
          annee: year,
          titre: titre,
          id_type: type,
          id_user: id_user,
          id_groupe: groupe,
        })
        .then((e) => {
          sujetSelect.forEach((element) => {
            ligne_sujet.create({
              id_user_sujet: e.id,
              id_sujet: element.value,
            });
          });
          groupeG.findOne({ where: { annee: year,id_groupeb:groupe } }).then(function (r1) {
       if(r1)
         { ligne_groupe.create({
            id_user_sujet: e.id,
            id_groupe: r1.id,
          });}
        else
          notif.create({
            id_user: id_user,
            text: "Nouveau sujet affecter",
            etat: 1,
          });
          return res.status(200).send(true);  
        });
        }).catch((error) => {     console.log('here',error);
          return res.status(403).send(error);
        });}
    else return res.status(403).send(false);
  } else {
    user_sujet.findOne({ where: { id: id } }).then(function (r1) {
      if (!r1) {
        return res.status(403).send(false);
      } else {
        if (sujetSelect.length > 0)
          user_sujet
            .update(
              {
                id_type: type,
                titre: titre,
                id_user: id_user,
                annee: year,
              },
              { where: { id: id } }
            )
            .then((e) => {
              ligne_sujet
                .destroy({ where: { id_user_sujet: id } })
                .then((des) => {
                  sujetSelect.forEach((element) => {
                    ligne_sujet
                      .create({
                        id_user_sujet: id,
                        id_sujet: element.value,
                      })
                      .then((pp) => {})
                      .catch((error) => {
                        console.log(error);
                        return res.status(403).send(false);
                      });
                  });
                })
                .catch((error) => {
                  console.log(error);
                  return res.status(403).send(error);
                });
              return res.status(200).send(true);
            })
            .catch((error) => {
              return res.status(403).send(false);
            });
        else return res.status(403).send(false);
      }
    });
  }
});
router.post("/allUserSujet", auth, (req, res) => {
  var idPere = req.body.idPere;
  var annee = req.body.annee;
  var where = req.body.etat!= undefined? { annee: annee,etat:0 } :{ annee: annee };
  if (idPere != 1) {
    where = req.body.etat!= undefined? {id_user: idPere, annee: annee,etat:0 } :{ id_user: idPere, annee: annee };
  }
  user_sujet
    .findAll({ where: where, include: ["users"], order: [["etat", "desc"]] })
    .then(function (r) {
      return res.status(200).send(r);
    });
});
router.post("/getBudgetFinal", auth, (req, res) => {
  var annee = req.body.annee;
  user_sujet
    .findAll({
      where: { etat: 2, annee: annee },
      include: {
        model: user,
        as: "users",
        include: ["roles"],
      },
      order: [["id", "desc"]],
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});

router.post("/getUserSujet", auth, async (req, res) => {
  var id = req.headers["id"];
  var findUserSuj = await user_sujet.findOne({
    where: { id: id },
    include: ["users",'groupe_budgets'],
  });
  var findLigne = await ligne_sujet.findAll({
    where: { id_user_sujet: id },
    include: ["sujets"],
  });
  var array = [];
  if (findLigne.length > 0)
    findLigne.forEach((e) => {
      array.push({ value: e.sujets.id, label: e.sujets.sujet });
    });
  return res
    .status(200)
    .json({ userSujet: findUserSuj, ligne: array, findLigne: findLigne });
});
router.put("/updateUserSujet", async (req, res) => {
  var id_sujets = req.body.entities.id_sujets;
  var id_user = req.body.entities.id_user;
  var id = req.body.id;
  user_sujet.findOne({ where: { id: id } }).then(function (r1) {
    if (r1) {
      var array1 = [];
      id_sujets.forEach((val) => {
        array1.push({
          id_equipe: id_user,
          id_sujet: val,
          id_user_sujet: r1.dataValues.id,
        });
      });
      sujet_equipe.bulkCreate(array1).then(() => {
        var year = r1.dataValues.annee;
        budjet
          .create({
            annee: year,
            id_user_sujet: id,
            id_equipe: id_user,
          })
          .then((val) => {
            notif.create({
              id_user: id_user,
              text: "Nouveau budget créer",
              etat: 2,
            });
            arborecence
              .findAll({ where: { id_sujet: id_sujets, etat: 1 } })
              .then(async (r) => {
                var array = [];
                r.forEach((e) => {
                  array.push({
                    id_arborecence: e.dataValues.id,
                    id_budjet: val.id,
                    id_sujet: e.dataValues.id_sujet,
                  });
                });
                ligne_budjet.bulkCreate(array);
              });
          });
      });
      return res.status(200).send(true);
    } else {
      return res.status(403).send(false);
    }
  });
});
router.put("/updateUserSujetBack", async (req, res) => {
  var entities = req.body.entities;
  var id = req.body.id;
  entities.forEach((element) => {
    var id_user = element.id_user;
    var id_sujets = element.id_sujets;
    ligne_sujet
      .update(
        {
          id_equipe: id_user,
        },
        { where: { id_sujet: id_sujets, id_user_sujet: id } }
      )
      .then((li) => {
        var year = new Date().getFullYear();
        budjet
          .create({
            annee: year,
            id_user_sujet: id,
            id_equipe: id_user,
          })
          .then((val) => {
            notif.create({
              id_user: id_user,
              text: "Nouveau budget créer",
              etat: 2,
            });
            arborecence
              .findAll({ where: { id_sujet: id_sujets, etat: 1 } })
              .then(async (r) => {
                var array = [];
                r.forEach((e) => {
                  array.push({
                    id_arborecence: e.dataValues.id,
                    id_budjet: val.id,
                    id_sujet: e.dataValues.id_sujet,
                  });
                });
                ligne_budjet.bulkCreate(array);
              });
          });
      });
  });
  /* for (const key in entities) {
    var element = entities[key];
    var id_user = element.id_user;
    var id_sujets = element.id_sujets;
    ligne_sujet.update(
      {
        id_equipe: id_user,
      },
      { where: { id_sujet: id_sujets } }
    );
    var year = new Date().getFullYear();
    var insertBudjet = await budjet.create({
      annee:year,
      id_equipe:id_user
    })

      arborecence.findAll({
        id_sujet:id_sujets
      }).then(async(r)=>{
        var array = [];
        r.forEach(e=>{
          array.push({
            id_arborecence:e.dataValues.id,
            id_budjet:insertBudjet.id,
            id_sujet:e.dataValues.id_sujet
          })
        })
        ligne_budjet.bulkCreate(array);

      })
  } */
  return res.status(200).send(true);
});
router.put("/updateEquipe/:id/:idUser", (req, res) => {
  var id = req.params.id;
  var id_user_sujet = req.params.idUser;
  sujet_equipe
    .findOne({ where: { id_equipe: id, id_user_sujet: id_user_sujet } })
    .then(function (r1) {
      if (!r1) {
        return res.status(403).send(false);
      } else {
        sujet_equipe
          .destroy({ where: { id_equipe: id, id_user_sujet: id_user_sujet } })
          .then(() => {
            budjet
              .findOne({
                where: { id_equipe: id, id_user_sujet: id_user_sujet },
              })
              .then(function async(rev) {
                if (rev) {
                  ligne_budjet
                    .destroy({ where: { id_budjet: rev.dataValues.id } })
                    .then(function async() {
                      budjet.destroy({ where: { id: rev.dataValues.id } });
                    });
                }
              });
            return res.status(200).send(true);
          })
          .catch((error) => {
            return res.status(403).send(false);
          });
      }
    });
});

router.get("/getSujetEquipe/:idTache", auth, async (req, res) => {
  var idTache = req.params.idTache;
  var findSujet = await sujet_equipe.findAll({
    where: { id_user_sujet: idTache },
    attributes: [
      [sequelize.fn("GROUP_CONCAT", sequelize.col("sujets.sujet")), "sujet"],
      [sequelize.fn("GROUP_CONCAT", sequelize.col("sujets.num")), "num"],
    ],

    include: ["sujets", "users"],
    group: ["id_equipe"],
  });
  /*  var sujets = findSujet.dataValues.sujet;
  var sujetJoin = sujets.split(","); */
  /* var findLigne = await ligne_sujet.findAll({
    where: { id_user_sujet: idTache, id_sujet: { [Op.ne]: sujetJoin } },
    attributes: [
      [sequelize.fn("GROUP_CONCAT", sequelize.col("sujets.sujet")), "sujet"],
    ],
    include: ["sujets", "users"],
    group: ["id_equipe"],
  }); */
  return res.status(200).json(findSujet);
});

router.get("/getAllAnnee", auth, (req, res) => {
  annee
    .findAll()
    .then(function (b) {
      return res.status(200).send(b);
    })
    .catch((err) => {
      console.log(err);
      return res.status(403).send(err);
    });
});
router.post("/getBudgetUser", auth, (req, res) => {
  var annee = req.body.annee;
  var idUser = req.body.idUser;
  user_sujet
    .findAll({
      where: { annee: annee, id_user: idUser },
      include: {
        model: user,
        as: "users",
        include: ["roles"],
      },
      order: [["id", "desc"]],
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});
router.delete("/deleteBudget/:id", (req, res) => {
  var id = req.params.id;
  user_sujet
    .findOne({
      where: { id: id },
    })
    .then((val) => {
      sujet_equipe
        .findOne({
          where: { id_user_sujet: val.dataValues.id },
        })
        .then((eq) => {
          if (eq) {
            sujet_equipe
              .destroy({ where: { id_user_sujet: val.dataValues.id } })
              .then(() => {
                budjet
                  .findOne({
                    attributes: [
                      [
                        sequelize.fn("GROUP_CONCAT", sequelize.col("id")),
                        "ids",
                      ],
                    ],
                    where: { id_user_sujet: id },
                  })
                  .then(function async(rev) {
                    if (rev) {
                      var ids = rev.dataValues.ids.split(",");
                      ligne_budjet
                        .destroy({ where: { id_budjet: ids } })
                        .then(function async() {
                          budjet
                            .destroy({ where: { id_user_sujet: id } })
                            .then((b) => {
                              ligne_sujet
                                .destroy({
                                  where: { id_user_sujet: val.dataValues.id },
                                })
                                .then((c) => {
                                  forecast
                                    .destroy({ where: { id_user_sujet: val.dataValues.id } })
                                    .then(function async() {
                                      user_sujet.destroy({
                                        where: { id: val.dataValues.id },
                                      });
                                    });
                                  /* user_sujet.destroy({
                                    where: { id: val.dataValues.id },
                                  }); */
                                  return res.status(200).send(true);
                                });
                            });
                        });
                    }
                  });
              });
          } else {
            ligne_sujet
              .destroy({
                where: { id_user_sujet: val.dataValues.id },
              })
              .then((c) => {
                user_sujet.destroy({
                  where: { id: val.dataValues.id },
                });
                return res.status(200).send(true);
              });
          }
        });
    })
    .catch((error) => {
      return res.status(403).send(false);
    });
});
module.exports = router;
