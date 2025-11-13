import { build } from "vite";
import { ChatBotService, CommonService } from "../Services";

// Inject endpoints properly without typing 'build' manually
const articleService = CommonService.enhanceEndpoints({}).injectEndpoints({
  endpoints: (build) => ({
    getChatBotResponse: build.query<any[], void>({
      query: () => "StaticData/responseData.json",
    }),
  }),
  overrideExisting: true,
});

const RealService = ChatBotService.enhanceEndpoints({}).injectEndpoints({
  endpoints: (build) => ({
    getAccessResponse: build.mutation<any, any>({
      query: (param) => {
        return {
          url: `sessions/create/`,
          method: 'POST',
          body: param
        };
      },
    }),
    getUserResponse: build.mutation<any, any>({
      query: (param) => {
        return {
          url: `run`,
          method: 'POST',
          body: param
        };
      },
    })
  })
})

export const { useGetChatBotResponseQuery } = articleService;

export const { useGetAccessResponseMutation, useGetUserResponseMutation } = RealService;