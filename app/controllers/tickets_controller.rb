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
    @tickets = Ticket.all.includes(:keywords)
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

  def new_field
    @field_name = params[:field]
    @frame_id = params[:frame_id]
    @ticket = Ticket.new
    
    render partial: 'field_form', locals: { 
      ticket: @ticket, 
      field_name: @field_name, 
      frame_id: @frame_id 
    }
  end
  
  def edit_field
    @ticket = Ticket.find(params[:id])
    @field_name = params[:field]
    @frame_id = params[:frame_id]
    
    render partial: 'field_form', locals: { 
      ticket: @ticket, 
      field_name: @field_name, 
      frame_id: @frame_id 
    }
  end

  def create_field
  Rails.logger.info "=== CREATE FIELD DEBUG ==="
  Rails.logger.info "All params: #{params.inspect}"
  Rails.logger.info "Ticket params: #{ticket_params.inspect}"
  Rails.logger.info "Field name: #{params[:field_name]}"
    @ticket = Ticket.new(ticket_params)
    @field_name = params[:field_name]
    @frame_id = params[:frame_id]
    @ticket.category_id = params[:category_id] 

    Rails.logger.info "Ticket before save: #{@ticket.inspect}"
  Rails.logger.info "Ticket errors before save: #{@ticket.errors.full_messages}"
    
    if @ticket.save
      Rails.logger.info "SUCCESS - Ticket saved with ID: #{@ticket.id}"
      puts "=========== CONSOLE DEBUG ==="
    puts "frame_id: #{@frame_id}"
    puts "ticket_id: #{@ticket.id}"
    puts "About to render with ticket_id: #{@ticket.id}"
      Rails.logger.info "Rendering with ticket_id: #{@ticket.id}"
      puts "About to render field_display partial..."
      
      # Success - show the saved value in display mode
      render partial: 'tickets/field_display', locals: { 
        ticket: @ticket, 
        field_name: @field_name, 
        frame_id: @frame_id,
        ticket_id: @ticket.id
      }
    else
      Rails.logger.info "FAILEDDD Ticket validation errors: #{@ticket.errors.full_messages}"
      # Error - show the form again with error styling
      render partial: 'field_form', locals: { 
        ticket: @ticket, 
        field_name: @field_name, 
        frame_id: @frame_id 
      }, status: :unprocessable_entity
    end
  end
  
  def update_field
    @ticket = Ticket.find(params[:id])
    @field_name = params[:field_name]
    @frame_id = params[:frame_id]
    
    if @ticket.update(ticket_params)
      Rails.logger.info "SUCCESSS"
      # Success - show the updated value
      render partial: 'tickets/field_display', locals: { 
        ticket: @ticket, 
        field_name: @field_name, 
        frame_id: @frame_id,
        ticket_id: @ticket.id
      }
    else
      # Error - show the form with errors
      Rails.logger.info "FAILEDDD"
      render partial: 'field_form', locals: { 
        ticket: @ticket, 
        field_name: @field_name, 
        frame_id: @frame_id 
      }, status: :unprocessable_entity
    end
  end

  def add_keyword
    @ticket = Ticket.find(params[:id])
    @keyword = Keyword.find(params[:keyword_id])
    
    if @ticket.keywords.include?(@keyword)
      render plain: ""
    else
      @ticket.keywords << @keyword
      render plain: "<span class='keyword-label'>#{@keyword.keyword}</span>"
    end
  end
  

  private

  def ticket_params
    field_name = params[:field_name]
  
    # Only permit the specific field being edited
    case field_name
    when 'issue'
      params.require(:ticket).permit(:issue)
    when 'documentation' 
      params.require(:ticket).permit(:documentation)
    when 'developer'
      params.require(:ticket).permit(:developer)
    when 'ticket_name'
      params.require(:ticket).permit(:ticket_name)
    when 'story_points'
      params.require(:ticket).permit(:story_points)
    when 'commit'
      params.require(:ticket).permit(:commit)
    else
      # Fallback - permit all fields
      params.require(:ticket).permit(:ticket_name, :issue, :documentation, :developer, :story_points, :accurate, :commit)
    end
  end
end