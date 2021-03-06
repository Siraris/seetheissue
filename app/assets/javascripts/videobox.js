/*!
 * VideoBox - v0.0.1 - * by Andrew Soep
 *
 * This is a reworking of Lightbox which you can find here:
 * http://lokeshdhakar.com/projects/lightbox2/
 *
 * This version works with video content instead of images
 * and allows videos to be loaded using AJAX requests instead of
 * using attributes on elements
 * Copyright 2017
 * Released under the MIT license
 */

// Uses Node, AMD or browser globals to create a module.
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals (root is window)
        root.videobox = factory(root.jQuery);
    }
}(this, function ($) {

  function Videobox(options) {
    this.album = [];
    this.currentVideoIndex = void 0;
    this.init();

    // options
    this.options = $.extend({}, this.constructor.defaults);
    this.option(options);
  }

  // Descriptions of all options available on the demo site:
  // http://lokeshdhakar.com/projects/lightbox2/index.html#options
  Videobox.defaults = {
    albumLabel: 'Video %1 of %2',
    alwaysShowNavOnTouchDevices: false,
    fadeDuration: 600,
    fitImagesInViewport: true,
    videoFadeDuration: 600,
    maxWidth: 800,
    maxHeight: 600,
    positionFromTop: 50,
    resizeDuration: 700,
    showImageNumberLabel: true,
    wrapAround: false,
    disableScrolling: false,
    /*
    Sanitize Title
    If the caption data is trusted, for example you are hardcoding it in, then leave this to false.
    This will free you to add html tags, such as links, in the caption.

    If the caption data is user submitted or from some other untrusted source, then set this to true
    to prevent xss and other injection attacks.
     */
    sanitizeTitle: false
  };

  Videobox.prototype.option = function(options) {
    $.extend(this.options, options);
  };

  Videobox.prototype.imageCountLabel = function(currentVideoNum, totalVideos) {
    return this.options.albumLabel.replace(/%1/g, currentVideoNum).replace(/%2/g, totalVideos);
  };

  Videobox.prototype.init = function() {
    const self = this;
    // Both enable and build methods require the body tag to be in the DOM.
    $(document).ready(function() {
      self.enable();
      self.build();
    });
  };

  // Loop through anchors and areamaps looking for either data-videobox attributes or rel attributes
  // that contain 'videobox'. When these are clicked, start videobox.
  Videobox.prototype.enable = function() {
    const self = this;
    $('body').on('click', 'a[rel^=videobox], div[rel^=videobox], a[data-videobox], div[data-videobox]', function(event) {
      // Retrieve videos, which is async. When it's done, we'll do something
      // in this case, get the popup going
      self.album = JSON.parse($(event.currentTarget)
        .parents('.parent')
        .find('.video_data')
        .html());
      self.start($(event.currentTarget));
      return false;
    });
  };

  // Build html for the videobox and the overlay.
  // Attach event handlers to the new DOM elements. click click click
  Videobox.prototype.build = function() {
    const self = this;
    $('<div id="videoboxOverlay" class="videoboxOverlay"></div><div id="videobox" class="videobox"><div class="vb-dataContainer"><div class="vb-data"><div class="vb-details"><span class="vb-caption"></span><span class="vb-number"></span></div><div class="vb-interactContainer"><a class="vb-share" data-toggle="modal" target="#shareModal">Share This Video</a> | <a class="vb-report" data-video="">Report Video</a></div><div class="vb-closeContainer"><a class="vb-close"></a></div></div></div><div class="vb-outerContainer"><div class="vb-container"><div id="vb-video" class="vb-video" /><div class="vb-prev-container"><a class="vb-prev" href="" ></a></div><div class="vb-next-container"><a class="vb-next" href="" ></a></div><div class="vb-loader"><a class="vb-cancel"></a></div></div></div></div>').appendTo($('body'));

    // Cache jQuery objects
    this.$videobox       = $('#videobox');
    this.$overlay        = $('#videoboxOverlay');
    this.$outerContainer = this.$videobox.find('.vb-outerContainer');
    this.$container      = this.$videobox.find('.vb-container');
    this.$image          = this.$videobox.find('.vb-video');
    this.$nav            = this.$videobox.find('.vb-nav');

    // Store css values for future lookup
    this.containerPadding = {
      top: parseInt(this.$container.css('padding-top'), 10),
      right: parseInt(this.$container.css('padding-right'), 10),
      bottom: parseInt(this.$container.css('padding-bottom'), 10),
      left: parseInt(this.$container.css('padding-left'), 10)
    };

    this.imageBorderWidth = {
      top: parseInt(this.$image.css('border-top-width'), 10),
      right: parseInt(this.$image.css('border-right-width'), 10),
      bottom: parseInt(this.$image.css('border-bottom-width'), 10),
      left: parseInt(this.$image.css('border-left-width'), 10)
    };

    // Attach event handlers to the newly minted DOM elements
    this.$overlay.hide().on('click', function() {
      self.end();
      return false;
    });

    this.$videobox.hide().on('click', function(event) {
      if ($(event.target).attr('id') === 'videobox') {
        self.end();
      }
      return false;
    });

    this.$outerContainer.on('click', function(event) {
      if ($(event.target).attr('id') === 'videobox') {
        self.end();
      }
      return false;
    });

    this.$videobox.find('.vb-prev').on('click', function() {
      if (self.currentVideoIndex === 0) {
        self.changeVideo(self.album.length - 1);
      } else {
        self.changeVideo(self.currentVideoIndex - 1);
      }
      return false;
    });

    this.$videobox.find('.vb-next').on('click', function() {
      if (self.currentVideoIndex === self.album.length - 1) {
        self.changeVideo(0);
      } else {
        self.changeVideo(self.currentVideoIndex + 1);
      }

      return false;
    });

    /*
      Show context menu for image on right-click

      There is a div containing the navigation that spans the entire image and lives above of it. If
      you right-click, you are right clicking this div and not the image. This prevents users from
      saving the image or using other context menu actions with the image.

      To fix this, when we detect the right mouse button is pressed down, but not yet clicked, we
      set pointer-events to none on the nav div. This is so that the upcoming right-click event on
      the next mouseup will bubble down to the image. Once the right-click/contextmenu event occurs
      we set the pointer events back to auto for the nav div so it can capture hover and left-click
      events as usual.
     */
    this.$nav.on('mousedown', function(event) {
      if (event.which === 3) {
        self.$nav.css('pointer-events', 'none');

        self.$videobox.one('contextmenu', function() {
          setTimeout(function() {
              this.$nav.css('pointer-events', 'auto');
          }.bind(self), 0);
        });
      }
    });

    this.$videobox.find('.vb-loader, .vb-close').on('click', function() {
      self.end();
      jwplayer().remove();
      return false;
    });

    $('.vb-report').on('click', (e) => {
      $('#report_video_id').val(this.album[this.currentVideoIndex].id);
      $('#reportModal').modal('show');
    });

    $('.vb-share').on('click', (e) => {
      $('#shareModal').modal('show');
      const video = this.album[this.currentVideoIndex];
      $('#shareModal .twitter-share').attr('href', `https://twitter.com/intent/tweet?text=See what this video has to say about ${video.issue.name} http://www.seetheissue.com/videos/${video.id}`);
      $('#shareModal .link-share').val(`http://www.seetheissue.com/videos/${video.id}`);
    });
  };

  // Show overlay and videobox. If the image is part of a set, add siblings to album array.
  Videobox.prototype.start = function($link) {
    const self    = this;
    const $window = $(window);

    $window.on('resize', $.proxy(this.sizeOverlay, this));

    this.sizeOverlay();

    // Set the video number to the index in the array
    let videoNumber = $link.attr('data-index');

    function addToAlbum($link) {
      self.album.push({
        link: $link.attr('href'),
        title: $link.attr('data-title') || $link.attr('title')
      });
    }

    // Support both data-videobox attribute and rel attribute implementations
    const dataVideoboxValue = $link.attr('data-videobox');
    let $links = null;

    // if (dataVideoboxValue) {
    //   $links = $($link.prop('tagName') + '[data-videobox="' + dataVideoboxValue + '"]');
    //   for (var i = 0; i < $links.length; i = ++i) {
    //     addToAlbum($($links[i]));
    //     if ($links[i] === $link[0]) {
    //       videoNumber = i;
    //     }
    //   }
    // } else {
    //   if ($link.attr('rel') === 'videobox') {
    //     // If image is not part of a set
    //     addToAlbum($link);
    //   } else {
    //     // If image is part of a set
    //     $links = $($link.prop('tagName') + '[rel="' + $link.attr('rel') + '"]');
    //     for (var j = 0; j < $links.length; j = ++j) {
    //       addToAlbum($($links[j]));
    //       if ($links[j] === $link[0]) {
    //         videoNumber = j;
    //       }
    //     }
    //   }
    // }

    // Position Videobox
    const top  = $window.scrollTop() + this.options.positionFromTop;
    const left = $window.scrollLeft();
    this.$videobox.css({
      top: top + 'px',
      left: left + 'px'
    }).fadeIn(this.options.fadeDuration);

    // Disable scrolling of the page while open
    if (this.options.disableScrolling) {
      $('body').addClass('vb-disable-scrolling');
    }

    this.changeVideo(videoNumber);
  };

  /*
    Record that a user has started watching a video

  */
  Videobox.prototype.recordWatch = function(video_id) {
    $.ajax({
      url: "/videos/watched",
      type: "POST",
      data: {
        "video_id": video_id
      }
    })
    .done((data, status, xhr) => {
    });
  }

  /*
    Record that a user has finished watching a video

  */
  Videobox.prototype.recordComplete = function(video_id) {
    $.ajax({
      url: "/videos/completed",
      type: "POST",
      data: {
        "video_id": video_id
      }
    })
    .done((data, status, xhr) => {
    });
  }

  // Hide most UI elements in preparation for the animated resizing of the videobox.
  Videobox.prototype.changeVideo = function(videoNumber) {
    const self = this;

    this.disableKeyboardNav();
    const $video = this.$videobox.find('.vb-video');
    this.currentVideoIndex = parseInt(videoNumber);

    this.$overlay.fadeIn(this.options.fadeDuration);

    $('.vb-loader').fadeIn('slow');
    this.$videobox.find('.vb-video, .vb-nav, .vb-prev, .vb-next, .vb-dataContainer, .vb-numbers, .vb-caption').hide();

    this.$outerContainer.addClass('animating');

    jwplayer("vb-video").setup({
      file: `https://content.jwplatform.com/videos/${this.album[this.currentVideoIndex].media_id}.mp4`
    })

    jwplayer().on("ready", () =>{
      this.$videobox.find('.vb-next').css("opacity", '0');
      this.sizeContainer($video + 50, $video + 50);
      $video.show();
    });

    jwplayer().on("play", () => {
      this.recordWatch(self.album[self.currentVideoIndex].id);
    });

    jwplayer().on("complete", () => {
      this.recordComplete(self.album[self.currentVideoIndex].id);
      if (this.currentVideoIndex <= this.album.length) {
        this.$videobox.find('.vb-next').css("opacity", '1');
      }
    });

    if (this.album.length - this.currentVideoIndex == 2) {
      //this.getVideos();
    }

    // // When image to show is preloaded, we send the width and height to sizeContainer()
    // var preloader = new Image();
    // preloader.onload = function() {
    //   var $preloader;
    //   var imageHeight;
    //   var imageWidth;
    //   var maxImageHeight;
    //   var maxImageWidth;
    //   var windowHeight;
    //   var windowWidth;

    //   $image.attr('src', self.album[videoNumber].link);

    //   $preloader = $(preloader);

    //   $image.width(preloader.width);
    //   $image.height(preloader.height);

    //   if (self.options.fitImagesInViewport) {
    //     // Fit image inside the viewport.
    //     // Take into account the border around the image and an additional 10px gutter on each side.

    //     windowWidth    = $(window).width();
    //     windowHeight   = $(window).height();
    //     maxImageWidth  = windowWidth - self.containerPadding.left - self.containerPadding.right - self.imageBorderWidth.left - self.imageBorderWidth.right - 20;
    //     maxImageHeight = windowHeight - self.containerPadding.top - self.containerPadding.bottom - self.imageBorderWidth.top - self.imageBorderWidth.bottom - 120;

    //     // Check if image size is larger then maxWidth|maxHeight in settings
    //     if (self.options.maxWidth && self.options.maxWidth < maxImageWidth) {
    //       maxImageWidth = self.options.maxWidth;
    //     }
    //     if (self.options.maxHeight && self.options.maxHeight < maxImageWidth) {
    //       maxImageHeight = self.options.maxHeight;
    //     }

    //     // Is the current image's width or height is greater than the maxImageWidth or maxImageHeight
    //     // option than we need to size down while maintaining the aspect ratio.
    //     if ((preloader.width > maxImageWidth) || (preloader.height > maxImageHeight)) {
    //       if ((preloader.width / maxImageWidth) > (preloader.height / maxImageHeight)) {
    //         imageWidth  = maxImageWidth;
    //         imageHeight = parseInt(preloader.height / (preloader.width / imageWidth), 10);
    //         $image.width(imageWidth);
    //         $image.height(imageHeight);
    //       } else {
    //         imageHeight = maxImageHeight;
    //         imageWidth = parseInt(preloader.width / (preloader.height / imageHeight), 10);
    //         $image.width(imageWidth);
    //         $image.height(imageHeight);
    //       }
    //     }
    //   }
    //   self.sizeContainer($image.width(), $image.height());
    // };

    // preloader.src          = this.album[videoNumber].link;
  };

  // Stretch overlay to fit the viewport
  Videobox.prototype.sizeOverlay = function() {
    this.$overlay
      .width($(document).width())
      .height($(document).height());
  };

  // Animate the size of the videobox to fit the image we are showing
  Videobox.prototype.sizeContainer = function(imageWidth, imageHeight) {
    const self = this;

    let oldWidth  = this.$outerContainer.outerWidth();
    let oldHeight = this.$outerContainer.outerHeight();
    let newWidth  = imageWidth + this.containerPadding.left + this.containerPadding.right + this.imageBorderWidth.left + this.imageBorderWidth.right;
    let newHeight = imageHeight + this.containerPadding.top + this.containerPadding.bottom + this.imageBorderWidth.top + this.imageBorderWidth.bottom;

    function postResize() {
      self.$videobox.find('.vb-dataContainer').width(newWidth);
      self.$videobox.find('.vb-prevLink').height(newHeight);
      self.$videobox.find('.vb-nextLink').height(newHeight);
      self.showVideo();
    }

    if (oldWidth !== newWidth || oldHeight !== newHeight) {
      // this.$outerContainer.animate({
      //   width: newWidth,
      //   height: newHeight
      // }, this.options.resizeDuration, 'swing', function() {
      //   postResize();
      // });
      postResize();
    } else {
      postResize();
    }
  };

  // Display the image and its details and begin preload neighboring images.
  Videobox.prototype.showVideo = function() {
    this.$videobox.find('.vb-loader').stop(true).hide();
    this.$videobox.find('.vb-video').fadeIn(this.options.videoFadeDuration);

    this.updateNav();
    this.updateDetails();
    this.preloadNeighboringImages();
    this.enableKeyboardNav();
  };

  // Display previous and next navigation if appropriate.
  Videobox.prototype.updateNav = function() {
    // Check to see if the browser supports touch events. If so, we take the conservative approach
    // and assume that mouse hover events are not supported and always show prev/next navigation
    // arrows in image sets.
    let alwaysShowNav = false;
    try {
      document.createEvent('TouchEvent');
      alwaysShowNav = (this.options.alwaysShowNavOnTouchDevices) ? true : false;
    } catch (e) {}

    this.$videobox.find('.vb-report').data('video', this.album[this.currentVideoIndex].id);

    this.$videobox.find('.vb-nav').show();

    if (this.album.length > 1) {
      if (this.options.wrapAround) {
        if (alwaysShowNav) {
          this.$videobox.find('.vb-prev, .vb-next').css('opacity', '1');
        }
        this.$videobox.find('.vb-prev, .vb-next').show();
      } else {
        if (this.currentVideoIndex > 0) {
          this.$videobox.find('.vb-prev').show();
          if (alwaysShowNav) {
            this.$videobox.find('.vb-prev').css('opacity', '1');
          }
        }
        if (this.currentVideoIndex < this.album.length - 1) {
          this.$videobox.find('.vb-next').show();
          if (alwaysShowNav) {
            this.$videobox.find('.vb-next').css('opacity', '1');
          }
        }
      }
    }
  };

  // Display caption, image number, and closing button.
  Videobox.prototype.updateDetails = function() {
    const self = this;

    // Enable anchor clicks in the injected caption html.
    // Thanks Nate Wright for the fix. @https://github.com/NateWr
    if (typeof this.album[this.currentVideoIndex].title !== 'undefined' &&
      this.album[this.currentVideoIndex].title !== '') {
      const $caption = this.$videobox.find('.vb-caption');
      if (this.options.sanitizeTitle) {
        $caption.text(this.album[this.currentVideoIndex].title);
      } else {
        $caption.html(this.album[this.currentVideoIndex].title);
      }
      $caption.fadeIn('fast')
        .find('a').on('click', function(event) {
          if ($(this).attr('target') !== undefined) {
            window.open($(this).attr('href'), $(this).attr('target'));
          } else {
            location.href = $(this).attr('href');
          }
        });
    }

    if (this.album.length > 0 && this.options.showImageNumberLabel) {
      const labelText = this.imageCountLabel(this.currentVideoIndex + 1, this.album.length);
      this.$videobox.find('.vb-number').text(labelText).fadeIn('fast');
    }

    this.$outerContainer.removeClass('animating');

    this.$videobox.find('.vb-dataContainer').fadeIn(this.options.resizeDuration, function() {
      return self.sizeOverlay();
    });
  };

  // Preload previous and next images in set.
  Videobox.prototype.preloadNeighboringImages = function() {
    // if (this.album.length > this.currentVideoIndex + 1) {
    //   var preloadNext = new Image();
    //   preloadNext.src = this.album[this.currentVideoIndex + 1].link;
    // }
    // if (this.currentVideoIndex > 0) {
    //   var preloadPrev = new Image();
    //   preloadPrev.src = this.album[this.currentVideoIndex - 1].link;
    // }
  };

  Videobox.prototype.enableKeyboardNav = function() {
    $(document).on('keyup.keyboard', $.proxy(this.keyboardAction, this));
  };

  Videobox.prototype.disableKeyboardNav = function() {
    $(document).off('.keyboard');
  };

  Videobox.prototype.keyboardAction = function(event) {
    var KEYCODE_ESC        = 27;
    var KEYCODE_LEFTARROW  = 37;
    var KEYCODE_RIGHTARROW = 39;

    var keycode = event.keyCode;
    var key     = String.fromCharCode(keycode).toLowerCase();
    if (keycode === KEYCODE_ESC || key.match(/x|o|c/)) {
      this.end();
    } else if (key === 'p' || keycode === KEYCODE_LEFTARROW) {
      if (this.currentVideoIndex !== 0) {
        this.changeVideo(this.currentVideoIndex - 1);
      } else if (this.options.wrapAround && this.album.length > 1) {
        this.changeVideo(this.album.length - 1);
      }
    } else if (key === 'n' || keycode === KEYCODE_RIGHTARROW) {
      if (this.currentVideoIndex !== this.album.length - 1) {
        this.changeVideo(this.currentVideoIndex + 1);
      } else if (this.options.wrapAround && this.album.length > 1) {
        this.changeVideo(0);
      }
    }
  };

  // Closing time. :-(
  Videobox.prototype.end = function() {
    this.disableKeyboardNav();
    $(window).off('resize', this.sizeOverlay);
    this.$videobox.fadeOut(this.options.fadeDuration);
    this.$overlay.fadeOut(this.options.fadeDuration);
    $('select, object, embed').css({
      visibility: 'visible'
    });
    if (this.options.disableScrolling) {
      $('body').removeClass('vb-disable-scrolling');
    }
    this.album = [];
  };

  return new Videobox();
}));
