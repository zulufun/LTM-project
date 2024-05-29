import axios from "axios";
import { serverConfig } from "../const/serverConfig";
import {Auth} from "./auth"

var { server } = serverConfig;
const _makeRequest = (instantAxios: any) => async (args: any) => {
  const _headers = args.headers ? args.headers : {};
  const body = args.body ? args.body : {};
  const defaultHeaders = {};
  args = {
    ...args,
    headers: {
      ...defaultHeaders,
      ..._headers,
    },
    body,
  };

  const request = instantAxios(args);

  return request
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response.data ? error.response.data : error.response;
    });
};

const _makeAuthRequest = (instantAxios: any) => async (args: any) => {
  const requestHeaders = args.headers ? args.headers : {};
  let token = localStorage.getItem("token");
  let refreshToken = localStorage.getItem("refresh_token");
  let client_id = localStorage.getItem("client_id");

  let headers = {
    Authorization: `Bearer ${token}`,
    ClientID: client_id,
  };
  // instantAxios.interceptors.response.use(
  //   (response: any) => response,
  //   async (error: any) => {
  //     const status = error.response ? error.response.status : null;
  //     console.log(status)
  //     const originalConfig = error.config;
  //     // Access Token was expired
  //     if (status === 401) {
  //       console.log("check refres")
  //       return Auth.refreshToken(token, refreshToken).then((res) => {
  //         error.config.headers["Authorization"] = "Bearer " + getAuthToken();
  //         return instantAxios(error.config);
  //       });
  //     }
  //     return Promise.reject(error);
  //   }
  // );
  ///test
  let isRefreshing = false;
  let failedQueue: {
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
  }[] = [];

  const processQueue = (error: any, token = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    failedQueue = [];
  };

  instantAxios.interceptors.response.use(
    (response: any) => {
      return response;
    },
    (err: any) => {
      const originalRequest = err.config;

      if (err.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = "Bearer " + token;
              return axios(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        return new Promise(function (resolve, reject) {
          // axios
          //     .post(`${serverConfig.server}/api/v1/auth/refresh`,
          //     { headers: {Authorization : `Bearer ${refreshToken}`} }
          //     )

          axios({
            method: "POST",
            url: `${serverConfig.server}/api/v1/auth/refresh`,
            headers: {
              Authorization: "Bearer " + refreshToken,
            },
          })
            .then(({ data }) => {
              console.log("check data", data);
              if (data.status) {
                Auth.saveToken(data.data);
                axios.defaults.headers.common["Authorization"] =
                  "Bearer " + data.data;
                originalRequest.headers["Authorization"] =
                  "Bearer " + data.data;
                processQueue(null, data.data);
                resolve(axios(originalRequest));
              }
            })
            .catch((err) => {
              processQueue(err, null);
              Auth.removeToken();
              window.location.href = "/login";
              reject(err);
            })
            .then(() => {
              isRefreshing = false;
            });
        });
      }

      return Promise.reject(err);
    }
  );

  args = {
    ...args,
    headers: {
      ...requestHeaders,
      ...headers,
    },
  };

  const request = instantAxios(args);

  return request
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error.response;
      //throw error.response.data ? error.response.data : error.response;
    });
};

const makeRequest = (options: any = {}) => {
  let BaseURL = server;

  if (options.BaseURL) BaseURL = options.BaseURL;

  //const baseUrlValidated = options.baseUrl || getEnv('baseAPIUrl')
  const instance = axios.create({
    // httpsAgent: new https.Agent({
    //   rejectUnauthorized: false,
    // }),
    baseURL: BaseURL,
    timeout: 1000000, //30000,
  });

  return {
    makeRequest: _makeRequest(instance),
    makeAuthRequest: _makeAuthRequest(instance),
  };
};

export default makeRequest;
