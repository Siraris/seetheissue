$(function() {
  $('#new_video').on('ajax:success', (e, data, status, xhr) => {
    console.log(data);
  });
});
