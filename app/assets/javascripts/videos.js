// const jwUrl = "http://content.jwplatform.com/thumbs/";
// const sizes = {
//   small: "360",
//   medium: "480",
//   large: "720"
// }

$(function() {
  $('.nailthumb-container').nailthumb();

  $('.carousel').slick()

  $('.parent.infinite').on('beforeChange', function(event, slick, currentSlide, nextSlide){
    const total = slick.slideCount - 5,
    parent = $(this);
    if (nextSlide == total) {
      getVideos(parent.data('issueId'), parent.data('page'));
    }
  });

    /*
    Deprecated but might be used later:
    Retrieves a list of videos for the current issue

    issue_id: Id of the issue stored on the carousel__container

    returns a list of video objects

   */
  function getVideos(issue_id, page) {
    const self = this;
    const deferred = $.Deferred();
    $.ajax({
      url: `/videos/list/${issue_id}/${page}`
    })
    .done((data, status, xhr) => {
      // const videoDataParent = $('.parent.infinite'),
      // videoDataHolder = videoDataParent.find('.video_data');
      // let videoData = JSON.parse(videoDataParent.find('.video_data').html()),
      // nextPage = videoDataParent.data('page') + 1;
      // const start = videoData.length;

      // videoData = videoData.concat(data);
      // appendVideosToSlider(videoData, start);
      // videoDataHolder.html(JSON.stringify(videoData));
      // videoDataParent.data('page', nextPage);
      // deferred.resolve();
    });

    return deferred.promise();
  }

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
});

