const URL =
  'https://api.github.com/repos/postcss/postcss/contributors?per_page=200'

const SIZE = window.devicePixelRatio > 1 ? 96 : 48

function load () {
  window.removeEventListener('scroll', load)
  fetch(URL)
    .then(res => res.json())
    .then(users => {
      let buffer = document.createDocumentFragment()
      for (let user of users) {
        let li = document.createElement('li')
        let img = document.createElement('img')
        img.src = user.avatar_url + '&size=' + SIZE
        img.alt = user.login
        img.title = user.login
        img.className = 'community_avatar'
        img.loading = 'lazy'
        li.appendChild(img)
        buffer.appendChild(li)
      }
      document.querySelector('.community_contributors').appendChild(buffer)
    })
}

window.addEventListener('scroll', load)
