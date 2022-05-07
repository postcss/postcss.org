function onClick(e) {
  e.target.closest('.sidemenu_item').classList.toggle('is-open')
}

let controllers = document.querySelectorAll('.sidemenu_controller')
for (let controller of controllers) {
  controller.addEventListener('click', onClick)
}
