class ReportsController < ApplicationController
  def create
    existing = Report.where(
      user_id: report_params[:user_id],
      video_id: report_params[:video_id]
    )
    unless (existing.empty?)
      render(json: { error_message: "You've already issued a report for this video.",
        error_code: "duplicate_report" },
        status: :unprocessable_entity
      ) and return
    end
    @report = Report.create(report_params).save()
    render(json: @report)
  end

  def report_params
    params.require(:report).permit(:user_id, :video_id, :comment, :category)
  end
end
