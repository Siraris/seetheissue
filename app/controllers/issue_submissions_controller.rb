class IssueSubmissionsController < ApplicationController
  def create
    @submission = IssueSubmission.create(issue_submission_params).save()
  end

  def issue_submission_params
    params.require(:issue_submission).permit(:issue, :details, :user_id)
  end
end
