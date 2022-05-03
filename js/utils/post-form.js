import { setFieldValue, setTextContext, setTitleImage } from './common'
import * as yup from 'yup'

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

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title!'),
    author: yup
      .string()
      .required('Please enter author!')
      .test(
        'at-least-two-word',
        'Please enter at least two words of 3 characters!',
        (value) => value.split(' ').filter((x) => Boolean(x) && x.length >= 3).length >= 2
      ),
    description: yup.string(),
  })
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`)
  if (element) element.setCustomValidity(error)
  setTextContext(element.parentElement, '.invalid-feedback', error)
}

async function validatePostForm(form, formValues) {
  try {
    // reset previous error
    ;['title', 'author'].forEach((name) => setFieldError(form, name, ''))

    // start validating
    const schema = getPostSchema()
    await schema.validate(formValues, { abortEarly: false })
  } catch (error) {
    const errorLog = {}

    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path

        // ignore if the field is already logged
        if (errorLog[name]) continue

        // set field error and mark as logged
        setFieldError(form, name, validationError.message)
        errorLog[name] = true
      }
    }
  }

  // add was-validated class to form element
  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')
  return isValid
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  setFormValues(form, defaultValues)

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    // get form values
    const formValues = getFormValues(form)
    console.log(formValues)

    // validation
    // if valid trigger submit callback
    // otherwise, show validation error
    if (!validatePostForm(form, formValues)) return
  })
}
