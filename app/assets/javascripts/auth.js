$(function () {
  var clearModalErrors = (modal) => {
    // Clear error summary div
    $(modal).find('.auth__modal__errors').hide().text('');

    // Clear inputs and errors
    var fieldsWithErrors = $(modal).find('input').parents('.form-group.has-error');
    fieldsWithErrors.removeClass('has-error');
    fieldsWithErrors.find('.auth__modal__error').remove();
  };

  var showErrors = (form, errors) => {
    form.find('input[type=password]').val('');

    // Add errors to appropriate fields
    $.each(errors, (field, errors) => {
      var inputEl = form.find('#user_' + field),
          inputContainerEl = inputEl.parents('.form-group');

      inputContainerEl.addClass('has-error');
      $.each(errors, (i, error) => {
        inputContainerEl.append(
          '<span class="help-block small auth__modal__error">' + error + '</span>'
        );
      });
    });
  };

  // Reset modal when dismissed
  $('.auth__modal').on('hidden.bs.modal', () => {
    clearModalErrors(this);
    $(this).find('form input:not(input[type=hidden])').val('');
  });

  // Clear modal errors when submitting auth modal
  $('.auth__modal form.br-form')
    .on('ajax:before', () => {
      clearModalErrors($(this).parents('.auth__modal'));
    });

  // Display authentication failures
  $('#loginModal #new_user')
    .on('ajax:success', (e, data, status, xhr) => {
      _kmq.push(['record', 'Signed In', { with: 'email' }]);
    })
    .on('ajax:error', (e, xhr, status, error) => {
      $(this).find('.auth__modal__errors').text(xhr.responseText).show();

      // Always clear passwords
      $(this).find('input[type=password]').val('');

      // Set error class on all fields
      $(this).find('#user_password, #user_email').parents('.form-group')
        .addClass('has-error');
    });

  // Handle sign up failure/success
  $('#signupModal #new_user')
    .on('ajax:success', (e, data, status, xhr) => {
      // NOTE Auth lib always returns HTTP 200, even if sign up failed! That's
      // why we have our custom status code that tells us the real status...
      var registrationStatus = parseInt(xhr.getResponseHeader('RegistrationStatusCode'));

      switch(registrationStatus) {
        case 200: // Sign up success but no ballot yet: show address modal
          $('.login-link').remove();
          break;
        case 302: // Sign up success and we have a ballot: 'redirect'
          if (window.afterSignUpPath) {
            location.href = window.afterSignUpPath;
          } else {
            location.reload();
          }
          break;
        case 422: // Uh-oh, validation errors!
          showErrors($(this), eval(data));
          break;
        default:
          console.warn("Encountered unknown 'RegistrationStatusCode'", registrationStatus);
      }
    })
    .on('ajax:error',  (e, xhr, status, error) => {
      console.warn("An error occured while processing sign up", error);
    });

  $('#updatePasswordModal form.br-form')
    .on('ajax:success', (e, data, status, xhr) => {
      // Yay! Close modal.
      $(this).closest('.modal').modal('hide');
    })
    .on('ajax:error', (e, xhr, status, error) => {
      switch(xhr.status) {
        case 422: // Uh-oh, validation errors!
          showErrors($(this), xhr.responseJSON);
          break;
        default:
          console.warn('An error occured while changing password', error);
      }
    });
});

