const crosswordSize = 14;
let crosswordData = [];
let startTime;
let direccion = 'HORIZONTAL';

const pistas = {
    horizontal: [
        { number: 1, clue: "3H", answer: "GIT", x: 3, y: 4 },
        { number: 2, clue: "6H", answer: "DOCKER", x: 6, y: 4 },
        { number: 3, clue: "8H", answer: "KUBERNETES", x: 8, y: 3 },
        { number: 4, clue: "10H", answer: "CP", x: 10, y: 7 },
        { number: 5, clue: "12H", answer: "PATH", x: 12, y: 6 }
    ],
    vertical: [
        { number: 6, clue: "4V", answer: "LS", x: 4, y: 5 },
        { number: 7, clue: "6V", answer: "CD", x: 6, y: 5 },
        { number: 8, clue: "8V", answer: "CAT", x: 6, y: 7 },
        { number: 9, clue: "10V", answer: "MAN", x: 6, y: 9 },
        { number: 10, clue: "12V", answer: "PWD", x: 8, y: 11 }
    ]
};

function configurarEventos() {
    document.getElementById('checkButton').addEventListener('click', verificarCrucigrama);
    document.getElementById('resetButton').addEventListener('click', crearCrucigrama);
}

function crearCrucigrama() {
    const contenedorCrucigrama = document.getElementById('crossword');
    contenedorCrucigrama.innerHTML = '';
    crosswordData = Array(crosswordSize).fill(null).map(() => Array(crosswordSize).fill(''));

    for (let fila = 0; fila < crosswordSize; fila++) {
        for (let columna = 0; columna < crosswordSize; columna++) {
            const celda = document.createElement('div');
            celda.classList.add('cell');
            celda.setAttribute('data-x', fila);
            celda.setAttribute('data-y', columna);

            const input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('maxlength', '1');
            input.setAttribute('aria-label', `Celda ${fila + 1}, ${columna + 1}`);
            input.setAttribute('aria-labelledby', obtenerEtiquetaPista(fila, columna));
            input.setAttribute('data-x', fila);
            input.setAttribute('data-y', columna);
            input.addEventListener('input', manejarEntrada);
            input.addEventListener('keydown', manejarTeclas);

            celda.appendChild(input);
            contenedorCrucigrama.appendChild(celda);
        }
    }

    colocarPalabras(pistas.horizontal, 'HORIZONTAL');
    colocarPalabras(pistas.vertical, 'VERTICAL');
    marcarCeldasNegras();
    startTime = Date.now();
}

function obtenerEtiquetaPista(fila, columna) {
    const pistaHorizontal = pistas.horizontal.find(pista => pista.x === fila && pista.y <= columna && pista.y + pista.answer.length > columna);
    const pistaVertical = pistas.vertical.find(pista => pista.y === columna && pista.x <= fila && pista.x + pista.answer.length > fila);
    let etiquetas = [];

    if (pistaHorizontal) etiquetas.push(`Pista horizontal: ${pistaHorizontal.clue}`);
    if (pistaVertical) etiquetas.push(`Pista vertical: ${pistaVertical.clue}`);

    return etiquetas.join(' y ') || 'Sin pista';
}

function colocarPalabras(listaPistas, direccion) {
    listaPistas.forEach(({ number, answer, x, y }) => {
        for (let i = 0; i < answer.length; i++) {
            const fila = direccion === 'HORIZONTAL' ? x : x + i;
            const columna = direccion === 'HORIZONTAL' ? y + i : y;

            crosswordData[fila][columna] = answer[i];
            const celda = document.querySelector(`.cell[data-x="${fila}"][data-y="${columna}"] input`);
            if (celda) {
                celda.setAttribute('data-answer', answer[i]);
                if (i === 0) {
                    const numeroEtiqueta = document.createElement('span');
                    numeroEtiqueta.classList.add('number');
                    numeroEtiqueta.textContent = number;
                    const celdaPadre = document.querySelector(`.cell[data-x="${fila}"][data-y="${columna}"]`);
                    celdaPadre.appendChild(numeroEtiqueta);
                }
            }
        }
    });
}

