class CategoriesController < ApplicationController
  def index
    respond_to do |format|
      format.html { render json: Category.all}
    end

  end

  def category_params
    params.require(:category).permit(:name)
  end
end
