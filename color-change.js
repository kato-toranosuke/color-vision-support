// 色を近似する
// h: 0~360, s: 0~100, v:0~100
const sample_colors = [
	{ name: 'red', color: { h: 26, s: 1.0, v: 0.84 } },
	{ name: 'orange', color: { h: 41, s: 1.0, v: 0.90 } },
	{ name: 'yellow', color: { h: 56, s: 0.73, v: 0.94 } },
	{ name: 'green', color: { h: 164, s: 1.0, v: 0.62 } },
	{ name: 'skyblue', color: { h: 202, s: 0.63, v: 0.91 } },
	{ name: 'blue', color: { h: 202, s: 1.0, v: 0.70 } },
	{ name: 'pink', color: { h: 327, s: 0.41, v: 0.80 } },
];
const sample_colors_2 = [
	{ name: 'red', hsv: { h: 26, s: 1.0, v: 0.84 }, rgb: { r: 213, g: 94, b: 0 } },
	{ name: 'orange', hsv: { h: 41, s: 1.0, v: 0.90 }, rgb: { r: 230, g: 159, b: 0 } },
	{ name: 'yellow', hsv: { h: 56, s: 0.73, v: 0.94 }, rgb: { r: 240, g: 228, b: 66 } },
	{ name: 'green', hsv: { h: 164, s: 1.0, v: 0.62 }, rgb: { r: 0, g: 158, b: 115 } },
	{ name: 'skyblue', hsv: { h: 202, s: 0.63, v: 0.91 }, rgb: { r: 86, g: 180, b: 233 } },
	{ name: 'blue', hsv: { h: 202, s: 1.0, v: 0.70 }, rgb: { r:0, g: 114, b: 178 }},
	{ name: 'pink', hsv: { h: 327, s: 0.41, v: 0.80 }, rgb: { r: 204, g: 121, b: 167 }},
];

// 正規表現
const reg4rgb = /(?<=rgb\().*(?=\))/;
const reg4rgba = /(?<=rgba\().*(?=\))/;


// この関数が実行される
function main() {
	var body = document.getElementsByTagName('body')[0];

	// body以下の全ての要素に対して背景色の色を近似する
	children_bc_change(body, getComputedStyle(body, null).getPropertyValue("background-color"));
	// body以下の全ての要素に対してフォントの色を近似する
	children_color_change(body);
}


// 各要素に対して関数font_change_colorを適用する
function children_color_change(element) {
	let children = element.children;

	for (let child of children) {
		if (child.children.length != 0) {
			children_color_change(child);
		}
		font_change_color(child);
	}
}

// 要素elementのフォントの色を近似し変更する
async function font_change_color(element) {
	// console.log(element);
	// console.log(element.style.backgroundColor);

	let css = getComputedStyle(element, null);
	let rgb_color = css.getPropertyValue("color");
	//console.log(rgb_color);

	// let reg = /(?<=rgb\().*(?=\))/;
	let result_rgb = rgb_color.match(reg4rgb);
	let result_rgba = rgb_color.match(reg4rgba);
	let result2;
	if (result_rgb === null && result_rgba === null) {
		result2 = ['255', '255', '255'];
		// result2 = ['0', '0', '0'];
		// console.log(element);
	} else if (result_rgb !== null) {
		result2 = result_rgb[0].split(',');
	} else {
		result2 = result_rgba[0].split(',');
	}

	let rgb = [];
	rgb[0] = Number(result2[0]);
	rgb[1] = Number(result2[1]);
	rgb[2] = Number(result2[2]);

	// var new_rgb = classify_colors(rgb);
	var new_rgb = classify_colors_2(rgb);

	// 背景色とフォントの色の組合せを考える
	new_rgb = conbination(new_rgb, element.style.backgroundColor);

	//return rgb;
	const new_rgb_str = `rgb(${new_rgb[0]}, ${new_rgb[1]}, ${new_rgb[2]})`;
	element.style.color = new_rgb_str;

	return;
}

