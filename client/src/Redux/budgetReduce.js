import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const updateBudjet = createAsyncThunk("budjet/updateBudjet", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "budjet/updateBudjet/"+action.id, {
    method: 'PUT',
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

export const updateBudjetExcel = createAsyncThunk("budjet/updateBudjetExcel", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "budjet/updateBudjetExcel/"+action.id, {
    method: 'PUT',
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

export const getDetailBudjet = createAsyncThunk("budjet/getDetailBudjet", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "budjet/getDetailBudjet/"+action.id+"/"+action.idRole+"/"+action.idUserSujet, {
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

export const exportExcelUser = createAsyncThunk("budjet/exportExcelUser", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "budjet/exportExcelUser", {
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
export const exportExcels = createAsyncThunk("budjet/exportExcel", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "budjet/exportExcel", {
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
export const getBudjetUser = createAsyncThunk("budjet/getBudjetUser", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "budjet/getBudjetUser/"+action.id+"/"+action.idRole+"/"+action.annee, {
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
export const getDetailGroupe = createAsyncThunk("budjet/getDetailGroupe", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "budjet/getDetailGroupe/"+action.id+"/"+action.annee, {
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
export const getLigneGroup = createAsyncThunk("budjet/getLigneGroup", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "budjet/getLigneGroup/"+action.id, {
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
export const getBudjetByUserSujet = createAsyncThunk("budjet/getBudjetByUserSujet", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "budjet/getBudjetByUserSujet/"+id, {
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
export const getBudjetByIdUser = createAsyncThunk("budjet/getBudjetByIdUser", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "budjet/getBudjetByIdUser/"+action.id+"/"+action.annee, {
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
export const budgetChangeEtat = createAsyncThunk("budjet/changerEtat", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "budjet/changeEtat/"+action.id, {
    method: 'PUT',
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
export const budjetGetById = createAsyncThunk("budjet/getBudjet", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "budjet/getBudjet", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const budjet = await response.json();
  return budjet;
});
export const saveGroup = createAsyncThunk("budjet/saveGroup", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "budjet/saveGroup", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  
  });
  const save = await response.json();
  return save;
});
export const getGroupeBudget = createAsyncThunk("budjet/getGroupeBudget", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "budjet/getGroupeBudget", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  
  });
  const save = await response.json();
  return save;
});
export const deleteGroupe = createAsyncThunk("budjet/deleteGroupe", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "budjet/deleteGroupe/"+id, {
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
  name: "budjet",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {},
  extraReducers: {
    [getBudjetUser.pending]: (state, action) => {
      state.loading = true;
    },
    [getBudjetUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [getBudjetUser.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export default sujetsReduce.reducer;
