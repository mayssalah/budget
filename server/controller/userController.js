const express = require("express");
const router = express.Router();
var equipe = require("../models/equipe");
var user = require("../models/user");
const jwt = require("jsonwebtoken");
const privateKey = "mySecretKeyabs";
var bcrypt = require("bcrypt");
const auth = require("../middlewares/passport");
const { Op } = require("sequelize");
const user_sujet = require("../models/user_sujet");

router.post("/updateProfile", auth, (req, res) => {
  var id = req.body.id;
  user.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      var password = "";
      if (req.body.password == "") {
        password = r1.password;
      } else {
        const salt = bcrypt.genSaltSync();
        password = bcrypt.hashSync(req.body.password, salt);
      }
      user
        .update(
          {
            nom_prenom: req.body.nom,
            login: req.body.login,
            tel: req.body.tel,
            password: password,
            etat: 1,
          },
          { where: { id: id } }
        )
        .then((u2) => {
          return res.status(200).send(true);
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});
router.post("/addUser", auth, (req, res) => {
  var id = req.body.id;
  var idPere = req.body.idPere;
  var idRolePere = req.body.idRolePere;
  if (id == 0) {
    user
      .create({
        nom_prenom: req.body.nom,
        login: req.body.login,
        email: req.body.email,
        tel: req.body.tel,
        id_role: req.body.role,
        password: req.body.password,
        id_type: req.body.type,
        etat: 1,
      })
      .then((u) => {
        if(idRolePere != 1){
          equipe.create({
            id_parent:idPere,
            id_fils:u.id,
            type:req.body.typeEquipe
          })
        }
        return res.status(200).send(true);
      })
      .catch((error) => {
        return res.status(400).send(false);
      });
  } else {
    user.findOne({ where: { id: id } }).then(function (r1) {
      if (!r1) {
        return res.status(400).send(false);
      } else {
        var password = "";
        if (req.body.password == "") {
          password = r1.password;
        } else {
          const salt = bcrypt.genSaltSync();
          password = bcrypt.hashSync(req.body.password, salt);
        }
        user
          .update(
            {
              nom_prenom: req.body.nom,
              login: req.body.login,
              email: req.body.email,
              tel: req.body.tel,
              id_role: req.body.role,
              password: password,
              id_type: req.body.type,
              etat: 1,
            },
            { where: { id: id } }
          )
          .then((u) => {
            return res.status(200).send(true);
          })
          .catch((error) => {
            return res.status(400).send(false);
          });
      }
    });
  }
  /* user
    .findOne({ where: { login: req.body.login, id: { [Op.ne]: id } } })
    .then(function (r1) {
      if (!r1 || r1.login != req.body.login) {
        if (id == 0) {
          user
            .create({
              nom_prenom: req.body.nom,
              login: req.body.login,
              email: req.body.email,
              tel: req.body.tel,
              id_role: req.body.role,
              password: req.body.password,
              etat: 1,
            })
            .then((u) => {
              if(idRolePere == 2){
                user.create({
                  id_parent:idPere,
                  id_fils:u.id
                })
              }
              return res.status(200).send(true);
            })
            .catch((error) => {
              return res.status(400).send(false);
            });
        } else {
          user.findOne({ where: { id: id } }).then(function (r1) {
            if (!r1) {
              return res.status(400).send(false);
            } else {
              var password = "";
              if (req.body.password == "") {
                password = r1.password;
              } else {
                const salt = bcrypt.genSaltSync();
                password = bcrypt.hashSync(req.body.password, salt);
              }
              user
                .update(
                  {
                    nom_prenom: req.body.nom,
                    login: req.body.login,
                    email: req.body.email,
                    tel: req.body.tel,
                    id_role: req.body.role,
                    password: password,
                    etat: 1,
                  },
                  { where: { id: id } }
                )
                .then((u) => {
                  return res.status(200).send(true);
                })
                .catch((error) => {
                  return res.status(400).send(false);
                });
            }
          });
        }
      } else {
        return res.status(403).send(false);
      }
    }); */
});
router.put("/changeEtat/:id", auth, (req, res) => {
  var id = req.params.id;
  user.findOne({ where: { id: id } }).then(function (u) {
    var etat = 0;
    if (u.dataValues.etat == 0) etat = 1;
    if (!u) {
      return res.status(403).send(false);
    } else {
      user
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
router.post("/allUser", auth, (req, res) => {
  user
    .findAll({
      include: ["roles"],
      where:{id_role:{ [Op.ne]: 6 }},
      order: [["id", "desc"]],
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});
router.post("/allEquipe", auth, (req, res) => {
  var idPere = req.body.idPere;
  equipe
    .findAll({
      include: [{
        model:user,
        as:"usersf",
        include:["roles"]
      }],
      where:{[Op.or]: [{id_parent:idPere}, {type: 1}]},
      order: [["id", "desc"]],
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});
router.get("/getEquipeActive/:idPere", auth, (req, res) => {
  var idPere = req.params.idPere;
  equipe
    .findAll({
      include: [{
        model:user,
        as:"usersf",
        where: { etat: 1 },
        include:["roles"]
      }],
      where:{[Op.or]: [{id_parent:idPere}, {type: 1}]},
      order: [["id", "desc"]],
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});
router.get("/getUserByType/:type", auth, (req, res) => {
  var type = req.params.type;
  user
    .findAll({
      where: { id_type: type,id_role: [2,3,4,5] },
      include: ["types"],
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});
router.post("/getActive", auth, (req, res) => {
  user
    .findAll({
      where: { etat: 1 },
      include: ["roles"],
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});

router.post("/getUser", auth, (req, res) => {
  var id = req.headers["id"];
  user.findOne({ where: { id: id },include:["types"] }).then(function (u1) {
    if (!u1) {
      return res.status(403).send(false);
    } else {
      return res.status(200).json(u1.dataValues);
    }
  });
});
router.post("/login", (req, res) => {
  var login = req.body.login;
  var password = req.body.password;
  user
    .findOne({
      include: ["roles"],
      where: { login: login, etat: 1 },
    })
    .then(function (u1) {
      if (!u1) {
        /* return res.status(403).send(false); */
        res.status(401).send({ message: "L’utilisateur n’existe pas !" });
      } else if (!u1.validPassword(password)) {
        res
          .status(401)
          .send({ message: "Verfier votre Login et Mot de passe!" });
        /* return res.status(403).send(false); */
      } else {
        const payload = {
          id: u1.dataValues.id,
          idRole: u1.dataValues.id_role,
          nom: u1.dataValues.nom_prenom,
          random:Math.floor(Math.random() * 100)
        };
        const token = jwt.sign(payload, privateKey, {});
        user
        .update(
          {
            token: token,
          },
          { where: { id: u1.dataValues.id } }
        )
        .then((u2) => {
          return res
            .status(200)
            .send({ data: u1.dataValues, token: token, message: true });
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
      }
    })
    .catch((error) => {
      return res.status(500).send(false);
    });
});
router.get("/getUserByRole/:idRole", auth, (req, res) => {
  user
    .findAll({
      where: { id_role: [2,3,4,5]  },
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});
router.get("/getUserByBudget", auth, (req, res) => {
  user_sujet
    .findAll({
      where:{etat:2},
      include:{
        model:user,
        as:"users",
        include:["roles"]
      }
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});
router.get("/verification", auth, (req,res) => {
  var token = req.headers["x-access-token"];
  const decoded = jwt.verify(token, privateKey); 
  user.findOne({ where: { token: token,id:decoded.id } }).then((e) => {
    if(e){    
      return res.status(200).send(e);
    }else {
      user.update({
      token:null
      },{where:{id:decoded.id}});
      return res.status(200).send(false);
    }
  })
});
router.put("/logOut", auth, (req,res) => {
  var token = req.headers["x-access-token"];
  const decoded = jwt.verify(token, privateKey); 
  user.findOne({ where: { token: token,id:decoded.id } }).then((e) => {
    if(e){  
      user.update({
      token:null
      },{where:{id:decoded.id}});  
      return res.status(200).send(e);
    }else {   
      return res.status(200).send(false);
    }
  })
});

module.exports = router;
