let N1 = 400; // Major smoothness
let N2 = 150; // Minor smoothness
let R1 = 30; // Major radius
let R2 = 10; // Minor radius
const Kx = 800; // Screen width
const Ky = 600; // Screen height
const Kz = 400; // Screen distance or magnification
const Kd = 70; // Donut distance
const PLOTDOT = [5,5]; // Dimensions of plotted dots
let speed = [.3,.1,.1]; //Rotation speed
let light = [0,0,-1]; //Light vector
let color = [240,219,79] // RGB 0-255

const halfKx = Kx / 2;
const halfKy = Ky / 2;
let canvas = document.createElement("canvas");
document.body.appendChild(canvas);
let ctx = canvas.getContext("2d");
canvas.width = Kx;
canvas.height = Ky;

// Matrix rotations
const rotateX = (point, angle) => [
	point[0],
	point[1] * Math.cos(angle) - point[2] * Math.sin(angle),
	point[1] * Math.sin(angle) + point[2] * Math.cos(angle)
];
const rotateY = (point, angle) => [
	point[0] * Math.cos(angle) + point[2] * Math.sin(angle),
	point[1],
	-point[0] * Math.sin(angle) + point[2] * Math.cos(angle)
];
const rotateZ = (point, angle) => [
	point[0] * Math.cos(angle) - point[1] * Math.sin(angle),
	point[0] * Math.sin(angle) + point[1] * Math.cos(angle),
	point[2]
];

// Creates circle of n intervals and rotates it arounda point with N intervals
function createDonut(N1, N2) {
	let circle = [];
	for (let i = 0; i < N2; i++) {
		let angle = (2 * Math.PI * i) / N2;
		let x = R2 * Math.cos(angle) - R1;
		let y = R2 * Math.sin(angle);
		circle.push([x, y, 0]);
	}
	let donut = [];
	for (let i = 0; i < N1; i++) {
		let angle = (2 * Math.PI * i) / N1;
		let rotated = circle.map((p) => rotateY(p, angle));
		donut = donut.concat(rotated);
	}
	return donut;
}

// Computes normalised dot product
function normalisedDot(a, b) {
	let product = 0;
	let magA = 0;
	let magB = 0;
	for (let i = 0; i < a.length; i++) {
		product += a[i] * b[i];
		magA += a[i] * a[i];
		magB += b[i] * b[i];
	}
	magA = Math.sqrt(magA);
	magB = Math.sqrt(magB);
	if (magA !== 0 && magB !== 0) {
		product /= (magA * magB);
	}
	return product;
}

let donut = createDonut(N1, N2);

function animate() {
	ctx.clearRect(0, 0, Kx, Ky);
	donut.sort((a, b) => b[2] - a[2]);
	
	for (let i = 0; i < donut.length; i++) {
		let p = donut[i];
		let l = normalisedDot(p, light);
		let col = [color[0]*l, color[1]*l, color[2]*l];
		let px = (Kz * p[0]) / (p[2] + Kd);
		let py = (Kz * p[1]) / (p[2] + Kd);
		ctx.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
		ctx.fillRect(px + halfKx, py + halfKy, PLOTDOT[0], PLOTDOT[1]);
	}
	donut = donut.map((point) => {
		let rotated = rotateX(point, speed[0]);
		rotated = rotateY(rotated, speed[1]);
		rotated = rotateZ(rotated, speed[2]);
		return rotated;
	});
	requestAnimationFrame(animate);
}

animate();
