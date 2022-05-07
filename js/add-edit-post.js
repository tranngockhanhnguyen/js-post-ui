import postApi from './api/postApi'
import { initPostForm, toast } from './utils'

function removeUnusedFileds(formValues) {
  const payload = { ...formValues }

  payload.imageSource === 'picsum' ? delete payload.image : delete payload.imageUrl

  // finally remove imageSource
  delete payload.imageSource

  // remove id if it add mode
  if (!payload.id) delete payload.id

  return payload
}

function jsonToFormData(jsonObject) {
  const formData = new FormData()

  for (const key in jsonObject) {
    formData.set(key, jsonObject[key])
  }

  return formData
}

async function handlePostFormSubmit(formValues) {
  try {
    const payload = removeUnusedFileds(formValues)
    const formData = jsonToFormData(payload)

    // check add/ edit mode
    // S1: base on search param (check id)
    // S2: check id from formValues
    // call api
    const savePost = formValues.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData)

    // show success  message
    toast.success('Save post successfully! 👌')

    // redirect to post detail page
    // setTimeout(() => {
    //   window.location.assign(`/post-detail.html?id=${savePost.id}`)
    // }, 2000)
  } catch (error) {
    console.log('failed to save post', error)
    toast.error(error)
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
    toast.error(error)
  }
})()
