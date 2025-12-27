const routes = {
  "dashboard": "src/views/dashboard.html",
  "catalogs/items": "src/views/catalogs/items.html",
  "catalogs/units": "src/views/catalogs/units.html",
  "catalogs/factor-adjustments": "src/views/catalogs/factor-adjustments.html",
  "customers/list": "src/views/customers/list.html",
  "employees/list": "src/views/employees/list.html",
  "materials/list": "src/views/materials/list.html",
  "quotations/list": "src/views/quotations/list.html",
  "quotations/detail": "src/views/quotations/detail.html",
  "quotations/modules": "src/views/quotations/modules.html"
};

function loadRoute(){
  const hash = location.hash.replace(/^#/, "");
  const path = routes[hash] || routes["dashboard"];
  fetch(path).then(r=>r.text()).then(html=>{
    $("#app").html(html);
  }).catch(()=>{
    $("#app").html("<div class='alert alert-danger'>Vista no encontrada</div>");
  });
}

window.addEventListener("hashchange", loadRoute);
window.addEventListener("load", loadRoute);
