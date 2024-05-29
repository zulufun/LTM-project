import createApiServices from "../createApiServices";
const api = createApiServices();

const getPromotion = () => {
  return api.makeAuthRequest({
    url: "/api/v1/promotion",
    method: "GET",
  });
};
const createPromotion = (data: any) => {
    return api.makeAuthRequest({
      url: "/api/v1/promotion",
      method: "POST",
      data,
    });
  };

  const deletePromotion = (Id: string) => {
    return api.makeAuthRequest({
      url: `/api/v1/promotion/${Id}`,
      method: "DELETE",
    });
  };
  
  const updatePromotion = (Id: string, data: any) => {
    return api.makeAuthRequest({
      url: `/api/v1/promotion/${Id}`,
      method: "PUT",
      data,
    });
  };
  

export { getPromotion };
export { createPromotion };
export { deletePromotion };
export { updatePromotion };