class VideosController < ApplicationController
  def index
    @videos = Video.all
    @categories = Category.all
  end

  def create
    # TODO Check to see size of file? We can't let anything over 5 GB
    # which would be a ridiculous size regardless
    jwService = JWService.new
    result = jwService.create_video(params)
    key = jwService.upload_video(result, params)

    begin
      @video = Video.create({
        media_id: key,
        issue_id: video_params[:issue_id],
        user_id: current_user.id
      }).save()

      render(json: @video)
    rescue ActiveRecord::RecordNotUnique
      # Find existing video and return info?  For deletion?
       render(json: { error: "Duplicate video for this issue" },
        status: :unprocessable_entity
      )
    end
  end

  def oauth
  end

  def plays
    # NOTE: Need to implement page consumption by recursively calling 
    # Can we get if there's more than one page of data?
    # or do we need to check page_length and if at 100, get next page?
    jwService = JWService.new
    result = jwService.plays()
    puts result
  end

  def list
    respond_to do |format|
      format.html { render json: Video.all}
    end
  end

  def video_params
    params.require(:video).permit(:content, :issue_id)
  end
end
