import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const saveTheme = createAsyncThunk("theme/saveTheme", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "theme/saveTheme", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const theme = await response.status;
  return theme;
});
export const getThemeBudget = createAsyncThunk("theme/getThemeBudget", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "theme/getThemeBudget", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const theme = await response.json();
  return theme;
});
export const getDetailTheme = createAsyncThunk("theme/getDetailTheme", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "theme/getDetailTheme", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const theme = await response.json();
  return theme;
});
export const getDetailThemeVis = createAsyncThunk("theme/getDetailThemeVis", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "theme/getDetailThemeVis", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const theme = await response.json();
  return theme;
});
export const exportExcel = createAsyncThunk("theme/exportExcel", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "theme/exportExcel", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const theme = await response.json();
  return theme;
});
export const themeDeleted = createAsyncThunk("theme/deleteTheme", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "theme/deleteTheme/"+id, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const theme = await response.json();
  return theme;
});
export const visualisationT = createAsyncThunk("theme/visualisation", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "theme/visualisation/"+action.annee, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const sell = await response.json();
  return sell;
});
export const changeOrdreT = createAsyncThunk("sell/changeOrdre", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "theme/changeOrdre/"+action.id+"/"+action.ordre, {
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
export const getLigneTheme = createAsyncThunk("theme/getLigneTheme", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "theme/getLigneTheme/"+action.id+"/"+action.annee, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const budjet = await response.json();
  return budjet;
});

export const getDetailGroupe = createAsyncThunk("theme/getDetailGroupe", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "theme/getDetailGroupe", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const budjet = await response.json();
  return budjet;
});

export const getLigneThemeS = createAsyncThunk("theme/getLigneThemeS", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "theme/getLigneThemeS/"+action.id+"/"+action.annee+"/"+action.idSujet, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const budjet = await response.json();
  return budjet;
});

const themesReduce = createSlice({
  name: "themes",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    /* themeDeleted(state, action) {
      const { id } = action.payload;
      fetch(Configuration.BACK_BASEURL + "theme/deleteTheme/"+id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
      });
    }, */
  },
  extraReducers: {
    [getThemeBudget.pending]: (state, action) => {
      state.loading = true;
    },
    [getThemeBudget.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [getThemeBudget.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

/* export const { themeDeleted } = themesReduce.actions; */

export default themesReduce.reducer;
