import fetch from 'isomorphic-fetch';

let token =
JSON.parse(sessionStorage.getItem("oidc.user:https://id.workaware.com:19E1882C8CDEA709C898149AEB62802EF48AF014")).access_token;
let headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
  "OData-Version": "4.0",
  "OData-MaxVersion": "4.0",
  "ZUMO-API-VERSION": "2.0.0",
  Prefer: "return=representation",
};   

 class apiService { 

  picklistItems = new Promise( (resolutionFunc,rejectionFunc) => {
    resolutionFunc(this.getPicklistItem());
});

  getPicklistItem() {
  return fetch("https://api-staging.workaware.com/api/v2/picklists", {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
  }
}
  export default apiService;
