// ＳＮＳリンク

ons.bootstrap();
ons.disableAutoStatusBarFill();  // (Monaca enables StatusBar plugin by default)

function twitText() {
    var s, url;
    s =  encodeURIComponent("#なとりすと");
    url = document.location.href;

    if (s != "") {
        if (s.length > 140) {
    	    //文字数制限
		    alert("テキストが140字を超えています");
	    } else {
		    //投稿画面を開く
		    url = "http://twitter.com/share?text=" + s;
		    window.open(url,"_system","width=600,height=300");
        }
    }
}

function lineText() {
    var s, url;
    s =   "なとりすと";
    url = document.location.href;

    if (s != "") {
	    if (s.length > 500) {
		    //文字数制限
		    alert("テキストが500字を超えています");
	    } else {
		    //投稿画面を開く
		    url = "http://line.me/R/msg/text/" + s;
		    window.open(url,"_system", 'location=yes');
        }
    }
}

share_pic: function share_pic(data)
    {
        Instagram.share("data:image/jpeg;base64," + data, 'example caption', function(err) {});
    }
// インスタグラムリンク
function getPhoto() {            
    navigator.camera.getPicture(onSuccess, onFail, 
    { quality: 50, destinationType: Camera.DestinationType.DATA_URL });
}

function onSuccess(imageData) {
    
    var img_tag = "なとりすと";
    
    Instagram.share("data:image/jpeg;base64," + imageData, img_tag, function(err) {});    
}

function onFail(message) {
  alert('An error Occured: ' + message);
}
