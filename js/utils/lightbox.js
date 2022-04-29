function showModal(modalElement) {
  // make sure bootstrap scripts is loaded
  if (!window.bootstrap) return

  const modal = new window.bootstrap.Modal(modalElement)
  if (modal) modal.show()
}

// handle click for all imgs --> Event Delegation
// img --> find all imgs with the same album/ gallery
// determine index of selected img
// show modal with selected img
// handle prev/ next click

export function registerLightbox({ modalId, imageSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalId)
  if (!modalElement) return

  // check if this modal is registered or not
  if (Boolean(modalElement.dataset.registered)) return

  // selector
  const imageElement = modalElement.querySelector(imageSelector)
  const prevButton = modalElement.querySelector(prevSelector)
  const nextButton = modalElement.querySelector(nextSelector)
  if (!imageElement || !prevButton || !nextButton) return

  // lightbox vars
  let imgList = []
  let currentIndex = 0

  function showImageAtIndex(index) {
    imageElement.src = imgList[index].src
  }

  document.addEventListener('click', (event) => {
    const { target } = event
    if (target.tagName !== 'IMG' || !target.dataset.album) return

    //  img with data-album
    imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`)
    currentIndex = [...imgList].findIndex((x) => x === target)

    showImageAtIndex(currentIndex)
    showModal(modalElement)
  })

  prevButton.addEventListener('click', () => {
    // show prev image of current album
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length
    showImageAtIndex(currentIndex)
  })

  nextButton.addEventListener('click', () => {
    // show next image of current album
    currentIndex = (currentIndex + 1) % imgList.length
    showImageAtIndex(currentIndex)
  })

  // mark this modal is already registered
  modalElement.dataset.registered = true
}
