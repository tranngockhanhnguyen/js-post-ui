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
      element.src = '../images/thumbnail.jpg'
    })
  }
}
