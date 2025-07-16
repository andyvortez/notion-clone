class HomePageController < ApplicationController
  def index
    @tickets = Ticket.all
    @category = Category.all
  end
end
