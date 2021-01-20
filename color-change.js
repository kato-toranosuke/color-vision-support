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
	{ name: 'brown', hsv: { h: 41, s: 1.0, v: 0.90 }, rgb: { r: 128, g: 64, b: 0 } }
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

const non_colors = [
	{ name: 'white', rgb: { r: 255, g: 255, b: 255 } },
	{ name: 'light_gray', rgb: { r: 200, g: 200, b: 203 } },
	{ name: 'gray', rgb: { r: 132, g: 145, b: 158 } },
	{ name: 'black', rgb: { r: 0, g: 0, b: 0 } }
];

const black = [0, 0, 0], orange = [230, 159, 0], skyblue = [86, 180, 233];
const green = [0, 158, 115], yellow = [240, 228, 66], blue = [0, 114, 178];
const red = [213, 94, 0], purple = [204, 121, 167], white = [255, 255, 255];

// 検索結果ページ
const search_engines = {
	google: { hostname: "www.google.com", pathname: "/search", visited_link_color: [95, 0, 139] },
	yahoo: { hostname: "search.yahoo.co.jp", pathname: "/search", visited_link_color: [69, 30, 101] },
	bing: { hostname: "www.bing.com", pathname: "/search" }
};
let search_res_page_flag = false;
let se_name;

// 正規表現
const reg4rgb = /(?<=rgb\().*(?=\))/;
const reg4rgba = /(?<=rgba\().*(?=\))/;

// 訪問済みURLリスト
let visited_urls_list = [];

// この関数が実行される
function main() {
	// 検索結果ページか判定
	search_res_page_flag = isSearchResPage();
	// 検索結果ページであった場合にCSSを設定
	if (search_res_page_flag) {
		const visited_urls_obj = localStorage.getItem('visited_urls');
		if (visited_urls_obj !== null) {
			visited_urls_list = JSON.parse(visited_urls_obj);
		}
		console.log(visited_urls_list);

		// CSSで対処しようとした場合→失敗
		// const sheet = document.styleSheets[0];
		// sheet.insertRule(`a:visited {background-color: rgb(${accent_colors[1].rgb.r}, ${accent_colors[1].rgb.g}, ${accent_colors[1].rgb.b})}`, 0);
		// sheet.insertRule(`a {color: green}`, 0);
	}

	var body = document.getElementsByTagName('body')[0];

	// body以下の全ての要素に対して背景色の色を近似する
	changeChildrenBgColor(body, getComputedStyle(body, null).getPropertyValue("background-color"));
	// body以下の全ての要素に対してフォントの色を近似する
	changeChildrenFontColor(body, false);

}

// 検索結果ページか判定
function isSearchResPage() {
	const host = location.hostname;
	const path = location.pathname;

	for (let se in search_engines) {
		if (search_engines[se].hostname == host) {
			const regexp = new RegExp('^' + search_engines[se].pathname + '.*');
			const match_arry = path.match(regexp)
			if (match_arry !== null) {
				se_name = se;
				return true;
			}
		}
	}

	return false;
}

// 検索結果ページにおいて、リンクをクリックした際にURLを保存する。
function addVisitedUrlsList() {
	const visited_urls_obj = localStorage.getItem('visited_urls');
	let visited_urls;
	if (visited_urls_obj !== null) {
		// 配列に変換
		visited_urls = JSON.parse(visited_urls_obj);
		visited_urls.push(this.href);
	} else {
		visited_urls = new Array(this.href);
	}

	// 保存
	const new_visited_urls_obj = JSON.stringify(visited_urls);
	localStorage.setItem('visited_urls', new_visited_urls_obj);
}

