// 色を近似する
const sample_colors = [
	{ name: 'red', hsv: { h: 26, s: 1.0, v: 0.84 }, rgb: { r: 213, g: 94, b: 0 } },
	{ name: 'orange', hsv: { h: 41, s: 1.0, v: 0.90 }, rgb: { r: 230, g: 159, b: 0 } },
	{ name: 'yellow', hsv: { h: 56, s: 0.73, v: 0.94 }, rgb: { r: 240, g: 228, b: 66 } },
	{ name: 'green', hsv: { h: 164, s: 1.0, v: 0.62 }, rgb: { r: 0, g: 158, b: 115 } },
	{ name: 'skyblue', hsv: { h: 202, s: 0.63, v: 0.91 }, rgb: { r: 86, g: 180, b: 233 } },
	{ name: 'blue', hsv: { h: 202, s: 1.0, v: 0.70 }, rgb: { r:0, g: 114, b: 178 }},
	{ name: 'pink', hsv: { h: 327, s: 0.41, v: 0.80 }, rgb: { r: 204, g: 121, b: 167 }},
];

const black = [0,0,0], orange = [230,159,0], skyblue = [86,180,233];
const green = [0,158,115], yellow = [240,228,66], blue = [0,114,178];
const red = [213,94,0], purple = [204,121,167], white = [255,255,255];

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

	let rgb = [];
	rgb[0] = Number(result2[0]);
	rgb[1] = Number(result2[1]);
	rgb[2] = Number(result2[2]);

	// rgbの値によってsample_colorsに近似する
	var new_rgb = classify_colors(rgb);
	// console.log(`before=${rgb}, after=${new_rgb}`);

	// 背景色とフォントの色の組合せを考える
	let bc = element.style.backgroundColor;
	new_rgb = conbination(new_rgb, bc2rgb(bc).slice(0,3));
	// console.log(new_rgb);

	const new_rgb_str = `rgb(${new_rgb[0]}, ${new_rgb[1]}, ${new_rgb[2]})`;
	element.style.color = new_rgb_str;

	return;
}

// arg: rgbを表す数値の配列
// res: sample_colorsに近似したrgbを表す数値の配列
function classify_colors(rgb) {
	let new_rgb;
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
		new_rgb = [sample_colors[min_index].rgb.r, sample_colors[min_index].rgb.g, sample_colors[min_index].rgb.b];
	} else {
		new_rgb = rgb;
	}

	// console.log(new_rgb);
	return new_rgb;
}


// arg:  fc:フォントの色  bc:背景色
// 参考資料、実験により、背景色に対して認識しやすいフォントの色に変換する
//NG: 暖色・寒色同士、明度が近い
function conbination(fc, bc) {
	// console.log(`fc=${fc}, bc=${bc}`);
	if(isMatch(bc, black)) { // orange, skyblue, green, yellow, red, purple, white
		if(isMatch(fc, black)) {
			fc = white;
		} else if(isMatch(fc, blue)) {
			fc = skyblue;
		}
	} else if(isMatch(bc, orange)) { // black, yellow, blue, white
		if(isMatch(fc, orange)) {
			fc = yellow;
		}else if(isMatch(fc, skyblue)) {
			fc = blue;
		}else if(isMatch(fc, green)) {
			fc = black;
		}else if(isMatch(fc, red)) {
			fc = black;
		}else if(isMatch(fc, purple)) {
			fc = black;
		}
	} else if(isMatch(bc, skyblue)) { // black, yellow, red, purple, white
		if(isMatch(fc, orange)) {
			fc = red;
		} else if(isMatch(fc, skyblue)) {
			fc = white;
		} else if(isMatch(fc, green)) {
			fc = black;
		} else if(isMatch(fc, blue)) {
			fc = white;
		}
	} else if(isMatch(bc, green)) { // black, orange, yellow, white
		if(isMatch(fc, skyblue)) {
			fc = white;
		} else if(isMatch(fc, green)) {
			fc = white;
		} else if(isMatch(fc, blue)) {
			fc = black;
		} else if(isMatch(fc, red)) {
			fc = orange;
		} else if(isMatch(fc, purple)) {
			fc = orange;
		}
	} else if(isMatch(bc, yellow)) { // black, skyblue, green, blue, red, purple
		if(isMatch(fc, orange)) {
			fc = red;
		} else if(isMatch(fc, yellow)) {
			fc = green;
		} else if(isMatch(fc, white)) {
			fc = black;
		}
	} else if(isMatch(bc, blue)) { // orange, yellow, purple, white
		if(isMatch(fc, skyblue)) {
			fc = white;
		} else if(isMatch(fc, green)) {
			fc = yellow;
		} else if(isMatch(fc, blue)) {
			fc = white;
		} else if(isMatch(fc, red)) {
			fc = purple;
		} else if(isMatch(fc, black)) {
			fc = white;
		}
	} else if(isMatch(bc, red)) { // black, skyblue, white
		if(isMatch(fc, orange)) {
			fc = black;
		} else if(isMatch(fc, green)) {
			fc = skyblue;
		} else if(isMatch(fc, yellow)) {
			fc = black;
		} else if(isMatch(fc, blue)) {
			fc = skyblue;
		} else if(isMatch(fc, red)) {
			fc = black;
		} else if(isMatch(fc, purple)) {
			fc = black;
		}
	} else if(isMatch(bc, purple)) { // black, yellow, blue, white
		if(isMatch(fc, orange)){
			fc = yellow;
		} else if(isMatch(fc, skyblue)){
			fc = blue;
		} else if(isMatch(fc, green)) {
			fc = black;
		} else if(isMatch(fc, red)) {
			fc = yellow;
		} else if(isMatch(fc, purple)) {
			fc = yellow;
		}
	} else if(isMatch(bc, white)) { // black, orange, green, blue, red, purple
		if(isMatch(fc, skyblue)) {
			fc = blue;
		} else if(isMatch(fc, yellow)) {
			fc = orange;
		} else if(isMatch(fc, white)) {
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
	if( bc.toString() == "rgba(0, 0, 0, 0)" ) { bc = "rgb(255, 255, 255)"; }
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
	let rgb = bc2rgb(bc);

	// 背景色が未設定かどうか
	if (rgb[0] + rgb[1] + rgb[2] + rgb[3] == 0) {
		return false;
	}
	else {
		let new_rgb = classify_colors(rgb.slice(0, 3));
		let new_rgb_str = `rgb(${new_rgb[0]}, ${new_rgb[1]}, ${new_rgb[2]})`;
		element.style.backgroundColor = new_rgb_str;
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
