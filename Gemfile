source 'https://rubygems.org'


# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.2.7.1'
# Use mysql2 as the database for Active Record
gem 'mysql2', '~> 0.3.13'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.1.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'
# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
gem 'turbolinks'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.0'
# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc

gem 'puma'
gem 'haml-rails'

# Bootstrap
gem 'bootstrap-sass', '~> 3.3.7'

# Restclient, it supports file uploads, UNLIKE HTTPARTY
gem 'rest-client'

# Devise - Authentication for Rails based on Warden
gem 'devise'

# FriendlyId is the “Swiss Army bulldozer” of slugging and permalink plugins
gem 'friendly_id', '~> 5.1.0'

# Omniauth for social logins
gem 'omniauth-facebook'
gem 'omniauth-google-oauth2'

# Gem for integrating React components into rails
gem 'react-rails'

gem "browserify-rails"

gem 'remotipart', '~> 1.2'

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

group :development, :test do
  # Shim to load environment variables from .env into ENV in development and test
  gem 'dotenv-rails'

  gem 'capybara'
  gem 'foreman'
  gem 'jazz_fingers'
  gem 'pry'
  gem 'rspec-rails'
  gem 'shoulda-matchers'
  gem 'spring'
  gem 'web-console', '~> 2.0'

  # Record your test suite's HTTP interactions and replay them during future
  # test runs for fast, deterministic, accurate tests.
  gem 'vcr'
end

group :test do
  gem 'factory_girl_rails'
  gem 'json-schema'
  gem 'poltergeist'
  gem 'database_cleaner'

  # Code coverage for Ruby
  gem 'simplecov', require: false
end
