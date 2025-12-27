const CatalogService = {
  listItems: function(){ return apiClient.get("/catalogs/items"); },
  listUnits: function(){ return apiClient.get("/catalogs/units"); },
  listFactorAdjustments: function(){ return apiClient.get("/catalogs/factor-adjustments"); }
};
