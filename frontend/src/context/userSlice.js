import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCurrentUser: null,
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.currentUser = action.payload;
      state.isCurrentUser = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isCurrentUser = false;
    },
    updateUser: (state, action) => {
      if (!state.currentUser) return;
      const { fullName, avatar } = action.payload;
      if (fullName !== undefined) state.currentUser.fullName = fullName;
      if (avatar !== undefined) state.currentUser.avatar = avatar;
    },
  },
});

export const { login, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
