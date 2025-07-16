class Ticket < ApplicationRecord
  validates :ticket_name, presence: true 
  enum :developer, [ :usman, :rehan, :andy ]
end
