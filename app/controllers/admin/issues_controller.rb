class Admin::IssuesController < AdminController

  def index
    @issues = Issue.all
  end
  def new
    @issue = Issue.build
  end

  def create
  end
end
