import postApi from './api/postApi'
import {
  initPagination,
  initSearch,
  renderPostList,
  renderPagination,
  toast,
  showModal,
} from './utils'

async function handleFilterChange(filterName, FilterValue) {
  try {
    // update query params
    const url = new URL(window.location)
    if (filterName) url.searchParams.set(filterName, FilterValue)

    // reset page if needed
    if (filterName === 'title_like') url.searchParams.set('_page', 1)

    window.history.pushState({}, '', url)

    // fetch API
    // re-render post list
    const { data, pagination } = await postApi.getAll(url.searchParams)
    renderPostList(data)
    renderPagination('pagination', pagination)
  } catch (error) {
    console.log('failed to fetch post list', error)
    toast.error(error)
  }
}

function registerPostDeleteEvent() {
  const modalElement = document.getElementById('removeBox')
  if (!modalElement) return
  let post = {}

  document.addEventListener('post-delete', (e) => {
    post = e.detail
    showModal(modalElement)
  })

  const deleteButton = modalElement.querySelector('[name="delete"]')
  if (deleteButton)
    deleteButton.addEventListener('click', async () => {
      try {
        if (!post) return
        await postApi.remove(post.id)
        await handleFilterChange()
        toast.success('Remove post successfully!')
      } catch (error) {
        console.log('failed to remove post list', error)
        toast.error(error)
      }
    })
}

;(async () => {
  try {
    const url = new URL(window.location)

    // upadate search params if needed
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6)
    if (!url.searchParams.get('_sort')) url.searchParams.set('_sort', 'updatedAt')
    if (!url.searchParams.get('_order')) url.searchParams.set('_order', 'desc')

    window.history.pushState({}, '', url)
    const queryParams = url.searchParams

    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    })

    initSearch({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    })

    registerPostDeleteEvent()

    handleFilterChange()
  } catch (error) {
    console.log('get all api failed', error)
    toast.error(error)
  }
})()