function classify_colors_2(rgb) {
	let new_rgb;
	if (Math.max(...rgb) - Math.min(...rgb) > 30) {
		// 有彩色の場合
		let min_index = 0, min_dist = 1000000;
		for (let i = 0; i < sample_colors_2.length; i++) {
			const sample_rgb = sample_colors_2[i].rgb;
			let dist = Math.abs(rgb[0] - sample_rgb.r) + Math.abs(rgb[1] - sample_rgb.g) + Math.abs(rgb[2] - sample_rgb.b);
			if (dist < min_dist) {
				min_index = i;
				min_dist = dist;
			}
		}
		new_rgb = [sample_colors_2[min_index].rgb.r, sample_colors_2[min_index].rgb.g, sample_colors_2[min_index].rgb.b];
	} else {
		new_rgb = rgb;
	}


	console.log(new_rgb);
	return new_rgb;
}

// arg: rgbを表す数値の配列
// res: sample_colorsに近似したrgbを表す数値の配列
function classify_colors(rgb) {
	// console.log(rgb);
	var hsv = rgb2hsv(rgb);
	// h = 0~360, s,v=0~1
	var hue = hsv[0];
	var sat = hsv[1];
	var bri = hsv[2];

	// 有彩色の場合
	if (Math.max(...rgb) - Math.min(...rgb) > 30) {
		// console.log("有彩色");

		if (hue < 34 || hue > 356) {
			// red
			hsv[0] = sample_colors[0].color.h;
			hsv[1] = sample_colors[0].color.s;
			hsv[2] = sample_colors[0].color.v;
		} else if (hue < 48) {
			// orange
			hsv[0] = sample_colors[1].color.h;
			hsv[1] = sample_colors[1].color.s;
			hsv[2] = sample_colors[1].color.v;
		} else if (hue < 90) {  // rgb 1:2:0
			// yellow
			hsv[0] = sample_colors[2].color.h;
			hsv[1] = sample_colors[2].color.s;
			hsv[2] = sample_colors[2].color.v;
		} else if (hue < 180) {  // rgb 0:1:1
			// green
			hsv[0] = sample_colors[3].color.h;
			hsv[1] = sample_colors[3].color.s;
			hsv[2] = sample_colors[3].color.v;
		} else if (hue < 215) {
			// skyblue
			hsv[0] = sample_colors[4].color.h;
			hsv[1] = sample_colors[4].color.s;
			hsv[2] = sample_colors[4].color.v;
		} else if (hue < 270) {  // rgb 1:0:2
			// blue
			hsv[0] = sample_colors[5].color.h;
			hsv[1] = sample_colors[5].color.s;
			hsv[2] = sample_colors[5].color.v;
		} else {
			// pink
			hsv[0] = sample_colors[6].color.h;
			hsv[1] = sample_colors[6].color.s;
			hsv[2] = sample_colors[6].color.v;
		}
	} else {
		// console.log("無彩色");
	}

	var new_rgb = hsv2rgb(hsv);
	// console.log(new_rgb);
	// r,g,b = 0~255
	return new_rgb;
}

// hsvからrgbへの変換
function hsv2rgb(hsv) {
	var h = hsv[0] / 60;
	var s = hsv[1];
	var v = hsv[2];
	if (s == 0) return [v * 255, v * 255, v * 255];

	var rgb;
	var i = parseInt(h);
	var f = h - i;
	var v1 = v * (1 - s);
	var v2 = v * (1 - s * f);
	var v3 = v * (1 - s * (1 - f));

	switch (i) {
		case 0:
		case 6:
			rgb = [v, v3, v1];
			break;

		case 1:
			rgb = [v2, v, v1];
			break;

		case 2:
			rgb = [v1, v, v3];
			break;

		case 3:
			rgb = [v1, v2, v];
			break;

		case 4:
			rgb = [v3, v1, v];
			break;

		case 5:
			rgb = [v, v1, v2];
			break;
	}

	return rgb.map(function (value) {
		return value * 255;
	});
}

