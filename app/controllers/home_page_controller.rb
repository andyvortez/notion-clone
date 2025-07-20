class HomePageController < ApplicationController
  before_action :authenticate_user!
  
  def index
    @tickets = Ticket.all
    @category = Category.all
  end
end
