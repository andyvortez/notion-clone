import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { allKeywords: Array }

  connect() {
    this.turboFrame = this.element.parentElement
    //const element = this.element
    this.selectColor()
  }

  selectColor() {
    const first = "rgba(59, 152, 255, 0.384)"
    const second = "rgba(255, 107, 180, 0.34)"
    const third = "rgba(255, 255, 243, 0.082)"
    const fourth = "rgba(255, 134, 49, 0.33)"
    const fifth = "rgba(197, 123, 255, 0.345)"
    const sixth = "rgba(255, 182, 135, 0.275)"
    const seventh = "rgba(255, 102, 91, 0.365)"
    const eighth = "rgba(255, 212, 111, 0.255)"
    const ninth = "rgba(93, 255, 164, 0.25)"
    const tenth = "rgba(254, 250, 240, 0.208)"
    const eleventh = "rgba(255, 134, 49, 0.33)"
    const twelfth = "rgba(255, 255, 243, 0.082)"
    const thirteenth = "rgba(254, 250, 240, 0.208)"
    const fourteenth = "rgba(254, 250, 240, 0.208)"


    const colors = [first, second, third, fourth, fifth, sixth, seventh, eighth, ninth, tenth, eleventh, twelfth, thirteenth, fourteenth]
    colors
  }

  showDropdown() {
    const currentDropdowns = document.querySelectorAll(".keyword-dropdown")
    if (currentDropdowns.length > 0) {
      return
    }
    
    
    const rect = this.element.getBoundingClientRect()
  
    // Create dropdown
    const dropdown = document.createElement('div')
    dropdown.className = 'keyword-dropdown'
    dropdown.innerHTML = this.buildDropdownHTML()
    
    // Position it relative to the cell but append to body
    dropdown.style.position = 'fixed'
    dropdown.style.top = `${rect.bottom}px`
    dropdown.style.left = `${rect.left}px`
    dropdown.style.zIndex = '1000'

    dropdown.querySelectorAll('.keyword-option').forEach(option => {
    option.addEventListener('click', (event) => this.selectKeyword(event))
    })
    
    // Append to body instead of the cell
    document.body.appendChild(dropdown)
    
    // Store reference so we can remove it later
    this.dropdown = dropdown
    document.body.classList.add('dropdown-active')
    setTimeout(() => {
      this.close()
    }, 500);
  }

  buildDropdownHTML() {
    let html = '<div class="dropdown-container">'
    
    this.allKeywordsValue.forEach(keyword => {
      html += `<div class="keyword-option" data-keyword-id="${keyword.id}">${keyword.keyword}</div>`
    })
      
    html += '</div>'
    return html
  }

  selectKeyword(event) {
    const keywordSelected = event.target
    const keywordId = keywordSelected.dataset.keywordId
    const ticketId = this.turboFrame.id.split('_')[1]
    
    fetch(`/tickets/${ticketId}/add_keyword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: JSON.stringify({
        keyword_id: keywordId
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
      const turboFrame = document.getElementById(`ticket_${ticketId}_ticket_keywords`)
      const keywordsCell = turboFrame.querySelector('.keywords-cell')
      keywordsCell.innerHTML += data
    })
  }

  close() {
    const keywordDropdown = document.querySelector('.keyword-dropdown')
    if (!keywordDropdown) return

    const handleOutsideClick = (event) => {
      if (!keywordDropdown.contains(event.target)) {
        keywordDropdown.remove()
        document.body.classList.remove('dropdown-active')
        document.removeEventListener('click', handleOutsideClick)
      }
    }
    document.addEventListener('click', handleOutsideClick)
  }
}
