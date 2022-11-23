import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchCategorie = createAsyncThunk("categorie/fetchCategorie", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "categorie/allCategorie", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const categorie = await response.json();
  return categorie;
});

export const categorieGetById = createAsyncThunk("categorie/categorieGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "categorie/getCategorie", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const categorie = await response.json();
  return categorie;
});
export const getActiveCategorie = createAsyncThunk("categorie/getActiveCategorie", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "categorie/getActive", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const categorie = await response.json();
  return categorie;
});
const categorieReduce = createSlice({
  name: "categorie",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    categorieAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "categorie/addCategorie", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    },
    categorieUpdated(state, action) {
      fetch(Configuration.BACK_BASEURL + "categorie/addCategorie", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    },
    categorieDeleted(state, action) {
      const { id } = action.payload;
      fetch(Configuration.BACK_BASEURL + "categorie/deleteCategorie/"+id, {
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

    [fetchCategorie.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchCategorie.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchCategorie.rejected]: (state, action) => {
      state.loading = false;
    },
    [categorieGetById.pending]: (state, action) => {
      state.loading = true;
    },
    [categorieGetById.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, action.payload];
    },
    [categorieGetById.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const { categorieAdded, categorieUpdated, categorieDeleted } = categorieReduce.actions;

export default categorieReduce.reducer;
