import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const addSell = createAsyncThunk("sell/addSell", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "sell/addSell", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const sell = await response.json();
  return sell;
});

export const addForecast = createAsyncThunk("sell/addForecast", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "sell/addForecast", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const sell = await response.json();
  return sell;
});

export const Reduction = createAsyncThunk("sell/Reduction", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "sell/Reduction/"+action.annee+'/'+action.idgroupe, {
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

export const getForcastDetails = createAsyncThunk("sell/getForcastDetail", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "sell/getForcastDetail/"+id, {
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

export const addLigne = createAsyncThunk("sell/addLigne", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "sell/addLigne", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const sell = await response.json();
  return sell;
});

export const getSell = createAsyncThunk("sell/getSell", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "sell/getSell", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const sell = await response.json();
  return sell;
});

export const detailSell = createAsyncThunk("sell/detailSell", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "sell/detailSell/"+action.id+'/'+action.idgroupe, {
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

export const getForcast = createAsyncThunk("sell/getForcast", async (annee) => {
  const response = await fetch(Configuration.BACK_BASEURL + "sell/getForcast", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(annee)
  });
  const sell = await response.json();
  return sell;
});

export const getForcastUserSujet = createAsyncThunk("sell/getForcastUserSujet", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "sell/getForcastUserSujet/"+id, {
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

export const deleteForcast = createAsyncThunk("sell/deleteForcast", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "sell/deleteForcast/"+id, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const sell = await response.json();
  return sell;
});

export const deleteSell = createAsyncThunk("sell/delete", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "sell/delete/"+id, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const sell = await response.json();
  return sell;
});
export const saveGroup = createAsyncThunk("sell/saveGroup", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "sell/saveGroup", {
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
export const getGroupeSell = createAsyncThunk("sell/getGroupeSell", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "sell/getGroupeSell", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  
  });
  const sell = await response.json();
  return sell;
});
export const deleteGroupe = createAsyncThunk("sell/deleteGroupe", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "sell/deleteGroupe/"+id, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const sell = await response.json();
  return sell;
});
export const getGroupes = createAsyncThunk("sell/getGroupes", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "sell/getGroupes/"+action.annee, {
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
export const visualisation = createAsyncThunk("sell/visualisation", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "sell/visualisation/"+action.annee, {
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
export const getSellFinal = createAsyncThunk("sell/getSellFinal", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "sell/getSellFinal/"+action.annee+"/"+action.id, {
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
export const detailGrossSell = createAsyncThunk("sell/detailGrossSell", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "sell/detailGrossSell/"+action.type+"/"+action.pays+"/"+action.annee, {
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
export const changeOrdre = createAsyncThunk("sell/changeOrdre", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "sell/changeOrdre/"+action.id+"/"+action.ordre, {
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
const sellReduce = createSlice({
  name: "sell",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {},
  extraReducers: {},
});

export default sellReduce.reducer;
