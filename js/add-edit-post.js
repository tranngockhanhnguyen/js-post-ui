import postApi from './api/postApi'
import { initPostForm, toast } from './utils'

async function handlePostFormSubmit(formValues) {
  console.log('sumit from parent', formValues)
  try {
    // check add/ edit mode
    // S1: base on search param (check id)
    // S2: check id from formValues
    // call api
    const savePost = formValues.id
      ? await postApi.update(formValues)
      : await postApi.add(formValues)

    // show success  message
    toast.success('Save post successfully! 👌')

    // redirect to post detail page
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savePost.id}`)
    }, 2000)
  } catch (error) {
    console.log('failed to save post', error)
    toast.error(`Error: ${error}`)
  }
}

// Main
;(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')

    const defaultValues = postId
      ? await postApi.getById(postId)
      : {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
        }

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: handlePostFormSubmit,
    })
  } catch (error) {
    console.log('Failed to fetch post details', error)
    toast.error(`Error: ${error}`)
  }
})()
