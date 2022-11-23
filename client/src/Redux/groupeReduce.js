import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchGroupe = createAsyncThunk("groupe_budget/allGroupe", async (annee) => {
  const response = await fetch(Configuration.BACK_BASEURL + "groupe_budget/allGroupe", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify({annee})
  });
  const groupe = await response.json();
  return groupe;
});
export const getActiveGroupe = createAsyncThunk("groupe_budget/getActive", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "groupe_budget/getActive", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const groupe_budget = await response.json();
  return groupe_budget;
});

export const getActiveGroupeUsers = createAsyncThunk("groupe_budget/getActiveUsers", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "groupe_budget/getActiveUsers", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const groupe_budget = await response.json();
  return groupe_budget;
});

export const getGroupe = createAsyncThunk("groupe_budget/getGroupe", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "groupe_budget/getGroupe", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const groupe_budget = await response.json();
  return groupe_budget;
});
export const ChangerEtat = createAsyncThunk("groupe_budget/changerEtat", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "groupe_budget/changerEtat/"+id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const groupe_budget = await response.status;
  return groupe_budget;
});
export const groupeAdded = createAsyncThunk("groupe_budget/addGroupe", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "groupe_budget/addGroupe", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const groupe_budget = await response.json();
  return groupe_budget;
});
const groupeReduce = createSlice({
  name: "groupeLigne",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {

  },
  extraReducers: {
  },
});

/* export const { ligneImsAdded } = ligneImsReduce.actions; */

export default groupeReduce.reducer;
