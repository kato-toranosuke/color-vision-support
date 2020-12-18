// 色を近似する
// h: 0~360, s: 0~100, v:0~100
const sample_colors = [
	{ name: 'red', color: { h: 27, s: 1.0, v: 1.0 } },
	{ name: 'orange', color: { h: 41, s: 1.0, v: 1.0 } },
	{ name: 'yellow', color: { h: 56, s: 1.0, v: 1.0 } },
	{ name: 'green', color: { h: 164, s: 1.0, v: 1.0 } },
	{ name: 'skyblue', color: { h: 200, s: 1.0, v: 1.0 } },
	{ name: 'blue', color: { h: 230, s: 1.0, v: 1.0 } },
	{ name: 'pink', color: { h: 326, s: 1.0, v: 1.0 } },
];

// 正規表現
const reg4rgb = /(?<=rgb\().*(?=\))/;
const reg4rgba = /(?<=rgba\().*(?=\))/;


// この関数が実行される
function main() {
	var body = document.getElementsByTagName('body')[0];

	// body以下の全ての要素に対してフォントの色を近似する
	children_color_change(body);
	// body以下の全ての要素に対して背景色の色を近似する
	children_bc_change(body, getComputedStyle(body, null).getPropertyValue("background-color"));
}


// 各要素に対して関数font_change_colorを適用する
function children_color_change(element) {
	let children = element.children;

	for(let child of children) {
		if (child.children.length != 0) {
			children_color_change(child);
		}
		font_change_color(child);
	}
}

// 要素elementのフォントの色を近似し変更する
async function font_change_color(element) {
	//console.log(element);

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
	} else if (result_rgb !== null){
		result2 = result_rgb[0].split(',');
	} else {
		result2 = result_rgba[0].split(',');
	}

	let rgb = [];
	rgb[0] = Number(result2[0]);
	rgb[1] = Number(result2[1]);
	rgb[2] = Number(result2[2]);

	var new_rgb = classify_colors(rgb);

	//return rgb;
	const new_rgb_str = `rgb(${new_rgb[0]}, ${new_rgb[1]}, ${new_rgb[2]})`;
	element.style.color = new_rgb_str;

	return;
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
	if ( Math.max(rgb)-Math.min(rgb) > 30 ) {
		// console.log("有彩色");

		if(hue < 27 || hue > 356){
			// red
			hsv[0] = sample_colors[0].color.h;
			hsv[1] = sample_colors[0].color.s;
			hsv[2] = sample_colors[0].color.v;
		}else if(hue < 48){
			// orange
			hsv[0] = sample_colors[1].color.h;
			hsv[1] = sample_colors[1].color.s;
			hsv[2] = sample_colors[1].color.v;
		}else if(hue < 90){  // rgb 1:2:0
			// yellow
			hsv[0] = sample_colors[2].color.h;
			hsv[1] = sample_colors[2].color.s;
			hsv[2] = sample_colors[2].color.v;
		}else if(hue < 180){  // rgb 0:1:1
			// green
			hsv[0] = sample_colors[3].color.h;
			hsv[1] = sample_colors[3].color.s;
			hsv[2] = sample_colors[3].color.v;
		}else if(hue < 215){
			// skyblue
			hsv[0] = sample_colors[4].color.h;
			hsv[1] = sample_colors[4].color.s;
			hsv[2] = sample_colors[4].color.v;
		}else if(hue < 270){  // rgb 1:0:2
			// blue
			hsv[0] = sample_colors[5].color.h;
			hsv[1] = sample_colors[5].color.s;
			hsv[2] = sample_colors[5].color.v;
		}else{
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
function hsv2rgb (hsv) {
	var h = hsv[0] / 60 ;
	var s = hsv[1] ;
	var v = hsv[2] ;
	if ( s == 0 ) return [ v * 255, v * 255, v * 255 ] ;

	var rgb ;
	var i = parseInt( h ) ;
	var f = h - i ;
	var v1 = v * (1 - s) ;
	var v2 = v * (1 - s * f) ;
	var v3 = v * (1 - s * (1 - f)) ;

	switch( i ) {
		case 0 :
		case 6 :
			rgb = [ v, v3, v1 ] ;
		break ;

		case 1 :
			rgb = [ v2, v, v1 ] ;
		break ;

		case 2 :
			rgb = [ v1, v, v3 ] ;
		break ;

		case 3 :
			rgb = [ v1, v2, v ] ;
		break ;

		case 4 :
			rgb = [ v3, v1, v ] ;
		break ;

		case 5 :
			rgb = [ v, v1, v2 ] ;
		break ;
	}

	return rgb.map( function ( value ) {
		return value * 255 ;
	} ) ;
}

// rgbからhsvへの変換
function rgb2hsv(rgb) {
	// console.log(rgb);
	var r = rgb[0] / 255 ;
	var g = rgb[1] / 255 ;
	var b = rgb[2] / 255 ;

	var max = Math.max( r, g, b ) ;
	var min = Math.min( r, g, b ) ;
	var diff = max - min ;

	var h = 0 ;

	switch( min ) {
		case max :
			h = 0 ;
		break ;

		case r :
			h = (60 * ((b - g) / diff)) + 180 ;
		break ;

		case g :
			h = (60 * ((r - b) / diff)) + 300 ;
		break ;

		case b :
			h = (60 * ((g - r) / diff)) + 60 ;
		break ;
	}

	var s = max == 0 ? 0 : diff / max ;
	var v = max ;

	return [ h, s, v ] ;
}



// 各要素に対して関数bc_change_colorを適用する
// 背景色が未設定の場合は親の要素の設定に従う
function children_bc_change(element, bc) {
	let children = element.children;

	for(let child of children) {
		if( !bc_change_color(child) ) {
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
	if( rgb[0]+rgb[1]+rgb[2]+rgb[3] == 0 ) {
		return false;
	}
	else {
		let new_rgb = classify_colors(rgb);
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
