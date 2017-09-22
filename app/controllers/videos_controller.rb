class VideosController < ApplicationController

  def index
    @videos = Video.all
    @categories = Category.all
  end

  def create

    # TODO Check to see size of file? We can't let anything over 5 GB
    # which would be a ridiculous size regardless

    # Check to see if user has already uploaded video for this issue
    # so we don't upload duplicates to hosted JW Player
    result = Video.where({
      issue_id: video_params[:issue_id].to_i,
      user_id: current_user.id
    })

    unless result.empty?
      render(json: { error_message: "Duplicate video for this issue, you can delete it from your profile to upload a new video.", error_code: "duplicate_video" },
        status: :unprocessable_entity
      ) and return
    end

    key = create_video(params)

    begin
      @video = Video.create({
        media_id: key,
        issue_id: video_params[:issue_id].to_i,
        user_id: current_user.id
      }).save()

      render(json: @video)
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
    params.require(:video).permit(:content, :issue_id, :user_id, :title, :description)
  end

  private

  def create_video(params)
    jwService = JWService.new
    result = jwService.create_video(params)
    return jwService.upload_video(result, params)
  end
end
