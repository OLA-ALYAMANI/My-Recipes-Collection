// let search = document.querySelector(".search-icon")
// let searchBox = document.querySelector(".searchBox")
// let closeBtn = document.querySelector(".close-icon")

// search.onclick = function(){
//     searchBox.classList.add('active');
//     closeBtn.classList.add('active');
//     search.classList.add('active');
// }

// closeBtn.onclick = function(){
//     searchBox.classList.remove('active')
//     closeBtn.classList.remove('active')
//     search.classList.remove('active')
// }
// const icon = document.querySelector('.icon');
// const search = document.querySelector('.search');
// icon.onclick = function(){
//     search.classList.toggle('active');
// }

const toggler = document.querySelector('.navbar-toggler');
const menu = document.getElementById('navbarNav');

    function setMenu(open) {
        toggler.classList.toggle('active', open);
        menu.classList.toggle('show', open);
        toggler.setAttribute('aria-expanded', String(open));
    }

    toggler.addEventListener('click', () => {
        setMenu(!menu.classList.contains('show'));
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setMenu(false));
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 800) setMenu(false);
    });

// -------------------- CARD FLIP --------------------
document.querySelectorAll('.wrapper').forEach(function (wrapper) {
    var btn = wrapper.querySelector('.flip-btn');
    var card = wrapper.querySelector('.cards');
    if (btn && card) {
        btn.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    }
});