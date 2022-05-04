import dayjs from 'dayjs'
import postApi from './api/postApi'
import { setTitleImage, setTextContext, registerLightbox, toast } from './utils'
import localizedFormat from 'dayjs/plugin/localizedFormat'
// to use format function
dayjs.extend(localizedFormat)

function renderPostDetail(post) {
  // render title, author, description, timespan, imageUrl
  setTextContext(document, '#postDetailTitle', post.title)
  setTextContext(document, '#postDetailAuthor', post.author)
  setTextContext(document, '#postDetailDescription', post.description)
  setTextContext(document, '#postDetailTimeSpan', dayjs(post.updatedAt).format(' - L LT'))
  setTitleImage(document, '#postTitleImage', post.imageUrl)

  // attach link to add-edit-post.html
  const editPageLink = document.getElementById('goToEditPageLink')
  if (editPageLink) editPageLink.href = `/add-edit-post.html?id=${post.id}`
}

;(async () => {
  registerLightbox({
    modalId: 'lightbox',
    imageSelector: `img[data-id="lightboxImg"]`,
    prevSelector: `button[data-id="lightboxPrev"]`,
    nextSelector: `button[data-id="lightboxNext"]`,
  })

  try {
    // get post id from URL
    // fetch post detail API
    // render post detail
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')

    if (!postId) {
      console.log('error')
      return
    }

    const post = await postApi.getById(postId)
    renderPostDetail(post)
  } catch (error) {
    console.log('failed to fetch post detail', error)
    toast.error(`Error: ${error}`)
  }
})()
