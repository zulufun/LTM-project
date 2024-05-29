import createApiService from "../createApiServices";

const api = createApiService();

// const getWebsite = (params: any) => {
//   return api.makeAuthRequest({
//     url: `/api/crawl`,
//     method: "GET",
//     params: params,
//   });
// };

const getOneWebsite = (params: any) => {
  return api.makeAuthRequest({
    url: `/api/crawl/test`,
    method: "GET",
    params: params,
  });
};

export const crawlServices = {
  // getWebsite,
  getOneWebsite,
};
