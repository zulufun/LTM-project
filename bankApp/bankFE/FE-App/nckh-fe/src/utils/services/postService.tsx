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

const get = (bank_name: any) => {
  return api.makeRequest({
    url: `/api/bank_branches`,
    method: "GET",
    params: bank_name
  });
};
const savetodb = (bank_name: any, bank_data:any) => {
  // console.log("Test Api",bank_data);
  // let data = {"data":bank_data}
  return api.makeAuthRequest({
    url: `/api/save_to_mongodb/?bank_name=${bank_name}`,
    method: "POST",
    data: bank_data // Chắc chắn rằng bank_data là một mảng các đối tượng
  });
};

const getcount = () => {
  return api.makeAuthRequest({
    url: `/api/thongke`,
    method: "GET",
  });
};
const getscore = () => {
  return api.makeAuthRequest({
    url: `/api/thongke2`,
    method: "GET",
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
  update,
  remove,
  detail,
  thongke,
  thongketheothang,
  savetodb,
  getcount,
  getscore
};
