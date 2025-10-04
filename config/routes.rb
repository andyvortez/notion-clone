Rails.application.routes.draw do
  devise_for :users, controllers: {
        registrations: 'users/registrations'
  }
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  # Defines the root path route ("/")
  root "home_page#index"

  resources :tickets do
    collection do
      get :new_field  
      get :new   # For creating new ticket fields
      post :create_field  # For saving new ticket fields
    end
    
    member do
      get :edit_field     # For editing existing ticket fields  
      patch :update_field # For saving existing ticket field updates
      post :add_keyword
      delete :delete_keyword
    end
  end
end
