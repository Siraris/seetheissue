class VideosController < ApplicationController
  def index
    @videos = Video.all
  end

  def create
    # TODO Check to see size of file? We can't let anything over 5 GB
    # which would be a ridiculous size regardless
    jwService = JWService.new
    result = jwService.create_video(params)
    key = jwService.upload_video(result, params)

    Video.create({
      media_id: key,
      category_id: video_params[:category_id],
      user_id: current_user.id
    }).save()
  end

  def oauth
  end

  def video_params
    params.require(:video).permit(:content, :category_id)
  end
end
