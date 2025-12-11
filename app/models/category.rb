class Category < ApplicationRecord
  has_many :tickets
  
  validates :name, presence: true
  validates_uniqueness_of :name
end
