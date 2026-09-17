import axios from "axios";

const URL = import.meta.env.VITE_API_BASE_URL;

export const setPassword = async (token, password) => {
  return axios.post(`${URL}/api/auth/set-password`, {
    token,
    password,
  });
};
