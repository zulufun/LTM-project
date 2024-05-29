import { serverConfig } from "../const/serverConfig";
import axios from "axios";
const saveToken = (token: any) => {
    window.localStorage.setItem("token", token);

}

const removeToken = () => {
    window.localStorage.removeItem("token");
}

const refreshToken = async () =>{
    try {
        const refreshRes = await axios.post(`${serverConfig.server}/api/auth/refresh`, {
          refreshToken: refreshToken,
        });
        const newToken = refreshRes?.data?.access_token;
        if (!newToken) {
          return false;
        }
        saveToken(newToken);
        return true;
      } catch (e) {
        removeToken();
        window.location.href = "/login";
        window.localStorage.clear();
      }
}



export const Auth = {
    saveToken, 
    removeToken,
    refreshToken
}