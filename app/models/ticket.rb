class Ticket < ApplicationRecord
  belongs_to :category
  has_and_belongs_to_many :keywords
  validates :ticket_name, presence: true 
  enum :developer, [ :usman, :rehan, :andy ]
end