function marcarCeldasNegras() {
    for (let fila = 0; fila < crosswordSize; fila++) {
        for (let columna = 0; columna < crosswordSize; columna++) {
            const celda = document.querySelector(`.cell[data-x="${fila}"][data-y="${columna}"] input`);
            if (!celda.getAttribute('data-answer')) {
                const celdaPadre = document.querySelector(`.cell[data-x="${fila}"][data-y="${columna}"]`);
                celdaPadre.classList.add('black');
                celda.disabled = true;
                celda.style.backgroundColor = '#000';
            }
        }
    }
}

function manejarEntrada(event) {
    const celda = event.target;
    const x = parseInt(celda.getAttribute('data-x'));
    const y = parseInt(celda.getAttribute('data-y'));

    crosswordData[x][y] = celda.value.toUpperCase();
    moverACeldaSiguiente(x, y);
}

function moverACeldaSiguiente(x, y) {
    let siguienteX = x;
    let siguienteY = y;
    
    do {
        if (direccion === 'HORIZONTAL') {
            siguienteY++;
            if (siguienteY >= crosswordSize) {
                siguienteY = 0;
                siguienteX++;
                if (siguienteX >= crosswordSize) {
                    siguienteX = 0;
                }
            }
        } else {
            siguienteX++;
            if (siguienteX >= crosswordSize) {
                siguienteX = 0;
                siguienteY++;
                if (siguienteY >= crosswordSize) {
                    siguienteY = 0;
                }
            }
        }
    } while (document.querySelector(`.cell[data-x="${siguienteX}"][data-y="${siguienteY}"]`)?.classList.contains('black'));

    const siguienteCelda = document.querySelector(`.cell[data-x="${siguienteX}"][data-y="${siguienteY}"] input`);
    if (siguienteCelda && !siguienteCelda.disabled) {
        siguienteCelda.focus();
    }
}

function manejarTeclas(event) {
    const celda = event.target;
    const x = parseInt(celda.getAttribute('data-x'));
    const y = parseInt(celda.getAttribute('data-y'));

    switch (event.key) {
        case 'ArrowRight':
            direccion = 'HORIZONTAL';
            moverACeldaSiguiente(x, y);
            break;
        case 'ArrowDown':
            direccion = 'VERTICAL';
            moverACeldaSiguiente(x, y);
            break;
        case 'ArrowLeft':
            direccion = 'HORIZONTAL';
            moverACeldaSiguiente(x, y - 1);  // Verificar límites
            break;
        case 'ArrowUp':
            direccion = 'VERTICAL';
            moverACeldaSiguiente(x - 1, y);  // Verificar límites
            break;
        case 'Backspace':
            if (direccion === 'HORIZONTAL') {
                moverACeldaSiguiente(x, y - 1);
            } else {
                moverACeldaSiguiente(x - 1, y);
            }
            break;
        default:
            break;
    }
}

function verificarCrucigrama() {
    const tiempoFinal = Date.now();
    const tiempoTotal = Math.floor((tiempoFinal - startTime) / 1000);
    let correcto = true;

    const todasLasPistas = pistas.horizontal.concat(pistas.vertical);
    todasLasPistas.forEach(({ answer, x, y }) => {
        for (let i = 0; i < answer.length; i++) {
            const fila = x + (direccion === 'HORIZONTAL' ? 0 : i);
            const columna = y + (direccion === 'HORIZONTAL' ? i : 0);

            const celdaInput = document.querySelector(`.cell[data-x="${fila}"][data-y="${columna}"] input`);
            if (celdaInput.value.toUpperCase() !== answer[i]) {
                celdaInput.style.backgroundColor = '#f08080';  // Colorea en rojo si es incorrecto
                correcto = false;
            } else {
                celdaInput.style.backgroundColor = '#90ee90';  // Colorea en verde si es correcto
            }
        }
    });

    const mensaje = document.getElementById('message');
    if (correcto) {
        mensaje.textContent = `¡Felicidades! Has completado el crucigrama en ${tiempoTotal} segundos.`;
    } else {
        mensaje.textContent = 'Hay errores, por favor revisa tu crucigrama.';
    }
}

window.onload = () => {
    crearCrucigrama();
    configurarEventos();
};
