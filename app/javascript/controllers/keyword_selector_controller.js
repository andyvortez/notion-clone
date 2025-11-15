import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { allKeywords: Array, currentKeywords: Array, removeKeyword: Array }

  connect() {
    this.turboFrame = this.element.parentElement
    //const element = this.element
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
    dropdown.style.top = `${rect.top}px`
    dropdown.style.left = `${rect.left}px`
    dropdown.style.zIndex = '1000'

    dropdown.querySelectorAll('.keyword-option').forEach(option => {
    option.addEventListener('click', (event) => this.selectKeyword(event))
    })

    dropdown.querySelectorAll('.current-label').forEach(option => {
    option.addEventListener('click', (event) => this.removeKeyword(event))
    })
    
    
    // Append to body instead of the cell
    document.body.appendChild(dropdown)
    
    // Store reference so we can remove it later
    this.dropdown = dropdown
    document.body.classList.add('dropdown-active')
    setTimeout(() => {
      this.close()
    }, 500);

    const search = dropdown.querySelector('#search');
    const items = dropdown.querySelectorAll('#item-list li');
    search.addEventListener('keyup', () => {
      const term = search.value.toLowerCase();
      items.forEach(item => {
        if (item.textContent.toLowerCase().includes(term)){
        item.classList.remove('hidden');
        } else {
         item.classList.add('hidden');
        }
      });
    });
  }

  buildDropdownHTML() { //OPEN DROPDOWN, DELETE KEYWORD, SEE IT UPDATE, CLOSE DROPDOWN, OPEN DROPDOWN, ADD KEYWORD, SEE IT UDPATE, CLOSE DROPDOWN, OPEN DROPDOWN, SEE NEW KEYWORD IS GONE
    let html = '<div class="dropdown-container">'
    html += '<div class="ticket-keywords" style="display: flex;">'
    this.currentKeywordsValue.forEach(k => {
      html += `<span class="keyword-label current-label" style="background-color: ${k.background_color};" data-keyword-id="${k.id}">${k.keyword}
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.646447 0.646447C0.841709 0.451184 1.15829 0.451184 1.35355 0.646447L4 3.29289L6.64645 0.646447C6.84171 0.451184 7.15829 0.451184 7.35355 0.646447C7.54882 0.841709 7.54882 1.15829 7.35355 1.35355L4.70711 4L7.35355 6.64645C7.54882 6.84171 7.54882 7.15829 7.35355 7.35355C7.15829 7.54882 6.84171 7.54882 6.64645 7.35355L4 4.70711L1.35355 7.35355C1.15829 7.54882 0.841709 7.54882 0.646447 7.35355C0.451184 7.15829 0.451184 6.84171 0.646447 6.64645L3.29289 4L0.646447 1.35355C0.451184 1.15829 0.451184 0.841709 0.646447 0.646447Z" fill="#ffffff75"/>
</svg></span>`
    })
    html += '</div>'
    html +=  `<div class="keyword-search-box"><input type="text" id="search" placeholder="search..."></div><ul id="item-list">`
    this.allKeywordsValue.forEach(keyword => {
      html += `<li class="keyword-option" style="background-color: ${keyword.background_color};" data-keyword-id="${keyword.id}">${keyword.keyword}</li>`
    })
     html += '</ul></div>'
    
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
      const dropdownContainer = document.querySelector('.ticket-keywords')
      keywordsCell.innerHTML += data
      const newKeyword = this.allKeywordsValue.find(k => k.id == keywordId)
      if (newKeyword) {
        const spanWithX = `<span class="keyword-label current-label" style="background-color: ${newKeyword.background_color};" data-keyword-id="${newKeyword.id}">${newKeyword.keyword}
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.646447 0.646447C0.841709 0.451184 1.15829 0.451184 1.35355 0.646447L4 3.29289L6.64645 0.646447C6.84171 0.451184 7.15829 0.451184 7.35355 0.646447C7.54882 0.841709 7.54882 1.15829 7.35355 1.35355L4.70711 4L7.35355 6.64645C7.54882 6.84171 7.54882 7.15829 7.35355 7.35355C7.15829 7.54882 6.84171 7.54882 6.64645 7.35355L4 4.70711L1.35355 7.35355C1.15829 7.54882 0.841709 7.54882 0.646447 7.35355C0.451184 7.15829 0.451184 6.84171 0.646447 6.64645L3.29289 4L0.646447 1.35355C0.451184 1.15829 0.451184 0.841709 0.646447 0.646447Z" fill="#ffffff75"/>
        </svg></span>`
        dropdownContainer.insertAdjacentHTML('beforeend', spanWithX)
        const newlyAddedSpan = dropdownContainer.lastElementChild
        newlyAddedSpan.addEventListener('click', (event) => this.removeKeyword(event))
        this.currentKeywordsValue = [...this.currentKeywordsValue, newKeyword]
        // After pushing to array
        this.element.setAttribute('data-keyword-selector-current-keywords-value', JSON.stringify(this.currentKeywordsValue))
      }
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
    document.body.classList.remove('modal-open');
  }

  removeKeyword(event) {
    console.log('removeKeyword called')
    console.log('Event target:', event.target)
    console.log('Target tag:', event.target.tagName)
    const keywordSpan = event.target.closest('.keyword-label')
    console.log('Found span:', keywordSpan)
    const keywordId = keywordSpan.dataset.keywordId
    const ticketId = this.turboFrame.id.split('_')[1]
    const keywordsCell = this.turboFrame.querySelector('.keywords-cell')
    const cellKeywordSpan = keywordsCell.querySelector(`[data-keyword-id="${keywordId}"]`)

    fetch(`/tickets/${ticketId}/delete_keyword`, {
      method: 'DELETE',
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
        keywordSpan.remove()
        if (cellKeywordSpan) {
          cellKeywordSpan.remove()
        }
        this.currentKeywordsValue = this.currentKeywordsValue.filter(k => k.id != keywordId)
        console.log('Keywords remaining after removal:', document.querySelectorAll('.current-label').length)
        console.log('currentKeywordsValue after filter:', this.currentKeywordsValue)
      } else {
        throw new Error('Request failed')
      }
    })
  }
}
