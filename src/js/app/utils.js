const Utils = {
  notify: function(message, type){
    const t = type || "info";
    const alert = `<div class="alert alert-${t}">${message}</div>`;
    $("#app").prepend(alert);
  }
};
