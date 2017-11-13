jQuery.retrieveVideos = function (page, per) {
  if (needMoreVideoData(page * per)) {
    $.ajax({
      url: `/videos/list/1/${page}/${per}.json`,
      dataFormat: "json"
    })
    .done((data, status, xhr) => {
      let videoData = JSON.parse($('.video_data').html());
      videoData = videoData.concat(data);
      $('.video_data').html(JSON.stringify(videoData));
    })
  }

  $.ajax({
    url: `/videos/list/1/${page}/${per}`,
    dataFormat: "html"
  })
  .done((data, status, xhr) => {
    if (data.length > 0) {
      $('.video__grid .videos').html(data);
      $('.video__grid .videos').fadeIn(400);
    } else {
      issueExplorerPage--;
    }
  });

  function needMoreVideoData(length) {
    const data = JSON.parse($('.video_data').html());
    if (data.length >= length) {
      return false;
    }
    return true;
  }
}

$(function() {
  let issueExplorerPage = 1;

  $('.nailthumb-container').nailthumb();

  $('.carousel').slick()

  $('#load-more__btn').on('click', (e) => {
    $('.videos-explore .more-videos').slideToggle();
    if ($(e.currentTarget).children('p').html() == "Show More") {
      $(e.currentTarget).children('p').html("Show Less");
    } else {
      $(e.currentTarget).children('p').html("Show More");
    }
  });

  function appendVideosToSlider(videoData, start) {
    let parent = $("<div />");
    for (let i = start, current = 1, len = videoData.length; i < len; i++, current++) {
      const video = videoData[i];

      if (current == 4) {
        $('.parent.infinite').slick('slickAdd', parent);
        parent = $("<div></div>");
        current = 1;
      }

      if (current <= 3) {
        const vote = (video.vote && video.vote.vote == 1)
          ? `<img src="/assets/Thumb up.png" /><p>Support</p>` : `<img src="/assets/Thumb down.png" /><p>Oppose</p>`;
        const description = (video.description) ? video.description : "No Description";
        // const description =  (video.description)
        //   ? `<p>${video.description.slice(0, 50)}...</p>` : `<p>A video about ${video.issue.name}</p>`;
        parent.append(`<div class="carousel__category" data-id="${video.media_id}" data-videobox="video" data-index="${i}">
          <img src="http://content.jwplatform.com/thumbs/${video.media_id}-186.jpg" width="186" class="video__image" />
          <div class="details">
            <div class="vote">
              ${vote}
            </div>
            <div class="clear" />
            <p></p>
            ${description}
        </div>`);
      }
    }
  }

  /* Issue Explorer code */
  $('.video__grid #prev').on('click', (e) => {
    if (issueExplorerPage != 1) {
      issueExplorerPage--;
    } else {
      $(e.currentTarget).addClass('hidden');
    }

    $('.video__grid .videos').fadeOut(400, function(){
      $.retrieveVideos(issueExplorerPage, $(e.currentTarget).data('per'));
    });

  });

  $('.video__grid #next').on('click', (e) => {
    issueExplorerPage++;
    $('.video__grid .videos').fadeOut(400, function(){
      $.retrieveVideos(issueExplorerPage, $(e.currentTarget).data('per'));
    });
    $('.video__grid #prev').removeClass('hidden');
  });
  /* End Issue Explorer code */
});

