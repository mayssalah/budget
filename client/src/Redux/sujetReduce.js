import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const sujetAdded = createAsyncThunk("sujet/addSujet", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "sujet/addSujet", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const sujet = await response.status;
  return sujet;
});
export const fetchSujet = createAsyncThunk("sujet/fetchSujet", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "sujet/allSujet", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    /* body: JSON.stringify({a: 1, b: 'Textual content'}) */
  });
  const sujets = await response.json();
  return sujets;
});

export const sujetGetById = createAsyncThunk("sujet/sujetGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "sujet/getSujet", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const sujetBase = await response.json();
  return sujetBase;
});
export const getActiveSujet = createAsyncThunk("sujet/getActive", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "sujet/getActive", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const sujet = await response.json();
  return sujet;
});
export const getSujetByType = createAsyncThunk("sujet/getSujetByType", async (idType) => {
  const response = await fetch(Configuration.BACK_BASEURL + "sujet/getSujetByType/"+idType, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const sujets = await response.json();
  return sujets;
});
export const sujetChangeEtat = createAsyncThunk("sujet/changerEtat", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "sujet/changeEtat/"+id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const user = await response.status;
  return user;
});
export const getNumSujet = createAsyncThunk("sujet/getNumSujet", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "sujet/getNumSujet", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

    body: JSON.stringify(action)
  });
  const sujets = await response.json();
  return sujets;
});
const sujetsReduce = createSlice({
  name: "sujets",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    sujetDeleted(state, action) {
      const { id } = action.payload;
      fetch(Configuration.BACK_BASEURL + "sujet/deleteSujet/"+id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
      });
    },
  },
  extraReducers: {
    [fetchSujet.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchSujet.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchSujet.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const { sujetDeleted } = sujetsReduce.actions;

export default sujetsReduce.reducer;
