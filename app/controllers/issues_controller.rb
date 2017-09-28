class IssuesController < ApplicationController
  def index
    respond_to do |format|
      format.js { render json: Issue.all}
    end
  end

  def show
    @issue = Issue.where(id: params[:id]).first
    @videos = Video.where(issue_id: params[:id])
    @issue_video_count = Video.where(issue_id: params[:id]).count('id')
    @for_votes = @issue.votes.where(vote: 1).count('id')
    @against_votes = @issue.votes.where(vote:0).count('id')
  end

  def issue_params
    params.require(:issue).permit(:name, :category_id)
  end
end
