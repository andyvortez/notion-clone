class KeywordsController < ApplicationController

  COLORS = [
    "rgba(59, 152, 255, 0.384)",
    "rgba(255, 107, 180, 0.34)",
    "rgba(255, 255, 243, 0.082)",
    "rgba(255, 134, 49, 0.33)",
    "rgba(197, 123, 255, 0.345)",
    "rgba(255, 182, 135, 0.275)",
    "rgba(255, 102, 91, 0.365)",
    "rgba(255, 212, 111, 0.255)",
    "rgba(93, 255, 164, 0.25)",
    "rgba(254, 250, 240, 0.208)",
    "rgba(255, 134, 49, 0.33)",
    "rgba(255, 255, 243, 0.082)",
    "rgba(254, 250, 240, 0.208)",
    "rgba(254, 250, 240, 0.208)"
  ]

  def create
    @keyword = Keyword.new(keyword_params)
    keyword_count = Keyword.count
    color_count = COLORS.length
    selected = keyword_count % color_count
    @keyword.background_color = COLORS[selected]
    if @keyword.save
      redirect_to root_path
    else
      Rails.logger.error("keyword did not save")
    end
  end

  def create_from_dropdown
    @keyword = Keyword.create!(keyword_params)
    render json: { id: @keyword.id, text: @keyword.keyword, background_color: @keyword.background_color }
  end

  def update_keywords
    ticket = Ticket.find(params[:id])
    keyword_ids = params[:keyword_ids] || []
    ticket.keywords = Keyword.where(id: keyword_ids)
    render partial: "tickets/keywords", locals: { ticket: ticket }
  end

  private

  def keyword_params
    params.require(:keyword)
  end

end

def create
  @ticket = Ticket.new(ticket_params)
  if @ticket.save
    redirect_to root_path
  else
    render "new"
  end
end
