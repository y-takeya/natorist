document.addEventListener('init', function(event) {
  var page = event.target;
  console.log("page init");
  switch(page.id) {
  case 'info-page':
      //情報ページ表示時の初期設定
    console.log(page.data.title);
    
    var reader = new FileReader();
    reader.onload = function(e) {
      var dataUrl = reader.result;
      document.getElementById("info-img").src = dataUrl;
    }
    ncmb.File.download(page.data.img, "blob")
    .then(function(blob) {
      reader.readAsDataURL(blob);
    })
    .catch(function(err) {
      console.error(err);
    })
    
    document.getElementById("info-title").innerHTML = page.data.title;
    //document.getElementById("info-img").src = page.data.img;
    document.getElementById("info-detail").innerHTML = page.data.detail;
    break;
  case 'map-page':
    //マップ表示
    console.log("map page init");
    // Geolocation APIに対応している
    if (navigator.geolocation) {
      //alert("この端末では位置情報が取得できます");
        startDrawCurrentPosition();
    // Geolocation APIに対応していない
    } else {
      alert("この端末では位置情報が取得できません");
    }
    break;
  }
});


function onClickInfo(title,detail,img){
    var options = {};
    options.data = {};
    options.animation = 'slide';
    options.data.title = title;
    options.data.detail = detail;
    options.data.img = img;
    console.log( options.data.img);
    NatNavi.pushPage('info.html', options);
};

function onClickTopBtn(page){
     var options = {};
    options.animation = 'slide';
    NatNavi.pushPage(page,options);
}


