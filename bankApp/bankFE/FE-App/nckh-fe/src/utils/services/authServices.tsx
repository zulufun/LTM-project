import createApiService from "../createApiServices";

const api = createApiService();

const login = (data: any) => {
  return api.makeAuthRequest({
    url: `/api/auth/login`,
    method: "POST",
    data: data,
  });
};

const register = (data: any) => {
  return api.makeAuthRequest({
    url: `/api/auth/register`,
    method: "GET",
    data: data,
  });
};

export const authService = {
  login, register
};