// 各要素に対して関数font_change_colorを適用する
function changeChildrenFontColor(element, is_parent_element_a) {
	// 訪問済みか未訪問の判定
	let flag = is_parent_element_a;
	if (search_res_page_flag) {
		let tagname = element.tagName;
		// aタグだった場合
		if (tagname == 'A') {
			// 訪問済みリストの中にURLが存在するか確認
			for (const visited_url of visited_urls_list) {
				if (visited_url == element.href) {
					flag = true;
				}
			}
			// イベントの設定
			element.addEventListener('click', addVisitedUrlsList, false);
			// flag = true;
		}
	}

	let children = element.children;

	for (let child of children) {
		if (child.children.length != 0) {
			// 子要素がある
			changeChildrenFontColor(child, flag);
		} else {
			// 子要素がない
			// 検索結果ページの内、aタグに関連するものでなければ、文字色変更する。そうでなければ、何もしない。
			if (!is_parent_element_a) {
				changeFontColor(child);
			} else {
				child.style.color = `rgba(${accent_colors[2].rgb.r}, ${accent_colors[2].rgb.g}, ${accent_colors[2].rgb.b}, 1})`;
				console.log(element);
			}
		}
	}
}

// 要素elementのフォントの色を近似し変更する
async function changeFontColor(element) {

	let css = getComputedStyle(element, null);
	let rgb_color = css.getPropertyValue("color");

	let matched_rgb = rgb_color.match(reg4rgb);
	let matched_rgba = rgb_color.match(reg4rgba);
	let result;
	if (matched_rgb === null && matched_rgba === null) {
		result = ['255', '255', '255'];
	} else if (matched_rgb !== null) {
		result = matched_rgb[0].split(',');
	} else {
		result = matched_rgba[0].split(',');
	}

	// 色情報をRGBA形式で統一的に扱えるように加工する。
	let rgba = [0, 0, 0, 0];
	rgba[0] = Number(result[0]);
	rgba[1] = Number(result[1]);
	rgba[2] = Number(result[2]);
	if (result.length == 4) {
		rgba[3] = Number(result[3]);
	} else {
		rgba[3] = 1;
	}

	// rgbの値によってsample_colorsに近似する
	let new_rgba = classifyColors(rgba, accent_colors);

	// 背景色とフォントの色の組合せを考える
	let bc = element.style.backgroundColor;
	let bc_rgba = bc2rgba(bc);
	let conb = checkConbination(new_rgba.slice(0, 3), bc_rgba.slice(0, 3));

	// 背景色と文字色の明度差を考慮する
	conb.push(new_rgba[3]); // rgbaにするための処理。将来的に廃止したい。
	new_rgba = checkValueDiff(conb, bc_rgba);

	// 要素に新しい色を登録する
	let new_rgba_str = `rgba(${new_rgba[0]}, ${new_rgba[1]}, ${new_rgba[2]}, ${new_rgba[3]})`;
	element.style.color = new_rgba_str;

	return;
}

// 明度差の考慮
function checkValueDiff(fc_rgba, bc_rgba) {
	let result = [0, 0, 0, 0];
	// 透明度の保存
	if (fc_rgba.length == 4) {
		result[3] = fc_rgba[3];
	} else {
		result[3] = 1;
	}

	// rgb -> hsv 変換
	let fc_hsv = rgb2hsv(fc_rgba);
	let bc_hsv = rgb2hsv(bc_rgba);

	// 明度差を判定
	if (Math.abs(bc_hsv[2] - fc_hsv[2]) < 10) {
		fc_hsv[2] = Math.abs(100 - fc_hsv[2]);
		fc_rgba = hsv2rgb(fc_hsv);
	}

	// rgb値の格納
	for (let i = 0; i < 3; i++) {
		result[i] = fc_rgba[i];
	}

	return result;
}

// arg: rgbを表す数値の配列
// res: sample_colorsに近似したrgbを表す数値の配列
function classifyColors(rgba, sample_colors) {
	let new_rgba;
	let rgb = [rgba[0], rgba[1], rgba[2]];
	if (Math.max(...rgb) - Math.min(...rgb) > 30) {
		// 有彩色の場合
		new_rgba = calcApproximateColor(rgba, sample_colors);
	} else {
		// 無彩色の場合
		new_rgba = calcApproximateColor(rgba, non_colors);
	}

	return new_rgba;
}

