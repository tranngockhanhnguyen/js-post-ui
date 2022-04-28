import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { setTextContext, setThumbnail, truncateText } from './common'

// to use fromNow function
dayjs.extend(relativeTime)

export function createPostElement(post) {
  if (!post) return

  // find and clone template
  const postTemplate = document.getElementById('postTemplate')
  if (!postTemplate) return

  const liElement = postTemplate.content.firstElementChild.cloneNode('true')
  if (!liElement) return

  // Update thumbnail, title, description, author
  setTextContext(liElement, '[data-id="title"]', truncateText(post.title, 30))
  setTextContext(liElement, '[data-id="description"]', truncateText(post.description, 200))
  setTextContext(liElement, '[data-id="author"]', post.author)
  // calculate spantime
  setTextContext(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`)
  setThumbnail(liElement, '[data-id="thumbnail"]', post.imageUrl)

  // attach events

  return liElement
}

export function renderPostList(postList) {
  if (!Array.isArray(postList)) return

  const ulElement = document.getElementById('postList')
  if (!ulElement) return

  // clear current list
  ulElement.textContent = ''

  postList.forEach((post) => {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  })
}
