$(() => {
  $('.carousel__category').on('click', (e) => {
    const categoryId = $(e.currentTarget).data('id');
    $('.categories.carousel').fadeOut(400, () => {
      for (let i = 0, len = issues.length; i < len; i++) {
        const issue = issues[i];
        if (issue.category_id == categoryId) {
         $('.issues.carousel').slick('slickAdd',`<a href="/issues/${issue.slug}">
          <div class="carousel__issue">
          <img src="assets/${issue.image}" width="220px" />
          <h3>${issue.name}</h3>
          </div>
          </a>`);
        }
        $('#categories-back__btn').show();
      }
    });
  });

  $('#categories-back__btn').on('click', (e) => {
    const size = $('.carousel__issue').length;
    for (let i = 0; i < size; i++){
      $('.issues.carousel').slick('slickRemove', 0);
    }
    $('.categories.carousel').fadeIn();
    e.preventDefault();
    $(e.currentTarget).hide();
    return false;
  });
});
