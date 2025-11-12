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

export { CommonService };