function calcApproximateColor(rgba, sample_colors) {
	let min_index = 0, min_dist = 1000000;
	for (let i = 0; i < sample_colors.length; i++) {
		const sample_rgb = sample_colors[i].rgb;
		let dist = Math.abs(rgba[0] - sample_rgb.r) + Math.abs(rgba[1] - sample_rgb.g) + Math.abs(rgba[2] - sample_rgb.b);
		if (dist < min_dist) {
			min_index = i;
			min_dist = dist;
		}
	}
	return [sample_colors[min_index].rgb.r, sample_colors[min_index].rgb.g, sample_colors[min_index].rgb.b, rgba[3]];
}


// arg:  fc:フォントの色  bc:背景色
// 参考資料、実験により、背景色に対して認識しやすいフォントの色に変換する
//NG: 暖色・寒色同士、明度が近い
function checkConbination(fc, bc) {
	// console.log(`fc=${fc}, bc=${bc}`);
	if (isMatch(bc, base_colors[0].rgb)) { // ------------------- light_pink
		if (isMatch(fc, non_colors[1].rgb)) { // light_grey
			// fc = white;
		}
	} else if (isMatch(bc, base_colors[1].rgb)) { // ------------ cream
		if (isMatch(fc, non_colors[0].rgb)) { // white
			// fc = white;
		}
	} else if (isMatch(bc, base_colors[2].rgb)) { // ------------ light_yg
		if (isMatch(fc, accent_colors[1].rgb)) { // yellow
			// fc = white;
		} else if (isMatch(fc, accent_colors[6].rgb)) { // orange
			// fc = white;
		} else if (isMatch(fc, non_colors[1].rgb)) { // light_grey
			// fc = white;
		}
	} else if (isMatch(bc, base_colors[3].rgb)) { // ------------ light_skyblue
		if (isMatch(fc, accent_colors[1].rgb)) { // light_grey
			// fc = yellow;
		}
	} else if (isMatch(bc, base_colors[4].rgb)) { // ------------ beige
		if (isMatch(fc, accent_colors[5].rgb)) { // pink
			fc = white;
		}
	} else if (isMatch(bc, base_colors[5].rgb)) { // ------------ light_green
		if (isMatch(fc, accent_colors[5].rgb)) { // pink
			// fc = red;
		}
	} else if (isMatch(bc, base_colors[6].rgb)) { // ------------ light_purple
		if (isMatch(fc, accent_colors[4].rgb)) { // skyblue
			// fc = yellow;
		} else if (isMatch(fc, non_colors[1].rgb)) { // light_grey
			// fc = white;
		} else if (isMatch(fc, non_colors[2].rgb)) { // grey
			// fc = white;
		}
	} else if (isMatch(bc, non_colors[0].rgb)) { // ------------- white
		if (isMatch(fc, accent_colors[1].rgb)) { // yellow
			// fc = white;
		}
	} else if (isMatch(bc, non_colors[1].rgb)) { // ------------- light_grey
		if (isMatch(fc, accent_colors[1].rgb)) { // yellow
			// fc = white;
		}
	} else if (isMatch(bc, non_colors[2].rgb)) { // ------------- gray
		if (isMatch(fc, accent_colors[2].rgb)) { // green
			// fc = white;
		} else if (isMatch(fc, accent_colors[7].rgb)) { // purple
			// fc = white;
		} else if (isMatch(fc, accent_colors[8].rgb)) { // brown
			// fc = white;
		} else if (isMatch(fc, accent_colors[3].rgb)) { // blue
			// fc = white;
		} else if (isMatch(fc, accent_colors[5].rgb)) { // pink
			// fc = white;
		}
	} else if (isMatch(bc, non_colors[3].rgb)) { // ------------ black
		if (isMatch(fc, accent_colors[8].rgb)) { // brown
			// fc = white;
		} else if (isMatch(fc, accent_colors[7].rgb)) { // purple
			// fc = white;
		}
	}

	return fc;
}

// rgb1とrgb2の数値の配列が一致しているか
function isMatch(rgb1, rgb2) {
	return rgb1[0] == rgb2.r && rgb1[1] == rgb2.g && rgb1[2] == rgb2.b;
}


