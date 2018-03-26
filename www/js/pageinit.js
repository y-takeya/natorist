var idx;  //情報の数
var ddata = {};
var reader;
var couponinfo;

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
    
    case 'coupon_info-page':
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

    
     case 'main-page':
    //メインページ
    console.log("main page init");
    var news = ncmb.DataStore("tmpNews");
    news.fetchAll()
        .then(function(results){
            reader = new FileReader();  //ファイルの読み込み
            reader.onload = function(e) {  //読み込み終了  
                    //idx++;
                    var dinfo = ncmb.DataStore(results[idx].get("detailClass"));  //詳細のクラスの読み込み
                    console.log(results[idx].get("detailClass"));
                    dinfo.fetchAll()
                        .then(function(dres){
                            ddata.img = dres[0].get("img");
                            ddata.title= dres[0].get("title");
                            ddata.detail= dres[0].get("detail");
                            console.log(idx);
                            items += '<ons-carousel-item><button onclick="onClickInfo('+"'"+ddata.title+"','"+ddata.detail+"','"+ddata.img+"'"+')" class="cal"><img src ="'+reader.result+'" alt="イメージが取得できませんでした" style="height:100%;width:100%" /></button></ons-carousel-item>';
                            document.getElementById("newsItems").innerHTML = items;  //main.htmlのカルーセルのdivに記述
                        })
                        .catch(function(err){
                            console.error(err);
                        })
                    
                    idx++;
                    if(idx<results.length){
                        loadNews(idx,results,reader);
                    }
            }
            var items ='';
            idx = 0; 
            console.log(results.length);
            loadNews(idx,results,reader);
        })
    break; 

    case 'coupon-page':
    var coupons = ncmb.DataStore("tmpCoupon");
    coupons.fetchAll()
        .then(function(results){
            reader = new FileReader();  //ファイルの読み込み
            reader.onload = function(e) {  //読み込み終了  
                    //idx++;
                    var dinfo = ncmb.DataStore(results[idx].get("detailclass"));  //詳細のクラスの読み込み
                    couponinfo=dinfo;
                    console.log(results[idx].get("detailclass"));
                    dinfo.fetchAll()
                        .then(function(dres){
                            ddata.img = dres[0].get("img");
                            ddata.title= dres[0].get("title");
                            ddata.detail= dres[0].get("detail");
                            console.log(idx);
                            
                            items += '<ons-list-item onclick="onClickCoupon('+"'"+ddata.title+"','"+ddata.detail+"','"+ddata.img+"'"+')" ><img src ="'+reader.result+'" alt="イメージが取得できませんでした"  class="contain"/>'+ddata.title+'</ons-list-item>';
                            document.getElementById("couponItems").innerHTML = items;  //main.htmlのカルーセルのdivに記述
                        })
                        .catch(function(err){
                            console.error(err);
                        })
                    
                    idx++;
                    if(idx<results.length){
                        loadNews(idx,results,reader);
                    }
            }
            var items ='';
            idx = 0; 
            console.log(results.length);
            loadNews(idx,results,reader);
        })
    break;
    
    
    
     case 'event-page':
    var events = ncmb.DataStore("tmpEvent");
    events.fetchAll()
        .then(function(results){
            reader = new FileReader();  //ファイルの読み込み
            reader.onload = function(e) {  //読み込み終了  
                    //idx++;
                    var dinfo = ncmb.DataStore(results[idx].get("detailClass"));  //詳細のクラスの読み込み
                    console.log(results[idx].get("detailClass"));
                    dinfo.fetchAll()
                        .then(function(dres){
                            ddata.img = dres[0].get("img");
                            ddata.title= dres[0].get("title");
                            ddata.detail= dres[0].get("detail");
                            console.log(idx);
                            items += '<ons-list-item onclick="onClickInfo('+"'"+ddata.title+"','"+ddata.detail+"','"+ddata.img+"'"+')" ><img src ="'+reader.result+'" alt="イメージが取得できませんでした" class="contain"/>'+ddata.title+'</ons-list-item>';
                            document.getElementById("eventItems").innerHTML = items;  //main.htmlのカルーセルのdivに記述
                        })
                        .catch(function(err){
                            console.error(err);
                        })
                    
                    idx++;
                    if(idx<results.length){
                        loadNews(idx,results,reader);
                    }
            }
            var items ='';
            idx = 0; 
            console.log(results.length);
            loadNews(idx,results,reader);
        })
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

function onClickCoupon(title,detail,img){
    var options = {};
    options.data = {};
    options.animation = 'slide';
    options.data.title = title;
    options.data.detail = detail;
    options.data.img = img;
    console.log( options.data.img);
    NatNavi.pushPage('coupon_info.html', options);
};

function onClickTopBtn(page){
    var options = {};
    options.animation = 'slide';
    NatNavi.pushPage(page,options);
}

function loadNews(idx,results,reader){

    console.log(results[idx].get("img"));
    ncmb.File.download(results[idx].get("img"), "blob")  //ファイルのダウンロード
        .then(function(blob) {
            reader.readAsDataURL(blob);  //ファイルの読み込み
        })
        .catch(function(err) {
            console.error(err);
        })
    
}

function usedCoupon(){
    var userid;
    window.NCMB.monaca.getInstallationId(
        function(userid){}
        );
    var classname=userid+'_Info';
    var coupons = ncmb.DataStore(classname);
            var coupon = new Coupons();
            coupon.set("couponInfo",couponinfo+'使用');
}

