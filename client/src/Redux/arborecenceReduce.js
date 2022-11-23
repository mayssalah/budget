import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const arborecenceAdded = createAsyncThunk("arborecence/addArborecence", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "arborecence/addArborecence", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const arborecence = await response.status;
  return arborecence;
});
export const fetchArborecence = createAsyncThunk("arborecence/fetchArborecence", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "arborecence/allArborecence", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    /* body: JSON.stringify({a: 1, b: 'Textual content'}) */
  });
  const arborecences = await response.json();
  return arborecences;
});

export const arborecenceGetById = createAsyncThunk("arborecence/arborecenceGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "arborecence/getArborecence", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const arborecenceBase = await response.json();
  return arborecenceBase;
});
export const getActiveArborecence = createAsyncThunk("arborecence/getActive", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "arborecence/getActive", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const arborecence = await response.json();
  return arborecence;
});

export const arborecencesChangeEtat = createAsyncThunk("arborecence/changerEtat", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "arborecence/changeEtat/"+id, {
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
const arborecencesReduce = createSlice({
  name: "arborecences",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    /* arborecenceDeleted(state, action) {
      const { id } = action.payload;
      fetch(Configuration.BACK_BASEURL + "arborecence/deleteArborecence/"+id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
    }, */
  },
  extraReducers: {
    [fetchArborecence.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchArborecence.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchArborecence.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

/* export const { arborecenceDeleted } = arborecencesReduce.actions; */

export default arborecencesReduce.reducer;
