import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./Redux/usersReduce";
import roleReducer from "./Redux/roleReduce";
import settingsReducer from "./Redux/settingsReduce";
import sujetReducer from "./Redux/sujetReduce";
import arborecenceReducer from "./Redux/arborecenceReduce";
import rootBaseReduce from "./Redux/rootBaseReduce";
import userSujetReduce from "./Redux/userSujetReduce";
import budgetReduce from "./Redux/budgetReduce";
import typeReduce from "./Redux/typeReduce";
import anneeReduce from "./Redux/anneeReduce";
import produitReducer from "./Redux/produitReduce";
import ligneImsReducer from "./Redux/ligneImsReduce";
import marcheImsReducer from "./Redux/marcheImsReduce";
import categorieReducer from "./Redux/categorieReduce";
import paysReducer from "./Redux/paysReduce";
import sellReducer from "./Redux/sellReduce";
import groupeReducer from "./Redux/groupeReduce";
export default configureStore({
  reducer: {
    users: usersReducer,
    role: roleReducer,
    settings: settingsReducer,
    sujet: sujetReducer,
    arborecence: arborecenceReducer,
    rootBase: rootBaseReduce,
    userSujet: userSujetReduce,
    budget: budgetReduce,
    type: typeReduce,
    annee: anneeReduce,
    ligneIms: ligneImsReducer,
    marcheIms: marcheImsReducer,
    produit: produitReducer,
    categorie: categorieReducer,
    pays: paysReducer,
    sell: sellReducer,
    groupe:groupeReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false,}),
});
