class Admin::ReportsController < AdminController
  def index
    @reports = Report.order(created_at: :desc).page(params[:page])
  end

  def new
    @report = Report.new
  end

  def create
    @report = Report.new(report_params)

    if @report.save
      redirect_to admin_reports_path,
                  success: t('.create')
    else
      render :new
    end
  end

  def show
    @report = Report.find(params[:id])
  end

  def edit
    @report = Report.find(params[:id])
  end

  def update
    @report = report.find(params[:id])

    if @report.update(report_params)
      redirect_to admin_reports_path,
                  success: t('.update')
    else
      render :show
    end
  end

  def destroy
    @report = report.find(params[:id])

    if @report.destroy
      redirect_to admin_reports_path,
                  success: t('.destroy')
    else
      render :show
    end
  end

  private

  def report_params
    params.require(:report).permit(:user_id, :video_id, :comment, :category)
  end
end