// arg:  element: DOM要素, bc: 親の要素の背景色
// 各要素に対して関数bc_change_colorを適用する
// 背景色が未設定の場合は親の要素の設定に従う
function changeChildrenBgColor(element, bc) {
	// bodyの背景色が未設定のときに白色に変換する
	if (bc.toString() == "rgba(0, 0, 0, 0)") { bc = "rgb(255, 255, 255)"; }
	let children = element.children;

	for (let child of children) {
		if (!changeBgColor(child)) {
			child.style.backgroundColor = bc;
		}
		if (child.children.length != 0) {
			changeChildrenBgColor(child, child.style.backgroundColor);
		}
	}
}

// 背景色をユニバーサル色に近似する。
// res: true = 背景色が設定されている, false = 設定されていない
function changeBgColor(element) {
	if (hasImage(element) || hasCdn(element)) { return true };
	let bc = getComputedStyle(element, null).getPropertyValue("background-color");
	let rgba = bc2rgba(bc);

	// 背景色が未設定かどうか
	if (rgba[0] + rgba[1] + rgba[2] + rgba[3] == 0) {
		return false;
	}
	else {
		let new_rgba = classifyColors(rgba, base_colors);
		let new_rgba_str = `rgba(${new_rgba[0]}, ${new_rgba[1]}, ${new_rgba[2]}, ${new_rgba[3]})`;
		element.style.backgroundColor = new_rgba_str;
		return true;
	}
}

// 文字列のrgb値から数値の配列に変換する
// res: [rの値, gの値, bの値, aの値]
function bc2rgba(bc) {
	// console.log(bc);
	let start = bc.indexOf('(');
	let end = bc.indexOf(')');
	let str = bc.substr(start + 1, end - start - 1).split(',');
	let rgba = [1, 1, 1, 1];
	let i = 0;
	for (let val of str) {
		rgba[i++] = Number(val);
	}
	return rgba;
}

/**
 * hsv -> rgb
 * @param {Array} hsv - h:[0,360] / s,v:[0,100]
 * @returns {Array} - [r, g, b]
 */
function hsv2rgb(hsv) {
	let h = hsv[0];
	let s = hsv[1];
	let v = hsv[2];
	if (h == 360) h = 0;

	let _h = (h / 60) % 1.0;
	let _s = s / 100.0;
	let _v = v / 100.0;

	let rgb;
	let a = _v * 255;
	let b = _v * (1 - _s) * 255;
	let c = _v * (1 - _s * _h) * 255;
	let d = _v * (1 - _s * (1 - _h)) * 255;

	if (s == 0) {
		//　無彩色
		rgb = [a, a, a];
	} else if (h < 60) {
		rgb = [a, d, b];
	} else if (h < 120) {
		rgb = [c, a, b];
	} else if (h < 180) {
		rgb = [b, a, d];
	} else if (h < 240) {
		rgb = [b, c, a];
	} else if (h < 300) {
		rgb = [d, b, a];
	} else {
		rgb = [a, b, c];
	}

	return rgb;
}

/**
 * rgb -> hsvに変換する。
 * @param {Array} rgb - [r, g, b]: value range is [0, 255]
 * @return {Array} - [h, s, v]: h [0, 360] / s, v [0, 100]
 */
function rgb2hsv(rgb) {
	var r = Number(rgb[0]) / 255;
	var g = Number(rgb[1]) / 255;
	var b = Number(rgb[2]) / 255;

	var max = Math.max(r, g, b);
	var min = Math.min(r, g, b);
	var diff = max - min;

	var h = 0;

	switch (min) {
		case max:
			// 無彩色の場合
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

	var s = max == 0 ? 0 : diff / max * 100;
	var v = max * 100;

	return [h, s, v];
}

function hasImage(element) {
	let img = getComputedStyle(element, null).getPropertyValue("background-image");
	let s = img.indexOf('u');
	return s != -1;
}

function hasCdn(element) {
	return element.classList.contains("fa");
}

main();
