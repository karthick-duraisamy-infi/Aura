import {
  configureStore,
  Middleware,
  Dispatch,
  UnknownAction,
} from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import type { FC } from "react";
import { CommonService, ChatBotService } from "@/service/Services";
import { serviceErrorLoggerMiddleware } from "./Service.middleware";

export const store = configureStore({
  reducer: {
    // ✅ Add both RTK Query API reducers
    [CommonService.reducerPath]: CommonService.reducer,
    [ChatBotService.reducerPath]: ChatBotService.reducer,
  },

  middleware: (getDefaultMiddleware) => {
    const allMiddleware = getDefaultMiddleware().concat(
      // ✅ Custom middleware for error logging
      serviceErrorLoggerMiddleware as Middleware<
        {},
        any,
        Dispatch<UnknownAction>
      >,

      // ✅ Add both RTK Query API middlewares
      CommonService.middleware as Middleware<{}, any, Dispatch<UnknownAction>>,
      ChatBotService.middleware as Middleware<{}, any, Dispatch<UnknownAction>>
    );

    return allMiddleware as any;
  },

  devTools: process.env.NODE_ENV !== "production",
});

// Explicitly type your root state and dispatch
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Redux Provider component
interface AppStoreProviderProps {
  children: React.ReactNode;
}

const AppStoreProvider: FC<AppStoreProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export type RootState = ReturnType<typeof store.getState>;
export { AppStoreProvider };
