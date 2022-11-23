const express = require("express");
const router = express.Router();
var sell = require("../models/sell");
var ligne_sell = require("../models/ligne_sell");
var forecast = require("../models/forecast");
var groupe = require("../models/groupe");
var ligne_groupe = require("../models/ligne_groupe");
const auth = require("../middlewares/passport");
var Sequelize = require("sequelize");
var configuration = require("../config");
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

// Desplay all lignes of client ...
router.post("/addSell", auth, (req, res) => {
  var pays = req.body.budget.pays;
  var annee = req.body.budget.annee;
  var titre = req.body.budget.titre;
  var type = req.body.budget.type;
  var total = req.body.budget.total;
  var groupeG = req.body.budget.id_groupe;
  sell
    .create({
      id_pays: pays,
      annee: annee,
      titre: titre,
      type: type,
      total: total,
      id_groupe: groupeG
    })
    .then((r) => {
      if (r) {
        groupe.findOne({ where: { annee: annee, id_groupeb: groupeG } }).then(function (r1) {
          ligne_groupe.create({
            id_sell: r.id,
            id_groupe: r1.dataValues.id,
          }).then(function () {
            groupe.update({
              total: parseFloat(parseFloat(total) + parseFloat(r1.dataValues.total)),
              etat: 1
            }, { where: { id: r1.dataValues.id, id_groupeb: groupeG } });
            return res.status(200).send({ id: r.id, message: true });
          })
        })
      }
      else return res.status(200).send({ message: false });
    })
    .catch((error) => {
      return res.status(403).send(error);
    });
});
router.post("/addForecast", auth, (req, res) => {
  var id_groupe = req.body.id_groupe;
  var id_budjet = req.body.id_budjet;
  var id_theme = req.body.id_theme;
  var valForecast = req.body.forecast;
  var actual = req.body.actual;
  var valForecastdis = req.body.forecastDis;
  var actualdis = req.body.actualDis;
  var valForecastrev = req.body.forecastRev;
  var actualrev = req.body.actualRev;
  if (req.body.id == 0) {
    forecast
      .create({
        id_groupe: id_groupe,
        id_sell: null,
        forecast: valForecast,
        id_user_sujet: id_budjet,
        actual: actual,
        id_theme: id_theme,
        forecastdis: valForecastdis,
        forecastrev: valForecastrev,
        actualdis: actualdis,
        actualrev: actualrev,
      })
      .then((r) => {
        if (r) return res.status(200).send({ id: r.id, message: true });
        else return res.status(200).send({ message: false });
      })
      .catch((error) => {
        return res.status(403).send(error);
      });
  }
  else {
    forecast
      .update({
        id_groupe: id_groupe,
        id_sell: null,
        forecast: valForecast,
        id_user_sujet: id_budjet,
        actual: actual,
        id_theme: id_theme,
        forecastdis: valForecastdis,
        forecastrev: valForecastrev,
        actualdis: actualdis,
        actualrev: actualrev,
      }, { where: { id: req.body.id } })
      .then((r) => {
        if (r) return res.status(200).send({ id: r.id, message: true });
        else return res.status(200).send({ message: false });
      })
      .catch((error) => {
        return res.status(403).send(error);
      });
  }
});
router.post("/getForcast", auth, (req, res) => {  
  var annee = req.body.annee;console.log('ici');
  forecast
    .findAll({
      where:{ [Op.or]: [{"$groupes.annee$": annee},{"$user_sujets.annee$": annee},{"$themes.annee$": annee}] },
      order: [["id", "desc"]],
      include: ["user_sujets", "groupes", "themes"],
    })
    .then(function (r) {
      return res.status(200).send(r);
    }).catch((error) => {
      return res.status(403).send(error);
    });
});

