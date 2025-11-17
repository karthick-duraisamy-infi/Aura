import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState: { tokenInfo?: any } = {};

const reducer = createSlice({
  name: 'AccessToken',
  initialState,
  reducers: {
    setTokenInfo: (state, { payload }: PayloadAction<{ value: any }>) => {
      if (payload) {
        state.tokenInfo = payload.value;
      }
    },
    cleanUpSetting: () => {
      return {};
    }
  },
  extraReducers: () => {}
});

export const {
  reducer: AccessTokenReducer,
  actions: { setTokenInfo, cleanUpSetting }
} = reducer;
