import { setFieldValue, setTitleImage } from './common'

function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title)
  setFieldValue(form, '[name="author"]', formValues?.author)
  setFieldValue(form, '[name="description"]', formValues?.description)

  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl) // hidden field
  setTitleImage(document, '#postTitleImage', formValues?.imageUrl)
}

function getFormValues(form) {
  const formValues = {}
  // S1: query each input and add to object formValues
  //   ;['title', 'description', 'author', 'imageUrl'].forEach((name) => {
  //     const field = form.querySelector(`[name="${name}`)
  //     if (field) formValues[name] = field.value
  //   })

  // S2: use FormData
  const data = new FormData(form)
  for (const [key, value] of data) {
    formValues[key] = value
  }

  return formValues
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  setFormValues(form, defaultValues)

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    // get form values
    // validation
    // if valid trigger submit callback
    // otherwise, show validation error
    const formValues = getFormValues(form)
    console.log(formValues)
  })
}
