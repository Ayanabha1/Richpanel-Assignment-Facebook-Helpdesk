import axios from "axios";
const baseURL = import.meta.env.VITE_API_URL || window.API_URL;
const graphURL = import.meta.env.VITE_GRAPH_URL;

let GraphApi = axios.create({
  baseURL: graphURL,
  withCredentials: false,
});

let Api = axios.create({
  baseURL: baseURL,
  withCredentials: false,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN")}`,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*",
    Accept: "*/*",
  },
});

let resetApiHeaders = (token) => {
  if (!token || token === "") {
    axios.defaults.headers.common["Authorization"] = null;
    Api = axios.create({
      baseURL: baseURL,
    });
  }
  Api = axios.create({
    baseURL: baseURL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
      Accept: "*/*",
    },
  });
};

export { Api, resetApiHeaders, GraphApi };
