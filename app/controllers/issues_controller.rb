class IssuesController < ApplicationController
  def index
    respond_to do |format|
      format.html { render json: Issue.all}
    end
  end

  def show
  end

  def issue_params
    params.require(:issue).permit(:name, :category_id)
  end
end
