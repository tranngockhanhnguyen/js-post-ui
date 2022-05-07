import { randomNumber, setFieldValue, setTextContext, setTitleImage } from './common'
import * as yup from 'yup'

const ImageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
}

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
        'Please enter at least two words of three characters!',
        (value) => value.split(' ').filter((x) => Boolean(x) && x.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageSource: yup
      .string()
      .required('Please select an image source!')
      .oneOf([ImageSource.PICSUM, ImageSource.UPLOAD], 'Invalid image source!'),
    imageUrl: yup.string().when('imageSource', {
      is: ImageSource.PICSUM,
      then: yup
        .string()
        .required('Please random a background image!')
        .url('Please enter a valid URL!'),
    }),
    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: yup
        .mixed()
        .test('required', 'Please select an image to upload!', (file) => Boolean(file?.name))
        .test('max-size-3mb', 'Please select an image that is less than 3 MB!', (file) => {
          const MAX_SIZE = 3 * 1024 * 1024 // 3 MB
          const fileSize = file?.size || 0
          return fileSize < MAX_SIZE
        }),
    }),
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
    ;['title', 'author', 'imageUrl', 'image'].forEach((name) => setFieldError(form, name, ''))

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

async function validateFormField(form, formValues, name) {
  try {
    // clear previous error
    setFieldError(form, name, '')

    const schema = getPostSchema()
    await schema.validateAt(name, formValues)
  } catch (error) {
    setFieldError(form, name, error.message)
  }

  // show validation error (if any)
  const field = form.querySelector(`[name="${name}"]`)
  if (field && !field.checkValidity()) field.parentElement.classList.add('was-validated')
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

function renderImageSourceControl(form, selectedValue) {
  const controlList = form.querySelectorAll('[data-id="imageSource"]')
  controlList.forEach((control) => (control.hidden = control.dataset.imageSource !== selectedValue))
}

function initRadioImageSource(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]')
  radioList.forEach((radio) =>
    radio.addEventListener('change', (e) => renderImageSourceControl(form, e.target.value))
  )
}

function initUploadImage(form) {
  const uploadImage = form.querySelector('[name="image"]')
  if (uploadImage)
    uploadImage.addEventListener('change', (e) => {
      const file = e.target.files[0]
      if (file) {
        const imageUrl = URL.createObjectURL(file)
        setTitleImage(document, '#postTitleImage', imageUrl)

        validateFormField(form, { imageSource: ImageSource.UPLOAD, image: file }, 'image')
      }
    })
}

function initValidationOnChange(form) {
  ;['title', 'author'].forEach((name) => {
    const field = form.querySelector(`[name="${name}"]`)
    if (field)
      field.addEventListener('input', (e) => {
        const newValue = e.target.value
        validateFormField(form, { [name]: newValue }, name)
      })
  })
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  setFormValues(form, defaultValues)

  let submitting = false

  initRandomImage(form)
  initRadioImageSource(form)
  initUploadImage(form)
  initValidationOnChange(form)

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
