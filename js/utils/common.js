import { toast } from './toast'

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
      toast.error('Error: Failed to load image! 😅')
      element.src = 'thumbnail.jpg'
    })
  }
}

export function setTitleImage(parentElement, selector, url) {
  if (!parentElement) return

  const element = parentElement.querySelector(selector)
  if (element) {
    element.style.backgroundImage = `url("${url}")`

    element.addEventListener('error', () => {
      toast.error('Error: Failed to load image! 😅')
      element.src = 'thumbnail.jpg'
    })
  }
}

export function setFieldValue(form, selector, value) {
  if (!form) return

  const field = form.querySelector(selector)
  if (field) field.value = value
}

export function randomNumber(n) {
  if (!Number.isInteger(n) || n <= 0) return

  return Math.floor(Math.random() * n)
}

export function showModal(modalElement) {
  // make sure bootstrap scripts is loaded
  if (!window.bootstrap) return

  const modal = new window.bootstrap.Modal(modalElement)
  if (modal) modal.show()
}
