const CustomerService = {
  list: function(){ return apiClient.get("/customers"); },
  create: function(data){ return apiClient.post("/customers", data); },
  update: function(id, data){ return apiClient.put(`/customers/${id}`, data); },
  remove: function(id){ return apiClient.delete(`/customers/${id}`); }
};
