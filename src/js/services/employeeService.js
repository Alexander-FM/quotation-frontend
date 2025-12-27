const EmployeeService = {
  list: function(){ return apiClient.get("/employees"); },
  create: function(data){ return apiClient.post("/employees", data); },
  update: function(id, data){ return apiClient.put(`/employees/${id}`, data); },
  remove: function(id){ return apiClient.delete(`/employees/${id}`); }
};