// rgbからhsvへの変換
function rgb2hsv(rgb) {
	// console.log(rgb);
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;

	var max = Math.max(r, g, b);
	var min = Math.min(r, g, b);
	var diff = max - min;

	var h = 0;

	switch (min) {
		case max:
			h = 0;
			break;

		case r:
			h = (60 * ((b - g) / diff)) + 180;
			break;

		case g:
			h = (60 * ((r - b) / diff)) + 300;
			break;

		case b:
			h = (60 * ((g - r) / diff)) + 60;
			break;
	}

	var s = max == 0 ? 0 : diff / max;
	var v = max;

	return [h, s, v];
}


// arg:  fc:フォントの色  bc:背景色
function conbination(fc, bc) {
	//NG: 暖色・寒色同士、明度が近い
	if(bc == black) {
		black -> white
		if
		blue -> water
	} else if(bc == orange) { // black, yellow, blue, white
		orenge -> yellow
		water -> blue
		green -> black
		red -> black
		purple -> black
	} else if(bc == water) { // black, yellow, red, purple, white
		orange -> red
		water -> white
		green -> black
		blue -> white
	} else if(bc == green) { // black, orange, yellow, white
		water -> white
		green -> white
		blue -> black
		red -> orange
		purple -> orenge
	} else if(bc == yellow) {
		orange -> red
		yellow -> green
		white -> black
	} else if(bc == blue) { // orange, yellow, purple, white
		water -> white
		green -> yellow
		blue -> white
		red -> purple
		black -> white
	} else if(bc == red) { // black, water, white
		orange -> black
		green -> water
		yellow -> black
		blue -> water
		red -> black
		purple -> black
	} else if(bc == purple) { // black, yellow, blue, white
		orange -> yellow
		water -> blue
		green -> black
		red -> yellow
		purple -> yellow
	} else { //
		water -> blue
		yellow -> orange
		white -> black
	}

	return fc;
}



// 各要素に対して関数bc_change_colorを適用する
// 背景色が未設定の場合は親の要素の設定に従う
function children_bc_change(element, bc) {
	let children = element.children;

	for (let child of children) {
		if (!bc_change_color(child)) {
			child.style.backgroundColor = bc;
		}
		if (child.children.length != 0) {
			children_bc_change(child, child.style.backgroundColor);
		}
	}
}

// 背景色をユニバーサル色に近似する。
// res: true = 背景色が設定されている, false = 設定されていない
function bc_change_color(element) {
	// console.log(element);
	let bc = getComputedStyle(element, null).getPropertyValue("background-color");
	// console.log(bc);
	let rgb = bc2rgb(bc);
	// console.log("rgb: "+rgb)

	// 背景色が未設定かどうか
	if (rgb[0] + rgb[1] + rgb[2] + rgb[3] == 0) {
		return false;
	}
	else {
		// let new_rgb = classify_colors(rgb.slice(0, 3));
		let new_rgb = classify_colors_2(rgb.slice(0, 3));
		let new_rgb_str = `rgb(${new_rgb[0]}, ${new_rgb[1]}, ${new_rgb[2]})`;
		element.style.backgroundColor = new_rgb_str;
		// console.log(new_rgb_str);
		return true;
	}
}

// 文字列のrgb値から数値の配列に変換する
// res: [rの値, gの値, bの値, aの値]
function bc2rgb(bc) {
	let start = bc.indexOf('(');
	let end = bc.indexOf(')');
	let str = bc.substr(start + 1, end - start - 1).split(',');
	let rgb = [1, 1, 1, 1];
	let i = 0;
	for (let val of str) {
		rgb[i++] = Number(val);
	}
	return rgb;
}

main();
