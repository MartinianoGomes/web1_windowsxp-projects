const contador = document.getElementById('contador');
const decrementar = document.querySelector('.decrementar');
const incrementar = document.querySelector('.incrementar');

incrementar.addEventListener('click', () => {
    contador.innerHTML = parseInt(contador.innerHTML) + 1;
    decrementar.disabled = false;
});

decrementar.addEventListener('click', () => {
    if (parseInt(contador.innerHTML) > 0) {
        contador.innerHTML = parseInt(contador.innerHTML) - 1;
    } else {
        decrementar.disabled = true;
    }
});