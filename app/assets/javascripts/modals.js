$(() => {
  $('.sign-up').on('click', (e) => {
    $('#loginModal').modal('hide');
  });

  $('.log-in').on('click', (e) => {
    $('#signupModal').modal('hide');
  });

  $('#uploadModal #category_id').on('change', (e) => {
    $('#issue-select__container').show();
    const issueSelect = $('#video_issue_id');
    issueSelect.html(""); // Reset issue container options
    issueSelect.append($("<option />").val(-1).text(""));
    for (let i = 0, len = issues.length; i < len; i++) {
      if (issues[i].category_id === parseInt($(e.currentTarget).val())) {
        issueSelect.append($("<option />").val(issues[i].id).text(issues[i].name));
      }
    }
  });

  $('#uploadModal #video_issue_id').on('change', (e) => {
    $('#second-upload__step').show();
  });

  $('#uploadModal').on('hidden.bs.modal', () => {
    document.getElementById('new_video').reset()
    $('#second-upload__step').hide();
    $('#issue-select__container').hide();
  });
});
