
//いいねを消し去る
// 変更テスト
function main() {

	var body = document.getElementsByTagName('body')[0];
	//let children = body.children;

	children_color_change(body);

	// var element = document.getElementById('imagine');
	// console.log(element);

	// var style = getComputedStyle(element,null);

	// console.log(style.color);

	// style.color = "blue";
}

function children_color_change(element) {
	let children = element.children;

	for(let child of children) {
		if(child.children.length != 0) {
			children_color_change(child);
		}
		change_color(child);
	}
}

function change_color(element) {
	element.style.color = "blue";
}

main();


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
