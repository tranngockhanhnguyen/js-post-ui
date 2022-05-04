import { randomNumber, setFieldValue, setTextContext, setTitleImage } from './common'
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
    imageUrl: yup
      .string()
      .required('Please random a background image!')
      .url('Please enter a valid URL!'),
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
    ;['title', 'author', 'imageUrl'].forEach((name) => setFieldError(form, name, ''))

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

function showLoading(form) {
  const saveButton = form.querySelector('[name="save"]')
  if (saveButton) {
    saveButton.disabled = true
    saveButton.innerHTML = `<i class="fas fa-save mr-1"></i> Saving...`
  }
}

function hideLoading(form) {
  const saveButton = form.querySelector('[name="save"]')
  if (saveButton) {
    saveButton.disabled = false
    saveButton.innerHTML = `<i class="fas fa-save mr-1"></i> Save`
  }
}

function initRandomImage(form) {
  const randomButton = document.getElementById('postChangeImage')
  if (!randomButton) return

  randomButton.addEventListener('click', () => {
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1378/400`

    setFieldValue(form, '[name="imageUrl"]', imageUrl) // hidden field
    setTitleImage(document, '#postTitleImage', imageUrl)
  })
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  setFormValues(form, defaultValues)

  let submitting = false

  initRandomImage(form)

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    // prevent other submission
    if (submitting) return

    showLoading(form)
    submitting = true

    // get form values
    const formValues = getFormValues(form)
    formValues.id = defaultValues.id

    // validation
    // if valid trigger submit callback
    // otherwise, show validation error
    const isValid = await validatePostForm(form, formValues)
    if (isValid) await onSubmit?.(formValues)

    hideLoading(form)
    submitting = false
  })
}
