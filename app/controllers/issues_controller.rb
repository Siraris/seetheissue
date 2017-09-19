class IssuesController < ApplicationController
  def index
    respond_to do |format|
      format.html { render json: Issue.all}
    end
  end

  def show
    @issue = Issue.where(id: params[:id]).first
    @videos = Video.where(issue_id: params[:id])
    @issue_video_count = Video.where(issue_id: params[:id]).count('id')
  end

  def issue_params
    params.require(:issue).permit(:name, :category_id)
  end
end
