import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchAnnee = createAsyncThunk("annee/fetchAnnee", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "annee/allAnnee", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const annee = await response.json();
  return annee;
});

export const anneeGetById = createAsyncThunk("annee/anneeGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "annee/getAnnee", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const annee = await response.json();
  return annee;
});
export const deleteAnnee = createAsyncThunk("annee/deleteAnnee", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "annee/deleteAnnee/"+id, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const annee = await response.json();
  return annee;
});

export const anneeAdded = createAsyncThunk("annee/addAnnee", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "annee/addAnnee", {
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
const anneeReduce = createSlice({
  name: "annee",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    /* anneeAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "annee/addAnnee", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    }, */
    anneeUpdated(state, action) {
      fetch(Configuration.BACK_BASEURL + "annee/addAnnee", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    },
    anneeDeleted(state, action) {
      const { id } = action.payload;
      fetch(Configuration.BACK_BASEURL + "annee/deleteAnnee/"+id, {
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

    [fetchAnnee.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchAnnee.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchAnnee.rejected]: (state, action) => {
      state.loading = false;
    },
    [anneeGetById.pending]: (state, action) => {
      state.loading = true;
    },
    [anneeGetById.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, action.payload];
    },
    [anneeGetById.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const { anneeUpdated, anneeDeleted } = anneeReduce.actions;

export default anneeReduce.reducer;
