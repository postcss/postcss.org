const URL =
  'https://api.github.com/repos/postcss/postcss/contributors?per_page=200'

fetch(URL)
  .then(res => res.json())
  .then(users => {
    let buffer = document.createDocumentFragment()
    for (let user of users) {
      let li = document.createElement('li')
      let img = document.createElement('img')
      img.src = user.avatar_url
      img.alt = user.login
      img.title = user.title
      img.className = 'community_avatar'
      img.loading = 'lazy'
      li.appendChild(img)
      buffer.appendChild(li)
    }
    document.querySelector('.community_contributors').appendChild(buffer)
  })
