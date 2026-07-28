let search = document.querySelector(".search-icon")
let searchBox = document.querySelector(".searchBox")
let closeBtn = document.querySelector(".close-icon")

search.onclick = function(){
    searchBox.classList.add('active');
    closeBtn.classList.add('active');
    search.classList.add('active');
}

closeBtn.onclick = function(){
    searchBox.classList.remove('active')
    closeBtn.classList.remove('active')
    search.classList.remove('active')
}
// const icon = document.querySelector('.icon');
// const search = document.querySelector('.search');
// icon.onclick = function(){
//     search.classList.toggle('active');
// }