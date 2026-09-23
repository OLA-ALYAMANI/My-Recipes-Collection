const radios = document.querySelectorAll('input[name="radio-btn"]');
let current = 0;

radios.forEach((r, i) => r.addEventListener('change', () => current = i));

setInterval(() => {
    current = (current + 1) % radios.length;
radios[current].checked = true;
}, 10000);