
//いいねを消し去る
function color_change() {

	document.getElementById('imagine').style.color = "blue";
	// var element = document.getElementById('imagine');
	// console.log(element);

	// var style = getComputedStyle(element,null);

	// console.log(style.color);

	// style.color = "blue";
}

color_change();


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

