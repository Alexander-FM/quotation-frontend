const apiClient = {
  request: function(method, url, data){
    const headers = {"Content-Type":"application/json"};
    if(ENV.AUTH_TOKEN){ headers["Authorization"] = `Bearer ${ENV.AUTH_TOKEN}`; }
    const opts = { method: method, headers: headers };
    if(data){ opts.body = JSON.stringify(data); }
    const fullUrl = ENV.API_BASE_URL + url;
    return fetch(fullUrl, opts).then(r=>{
      if(!r.ok) throw new Error("HTTP " + r.status);
      const ct = r.headers.get("content-type") || "";
      if(ct.includes("application/json")) return r.json();
      return r.text();
    });
  },
  get: function(url){ return this.request("GET", url); },
  post: function(url, data){ return this.request("POST", url, data); },
  put: function(url, data){ return this.request("PUT", url, data); },
  delete: function(url){ return this.request("DELETE", url); }
};
