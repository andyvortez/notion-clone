class HomePageController < ApplicationController
  def index
    @tickets = Ticket.all
  end
end
