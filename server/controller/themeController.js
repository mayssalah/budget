const express = require("express");
const router = express.Router();
var theme = require("../models/theme");
var sujet = require("../models/sujet");
var groupe = require("../models/groupe");
var ligne_theme = require("../models/ligne_theme");
var budjet = require("../models/budjet");
var ligne_budjet = require("../models/ligne_budjet");
var ligne_groupe = require("../models/ligne_groupe");
const auth = require("../middlewares/passport");
var configuration = require("../config");
var Sequelize = require("sequelize");
const forecast = require("../models/forecast");
const user_sujet = require("../models/user_sujet");
const User = require("../models/user");
const { Op } = require("sequelize");

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

router.post("/saveTheme", (req, res) => {
  var annee = req.body.annee;
  var titre = req.body.titre;
  var num = req.body.num;
  var users = req.body.users;
  var groupeG = req.body.id_groupe;
  var id_groupe_budget = req.body.id_groupe_budget;
  theme
    .create({
      annee: annee,
      titre: titre,
      id_groupe: groupeG
    })
    .then((e) => {
      var array = [];
      num.forEach(async (element) => {
        array.push(element.label);
      });
      var id_users = [];
      users.forEach(async (element) => {
        id_users.push(element.value);
      });
      ligne_budjet.findAll({ include: [{ model: sujet, as: 'sujets', where: { num: array } }, { model: budjet, as: 'budjets', where: { annee: annee }, include: [{ model: user_sujet, as: 'user_sujets', where: { id_user: id_users, annee: annee,id_groupe:id_groupe_budget }, include: ['users'] }] }], group: ['id_sujet', 'id_budjet'] }).then((val) => {
        arrayInsert = [];
        var idS = [];
        var tot = 0;
        val.forEach((insert) => {
          idS.push(insert.dataValues.sujets.id);
          tot += insert.dataValues.total;
          arrayInsert.push({
            id_sujet: insert.dataValues.sujets.id,
            id_user: insert.dataValues.budjets.user_sujets.id_user,
            id_theme: e.id,
            id_groupe_budget:insert.dataValues.budjets.user_sujets.id_groupe
          });
        });
        /* ligne_budjet
           .sum("ligne_budjets.total", {
             where: { id_sujet: idS},
             include:[{model:budjet,as:'budjets', where: { annee: annee }}]
           })
           .then((val) => {*/
        theme
          .update(
            {
              total: tot,
            },
            { where: { id: e.id } }
          )
          .then((r2) => {
            groupe.findOne({ where: { id_groupeb: groupeG, annee: annee } }).then(th => {
              ligne_groupe.create({
                id_theme: e.id,
                id_groupe: th.id,
              });
              groupe.update({
                total: parseFloat(tot + th.dataValues.total),
                etat: 1
              }, { where: { id_groupeb: groupeG } });
            })
            ligne_theme.bulkCreate(arrayInsert).then(() => {
              return res.status(200).send(true);
            });
          });
        /*});*/
      });
    })
    .catch((error) => {
      return res.status(403).send(false);
    });
});
router.post("/getThemeBudget", auth, async (req, res) => {
  var annee = req.body.annee;
  ligne_theme
    .findAll({
      group: ["id_theme"],
      attributes: [
        [sequelize.fn("GROUP_CONCAT", sequelize.col("id_sujet")), "sujets"],
      ],
      include: {
        model: theme,
        as: "themes",
        where: { annee: annee },
        include:["groupe_budgets"]
      },
      order: [["id_theme", "desc"]],
    })
    .then(function (r) {
      if (r) return res.status(200).send(r);
      else return res.status(200).send([]);
    });
});

router.post("/getDetailGroupe", auth, async (req, res) => {
  var annee = req.body.annee;
  var id = req.body.id;
  theme
    .findAll({
      where: { annee: annee, id_groupe: id },
      order: [["id", "desc"]],
    })
    .then(function (r) {
      if (r) return res.status(200).send(r);
      else return res.status(200).send([]);
    });
});

