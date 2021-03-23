$('.tabs a, #sidebarExtension h4').on('click', function() {
  $('.tabs a').removeClass('active');
  setModule($(this).attr('id'));
});

function setModule(name) {
  $('.module').hide();
  $(`#${name}Module`).show();
  $(`#${name}`).addClass('active');

  const newURL = `${window.location.protocol}//${window.location.host}${window.location.pathname}?module=${name}`;
  window.history.pushState({ path: newURL }, '', newURL);
}

setModule(module || 'overview');