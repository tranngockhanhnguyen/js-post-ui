import postApi from './api/postApi'
import { setTextContext, setThumbnail, truncateText } from './utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

// to use fromNow function
dayjs.extend(relativeTime)

function createPostElement(post) {
  if (!post) return

  // find and clone template
  const postTemplate = document.getElementById('postTemplate')
  if (!postTemplate) return

  const liElement = postTemplate.content.firstElementChild.cloneNode('true')
  if (!liElement) return

  // Update thumbnail, title, description, author
  setTextContext(liElement, '[data-id="title"]', post.title)
  setTextContext(liElement, '[data-id="description"]', truncateText(post.description, 200))
  setTextContext(liElement, '[data-id="author"]', post.author)
  // calculate spantime
  setTextContext(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`)
  setThumbnail(liElement, '[data-id="thumbnail"]', post.imageUrl)

  // attach events

  return liElement
}

function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return

  const ulElement = document.getElementById('postList')
  if (!ulElement) return

  postList.forEach((post) => {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  })
}

;(async () => {
  try {
    const queryParams = {
      _page: 1,
      _limit: 6,
    }
    const { data, pagination } = await postApi.getAll(queryParams)
    renderPostList(data)
  } catch (error) {
    console.log('get all failed', error)
    // show modal, toast error
  }
})()
