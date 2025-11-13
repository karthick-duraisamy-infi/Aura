import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// To trigger the services by using the baseUrl
const CommonService = createApi({
  reducerPath: "CommonApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
    credentials: "include",
  }),
  endpoints: () => ({}),
});

const getBaseUrl = () => {
  if (window?.location?.href?.includes("localhost")) {
    return import.meta.env.VITE_API_URL;
  }
  return window?.location?.href;
};

const ChatBotService = createApi({
  reducerPath: "mailApi",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    credentials: "include",
    prepareHeaders: (headers) => {
      const user = localStorage.getItem("user") as string;
      const iframe_token = sessionStorage.getItem("iframe_token");
      if (iframe_token) {
        iframe_token && headers.set("Authorization", `Bearer ${iframe_token}`);
      }
      if (user) {
        const token = JSON.parse(user)?.token;
        token && headers.set("X-XSRF-TOKEN", token);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});

export { CommonService, ChatBotService };
