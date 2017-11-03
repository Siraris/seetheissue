Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'videos#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  resources :videos do
    collection do
      get 'list/:issue_id' => :list
      get :plays
      post :watched
      post :completed
    end
  end
  resources :categories
  resources :issues
  resources :issue_submissions
  resources :reports

  devise_for :users, controllers: {
    confirmations: "users/confirmations",
    omniauth_callbacks: "users/omniauth_callbacks",
    registrations: "users/registrations",
    sessions: "users/sessions",
    passwords: "users/passwords",
    unlocks: "users/unlocks"
  }

  get '/profile', to: "users#show"

  resource :user, only: %i(destroy show update) do
    member do
      patch :update_password
    end
  end

  namespace :admin, path: 'admin' do
    root to: 'dashboards#show'

    resources :categories
    resources :issues
    resources :issue_submissions
    resources :reports
  end
end
