class Ticket < ApplicationRecord
  belongs_to :category
  validates :ticket_name, presence: true 
  enum :developer, [ :usman, :rehan, :andy ]
end
