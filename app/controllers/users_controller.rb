class UsersController < ApplicationController
  force_ssl if: :ssl_configured?

  before_action :authenticate_user!

  def show
    @user = find_user
  end

  # Allows update of user attributes, _except_ password
  def update
    @user = find_user

    respond_to do |format|
      if @user.update_without_password(user_params)
        format.json { render :show, status: :ok, location: @user }
      else
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # Allows update of password only
  def update_password
    @user = find_user

    respond_to do |format|
      if @user.update(user_password_params)
        bypass_sign_in(@user)
        format.json { render :show, status: :ok, location: @user }
      else
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @user = find_user

    sign_out(@user)
    @user.destroy

    redirect_to root_path
  end

  private

  # Looks up user from database
  #
  # Note that we cannot just return `current_user` as this could be an instance
  # of `GuestUser`. We look up the user so a `RecordNotFound` is triggered for
  # guest users.
  def find_user
    User.find(current_user.id)
  end

  def user_params
    params.require(:user).permit(:email, :first_name, :last_name, :tenant_id)
  end

  def user_password_params
    params.require(:user).permit(:password, :password_confirmation)
  end
end
