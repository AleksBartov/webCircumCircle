const points = [];

const canvas = document.getElementById("can");
const ctx = canvas.getContext("2d");
ctx.beginPath();
ctx.arc(200, 200, 150, 0, 2 * Math.PI);
ctx.lineWidth = 1;
ctx.strokeStyle = "rgba(0,0,0,0.3)";
ctx.stroke();
ctx.closePath();

ctx.beginPath();

function handlerMouseStart(ev) {
  ev.preventDefault();

  ctx.arc(
    ev.changedTouches[0].pageX,
    ev.changedTouches[0].pageY,
    3,
    0,
    2 * Math.PI
  );
  points.push({ x: ev.changedTouches[0].pageX, y: ev.changedTouches[0].pageY });

  ctx.lineWidth = 1;
  ctx.strokeStyle = "red";
  ctx.fill();
}

function handlerMouseMove(ev) {
  ev.preventDefault();
  ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
  ctx.lineTo(ev.changedTouches[0].pageX, ev.changedTouches[0].pageY);
  points.push({ x: ev.changedTouches[0].pageX, y: ev.changedTouches[0].pageY });
  ctx.lineWidth = 1;
  ctx.strokeStyle = "red";
  ctx.stroke();
}

function handlerMouseEnd(ev) {
  ev.preventDefault();
  ctx.closePath();
  showResults();
}

function startup() {
  const el = document.getElementById("can");
  el.addEventListener("touchstart", handlerMouseStart);
  el.addEventListener("touchmove", handlerMouseMove);
  el.addEventListener("touchend", handlerMouseEnd);
}

document.addEventListener("DOMContentLoaded", startup);

const circumCircleSquare = (p) => {
  let result;
  const allDistances = new Set();

  for (let i = 0; i < p.length; i++) {
    let distances = new Set();
    for (let j = 0; j < p.length; j++) {
      if (i !== j) {
        const microDist = Math.floor(
          Math.sqrt(
            Math.abs(p[i].x - p[j].x) ** 2 + Math.abs(p[i].y - p[j].y) ** 2
          )
        );
        distances.add(microDist);
      }
    }
    const pointMaxDist = [...distances].reduce((acc, val) => {
      if (acc < val) acc = val;
      return acc;
    });

    allDistances.add(pointMaxDist);
  }

  const maxDistance = [...allDistances].reduce((acc, val) => {
    if (acc < val) acc = val;
    return acc;
  });

  result = Math.floor(Math.PI * (maxDistance / 2) ** 2);

  return result;
};

const userFormSquare = (p) => {
  let result;
  const sum = [];
  const sub = [];
  for (let i = 0; i < p.length; i++) {
    if (i === p.length - 1) {
      sum.push(Math.floor(p[i].x * p[0].y));
      sub.push(Math.floor(p[i].y * p[0].x));
    } else {
      sub.push(Math.floor(p[i].y * p[i + 1].x));
      sum.push(Math.floor(p[i].x * p[i + 1].y));
    }
  }
  const firstPart = [...sum].reduce((acc, val) => acc + val);
  const secondPart = [...sub].reduce((acc, val) => acc + val);
  result = Math.abs(Math.floor((firstPart - secondPart) / 2));

  return result;
};

function showResults() {
  const result = (userFormSquare(points) / circumCircleSquare(points)) * 100;
  window.main.innerHTML = `from perfect circle: ${result.toFixed(3)}%`;
  console.log(`from perfect circle: ${result.toFixed(3)}%`);
}
