import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const loginFetch = createAsyncThunk("user/login", async (payload) => {
  const response = await fetch(Configuration.BACK_BASEURL + "user/login", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },    
    body: JSON.stringify(payload)
  });
  const users = await response.json();
  return users;
});

export const fetchUsers = createAsyncThunk("user/fetchUsers", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "user/allUser", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const users = await response.json();
  return users;
});
export const getActiveUser = createAsyncThunk("user/getActiveUser", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "user/getActive", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const user = await response.json();
  return user;
});
export const getEquipeActive = createAsyncThunk("user/getEquipeActive", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "user/getEquipeActive/"+id, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const user = await response.json();
  return user;
});
export const getUserByRole = createAsyncThunk("user/getUserByRole", async (idRole) => {
  const response = await fetch(Configuration.BACK_BASEURL + "user/getUserByRole/"+idRole, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const user = await response.json();
  return user;
});
export const getUserByType = createAsyncThunk("user/getUserByType", async (idType) => {
  const response = await fetch(Configuration.BACK_BASEURL + "user/getUserByType/"+idType, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const user = await response.json();
  return user;
});
export const getUserByBudget = createAsyncThunk("user/getUserByBudget", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "user/getUserByBudget", {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const user = await response.json();
  return user;
});

export const userGetById = createAsyncThunk("user/userGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "user/getUser", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const userBase = await response.json();
  return userBase;
});
export const userChangeEtat = createAsyncThunk("user/changerEtat", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "user/changeEtat/"+id, {
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

export const allEquipe = createAsyncThunk("user/allEquipe", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "user/allEquipe", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  
  });
  const userBase = await response.json();
  return userBase;
});

export const userAdded = createAsyncThunk("user/addUser", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "user/addUser", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const user = await response.json();
  return user;
});

export const verification = createAsyncThunk("user/verification", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "user/verification", {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const userBase = await response.json();
  return userBase;
});
const usersReduce = createSlice({
  name: "users",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    /* userAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "user/addUser", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    }, */
    
    profilUpdated(state, action) {
      fetch(Configuration.BACK_BASEURL + "user/updateProfile", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    },
  },
  extraReducers: {
    [verification.pending]: (state, action) => {
      state.loading = true;
    },
    [verification.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, action.payload];
    },
    [verification.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const { profilUpdated } = usersReduce.actions;

export default usersReduce.reducer;
