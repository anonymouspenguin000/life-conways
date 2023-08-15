'use strict';

document.addEventListener('DOMContentLoaded', main);

function main() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const rand = 0; // Chance of randomly creating a cell
    const cols = 150;
    const rows = cols;
    const matrix = new Array(rows).fill(0).map(el => new Array(cols).fill(0).map(el => Math.random() < rand ? 1 : 0));

    const cw = canvas.width;
    const ch = canvas.height;
    const clw = cw / cols;
    const clh = ch / rows;

    const rule_b = [3];
    const rule_s = [2, 3];

    let pause = true;
    function iteration() {
        if (pause) return;
        const ops = [];

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let cnt = 0;
                for (let ni = -1; ni <= 1; ni++) {
                    for (let nj = -1; nj <= 1; nj++) {
                        if (ni === 0 && nj === 0) continue;
                        const nb_row = i + ni;
                        const nb_col = j + nj;

                        if (matrix[nb_row] && matrix[nb_row][nb_col]) cnt++;
                    }
                }

                let op = 0;
                if (!rule_s.includes(cnt)) op = -1;
                if (rule_b.includes(cnt)) op = 1;

                if (op) ops.push([i, j, op]);
            }
        }

        ops.forEach(op => op[2] !== 0 && (matrix[op[0]][op[1]] = op[2] === -1 ? 0 : 1));
        draw();
    }

    function draw() {
        ctx.clearRect(0, 0, cw, ch);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const coords = [j * clw, i * clh, clw, clh];
                ctx.strokeRect(...coords);
                if (matrix[i][j]) ctx.fillRect(...coords);
            }
        }
    }
    draw();

    let itv = setInterval(iteration, 100);
    document.getElementById('speed').onchange = function () {
        clearInterval(itv);
        itv = setInterval(iteration, this.value);
    }

    canvas.oncontextmenu = function () {
        pause = !pause;
        return false;
    };
    canvas.onclick = function (event) {
        const erow = ~~(event.offsetY / clh);
        const ecol = ~~(event.offsetX / clw);

        matrix[erow][ecol] = +!matrix[erow][ecol];
        draw();
    };
}
