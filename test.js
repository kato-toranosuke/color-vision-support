// 色を近似する
// h: 0~360, s: 0~100, v:0~100
const sample_colors = [
	{ name: 'black', color: { h: -1, s: 100, v: 100 } },
	{ name: 'red', color: { h: 27, s: 100, v: 100 } },
	{ name: 'orange', color: { h: 41, s: 100, v: 100 } },
	{ name: 'yellow', color: { h: 56, s: 100, v: 100 } },
	{ name: 'green', color: { h: 164, s: 100, v: 100 } },
	{ name: 'skyblue', color: { h: 200, s: 100, v: 100 } },
	{ name: 'blue', color: { h: 230, s: 100, v: 100 } },
	{ name: 'purple', color: { h: 326, s: 100, v: 100 } },
];

function main() {

	var body = document.getElementsByTagName('body')[0];

	children_color_change(body);
}

function children_color_change(element) {
	let children = element.children;

	for (let child of children) {
		if (child.children.length != 0) {
			children_color_change(child);
		}
		change_color(child);
	}
}

function get_rgb_from_css(element) {
	let css = getComputedStyle(element, null);
	// console.log(css);
	let c = css.getPropertyValue("color");

	let reg = /(?<=rgb\().*(?=\))/;
	let result = c.match(reg);
	let result2 = result[0].split(',');

	let rgb = [];
	rgb[0] = Number(result2[0]);
	rgb[1] = Number(result2[1]);
	rgb[2] = Number(result2[2]);

	return rgb;
}

function get_rgb_from_style(element) {
	console.log(element.style.color);
}

function change_color(element) {
	// get_rgb_from_style(element);

	const rgb = get_rgb_from_css(element);

	var new_rgb = classify_colors(rgb);
	const new_rgb_str = `rgb(${new_rgb[0]}, ${new_rgb[1]}, ${new_rgb[2]})`;
	element.style.color = new_rgb_str;

	return;
}

main();


// 背景色をグレースケールに変換する
function background2grey(rgb) {
	return rgb;
}

function classify_colors(rgb) {
	console.log(rgb);
	var hsv = rgb2hsv(rgb);
	var hue = hsv[0];

	console.log(hue);

	if (hue < 10) {
		// black
		hsv[0] = sample_colors[0].color.h;
		hsv[1] = sample_colors[0].color.s;
		hsv[2] = sample_colors[0].color.v;
	} else if (hue < 35) {
		// red
		hsv[0] = sample_colors[1].color.h;
		hsv[1] = sample_colors[1].color.s;
		hsv[2] = sample_colors[1].color.v;
	} else if (hue < 50) {
		// orange
		hsv[0] = sample_colors[2].color.h;
		hsv[1] = sample_colors[2].color.s;
		hsv[2] = sample_colors[2].color.v;
	} else {
		// purple
		hsv[0] = sample_colors[7].color.h;
		hsv[1] = sample_colors[7].color.s;
		hsv[2] = sample_colors[7].color.v;
	}

	hsv[1] = hsv[1] / 100;
	hsv[2] = hsv[2] / 100;

	var new_rgb = hsv2rgb(hsv);
	return new_rgb;
}

// 要素の色を取得する
function get_element_color(node) {
	let rgb = { r: -1, g: -1, b: -1 };

	var body = document.getElementsByTagName('body')[0];
	children_color_change(body);


	return rgb;
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

	return [h, s, v];
}


// //ストリーム変更時にいいねを消し去る
// function ObserveStream(){
//     //オブザーバーの作成
//     var observer = new MutationObserver(hide_like);
//     //監視の開始
//     observer.observe(document.getElementsByClassName('stream-items')[0], {
//         attributes: true,
//         childList:  true
//     });
//     console.log("observe");
//     hide_like();
// }


// //body変更時にObserveStreamを設定する。
// //オブザーバーの作成
// var observer = new MutationObserver(hide_like);
// //監視の開始
// observer.observe(document.getElementsByClassName('stream-items')[0], {
//     attributes: true,
//     childList: true
// });