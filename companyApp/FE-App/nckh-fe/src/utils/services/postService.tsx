import createApiService from "../createApiServices";

const api = createApiService();

const thongke = (params: any) => {
  return api.makeAuthRequest({
    url: `/api/post/thongke/thongke2`,
    method: "GET",
    params: params,
  });
};

const thongketheothang = (params: any) => {
  return api.makeAuthRequest({
    url: `/api/post/thongke/thongketheothang`,
    method: "GET",
    params: params,
  });
};

const get = (province: any) => {
  return api.makeRequest({
    url: `/api/companies`,
    method: "GET",
    params: province
  });
};
const create = (province: string) => {
  return api.makeAuthRequest({
    url: `/api/save_companies/?province=${province}`,
    method: "POST",
  });
};
const savetodb = (province: any) => {
  return api.makeAuthRequest({
    url: `/api/save_companies`,
    method: "POST",
    data: province,
  });
};

const detail = (id: any) => {
  return api.makeAuthRequest({
    url: `/api/post/${id}`,
    method: "GET",
  });
};



const update = (id: any, data: any) => {
  return api.makeAuthRequest({
    url: `/api/post/${id}`,
    method: "PUT",
    data: data,
  });
};

const remove = (id: any) => {
  return api.makeAuthRequest({
    url: `/api/post/${id}`,
    method: "DELETE",
  });
};

export const postServices = {
  get,
  create,
  update,
  remove,
  detail,
  thongke,
  thongketheothang
};
