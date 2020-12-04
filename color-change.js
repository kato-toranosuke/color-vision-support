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
		background2grey(child);
	}
}

function change_color(element) {

}

main();


// 背景食をグレースケールに変換する
function background2grey(element) {
	console.log("---------------------------------");
	console.log(element);
	let cssStyle = getComputedStyle(element, null);
	let bc = cssStyle.getPropertyValue("background-color");

	console.log("bc: " + bc);
	let rgb = bc2rgb(bc);
	console.log(rgb);

	// element.style.backgroundColor = "grey";
	if( rgb[0]+rgb[1]+rgb[2]+rgb[3] == 0 ) {
		console.log("undefined?");
		element.style.backgroundColor = "rgb(255,255,255)";
	}
	else {
		var gs = (rgb[0]+rgb[1]+rgb[2]) / (3*4);
		gs = parseInt(gs + 150);
		bc = "rgb(" + gs + "," + gs + "," + gs + ")";
		console.log("after: " + bc);
		element.style.backgroundColor = bc;
	}
}

function bc2rgb(bc) {
	let start = bc.indexOf('(');
	let end = bc.indexOf(')');
	let str = bc.substr(start+1, end-start-1).split(',');
	let rgb = [1, 1, 1, 1];
	let i=0;
	for(let val of str) {
		rgb[i++] = Number(val);
	}
	return rgb;
}

// 色を近似する
function classify_colors(rgb) {
	return new_rgb;
}

// 要素の色を取得する
function get_element_color(node) {
	return rgb;
}


