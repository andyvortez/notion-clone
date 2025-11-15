import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { allDevelopers: Array, currentDeveloper: String }
  connect() {
    this.turboFrame = this.element.parentElement
  }

  showDropdown() {
    
    const currentDropdowns = document.querySelectorAll(".developer-dropdown")
    if (currentDropdowns.length > 0) {
      return
    }

    const rect = this.element.getBoundingClientRect()

    const dropdown = document.createElement('div')
    dropdown.className = 'developer-dropdown'
    dropdown.innerHTML = this.buildDropdownHTML()

    dropdown.style.position = 'fixed'
    dropdown.style.top = `${rect.top}px`
    dropdown.style.left = `${rect.left}px`
    dropdown.style.zIndex = '1000'

    dropdown.querySelectorAll('.developer-option').forEach(option => {
      option.addEventListener('click', (event) => this.selectDeveloper(event))
    })

    dropdown.querySelectorAll('.developer-option').forEach(option => {
      option.addEventListener('click', (event) => {
        event.stopPropagation();
        this.selectDeveloper(event);
      });
    });

    dropdown.querySelectorAll('.current-label').forEach(option => {
      option.addEventListener('click', (event) => {
        event.stopPropagation(); // ⬅️ same idea
        this.removeDeveloper(event);
      });
    });

    document.body.appendChild(dropdown)

    this.dropdown = dropdown
    document.body.classList.add('dropdown-active')

    this.close()
    
  }

  buildDropdownHTML() { //OPEN DROPDOWN, DELETE KEYWORD, SEE IT UPDATE, CLOSE DROPDOWN, OPEN DROPDOWN, ADD KEYWORD, SEE IT UDPATE, CLOSE DROPDOWN, OPEN DROPDOWN, SEE NEW KEYWORD IS GONE
    let html = '<div class="dropdown-container">'
    if (this.currentDeveloperValue) {
      html += '<div class="ticket-developer" style="display: flex;">'
      html += `<span class="developer-label current-label" data-developer-name="${this.currentDeveloperValue}">${this.currentDeveloperValue} <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.646447 0.646447C0.841709 0.451184 1.15829 0.451184 1.35355 0.646447L4 3.29289L6.64645 0.646447C6.84171 0.451184 7.15829 0.451184 7.35355 0.646447C7.54882 0.841709 7.54882 1.15829 7.35355 1.35355L4.70711 4L7.35355 6.64645C7.54882 6.84171 7.54882 7.15829 7.35355 7.35355C7.15829 7.54882 6.84171 7.54882 6.64645 7.35355L4 4.70711L1.35355 7.35355C1.15829 7.54882 0.841709 7.54882 0.646447 7.35355C0.451184 7.15829 0.451184 6.84171 0.646447 6.64645L3.29289 4L0.646447 1.35355C0.451184 1.15829 0.451184 0.841709 0.646447 0.646447Z" fill="#ffffff75"/>
        </svg></span>`
      html += '</div>'
    }
    
    html += `<hr><ul id="item-list">`
    this.allDevelopersValue.forEach(developer => {
      html += `<li class="developer-option" data-developer-name="${developer}">${developer}</li>`
    })
     html += '</ul></div>'
    
    return html
  }

  selectDeveloper(event) {
    const developerSelected = event.currentTarget;
    const developerName = developerSelected.dataset.developerName
    const ticketId = this.turboFrame.id.split('_')[1]

    fetch(`/tickets/${ticketId}/update_developer`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: JSON.stringify({
        developer: developerName
      })
    })
    .then(response => {
      if (response.ok) {
        return response.text()
      } else {
        throw new Error('Request failed')
      }
    })
    .then(data => {
      const turboFrame = document.getElementById(`ticket_${ticketId}_developer`)
      const developerCell = turboFrame.querySelector('.developer-cell')
      developerCell.innerHTML = `<span class="developer-label" data-developer-name="${data}">${data}</span>`
      this.currentDeveloperValue = data
      this.dropdown.remove()
      document.body.classList.remove('dropdown-active')
    }) 
  }

  removeDeveloper(event) { //  DELETING WORKS, BUT OPENING DROPDOWN AGAIN BEFORE REFRESH LEADS TO "NULL X" NEED TO REMOVE TEXT REPLACEMENT
    const ticketId = this.turboFrame.id.split('_')[1]
    const turboFrame = document.getElementById(`ticket_${ticketId}_developer`)
    console.log('removing', event.target)
    const developerCell = turboFrame.querySelector('.developer-cell')
   
    

    fetch(`/tickets/${ticketId}/remove_developer`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: JSON.stringify({
        developer: null
      })
    })
    .then(response => {
      
      if (response.ok) {
        developerCell.innerHTML = null
        if (this.currentDeveloperValue) {
          this.currentDeveloperValue = null
        }
        this.dropdown.remove()
        document.body.classList.remove('dropdown-active')
      } else {
        throw new Error('Request failed')
      }
    })
  }

  close() {
    const developerDropdown = document.querySelector('.developer-dropdown')
    if (!developerDropdown) return
    
    const handleOutsideClick = (event) => {
      if (!developerDropdown.contains(event.target)) {
        developerDropdown.remove()
        document.body.classList.remove('dropdown-active')
        document.removeEventListener('click', handleOutsideClick)
      }
    }
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick)
    }, 0)
   
  }
}
