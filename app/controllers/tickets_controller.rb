class TicketsController < ApplicationController

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
  end

  def update
    @ticket = Ticket.find(params[:id])
    if @ticket.update(ticket_params)
      redirect_to @ticket, notice: 'Ticket updated!'
    else 
      render :edit
    end
  end

  def edit
    @ticket = Ticket.find(params[:id])
  end

  def destroy
    @ticket = Ticket.find(params[:id]).destroy!
  end
  
  def show
    @ticket = Ticket.find(params[:id])
  end
  

  private

  def ticket_params
    params.require(:ticket).permit(:ticket_name, :issue, :documentation, :developer, :story_points, :accurate, :commit, :created_at)
  end
end