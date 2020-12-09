// 色を近似する
// h: 0~360, s: 0~100, v:0~100
const sample_colors = [
	{ name: 'red', color: { h: 27, s: 100, v: 100 } },
	{ name: 'orange', color: { h: 41, s: 100, v: 100 } },
	{ name: 'yellow', color: { h: 56, s: 100, v: 100 } },
	{ name: 'green', color: { h: 164, s: 100, v: 100 } },
	{ name: 'skyblue', color: { h: 200, s: 100, v: 100 } },
	{ name: 'blue', color: { h: 230, s: 100, v: 100 } },
	{ name: 'pink', color: { h: 326, s: 100, v: 100 } },
];

function main() {

	var body = document.getElementsByTagName('body')[0];

	children_color_change(body);
	// 全ての要素に対して背景色をグレースケールに変換する
	children_bc_change(body, getComputedStyle(body, null).getPropertyValue("background-color"));
}


function children_color_change(element) {
	let children = element.children;

	for(let child of children) {
		if (child.children.length != 0) {
			children_color_change(child);
		}
		change_color(child);
	}
}

async function change_color(element) {
	console.log(element);

	let css = getComputedStyle(element, null);
	let rgb_color = css.getPropertyValue("color");
	console.log(rgb_color);

	let reg = /(?<=rgb\().*(?=\))/;
	let result = rgb_color.match(reg);
	let result2 = result[0].split(',');

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

function classify_colors(rgb) {
	var hsv = rgb2hsv(rgb);
	// h = 0~360, s,v=0~1
	var hue = hsv[0];
	var sat = hsv[1];

	// 有彩色の場合
	if(sat != 0){
		if(hue < 34){
			// red
			hsv[0] = sample_colors[0].color.h;
			hsv[1] = sample_colors[0].color.s;
			hsv[2] = sample_colors[0].color.v;
		}else if(hue < 48){
			// orange
			hsv[0] = sample_colors[1].color.h;
			hsv[1] = sample_colors[1].color.s;
			hsv[2] = sample_colors[1].color.v;
		}else if(hue < 110){
			// yellow
			hsv[0] = sample_colors[2].color.h;
			hsv[1] = sample_colors[2].color.s;
			hsv[2] = sample_colors[2].color.v;
		}else if(hue < 182){
			// green
			hsv[0] = sample_colors[3].color.h;
			hsv[1] = sample_colors[3].color.s;
			hsv[2] = sample_colors[3].color.v;
		}else if(hue < 215){
			// skyblue
			hsv[0] = sample_colors[4].color.h;
			hsv[1] = sample_colors[4].color.s;
			hsv[2] = sample_colors[4].color.v;
		}else if(hue < 278){
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
	}

	hsv[1] = hsv[1] / 100;
	hsv[2] = hsv[2] / 100;

	var new_rgb = hsv2rgb(hsv);
	// r,g,b = 0~255
	return new_rgb;
}

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

function rgb2hsv (rgb) {
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


// 各要素に対してbackground2greyを適用する
// 背景色が未設定の場合は親の要素の設定に従う
function children_bc_change(element, bc) {
	let children = element.children;

	for(let child of children) {
		if( !background2grey(child) ) {
			child.style.backgroundColor = bc;
		}
		if (child.children.length != 0) {
			children_color_change(child, child.style.backgroundColor);
		}
	}
}

// 背景色が設定されていればグレースケールに変換する
function background2grey(element) {
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
		let gs = (rgb[0]+rgb[1]+rgb[2]) / 3;
		gs = parseInt(gs);  // ここでグレースケールの濃淡の調整
		bc = "rgb(" + gs + "," + gs + "," + gs + ")";
		element.style.backgroundColor = bc;
		console.log(bc);
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
