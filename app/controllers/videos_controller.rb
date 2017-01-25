class VideosController < ApplicationController
  def index
    @videos = Video.all
  end

  def create
    # TODO Check to see size of file? We can't let anything over 5 GB
    # which would be a ridiculous size regardless
    jwService = JWService.new
    result = jwService.create_video(params)
    jwService.upload_video(result, params)
  end

  def oauth
  end
end
