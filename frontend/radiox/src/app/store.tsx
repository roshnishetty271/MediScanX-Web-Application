import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  gender: string;
  symptoms: string;
  username: string;
  password: string;
  email: string;
}

const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: '',
    dateOfBirth: '',
    phoneNumber: '',
    address: '',
    gender: '',
    symptoms: '',
    username: '',
    password: '',
    email: '',
  } as UserState,
  reducers: {
    setUserData: (state: UserState, action: { payload: Partial<UserState> }) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setUserData } = userSlice.actions;

const rootReducer = {
  user: userSlice.reducer,
};

export const store = configureStore({
  reducer: rootReducer,
});

// Define RootState type
export type RootState = ReturnType<typeof store.getState>;

// Define selector after RootState is defined
export const selectUserData = (state: RootState) => state.user;