class Ticket < ApplicationRecord
  validates :ticket_name, presence: true 
end
