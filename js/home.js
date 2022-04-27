import postApi from './api/postApi'
import { getUlPagination, setTextContext, setThumbnail, truncateText } from './utils'
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

  // clear current list
  ulElement.textContent = ''

  postList.forEach((post) => {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  })
}

function rederPagination(pagination) {
  const ulPagination = getUlPagination()
  if (!pagination || !ulPagination) return

  // calc totalPages
  const { _page, _limit, _totalRows } = pagination
  const totalPages = Math.ceil(_totalRows / _limit)

  // save page and totalPages to ulPagination
  ulPagination.dataset.page = _page
  ulPagination.dataset.totalPages = totalPages

  // check if enabled / disabled prev link
  _page <= 1
    ? ulPagination.firstElementChild?.classList.add('disabled')
    : ulPagination.firstElementChild?.classList.remove('disabled')

  // check if enabled / disabled next link
  _page >= totalPages
    ? ulPagination.lastElementChild?.classList.add('disabled')
    : ulPagination.lastElementChild?.classList.remove('disabled')
}

async function handleFilterChange(filterName, FilterValue) {
  try {
    // update query params
    const url = new URL(window.location)
    url.searchParams.set(filterName, FilterValue)
    window.history.pushState({}, '', url)

    // fetch API
    // re-render post list
    const { data, pagination } = await postApi.getAll(url.searchParams)
    renderPostList(data)
    rederPagination(pagination)
  } catch (error) {
    console.log('failed to fetch post list', error)
  }
}

function handlePrevClick(e) {
  e.preventDefault()

  const ulPagination = getUlPagination()
  if (!ulPagination) return

  const page = Number.parseInt(ulPagination.dataset.page) || 1
  if (page <= 1) return

  handleFilterChange('_page', page - 1)
}

function handleNextClick(e) {
  e.preventDefault()

  const ulPagination = getUlPagination()
  if (!ulPagination) return

  const page = Number.parseInt(ulPagination.dataset.page) || 1
  const totalPages = ulPagination.dataset.totalPages
  if (page >= totalPages) return

  handleFilterChange('_page', page + 1)
}

function initPagination() {
  // bind click event for pre/next link
  const ulPagination = getUlPagination()
  if (!ulPagination) return

  // add click event for pre link
  const prevLink = ulPagination.firstElementChild?.firstElementChild
  if (prevLink) prevLink.addEventListener('click', handlePrevClick)

  // add click event for next link
  const nextLink = ulPagination.lastElementChild?.lastElementChild
  if (nextLink) nextLink.addEventListener('click', handleNextClick)
}

function initURl() {
  const url = new URL(window.location)

  // upadate search params if needed
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 12)

  window.history.pushState({}, '', url)
}

;(async () => {
  try {
    initPagination()
    initURl()

    const queryParams = new URLSearchParams(window.location.search)
    const { data, pagination } = await postApi.getAll(queryParams)
    renderPostList(data)
    rederPagination(pagination)
  } catch (error) {
    console.log('get all failed', error)
    // show modal, toast error
  }
})()
