// 色を近似する
const accent_colors = [
	{ name: 'red', hsv: { h: 26, s: 1.0, v: 0.84 }, rgb: { r: 255, g: 75, b: 0 } },
	{ name: 'yellow', hsv: { h: 56, s: 0.73, v: 0.94 }, rgb: { r: 255, g: 241, b: 0 } },
	{ name: 'green', hsv: { h: 164, s: 1.0, v: 0.62 }, rgb: { r: 3, g: 175, b: 122 } },
	{ name: 'blue', hsv: { h: 202, s: 1.0, v: 0.70 }, rgb: { r: 0, g: 90, b: 255 } },
	{ name: 'skyblue', hsv: { h: 202, s: 0.63, v: 0.91 }, rgb: { r: 77, g: 196, b: 255 } },
	{ name: 'pink', hsv: { h: 327, s: 0.41, v: 0.80 }, rgb: { r: 255, g: 128, b: 130 } },
	{ name: 'orange', hsv: { h: 41, s: 1.0, v: 0.90 }, rgb: { r: 246, g: 170, b: 0 } },
	{ name: 'purple', hsv: { h: 41, s: 1.0, v: 0.90 }, rgb: { r: 153, g: 0, b: 153 } },
	{ name: 'brown', hsv: { h: 41, s: 1.0, v: 0.90 }, rgb: { r: 128, g: 64, b: 0 } },
];

const base_colors = [
	{ name: 'light_pink', rgb: { r: 255, g: 202, b: 191 } },
	{ name: 'cream', rgb: { r: 255, g: 255, b: 128 } },
	{ name: 'light_yg', rgb: { r: 216, g: 242, b: 85 } },
	{ name: 'light_skyblue', rgb: { r: 191, g: 228, b: 255 } },
	{ name: 'beige', rgb: { r: 255, g: 202, b: 128 } },
	{ name: 'light_green', rgb: { r: 119, g: 217, b: 168 } },
	{ name: 'light_purple', rgb: { r: 201, g: 172, b: 230 } }
];

const

const black = [0, 0, 0], orange = [230, 159, 0], skyblue = [86, 180, 233];
const green = [0, 158, 115], yellow = [240, 228, 66], blue = [0, 114, 178];
const red = [213, 94, 0], purple = [204, 121, 167], white = [255, 255, 255];

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

	let css = getComputedStyle(element, null);
	let rgb_color = css.getPropertyValue("color");

	let result_rgb = rgb_color.match(reg4rgb);
	let result_rgba = rgb_color.match(reg4rgba);
	let result2;
	if (result_rgb === null && result_rgba === null) {
		result2 = ['255', '255', '255'];
	} else if (result_rgb !== null) {
		result2 = result_rgb[0].split(',');
	} else {
		result2 = result_rgba[0].split(',');
	}

	let rgba = [];
	rgba[0] = Number(result2[0]);
	rgba[1] = Number(result2[1]);
	rgba[2] = Number(result2[2]);
	if (result2.length == 4) {
		rgba[3] = Number(result2[3]);
	} else {
		rgba[3] = -1;
	}

	// rgbの値によってsample_colorsに近似する
	var new_rgba = classify_colors(rgba, accent_colors);
	// console.log(`before=${rgb}, after=${new_rgb}`);

	// 背景色とフォントの色の組合せを考える
	let bc = element.style.backgroundColor;
	let conb = conbination(new_rgba.slice(0, 3), bc2rgba(bc).slice(0, 3));

	// 背景色と文字色の明度差を考慮する
	// rgb -> hsv 変換
	let bc_hsv = rgb2hsv(bc);
	let conb_hsv = rgb2hsv(conb);
	// 明度差を判定
	if (bc) {

	}

	new_rgba = [conb[0], conb[1], conb[2], new_rgba[3]];
	// console.log(new_rgba);

	// 透明度の値に応じて値を設定
	let new_rgba_str;
	if (new_rgba[3] == -1) {
		new_rgba_str = `rgb(${new_rgba[0]}, ${new_rgba[1]}, ${new_rgba[2]})`;
	} else {
		new_rgba_str = `rgba(${new_rgba[0]}, ${new_rgba[1]}, ${new_rgba[2]}, ${new_rgba[3]})`;
	}

	// console.log(new_rgba_str);
	element.style.color = new_rgba_str;

	return;
}

// arg: rgbを表す数値の配列
// res: sample_colorsに近似したrgbを表す数値の配列
function classify_colors(rgba, sample_colors) {
	let new_rgba;
	let rgb = [rgba[0], rgba[1], rgba[2]];
	if (Math.max(...rgb) - Math.min(...rgb) > 30) {
		// 有彩色の場合
		let min_index = 0, min_dist = 1000000;
		for (let i = 0; i < sample_colors.length; i++) {
			const sample_rgb = sample_colors[i].rgb;
			let dist = Math.abs(rgb[0] - sample_rgb.r) + Math.abs(rgb[1] - sample_rgb.g) + Math.abs(rgb[2] - sample_rgb.b);
			if (dist < min_dist) {
				min_index = i;
				min_dist = dist;
			}
		}
		new_rgba = [sample_colors[min_index].rgb.r, sample_colors[min_index].rgb.g, sample_colors[min_index].rgb.b, rgba[3]];
	} else {
		new_rgba = rgba;
	}

	return new_rgba;
}


