import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const userSujetAdded = createAsyncThunk("userSujet/addUserSujet", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "userSujet/addUserSujet", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const userSujet = await response.status;
  return userSujet;
});

export const updateUserSujet = createAsyncThunk("userSujet/updateUserSujet", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "userSujet/updateUserSujet", {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const userSujet = await response.status;
  return userSujet;
});

export const updateEquipe = createAsyncThunk("userSujet/updateEquipe", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "userSujet/updateEquipe/"+action.i+"/"+action.id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const userSujet = await response.status;
  return userSujet;
});
export const getSujetEquipe = createAsyncThunk("userSujet/getSujetEquipe", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "userSujet/getSujetEquipe/"+id, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const userSujet = await response.json();
  return userSujet;
});
export const fetchUserSujet = createAsyncThunk("userSujet/fetchUserSujet", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "userSujet/allUserSujet", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const userSujet = await response.json();
  return userSujet;
});
export const getBudgetFinal = createAsyncThunk("userSujet/getBudgetFinal", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "userSujet/getBudgetFinal", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const userSujet = await response.json();
  return userSujet;
});
export const getBudgetUsers = createAsyncThunk("userSujet/getBudgetUser", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "userSujet/getBudgetUser", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const userSujet = await response.json();
  return userSujet;
});
export const userSujetGetById = createAsyncThunk("userSujet/getUserSujet", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "userSujet/getUserSujet", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const userSujet = await response.json();
  return userSujet;
});
export const getActiveUserSujet = createAsyncThunk("userSujet/getActive", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "userSujet/getActive", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const userSujet = await response.json();
  return userSujet;
});
export const userSujetChangeEtat = createAsyncThunk("userSujet/changerEtat", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "userSujet/changeEtat/"+action.id+"/"+action.etat, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const userSujet = await response.json();
  return userSujet;
});
export const getAllAnnee = createAsyncThunk("userSujet/getAllAnnee", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "userSujet/getAllAnnee", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  const annee = await response.json();
  return annee;
});
export const deleteBudget = createAsyncThunk("userSujet/deleteBudget", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "userSujet/deleteBudget/"+id, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const save = await response.json();
  return save;
});
const sujetsReduce = createSlice({
  name: "userSujet",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {},
  extraReducers: {
    [fetchUserSujet.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchUserSujet.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchUserSujet.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export default sujetsReduce.reducer;
