const MaterialService = {
  list: function(){ return apiClient.get("/materials"); },
  create: function(data){ return apiClient.post("/materials", data); },
  update: function(id, data){ return apiClient.put(`/materials/${id}`, data); },
  remove: function(id){ return apiClient.delete(`/materials/${id}`); }
};
