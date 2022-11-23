import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchPays = createAsyncThunk("pays/fetchPays", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "pays/allPays", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const pays = await response.json();
  return pays;
});

export const paysGetById = createAsyncThunk("pays/paysGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "pays/getPays", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const pays = await response.json();
  return pays;
});
export const getActivePays = createAsyncThunk("pays/getActivePays", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "pays/getActive", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const pays = await response.json();
  return pays;
});
const paysReduce = createSlice({
  name: "pays",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    paysAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "pays/addPays", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    },
    paysUpdated(state, action) {
      fetch(Configuration.BACK_BASEURL + "pays/addPays", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    },
    paysDeleted(state, action) {
      const { id } = action.payload;
      fetch(Configuration.BACK_BASEURL + "pays/deletePays/"+id, {
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

    [fetchPays.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchPays.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchPays.rejected]: (state, action) => {
      state.loading = false;
    },
    [paysGetById.pending]: (state, action) => {
      state.loading = true;
    },
    [paysGetById.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, action.payload];
    },
    [paysGetById.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const { paysAdded, paysUpdated, paysDeleted } = paysReduce.actions;

export default paysReduce.reducer;
