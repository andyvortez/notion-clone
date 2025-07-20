class TicketsController < ApplicationController
  before_action :authenticate_user!

  def create
    @ticket = Ticket.new(ticket_params)
    if @ticket.save
      redirect_to root_path
    else
      render "new"
    end
  end

  def new
    @ticket = Ticket.new
  end

  def index
    @tickets = Ticket.all
    @grouped_tickets = Ticket.includes(:category).group_by(&:category)
  end

  def update
    @ticket = Ticket.find(params[:id])
    if @ticket.update(ticket_params)
      redirect_to root_path, notice: 'Ticket updated!'
    else 
      render :edit
    end
  end

  def edit
    @ticket = Ticket.find(params[:id])
  end

  def destroy
    @ticket = Ticket.find(params[:id]).destroy!
    flash[:success] = "The ticket has been destroyed."
    redirect_to root_path
  end
  
  def show
    @ticket = Ticket.find(params[:id])
  end
  

  private

  def ticket_params
    params.require(:ticket).permit(:ticket_name, :issue, :documentation, :developer, :story_points, :accurate, :commit, :created_at, :category_id, keyword_ids: [])
  end
end