router.get("/getForcastDetail/:id", auth, (req, res) => {
  forecast
    .findOne({
      where: { id: req.params.id },
      order: [["id", "desc"]],
      include: ["user_sujets", "groupes", "themes"],
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});

router.get("/getForcastUserSujet/:idUserSujet", auth, (req, res) => {
  var idUserSujet = req.params.idUserSujet
  forecast
    .findOne({
      where: { id_user_sujet: idUserSujet }
    })
    .then(function (r) {
      return res.status(200).send({ data: r, mesagge: true });
    });
});
router.delete("/deleteForcast/:id", auth, (req, res) => {
  var id = req.params.id;
  forecast.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      forecast
        .destroy({ where: { id: id } })
        .then((r2) => {
          return res.status(200).send(true);
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});
router.post("/addLigne", auth, (req, res) => {
  var list = req.body.list;
  try {
    ligne_sell.bulkCreate(list).then((val) => {
      return res.status(200).send(val);
    });
  } catch (error) {
    return res.status(200).send(error);
  }
});
router.post("/getSell", auth, (req, res) => {
  var annee = req.body.annee;
  sell
    .findAll({
      where: { annee: annee },
      order: [["id", "desc"]],
      include: ["pays"],
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});

//Delete sells
router.delete("/delete/:id", auth, (req, res) => {
  var id = req.params.id;
  sell.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      ligne_sell.destroy({ where: { id_sell: id } }).then((r2) => {
        forecast.destroy({ where: { id_sell: id } }).then((r2) => {
          groupe.findOne({ where: { id_groupeb: r1.dataValues.id_groupe } }).then(function (groupeid) {
            var total = groupeid.dataValues.total > 0 ? parseFloat(groupeid.dataValues.total - r1.dataValues.total) : 0;
            groupe.update({
              total: total,
            }, { where: { id: groupeid.id } }).then((r2) => {
              ligne_groupe.destroy({ where: { id_groupe: groupeid.id, id_sell: id } })
              sell
                .destroy({ where: { id: id } })
                .then((r2) => {
                  return res.status(200).send(true);
                })
            })
          })
        })
          .catch((error) => {
            return res.status(403).send(false);
          });
      });
    }
  });
});
router.post("/saveGroup", (req, res) => {
  var annee = req.body.annee;
  var titre = req.body.titre;
  var sellVal = req.body.sell;
  var revenu = req.body.revenu;
  groupe
    .create({
      annee: annee,
      titre: titre,
      type: 1,
      revenu: revenu
    })
    .then((e) => {
      var idS = [];
      sellVal.forEach((element) => {
        idS.push(element.value);
        ligne_groupe.create({
          id_sell: element.value,
          id_groupe: e.id,
        });
      });
      sell
        .sum("total", {
          where: { id: idS },
        })
        .then((val) => {
          groupe
            .update(
              {
                total: val,
              },
              { where: { id: e.id } }
            )
            .then((r2) => {
              return res.status(200).send(true);
            });
        });
    })
    .catch((error) => {
      return res.status(403).send(false);
    });
});
router.post("/getGroupeSell", auth, async (req, res) => {
  var annee = req.body.annee;
  ligne_groupe
    .findAll({
      group: ["ligne_groupes.id_groupe"],
      attributes: [
        [sequelize.fn("GROUP_CONCAT", sequelize.col("sells.titre")), "sell"],
        "createdAt",
      ],
      include: [
        {
          model: groupe,
          where: { annee: annee, type: 1, etat: 1 },
          as: "groupes",
        },
        "sells",
      ],
      order: [["id", "desc"]],
    })
    .then(function (r) {
      return res.status(200).send(r);
    })
    .catch((error) => {
      return res.status(403).send(false);
    });
});
/* deleteGroupe */
router.delete("/deleteGroupe/:id", auth, (req, res) => {
  var id = req.params.id;
  groupe.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      ligne_groupe
        .destroy({ where: { id_groupe: id } })
        .then((r2) => {
          forecast
            .destroy({
              where: { id_groupe: id }
            })
            .then(function async() {
              groupe.update({
                total: 0,
                etat: 0,
              }, { where: { id: id } }).then((sellreq) => {
                sell.findOne({
                  group: ["id_groupe"],
                  attributes: [
                    [sequelize.fn("GROUP_CONCAT", sequelize.col("id")), "idSells"],
                  ],
                  where: { id_groupe: r1.dataValues.id_groupeb }
                }).then(function (sellfind) {

                  var arraysell = sellfind.dataValues.idSells.split(',');
                  ligne_sell
                    .destroy({ where: { id_sell: arraysell } })
                    .then((gs) => {
                      sell
                        .destroy({ where: { id_groupe: r1.dataValues.id_groupeb } })
                    });
                });
              });
              return res.status(200).send(true);
            });
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});
router.get("/getGroupes/:annee", auth, async (req, res) => {
  var annee = req.params.annee;
  ligne_groupe
    .findAll({
      group: ["id_groupe"],
      include: [
        {
          model: groupe,
          where: { annee: annee },
          as: "groupes",
        },
        "sells",
        "user_sujets",
      ],
      order: [["id_groupe", "desc"]],
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});
router.get("/visualisation/:annee", auth, async (req, res) => {
  var annee = req.params.annee;
  var ligne = await ligne_groupe.findAll({
    group: ["id_groupe"],
    include: [
      {
        model: groupe,
        where: { etat:1,annee: annee, type: [1, 2] },
        as: "groupes",
        /* order: [[ 'groupes.ordre', 'asc' ]], */
      },
      "sells",
      "user_sujets",
    ],
    order: [[groupe, 'ordre', 'asc'],]
  });
  var array = [];
  var arraytheme = ['GROSS PROFIT', 'NET CONTRIBUTION', 'BUSSNESS CONTRIBUTION', 'OPERATING INCOME'];
  var compteurtheme = 0;
  var totalsell = 0;
  var forecasttheme=0;  
  var actualtheme=0;
  var grandtotal = 0;
  var forecastsell=0;  
  var actualsell=0;
  for (const key in ligne) {
    const e = ligne[key];
    var forecasts = await forecast.findOne({      where: { id_groupe: e.id_groupe }   });
    var valForecasts = 0;
    var valActual = 0;
    var valForecastsD = 0;
    var valActualD = 0;
    var valForecastsR = 0;
    var valActualR = 0;
    var reduction =0;
    var netrevenu=0;
    var royalties=0;
    if (forecasts != null) {
      valForecasts = forecasts.forecast;
      valActual = forecasts.actual;
      valForecastsD = forecasts.forecastdis;
      valActualD = forecasts.actualdis;
      valForecastsR = forecasts.forecastrev;
      valActualR = forecasts.actualrev;
    }
    var id_sell = e.dataValues.id_sell ? e.dataValues.id_sell : null;
    var id_themeG = e.dataValues.id_theme ? e.dataValues.id_groupe : null;
    if (id_sell !== null && e.dataValues.groupes.include === 1) {
      reduction = await reduct(annee, e.dataValues.groupes.id);
      totalsell += (e.dataValues.groupes.total-reduction)+e.dataValues.groupes.revenu;
      netrevenu=(e.dataValues.groupes.total-reduction)+e.dataValues.groupes.revenu;
      if(valForecasts>0)forecasttheme+=valForecastsR+(valForecasts-valForecastsD)
      if(valActual>0)actualtheme+=valActualR+(valActual-valActualD)
      var grandtotal = e.dataValues.groupes.total;
      if(valForecasts>0) forecastsell=valForecasts;  
      if(valActual>0) actualsell=valActual;
      royalties=e.dataValues.groupes.total-reduction;
    }
    else if (id_sell !== null && e.dataValues.groupes.include === 0) { totalsell = totalsell - e.dataValues.groupes.total;
      if(valForecasts>0)forecasttheme=forecasttheme-valForecasts;
      if(valActual>0)actualtheme=actualtheme-valActual;    
    
    }
    array.push({
      id: e.dataValues.id,
      actual: valActual,
      forecast: valForecasts,
      actualdis: valActualD,
      forecastdis: valForecastsD,
      actualrev: valActualR,
      forecastrev: valForecastsR,
      id_groupe: e.dataValues.groupes.id,
      annee: e.dataValues.groupes.annee,
      titre: e.dataValues.groupes.titre,
      id_sell: id_sell,
      total: e.dataValues.groupes.total,
      include: e.dataValues.groupes.include,
      ordre: e.dataValues.groupes.ordre,
      id_themeG: id_themeG,
      id_theme: null,
      grandtotal:grandtotal,
      revenu: e.dataValues.groupes.revenu,
      pourcentage_total:(e.dataValues.groupes.total/grandtotal)*100,
      pourcentage_forcast:forecastsell>0?(valForecasts/forecastsell)*100:0,
      pourcentage_actual:actualsell>0?(valActual/actualsell)*100:0,
      discount:reduction,
      netrevenu:netrevenu,
      royalties:royalties
    });
    if (id_themeG !== null && compteurtheme < 5) {
      compteurtheme++;
      totalsell = totalsell - e.dataValues.groupes.total;
      if(valForecasts>0)forecasttheme=forecasttheme-valForecasts;
      if(valActual>0)actualtheme=actualtheme-valActual;  
      array.push({
        id: e.dataValues.id,
        actual: 0,
        forecast: forecasttheme,
        actualdis:actualtheme,
        forecastdis: 0,
        actualrev: 0,
        forecastrev: 0,
        id_groupe: null,
        annee: e.dataValues.groupes.annee,
        titre: arraytheme[compteurtheme - 1],
        id_sell: null,
        total: totalsell,
        include: 0,
        ordre: e.dataValues.groupes.ordre,
        id_themeG: id_themeG,
        id_theme: null,
        revenu: null,
        grandtotal:grandtotal,
        pourcentage_total:(totalsell/grandtotal)*100,
        pourcentage_forcast:forecastsell>0?(forecasttheme/forecastsell)*100:0,
        pourcentage_actual:actualsell>0?(actualtheme/actualsell)*100:0,
      });
    }
  }
  return res.status(200).send(array);
});
router.get("/detailSell/:id/:idgroupe", auth, async (req, res) => {
  var id = req.params.id;
  var sells = [];
  var ligne = [];
  if (id != "cogs") {
    sells = await sell.findOne({ where: { id: id }, include: ["pays", "groupe_budgets"] });
    ligne = await ligne_sell.findAll({ where: { id_sell: id }, include: ["produits", "categories"] });
  } else {
    var idgroupe = req.params.idgroupe;
    sells = await sell.findOne({ where: { id_groupe: idgroupe }, include: ["pays", "groupe_budgets"] });
    ligne = await ligne_sell.findAll({ where: { id_sell: sells.id }, include: ["produits", "categories"] });
  }
  return res.status(200).send({ sells, ligne });
});
router.get("/getSellFinal/:annee/:idGroupe", auth, async (req, res) => {
  var annee = req.params.annee;
  var idGroupe = req.params.idGroupe;
  var ligne = await ligne_groupe.findOne({
    group: ["id_groupe"],
    attributes: [
      [sequelize.fn("GROUP_CONCAT", sequelize.col("id_sell")), "idSells"],
    ],
    where: { id_groupe: idGroupe },
  });
  var array = []
  if (ligne != null) {
    var ids = ligne.dataValues.idSells.split(",");
    var opaliaPrivate = await ligne_sell.sum("ligne_sells.total", {
      where: { id_categorie: 1 },
      include: [
        {
          model: sell,
          as: "sells",
          where: { type: 0, annee: annee, id: ids }
        },
      ],
    });
    var boucharaPrivate = await ligne_sell.sum("ligne_sells.total", {
      where: { id_categorie: 4 },
      include: [
        {
          model: sell,
          as: "sells",
          where: { type: 0, annee: annee, id: ids }
        },
      ],
    });
    var hopital = await ligne_sell.sum("ligne_sells.total", {
      include: [
        {
          model: sell,
          as: "sells",
          where: { type: 1, annee: annee, id: ids }
        },
      ],
    });
    var military = await ligne_sell.sum("ligne_sells.total", {
      include: [
        {
          model: sell,
          as: "sells",
          where: { type: 2, annee: annee, id: ids }
        },
      ],
    });
    var total = opaliaPrivate + boucharaPrivate + hopital + military;
    /** marcher tunisien **/
    /*** typeAffiche 0-total 1-opalia 2-boucahra 3-HOSPITAL 4-Military 5-export ***/
    array = [
      {
        titre: "OPALIA Private Market",
        total: opaliaPrivate ? Intl.NumberFormat("fr-FR", {
          maximumSignificantDigits: 15,
        }).format(opaliaPrivate) + " TND" : "0 TND",
        background: "#fff",
        color: "#000",
        fontSize: "13px",
        fontWeight: "200",
        typeAffiche: 1,
        pays: 0
      },
      {
        titre: "BOUCHARA MARKET",
        total: boucharaPrivate ? Intl.NumberFormat("fr-FR", {
          maximumSignificantDigits: 15,
        }).format(boucharaPrivate) + " TND" : "0 TND",
        background: "#fff",
        color: "#000",
        fontSize: "13px",
        fontWeight: "200",
        typeAffiche: 2,
        pays: 0
      },
      {
        titre: "HOSPITAL Market",
        total: hopital ? Intl.NumberFormat("fr-FR", {
          maximumSignificantDigits: 15,
        }).format(hopital) + " TND" : "0 TND",
        background: "#fff",
        color: "#000",
        fontSize: "13px",
        fontWeight: "200",
        typeAffiche: 3,
        pays: 0
      },
      {
        titre: "Military Market",
        total: military ? Intl.NumberFormat("fr-FR", {
          maximumSignificantDigits: 15,
        }).format(military) + " TND" : "0 TND",
        background: "#fff",
        color: "#000",
        fontSize: "13px",
        fontWeight: "200",
        typeAffiche: 4,
        pays: 0
      },
      {
        titre: "TOTAL TUNISIAN MARKET",
        total: total ? Intl.NumberFormat("fr-FR", {
          maximumSignificantDigits: 15,
        }).format(total) + " TND" : "0 TND",
        background: "#92cddc",
        color: "#1f4980",
        fontSize: "15px",
        fontWeight: "600",
        typeAffiche: 0,
        pays: 0
      },
    ];
    /** export **/
    var findPays = await sell.findAll({
      where: { type: 3, annee: annee },
      include: ["pays"],
      group: ["id_pays"]
    });
    var totalExport = 0
    for (const key in findPays) {
      const element = findPays[key];
      var sumPays = await ligne_sell.sum("ligne_sells.total", {
        include: [
          {
            model: sell,
            as: "sells",
            where: { type: 3, annee: annee, id_pays: element.id_pays, id_groupe: idGroupe }
          },
        ],
      });
      totalExport += sumPays;
      array.push({
        titre: element.dataValues.titre,
        total: sumPays ? Intl.NumberFormat("fr-FR", {
          maximumSignificantDigits: 15,
        }).format(sumPays) + " TND" : "0 TND",
        background: "#fff",
        color: "#000",
        fontSize: "13px",
        fontWeight: "200",
        typeAffiche: 5,
        pays: element.pays.id
      });
    }
    array.push({
      titre: "TOTAL EXPORT MARKET",
      total: totalExport ? Intl.NumberFormat("fr-FR", {
        maximumSignificantDigits: 15,
      }).format(totalExport) + " TND" : "0 TND",
      background: "#92cddc",
      color: "#1f4980",
      fontSize: "15px",
      fontWeight: "600",
      typeAffiche: 0,
      pays: 0
    });
    var totalFarma = totalExport + total;
    array.push({
      titre: "TOTAL FARMA TUNISIA",
      total: totalFarma ? Intl.NumberFormat("fr-FR", {
        maximumSignificantDigits: 15,
      }).format(totalFarma) + " TND" : "0 TND",
      background: "#31859b",
      color: "#fff",
      fontSize: "15px",
      fontWeight: "600",
      typeAffiche: 0,
      pays: 0
    });

  }
  return res.status(200).send(array);
});
router.get("/Reduction/:annee/:idgroupe", auth, async (req, res) => {
  var annee = req.params.annee;
  var opalia = await ligne_sell.sum('ligne_sells.total', {
    where: { id_categorie: 1 },
    include: [
      {
        model: sell,
        as: "sells",
        where: { type: 0, annee: annee, id_groupe: req.params.idgroupe }
      },
    ],
  });
  var bouchara = await ligne_sell.sum('ligne_sells.total', {
    where: { id_categorie: 4 },
    include: [
      {
        model: sell,
        as: "sells",
        where: { type: 0, annee: annee, id_groupe: req.params.idgroupe },
      },
    ],
  });
  var reductiont = opalia * 0.02 + bouchara * 0.0025;
  return res.status(200).send({ reductiont: parseFloat(reductiont) });
});
//function reduction
 function reduct(annee, idgroupe) {
  return  new (async(resolve, reject) => {
  var opalia = await ligne_sell.sum('ligne_sells.total', {
    where: { id_categorie: 1 },
    include: [
      {
        model: sell,
        as: "sells",
        where: { type: 0, annee: annee, id_groupe: idgroupe }
      },
    ],
  });
  var bouchara = await ligne_sell.sum('ligne_sells.total', {
    where: { id_categorie: 4 },
    include: [
      {
        model: sell,
        as: "sells",
        where: { type: 0, annee: annee, id_groupe: idgroupe },
      },
    ],
  });
  var reductiont = opalia * 0.02 + bouchara * 0.0025;
  return resolve(parseFloat(reductiont));
})
}

router.get("/detailGrossSell/:type/:pays/:annee", auth, async (req, res) => {
  var type = req.params.type;
  var pays = req.params.pays;
  var annee = req.params.annee;
  /*** typeAffiche 0-total 1-opalia 2-boucahra 3-HOSPITAL 4-Military 5-export ***/
  var where = {};
  var whereL = {};
  switch (parseInt(type)) {
    case 1: {
      where = { type: 0, annee: annee };
      whereL = { id_categorie: 1 };
    }
      break;
    case 2: {
      where = { type: 0, annee: annee };
      whereL = { id_categorie: 4 };
    }
      break;
    case 3: {
      where = { type: 1, annee: annee };
      whereL = {};
    }
      break;
    case 4: {
      where = { type: 2, annee: annee };
      whereL = {};
    }
      break;
    case 5: {
      where = { type: 3, id_pays: pays, annee: annee };
      whereL = {};
    }
      break;
  }
  var findSells = await ligne_sell.findAll({
    where: whereL,
    include: [
      {
        model: sell,
        as: "sells",
        where: where
      },
      "produits",
      "categories"
    ],
  });
  /* 
  var ligne = await ligne_sell.findAll({ where: { id_sell: id }, include:["produits","categories"] }); */
  return res.status(200).send(findSells);
});
router.put("/changeOrdre/:id/:ordre", auth, (req, res) => {
  var id = req.params.id;
  var ordre = req.params.ordre;
  groupe.findOne({ where: { id: id } }).then(function (u) {
    if (!u) {
      return res.status(403).send(false);
    } else {
      groupe
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

module.exports = router;
