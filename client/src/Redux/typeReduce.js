import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchType = createAsyncThunk("type/fetchType", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "type/allType", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const type = await response.json();
  return type;
});

export const typeGetById = createAsyncThunk("type/typeGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "type/getType", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const type = await response.json();
  return type;
});
export const getActiveType = createAsyncThunk("type/getActiveType", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "type/getActive", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const type = await response.json();
  return type;
});
const typeReduce = createSlice({
  name: "type",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    typeAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "type/addType", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    },
    typeUpdated(state, action) {
      fetch(Configuration.BACK_BASEURL + "type/addType", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    },
    typeDeleted(state, action) {
      const { id } = action.payload;
      fetch(Configuration.BACK_BASEURL + "type/deleteType/"+id, {
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

    [fetchType.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchType.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchType.rejected]: (state, action) => {
      state.loading = false;
    },
    [typeGetById.pending]: (state, action) => {
      state.loading = true;
    },
    [typeGetById.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, action.payload];
    },
    [typeGetById.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const { typeAdded, typeUpdated, typeDeleted } = typeReduce.actions;

export default typeReduce.reducer;
