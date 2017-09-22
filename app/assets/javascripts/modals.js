$(() => {
  $('.sign-up').on('click', (e) => {
    $('#loginModal').modal('hide');
  });

  $('.log-in').on('click', (e) => {
    $('#signupModal').modal('hide');
  });
});
