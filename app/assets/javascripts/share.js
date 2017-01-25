$('.facebook-share').on('click', function() {
  FB.ui({
    method: 'share',
    display: 'popup',
    href: 'https://www.ballotready.org',
    quote: $(this).data('quote')
  }, function(response){});
});
