import { create } from "apisauce";

const domain = "https://homlisti.tpblog.net";
const apiKey = "14efc224-34ec-4ccf-8c02-07ae1f0364c6";

const apiRequestTimeOut = 6000; //30s

const api = create({
    baseURL: domain + "/wp-json/rtcl/v1/",
    headers: {
        Accept: "application/json",
        "X-API-KEY": apiKey,
    },
    timeout: apiRequestTimeOut,
});

export default api;