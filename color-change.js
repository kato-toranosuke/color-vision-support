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

function change_color(element) {

}

main();


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
		gs = parseInt(gs/3 + 170);  // ここでグレースケールの濃淡の調整
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


