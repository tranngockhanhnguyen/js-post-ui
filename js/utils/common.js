export function setTextContext(parentElement, selector, text) {
  if (!parentElement) return

  const element = parentElement.querySelector(selector)
  if (element) element.textContent = text
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text

  return `${text.slice(0, maxLength - 1)}…`
}

export function setThumbnail(parentElement, selector, url) {
  if (!parentElement) return

  const element = parentElement.querySelector(selector)
  if (element) {
    element.src = url

    element.addEventListener('error', () => {
      console.log('load image error --> use default placeholder')
      element.src = 'thumbnail.jpg'
    })
  }
}

export function setTitleImage(parentElement, selector, url) {
  if (!parentElement) return

  const element = parentElement.querySelector(selector)
  if (element) {
    element.style.backgroundImage = `url(${url})`

    element.addEventListener('error', () => {
      console.log('load image error --> use default placeholder')
      element.src = 'thumbnail.jpg'
    })
  }
}
