$(function() {
  $('#new_video').on('ajax:success', (e, data, status, xhr) => {
    console.log(data);
  }).on('ajax:error', (e, xhr, settings, error) => {
    const response = JSON.parse(xhr.responseText),
      error_node = $('#upload-modal__errors');
    if (response.error_code === "duplicate_video") {
      error_node.html(response.error_message);
    }
  });
});
