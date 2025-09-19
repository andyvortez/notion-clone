class HomePageController < ApplicationController
  before_action :authenticate_user!
  
  def index
    @tickets = Ticket.all
    @category = Category.all
    @all_keywords = Keyword.all
  end
end
