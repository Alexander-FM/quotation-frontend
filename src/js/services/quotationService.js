const QuotationService = {
  list: function(){ return apiClient.get("/quotations"); },
  create: function(data){ return apiClient.post("/quotations", data); },
  update: function(id, data){ return apiClient.put(`/quotations/${id}`, data); },
  remove: function(id){ return apiClient.delete(`/quotations/${id}`); },
  details: function(id){ return apiClient.get(`/quotations/${id}/details`); },
  modules: function(id){ return apiClient.get(`/quotations/${id}/modules`); },
  detailSubitems: function(detailId){ return apiClient.get(`/quotation-details/${detailId}/subitems`); }
};