router.post("/getDetailTheme", auth, async (req, res) => {
  var annee = req.body.annee;
  var id = req.body.id;
  ligne_theme
    .findOne({
      group: ["id_theme"],
      attributes: [
        [sequelize.fn("GROUP_CONCAT", sequelize.col("id_sujet")), "sujets"],
        [sequelize.fn("GROUP_CONCAT", sequelize.col("id_user")), "allusers"],
        [sequelize.fn("GROUP_CONCAT", sequelize.col("id_groupe_budget")), "allgroupe"],

      ],
      include: [{
        model: theme,
        where: { annee: annee, id: id },
        as: "themes"
      }, 'users'],

      order: [["id_theme", "desc"]],
    })
    .then(function (r) {
      var array = r.dataValues.sujets.split(",");
      var allusers = r.dataValues.allusers.split(",");
      var allgroupe = r.dataValues.allgroupe.split(",");
      ligne_budjet
        .findAll({
          where: { id_sujet: array },
          include: [
            {
              model: sujet,
              as: "sujets",
            },
            {
              model: budjet,
              as: "budjets",
              where: { annee: annee },
              include: [{
                model: user_sujet,
                as: "user_sujets",
                where: { id_user: allusers,id_groupe:allgroupe },
                include: ['users']
              }]
            },
            "arborecences",
          ],
        })
        .then((val) => {
          var obj = new Object();
          val.forEach((e) => {
            if (!obj[e.dataValues.sujets.num]) {
              obj[e.dataValues.sujets.num] = [];
              obj[e.dataValues.sujets.num].push(e.dataValues);
            } else {
              obj[e.dataValues.sujets.num].push(e.dataValues);
            }
          });
          return res
            .status(200)
            .send({ detail: obj, titre: r.dataValues.themes.titre });
        });
    });
});
router.post("/exportExcel", auth, async (req, res) => {
  var annee = req.body.annee;
  var id = req.body.id;
  var where = { annee: annee };
  var allSujet = await ligne_theme.findOne({
    group: ["id_theme"],
    attributes: [
      [sequelize.fn("GROUP_CONCAT", sequelize.col("id_sujet")), "sujets"],
      [sequelize.fn("GROUP_CONCAT", sequelize.col("id_user")), "allusers"],
      [sequelize.fn("GROUP_CONCAT", sequelize.col("id_groupe_budget")), "allgroupe"],
    ],
    include: {
      model: theme,
      where: { id: id },
      as: "themes",
    },
  });
  var id_sujet = allSujet.dataValues.sujets.split(",");
  var allusers = allSujet.dataValues.allusers.split(",");
  var allgroupe = allSujet.dataValues.allgroupe.split(",");
  var findLigne = await ligne_budjet.findAll({
    where: { id_sujet: id_sujet },     
    include: [
      {
        model: sujet,
        as: "sujets",
      },
      {
        model: budjet,
        as: "budjets",
        where: { annee: annee },
        include: [{
          model: user_sujet,
          as: "user_sujets",
          where: { id_user: allusers,id_groupe:allgroupe },
          include: ['users']
        }]
      },
      "arborecences",
    ],
  });
  var obj = new Object();
  findLigne.forEach((e) => {
    if (!obj[e.dataValues.sujets.num]) {
      obj[e.dataValues.sujets.num] = [];
    }
    obj[e.dataValues.sujets.num].push({
      sujet: e.dataValues.sujets.num + " : " + e.dataValues.sujets.sujet,
      arborecence:
        e.dataValues.arborecences.num +
        " : " +
        e.dataValues.arborecences.description,
      titre: allSujet.dataValues.themes.titre,
      Janvier: e.dataValues.jan,
      Fevrier: e.dataValues.feb,
      Mars: e.dataValues.mars,
      Q1: e.dataValues.q1,
      Avril: e.dataValues.apr,
      Mai: e.dataValues.mai,
      Juin: e.dataValues.juin,
      Q2: e.dataValues.q2,
      Juillet: e.dataValues.july,
      Aout: e.dataValues.aug,
      Septembre: e.dataValues.sep,
      Q3: e.dataValues.q3,
      Octobre: e.dataValues.oct,
      Novembre: e.dataValues.nov,
      Decembre: e.dataValues.dec,
      Q4: e.dataValues.q4,
      Total: e.dataValues.total,
    });
  });
  return res.status(200).json(obj);
});
/* deleteThemee */
router.delete("/deleteTheme/:id", auth, (req, res) => {
  var id = req.params.id;
  theme.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      ligne_theme
        .destroy({ where: { id_theme: id } })
        .then((r2) => {
          forecast
            .destroy({ where: { id_theme: id } })
            .then((r2) => {
              groupe.findOne({ where: { id_groupeb: r1.dataValues.id_groupe } }).then(async function  (groupeid) {
                const count = await ligne_groupe.count({where:{id_groupe: groupeid.id }});
                var total = groupeid.dataValues.total > 0 ? parseFloat(groupeid.dataValues.total - r1.dataValues.total) : 0;
                var upd={total: total}
                if(count==1) upd={etat:0,total: total}
                groupe.update(upd, { where: { id: groupeid.id } }).then((r2) => {
                  ligne_groupe.destroy({ where: { id_groupe: groupeid.id ,id_theme:id} })
                  theme.destroy({ where: { id: id } });
                  return res.status(200).send(true);
                })
              })
            })
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});
router.get("/visualisation/:annee", auth, async (req, res) => {
  var annee = req.params.annee;
  var ligne = await ligne_theme.findAll({
    group: ["id_theme"],
    include: [
      {
        model: theme,
        where: { annee: annee },
        as: "themes",
      },
    ],
    order: [[theme, "ordre", "asc"]],
  });
  var array = [];
  for (const key in ligne) {
    const e = ligne[key];
    var forecasts = await forecast.findOne({
      where: { id_theme: e.id_theme },
    });
    var valForecasts = 0;
    var valActual = 0;
    if (forecasts != null) {
      valForecasts = forecasts.forecast;
      valActual = forecasts.actual;
    }
    array.push({
      id: e.dataValues.id,
      actual: valActual,
      forecast: valForecasts,
      id_theme: e.dataValues.themes.id,
      annee: e.dataValues.themes.annee,
      titre: e.dataValues.themes.titre,
      total: e.dataValues.themes.total,
      ordre: e.dataValues.themes.ordre,
    });
  }
  return res.status(200).send(array);
});
router.put("/changeOrdre/:id/:ordre", auth, (req, res) => {
  var id = req.params.id;
  var ordre = req.params.ordre;
  theme.findOne({ where: { id: id } }).then(function (u) {
    if (!u) {
      return res.status(403).send(false);
    } else {
      theme
        .update(
          {
            ordre: ordre,
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
router.get("/getLigneThemeS/:id/:annee/:idSujet", auth, async (req, res) => {
  var id = req.params.id;
  var annee = req.params.annee;
  var idSujet = req.params.idSujet;
  var findLigne = await ligne_theme.findOne({
    attributes: [
      [sequelize.fn("GROUP_CONCAT", sequelize.col("id_user")), "allsuser"],
      [sequelize.fn("GROUP_CONCAT", sequelize.col("id_groupe_budget")), "allsgroupe"]
    ],
    where: { id_theme: id, id_sujet: idSujet },
    include: ["themes", "sujets", "users"]
  });
  var idAllUser = findLigne.dataValues.allsuser.split(',');
  var idAllGroupe = findLigne.dataValues.allsgroupe.split(',');
  var ligneBudg = await ligne_budjet.findAll({
    include: [{
      model: budjet,
      as: 'budjets',
      include: {
        model: user_sujet,
        as: 'user_sujets',
        where: { id_user: idAllUser, annee: annee }
      },
    },
    {
      model: sujet,
      as: 'sujets',
    },
    ],
    where: {
      [Op.and]: [
        { "$budjets.user_sujets.id_user$": idAllUser },
        { "$budjets.user_sujets.annee$": annee },
        { "$budjets.user_sujets.id_groupe$": idAllGroupe }
      ],
      id_sujet: idSujet
    },
    group: ['id_sujet', 'id_budjet']
  });
  var arrayTheme = []
  ligneBudg.forEach((val, key) => {
    var idSujet = val.dataValues.sujets.id;
    var titre = val.dataValues.sujets.num + " " + val.dataValues.sujets.sujet;
    arrayTheme.push({
      id: idSujet,
      idUser: idAllUser,
      titre: titre,
      nom: val.dataValues.budjets != null ? val.dataValues.budjets.user_sujets.titre : "",
      total: val.dataValues.total,
      id_budjet: val.dataValues.budjets != null ? val.dataValues.budjets.id : ""
    })
  });
  return res.status(200).send(arrayTheme);
});

router.get("/getLigneTheme/:id/:annee", auth, async (req, res) => {
  var id = req.params.id;
  var annee = req.params.annee;
  var findLigne = await ligne_theme.findOne({
    attributes: [
      [sequelize.fn("GROUP_CONCAT", sequelize.col("id_sujet")), "allsujet"],
      [sequelize.fn("GROUP_CONCAT", sequelize.col("id_user")), "allsuser"],
      [sequelize.fn("GROUP_CONCAT", sequelize.col("id_groupe_budget")), "allsgroupe"],
    ],
    where: { id_theme: id },
    include: ["themes", "sujets", "users"]
  });
  var idAllSujet = findLigne.dataValues.allsujet.split(',');
  var idAllUser = findLigne.dataValues.allsuser.split(',');
  var idAllGroupe = findLigne.dataValues.allsgroupe.split(',');

  var ligneBudg = await ligne_budjet.findAll({
    attributes: [[sequelize.fn("sum", sequelize.col("ligne_budjets.total")), "mnt"]],
    where: {
      id_sujet: idAllSujet,
      [Op.and]: [
        { "$budjets.user_sujets.id_user$": idAllUser },
        { "$budjets.user_sujets.id_groupe$": idAllGroupe },
        { "$budjets.user_sujets.annee$": annee }
      ]
    },
    include: [{
      model: budjet,
      as: 'budjets',
      include: {
        model: user_sujet,
        as: 'user_sujets',
        include: ["groupe_budgets"]
      },
    }, "sujets"
    ],
    group: ["id_sujet"],
  });


  var arrayTheme = []
  ligneBudg.forEach((val, key) => {
    var idSujet = val.dataValues.sujets.id;
    var titre = val.dataValues.sujets.num + " " + val.dataValues.sujets.sujet;
    arrayTheme.push({
      id: idSujet,
      idUser: idAllUser,
      titre: titre,
      groupeB: val.dataValues.budjets.user_sujets.groupe_budgets.nom,
      total: val.dataValues.mnt,
    })
  });
  return res.status(200).send(arrayTheme);
});

router.post("/getDetailThemeVis", auth, async (req, res) => {
  var annee = req.body.annee;
  var id = req.body.id;
  var idBudget = req.body.idUser

  ligne_budjet
    .findAll({
      where: { id_sujet: id, id_budjet: idBudget },
      include: [
        {
          model: sujet,
          as: "sujets",
        },
        {
          model: budjet,
          as: "budjets",
          where: { annee: annee, id: idBudget },
          include: {
            model: user_sujet,
            as: "user_sujets",
            include: {
              model: User,
              as: "users",
            }
          }
        },
        "arborecences",
      ],
    })
    .then((val) => {
      var obj = new Object();
      val.forEach((e) => {
        if (!obj[e.dataValues.sujets.num]) {
          obj[e.dataValues.sujets.num] = [];
          obj[e.dataValues.sujets.num].push(e.dataValues);
        } else {
          obj[e.dataValues.sujets.num].push(e.dataValues);
        }
      });
      return res
        .status(200)
        .send({ detail: obj });
    });
  /* ligne_theme
    .findOne({
      group: ["id_theme"],
      attributes: [
        [sequelize.fn("GROUP_CONCAT", sequelize.col("id_sujet")), "sujets"],
      ],
      include: {
        model: theme,
        where: { annee: annee, id: id },
        as: "themes",
      },
      order: [["id_theme", "desc"]],
    })
    .then(function (r) {
      var array = r.dataValues.sujets.split(",");
      ligne_budjet
        .findAll({
          where: { id_sujet: array },
          include: [
            {
              model: sujet,
              as: "sujets",
            },
            {
              model: budjet,
              as: "budjets",
              where: { annee: annee },
            },
            "arborecences",
          ],
        })
        .then((val) => {
          var obj = new Object();
          val.forEach((e) => {
            if (!obj[e.dataValues.sujets.num]) {
              obj[e.dataValues.sujets.num] = [];
              obj[e.dataValues.sujets.num].push(e.dataValues);
            } else {
              obj[e.dataValues.sujets.num].push(e.dataValues);
            }
          });
          return res
            .status(200)
            .send({ detail: obj, titre: r.dataValues.themes.titre });
        });
    }); */
});

module.exports = router;
