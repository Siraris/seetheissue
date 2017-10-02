$(function() {
  $('#new_video').on('ajax:success', (e, data, status, xhr) => {
  }).on('ajax:error', (e, xhr, settings, error) => {
    const response = JSON.parse(xhr.responseText),
      error_node = $('#upload-modal__errors');
    if (response.error_code === "duplicate_video") {
      error_node.html(response.error_message);
    }
  });

  $('#new_report').on('ajax:success', (e, data, status, xhr) => {
    $('#reportModal .success').html("<h1>Thanks for your submission, we'll deal with this immediately!</h1>").show();
  }).on('ajax:error', (e, xhr, settings, error) => {
    const response = JSON.parse(xhr.responseText),
      error_node = $('#report-modal__errors');
    if (response.error_code === "duplicate_report") {
      error_node.html(response.error_message);
    }
  });

  $('.btn.edit').on('click', (e) => {
    const button = $($(e.currentTarget).data('button'));
    button.toggle();
    button.parent().children('.lightblue').toggle();
    e.preventDefault();
    return false;
  });

  $('.delete_video').on('click', (e) => {
    const video_id = $(e.currentTarget).data('video');
    $.ajax({
      url: `/videos/${video_id}`,
      type: 'DELETE'
    }).done((data, status, xhr)=>{
      if (data.message == "deleted") {
        const container = $(e.currentTarget).parents('.carousel__category');
        const index = container.data('index');
        $(container.parents('.carousel')).slick('slickRemove',index);
      }
    }).fail((xhr, textStatus) => {
      alert("There was an issue deleting your video, please try again or contact us for help.");
    });
    e.preventDefault();
    return false;
  });
});
