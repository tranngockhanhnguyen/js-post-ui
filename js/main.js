console.log('Hello')

import axiosClient from './api/axiosClient'
import postApi from './api/postAPI'

console.log('Hello')

async function main() {
  //   const response = await axiosClient.get('/posts')
  const queryParams = {
    _page: 2,
    _lmit: '',
  }
  const response = await postApi.getAll(queryParams)
  console.log(response)
}
main()
