import { CommonService } from "../Services";

const service = CommonService.enhanceEndpoints({}).injectEndpoints({
  endpoints: (build: any) => ({
    // getArticlesList: build.mutation<any[], {}>({
    //   query: () => "locals/dummy_data/articles.json",
    // })
  }),
  overrideExisting: true,
});

export const {
//   useGetArticlesListMutation,
} = service;