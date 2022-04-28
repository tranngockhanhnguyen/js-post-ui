import postApi from './api/postApi'
import { initPagination, initSearch, renderPostList, rederPagination } from './utils'

async function handleFilterChange(filterName, FilterValue) {
  try {
    // update query params
    const url = new URL(window.location)
    url.searchParams.set(filterName, FilterValue)

    // reset page if needed
    if (filterName === 'title_like') url.searchParams.set('_page', 1)

    window.history.pushState({}, '', url)

    // fetch API
    // re-render post list
    const { data, pagination } = await postApi.getAll(url.searchParams)
    renderPostList(data)
    rederPagination('pagination', pagination)
  } catch (error) {
    console.log('failed to fetch post list', error)
  }
}

;(async () => {
  try {
    const url = new URL(window.location)

    // upadate search params if needed
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1)
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 12)

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

    const { data, pagination } = await postApi.getAll(queryParams)
    renderPostList(data)
    rederPagination('pagination', pagination)
  } catch (error) {
    console.log('get all failed', error)
    // show modal, toast error
  }
})()
