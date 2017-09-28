class VideosController < ApplicationController

  def index
    @videos = Video.all
    @categories = Category.all
    @issues = Issue.all
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

  def show
    @video = Video.where(id: params[:id]).first
    @issue = Issue.where(id: @video.issue_id).first
    @videos = Video.where(issue_id: @issue.id)
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

  def watched
    store_statistic(:watched)
  end

  def completed
    store_statistic(:completed)
  end

  # TODO - Don't return all videos, just video for issue
  def list
    respond_to do |format|
      format.json { render json: Video.where(issue_id: params[:issue_id]).limit(25)}
    end
  end

  def video_params
    params.require(:video).permit(:content, :issue_id, :user_id, :title, :description, :votes)
  end

  private

    def store_statistic(name)
      stat_params = {video_id: params[:video_id]}
      stat_params[:user_id] = (user_signed_in?) ? current_user.id : nil

      stat = Statistic.where(stat_params)

      unless (stat.empty?)
        stat = stat.first
        stat.increment(name)
        stat.save();
      else
        new_stat = Statistic.new(stat_params)
        new_stat.watched = 1 if name == :watched || name == :completed
        new_stat.completed = 1 if name == :completed
        new_stat.save()
      end

      respond_to do |format|
        format.html { render json: "stat_saved"}
      end
    end

    def create_video(params)
      jwService = JWService.new
      result = jwService.create_video(params)
      return jwService.upload_video(result, params)
    end
end
