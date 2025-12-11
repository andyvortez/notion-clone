class Ticket < ApplicationRecord
  belongs_to :category
  has_and_belongs_to_many :keywords
  #validates :ticket_name, presence: true 
  enum :developer, [ :usman, :rehan, :andy ]
  validates :story_points, numericality: { only_integer: true, greater_than_or_equal_to: 1, allow_nil: true }
end
