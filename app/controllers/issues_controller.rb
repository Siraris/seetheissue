class IssuesController < ApplicationController
  def index
    respond_to do |format|
      format.js { render json: Issue.all}
    end
  end

  def show
    @issue = Issue.friendly.find(params[:id])
    @videos = Video.where(issue_id: @issue).limit(25)
    @issue_video_count = Video.where(issue_id: @issue).count()
    @for_votes = @issue.votes.where(vote: 1).count()
    @against_votes = @issue.votes.where(vote:0).count()
  end

  def issue_params
    params.require(:issue).permit(:name, :category_id)
  end
end