// arg:  fc:フォントの色  bc:背景色
// 参考資料、実験により、背景色に対して認識しやすいフォントの色に変換する
//NG: 暖色・寒色同士、明度が近い
function conbination(fc, bc) {
	// console.log(`fc=${fc}, bc=${bc}`);
	if (isMatch(bc, black)) { // orange, skyblue, green, yellow, red, purple, white
		if (isMatch(fc, black)) {
			fc = white;
		} else if (isMatch(fc, blue)) {
			fc = skyblue;
		}
	} else if (isMatch(bc, orange)) { // black, yellow, blue, white
		if (isMatch(fc, orange)) {
			fc = yellow;
		} else if (isMatch(fc, skyblue)) {
			fc = blue;
		} else if (isMatch(fc, green)) {
			fc = black;
		} else if (isMatch(fc, red)) {
			fc = black;
		} else if (isMatch(fc, purple)) {
			fc = black;
		}
	} else if (isMatch(bc, skyblue)) { // black, yellow, red, purple, white
		if (isMatch(fc, orange)) {
			fc = red;
		} else if (isMatch(fc, skyblue)) {
			fc = white;
		} else if (isMatch(fc, green)) {
			fc = black;
		} else if (isMatch(fc, blue)) {
			fc = white;
		}
	} else if (isMatch(bc, green)) { // black, orange, yellow, white
		if (isMatch(fc, skyblue)) {
			fc = white;
		} else if (isMatch(fc, green)) {
			fc = white;
		} else if (isMatch(fc, blue)) {
			fc = black;
		} else if (isMatch(fc, red)) {
			fc = orange;
		} else if (isMatch(fc, purple)) {
			fc = orange;
		}
	} else if (isMatch(bc, yellow)) { // black, skyblue, green, blue, red, purple
		if (isMatch(fc, orange)) {
			fc = red;
		} else if (isMatch(fc, yellow)) {
			fc = green;
		} else if (isMatch(fc, white)) {
			fc = black;
		}
	} else if (isMatch(bc, blue)) { // orange, yellow, purple, white
		if (isMatch(fc, skyblue)) {
			fc = white;
		} else if (isMatch(fc, green)) {
			fc = yellow;
		} else if (isMatch(fc, blue)) {
			fc = white;
		} else if (isMatch(fc, red)) {
			fc = purple;
		} else if (isMatch(fc, black)) {
			fc = white;
		}
	} else if (isMatch(bc, red)) { // black, skyblue, white
		if (isMatch(fc, orange)) {
			fc = black;
		} else if (isMatch(fc, green)) {
			fc = skyblue;
		} else if (isMatch(fc, yellow)) {
			fc = black;
		} else if (isMatch(fc, blue)) {
			fc = skyblue;
		} else if (isMatch(fc, red)) {
			fc = black;
		} else if (isMatch(fc, purple)) {
			fc = black;
		}
	} else if (isMatch(bc, purple)) { // black, yellow, blue, white
		if (isMatch(fc, orange)) {
			fc = yellow;
		} else if (isMatch(fc, skyblue)) {
			fc = blue;
		} else if (isMatch(fc, green)) {
			fc = black;
		} else if (isMatch(fc, red)) {
			fc = yellow;
		} else if (isMatch(fc, purple)) {
			fc = yellow;
		}
	} else if (isMatch(bc, white)) { // black, orange, green, blue, red, purple
		if (isMatch(fc, skyblue)) {
			fc = blue;
		} else if (isMatch(fc, yellow)) {
			fc = orange;
		} else if (isMatch(fc, white)) {
			fc = black;
		}
	}

	return fc;
}

// rgb1とrgb2の数値の配列が一致しているか
function isMatch(rgb1, rgb2) {
	return rgb1.toString() == rgb2.toString();
}


// arg:  element: DOM要素, bc: 親の要素の背景色
// 各要素に対して関数bc_change_colorを適用する
// 背景色が未設定の場合は親の要素の設定に従う
function children_bc_change(element, bc) {
	// bodyの背景色が未設定のときに白色に変換する
	if (bc.toString() == "rgba(0, 0, 0, 0)") { bc = "rgb(255, 255, 255)"; }
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
	let bc = getComputedStyle(element, null).getPropertyValue("background-color");
	let rgba = bc2rgba(bc);

	// 背景色が未設定かどうか
	if (rgba[0] + rgba[1] + rgba[2] + rgba[3] == 0) {
		return false;
	}
	else {
		let new_rgba = classify_colors(rgba, base_colors);
		let new_rgba_str = `rgba(${new_rgba[0]}, ${new_rgba[1]}, ${new_rgba[2]}, ${new_rgba[3]})`;
		element.style.backgroundColor = new_rgba_str;
		return true;
	}
}

// 文字列のrgb値から数値の配列に変換する
// res: [rの値, gの値, bの値, aの値]
function bc2rgba(bc) {
	console.log(bc);
	let start = bc.indexOf('(');
	let end = bc.indexOf(')');
	let str = bc.substr(start + 1, end - start - 1).split(',');
	let rgba = [1, 1, 1, 1];
	let i = 0;
	for (let val of str) {
		rgba[i++] = Number(val);
	}
	console.log(rgba);
	return rgba;
}

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

function rgb2hsv(rgb) {
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

	console.log(v);

	return [h, s, v];
}

main();
