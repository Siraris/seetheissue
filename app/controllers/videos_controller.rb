class VideosController < ApplicationController

  def index
    @categories = Category.all
    @issues = Issue.friendly.all
    @highlights = @issues.reject{|issue| issue.top_issue == false}
    @videos = Video.includes(:issue).where(issue_id: @issues.reject{|issue| issue.top_issue == false})
    @around_the_site = generate_around_site
  end

  def test
    @geo_service = GEOService.new
    result = @geo_service.query_geo_data("60035")
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
      render(json: { error_message: "Duplicate video for this issue, you can delete it from your profile to upload a new video.",
        error_code: "duplicate_video" },
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
    @issue = Issue.friendly.where(id: @video.issue_id).first
    @videos = Video.where(issue_id: @issue.id)
  end

  def destroy
    if (user_signed_in?)
      @video = Video.where(id: params[:id]).first
      @video.destroy if (@video.user_id == current_user.id)

      message = (@video.destroyed?) ? "deleted" : "failed"

      render(json: {message: message}) and return
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

  def watched
    store_statistic(:watched)
  end

  def completed
    store_statistic(:completed)
  end

  # TODO - Don't return all videos, just video for issue
  def list
    respond_to do |format|
      format.html { render partial: 'videos/issues_video_container', locals: {videos: Video.where(issue_id: params[:issue_id]).page(params[:page]).per(params[:per]), issue: Issue.where(id: params[:issue_id])} }
      format.json { render json: Video.where(issue_id: params[:issue_id]).page(params[:page]).per(params[:per])}
    end
  end

  def video_params
    params.require(:video).permit(:content, :issue_id, :user_id, :title, :description, :votes)
  end

  private

    # This might need a bit more complexity in the future,
    # but for now, it works like a charm
    def generate_around_site
      return Video.order("RAND()").limit(4)
    end

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
