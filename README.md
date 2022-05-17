Post UI Project 😍
View live demo: https://awesomepostui.vercel.app This simple website has 3 pages:

Home page: /
Add/Edit a post page: /add-edit-post.html
Post detail page: /post-detail.html

## Techstacks

- HTML/CSS
- Javascript
- Lib: Bootrap, Axios, Yup, Lodash, Dayjs  
- API_URL: https://js-post-api.herokuapp.com/api

## Description
🏠 Home page
Render list of posts
Research Bootstrap Carousel and add to home page.
Include 3 slides
Each slide has title and description.
Auto move the next slide.
Fetch list of posts and render to UI.
Sort list of post to show the latest post first.
ADVANCED: Support pagination to be able to to fetch posts by page and limit the number of posts per page.
Handle event on each post item
Click: Go to detail page and show detail of clicked post.
Edit button click: Go to edit page and populate detail of clicked post to form.
Remove button click: Show confirmation to remove? If yes, remove it. Otherwise, do nothing :P
➕ Add/Edit post page
Add form validation
Require title field
Require author field
ADD MODE (if postId query param doesn't exist)

Handle form submit
Show error if validation is failed. Stop form submit.
Add new post with submitted values: title, author, description and imageUrl
If add successfully, show an alert with message Save post successfully and redirect to Edit page of the new post.
If failed, show an alert with error message.
EDIT MODE (if postId query param exists)

Get post detail and set initial value for form.
Handle form submit
Do nothing if user doesn't change anything.
Show error if validation is failed. Stop form submit.
Update existing post with field that has changes. Don't include unchanged properties inside payload.
If update successfully, show an alert with message Save post successfully.
If failed, show an alert with error message.
👀 Post detail page
Get post detail.
Update corresponding DOM: title, description, author, createdAt and imageUrl.
Integrate with Lightbox to view image when click on image.
