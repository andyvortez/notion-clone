// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

    // Example using vanilla JavaScript
    document.addEventListener('DOMContentLoaded', () => {
      const openButtons = document.querySelectorAll('.open-slider'); // Assuming a button to trigger the overlay
      const closeButton = document.getElementById('close-slider');
      const overlay = document.getElementById('form-slider');

      openButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          overlay.style.display = "flex";
          console.log('Overlay opened');
          document.body.classList.add('slider-active')
        })
      })

      if (closeButton) {
        closeButton.addEventListener('click', () => {
          overlay.style.display = 'none';
          console.log(overlay, 'none')
          document.body.classList.remove('slider-active')
        });
      } else {
        console.log(overlay, 'did not work')
      }
    });

    //NEED TO BE ABLE TO SELECT THE OTHER BUTTONS WITHOUT REFRESHING THE PAGE AFTER CREATING A TICKET
