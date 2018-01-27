var    projection3857 = new OpenLayers.Projection("EPSG:3857");
var    projection4326 = new OpenLayers.Projection("EPSG:4326");
var    projection900913 = new OpenLayers.Projection("EPSG:900913");

var popup = null;

var markerType ='イベント';
var dataStore ='tmpMarkers';
var checkDataStore='';


var mode = 0;
var markerUpdateTimer;
var meMarker;

var mode = 0;
var markerUpdateTimer;
var meMarker;

ons.ready(function(){
    console.log('Onsen UI is ready!');
});

//OpenLayers.Control.Crosshairs のクラスを設定
OpenLayers.Control.Crosshairs = OpenLayers.Class(OpenLayers.Control, {
  imgUrl: null,
  size: null,
  position: null,
  initialize: function(options) {
    OpenLayers.Control.prototype.initialize.apply(this, arguments);
  },
  draw: function() {
    OpenLayers.Control.prototype.draw.apply(this, arguments);
    var px = this.position.clone();
    var centered = new OpenLayers.Pixel(Math.round(px.x - (this.size.w / 2)), Math.round(px.y - (this.size.h / 2)));
    this.buttons = new Array();
    this.div = OpenLayers.Util.createAlphaImageDiv(
        OpenLayers.Util.createUniqueID("OpenLayers.Control.Crosshairs_"), 
        centered, 
        this.size, 
        this.imgUrl, 
        "absolute");
    return this.div;
  },
  setPosition: function(position) {
    this.position = position;
    var px = this.position.clone();
    var centered = new OpenLayers.Pixel(Math.round(px.x - (this.size.w / 2)), Math.round(px.y - (this.size.h / 2)));
    this.div.style.left = centered.x + "px";
    this.div.style.top = centered.y + "px";
  },
  CLASS_NAME: "OpenLayers.Control.Crosshairs"
});

//OSMの描画
function writemap(lat,lon) {
    map = new OpenLayers.Map("canvas");
    var mapnik = new OpenLayers.Layer.OSM();
    map.addLayer(mapnik);
        
    var cross = new OpenLayers.Control.Crosshairs( {
        imgUrl: "img/crosshair.png",
        size: new OpenLayers.Size( 32, 32 ),
        position: new OpenLayers.Pixel(
          map.getCurrentSize().w / 2,
          map.getCurrentSize().h / 2 )
    } );
    map.addControl(cross);

    console.log(lat+":"+lon+":");
    //名取の表示
    var lonLat = new OpenLayers.LonLat(140.882877,38.172748)  
        .transform(
            projection4326, 
            projection900913
        );
    map.setCenter(lonLat, 15);
    
    //現在地のマーカー
    meMarker = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(meMarker);

}

function startTracking(){
    var watchId = navigator.geolocation.watchPosition( successWatch , onGeoError , geoOption2) ;
}

function successWatch(position){
    //現在地にマーカーを表示
    //console.log(position.coords.latitude+":"+position.coords.longitude);
    var iconsize = new OpenLayers.Size(16, 16);
    var point    = new OpenLayers.Pixel(-(iconsize.w/2), -iconsize.h/2);
    var icon = selectIcon('現在地');
    var marker = new OpenLayers.Marker(
        new OpenLayers.LonLat(position.coords.longitude,position.coords.latitude)
                    .transform(projection4326,projection900913),
        new OpenLayers.Icon(icon, iconsize, point)
    );
    meMarker.destroy();
    
    if(mode != 0){
        //console.log(position.coords.latitude+":"+position.coords.longitude);
        meMarker = new OpenLayers.Layer.Markers("Markers");
        map.addLayer(meMarker);
        meMarker.addMarker(marker);
    }
    
    if(mode == 2) {
        var lonLat = new OpenLayers.LonLat(
            position.coords.longitude,
            position.coords.latitude ).transform(
              new OpenLayers.Projection("EPSG:4326"),
              map.getProjectionObject() );
          map.setCenter(lonLat);
    }
}

function stopTracking(){
    // 位置情報の追跡を中止する
    navigator.geolocation.clearWatch( watchId ) ;
}


}

function startTracking(){
    var watchId = navigator.geolocation.watchPosition( successWatch , onGeoError , geoOption2) ;
}

function successWatch(position){
    //現在地にマーカーを表示
    //console.log(position.coords.latitude+":"+position.coords.longitude);
    var iconsize = new OpenLayers.Size(16, 16);
    var point    = new OpenLayers.Pixel(-(iconsize.w/2), -iconsize.h/2);
    var icon = selectIcon('現在地');
    var marker = new OpenLayers.Marker(
        new OpenLayers.LonLat(position.coords.longitude,position.coords.latitude)
                    .transform(projection4326,projection900913),
        new OpenLayers.Icon(icon, iconsize, point)
    );
    meMarker.destroy();
    
    if(mode != 0){
        //console.log(position.coords.latitude+":"+position.coords.longitude);
        meMarker = new OpenLayers.Layer.Markers("Markers");
        map.addLayer(meMarker);
        meMarker.addMarker(marker);
    }
    
    if(mode == 2) {
        var lonLat = new OpenLayers.LonLat(
            position.coords.longitude,
            position.coords.latitude ).transform(
              new OpenLayers.Projection("EPSG:4326"),
              map.getProjectionObject() );
          map.setCenter(lonLat);
    }
}

function stopTracking(){
    // 位置情報の追跡を中止する
    navigator.geolocation.clearWatch( watchId ) ;
}


function startDrawCurrentPosition() {
    navigator.geolocation.getCurrentPosition(onInitGeoSuccess, onGeoError, geoOption);
}

//OSMの描画時に位置情報取得に成功した場合のコールバック
function onInitGeoSuccess(position){
    writemap(position.coords.longitude,position.coords.latitude);        
    startTracking();
};


//OSMの描画時に位置情報取得に成功した場合のコールバック
function onGeoSuccess(position){
    current = new CurrentPoint();    
    current.geopoint = position.coords; //位置情報を保存する
    writemap(current.geopoint.longitude,current.geopoint.latitude);
};

//位置情報取得に失敗した場合のコールバック
function onGeoError(error){
    console.log("現在位置を取得できませんでした");
      switch(error.code) {
        case 1: //PERMISSION_DENIED
          alert("位置情報の利用が許可されていません");
          break;
        case 2: //POSITION_UNAVAILABLE
          alert("現在位置が取得できませんでした");
          break;
        case 3: //TIMEOUT
          alert("タイムアウトになりました");
          break;
        default:
          alert("その他のエラー(エラーコード:"+error.code+")");
          break;
      }
};


//位置情報取得時に設定するオプション
var geoOption = {
    timeout: 6000
};


var geoOption2 = {
    "enableHighAccuracy": true ,
    "timeout": 1000000 ,
	"maximumAge": 0 ,
} ;


//現在地を保持するクラスを作成
function CurrentPoint(){
    geopoint=null;  //端末の位置情報を保持する
}

//現在地に移動する
function current_geopoint(){
    navigator.geolocation.getCurrentPosition(onCurrentSuccess, onGeoError, geoOption);
     console.log("current_geopoint");
}
//現在値の位置情報取得に成功した場合のコールバック
function onCurrentSuccess(position){
    current = new CurrentPoint();    
    current.geopoint = position.coords; //位置情報を保存する
    map.setCenter(new OpenLayers.LonLat(current.geopoint.longitude, current.geopoint.latitude)
    .transform(projection4326,projection900913));
};

//中心地をポイントとして登録する
/* function save_geopoint(){
    //alert("save_geopoint");
    var lonLat = map.getCenter().transform(projection900913,projection4326);
    lonLat.lat = Math.round(lonLat.lat*1000000)/1000000;
    lonLat.lon = Math.round(lonLat.lon*1000000)/1000000;
    //alert(lonLat.lon+","+lonLat.lat);
    
    navigator.notification.prompt(
        'マーカーの種類を入力してください（観光、イベント、クーポン、避難所）',  // メッセージ
        onPrompt1,                  // 呼び出すコールバック
        'マーカー種類の登録',            // タイトル
        ['登録','やめる'],             // ボタンのラベル名
        markerType                 // デフォルトのテキスト
    );

    function onPrompt1(results) {
        if(results.buttonIndex != 1)  return;
        markerType = results.input1;

        navigator.notification.prompt(
                'マーカーの名前を入力してください',  // メッセージ
                onPrompt,                  // 呼び出すコールバック
                'マーカー名の登録',            // タイトル
                ['登録','やめる'],             // ボタンのラベル名
                'マーカー名'                 // デフォルトのテキスト
            );
    
        function onPrompt(results) {
            if(results.buttonIndex != 1)  return;
            var geoPoint = new ncmb.GeoPoint(lonLat.lat, lonLat.lon);
            var Places = ncmb.DataStore(dataStore);
            var point = new Places();
            point.set("name",results.input1);
            point.set("geo", geoPoint);
            point.set("type", markerType);

            var info = {};
            info.img="noimage.png";
            info.title="No title";
            info.detail="No detail";
            //動作確認
            //info.title="熊野本宮社    （くまのほんぐうしゃ）";
            //info.detail="全国で唯一、熊野三山からそれぞれ分霊された名取熊野三社のひとつです。別名、本宮十二神とも称されており、祭神は家津御子神(けつみこのかみ)という作物の神です。現在地には万治元年(1658年)に遷宮し、以前は現在地より 500mほど離れた小館と称する山上に鎮座していたと伝えられています。現在では500年前に山伏から伝えられたという、 市指定無形民俗文化財である『熊野十二神鹿踊』は、踊り手は世襲制で引き継がれています。他にも、現在は行われていませんが、下増田の北釜へ神輿を運ぶ「お浜下り」や「流鏑馬」 なども伝えられていました。";
            //info.img="kumano.jpg";

            point.set("img",info.img);
            point.set("title",info.title);
            point.set("detail",info.detail);

            point.save()
            .then(function(){
                console.log(lonLat.lat + ":" + lonLat.lon);

                var markers = new OpenLayers.Layer.Markers("Markers");
                map.addLayer(markers);

                var iconsize = new OpenLayers.Size(32, 32);
                var point    = new OpenLayers.Pixel(-(iconsize.w/2), -iconsize.h);
                //マーカータイプでアイコンを変更
                //todo アイコンの画像を用意する
                var icon = selectIcon(markerType);
                var marker = new OpenLayers.Marker(
                new OpenLayers.LonLat(lonLat.lon,lonLat.lat)
                    .transform(projection4326,projection900913),
                new OpenLayers.Icon(icon, iconsize, point)
                );
                //マーカー名と詳細ボタンをポップアップで表示
                marker.tag = results.input1;
                marker.tag += '<button onclick="onClickInfo('+"'"+info.title+"','"+info.detail+"','"+info.img+"'"+')">詳しく</button>';
                
                // マーカーをタップした際にポップアップを表示
                marker.events.register("touchstart", marker, function(event) {
                 // すでに別なポップアップが開いていたら消す
                 if (popup) map.removePopup(popup);
                 // ポップアップを作成
                 popup = new OpenLayers.Popup("chicken",
                 event.object.lonlat,
                 new OpenLayers.Size(100,50),
                 event.object.tag,
                 true);
                 
                 // 作成したポップアップを地図に追加
                 map.addPopup(popup);
                 });

                markers.addMarker(marker);
                console.log("save_geopoint");
            })
            .catch(function(err){// エラー処理
            });
        };
    }
} */

//登録されたポイントを引き出し地図上に表示する
function find_geopoint(){
    var lonLat = map.getCenter().transform(projection900913,projection4326);
    lonLat.lat = Math.round(lonLat.lat*1000000)/1000000;
    lonLat.lon = Math.round(lonLat.lon*1000000)/1000000;
        var geoPoint = new ncmb.GeoPoint(lonLat.lat, lonLat.lon);
        console.log("findpoints:"+lonLat.lat + ":" + lonLat.lon);
        onPrompt();
    /*    navigator.notification.prompt(
        '',  // メッセージ
        onPrompt,                  // 呼び出すコールバック
        'チェックするデータストアの設定',            // タイトル
        ['設定','やめる'],             // ボタンのラベル名
        checkDataStore                 // デフォルトのテキスト
    );  */
  
    function onPrompt(results) {
      
      //  if(results.buttonIndex != 1)  return;
      //  checkDataStore = results.input1;
        
        var PlacePointsClass = ncmb.DataStore(checkDataStore);
        //ニフティクラウド mobile backendにアクセスして検索開始位置を指定
        PlacePointsClass.withinKilometers("geo", geoPoint, 5)
            .fetchAll()
            .then(function(results){
                var data = [];
                if(results.length) {
                    // すでに別なポップアップが開いていたら消します
                    if (popup) map.removePopup(popup);
                }
                
                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    var markers = new OpenLayers.Layer.Markers("Markers");
                    map.addLayer(markers);
                    var regist_location = result.get("geo");
                    var regist_name = result.get("name");
                    var regist_type = result.get("type");
                    
                    var regist_info = {};
                    regist_info.title = result.get("title");
                    regist_info.detail = result.get("detail");
                    regist_info.img = result.get("img");
                    
                    var iconsize = new OpenLayers.Size(32, 32);
                    var point    = new OpenLayers.Pixel(-(iconsize.w/2), -iconsize.h);
                    var icon = selectIcon(regist_type);
                    var marker = new OpenLayers.Marker(
                        new OpenLayers.LonLat(regist_location.longitude,regist_location.latitude)
                                    .transform(projection4326,projection900913),
                        new OpenLayers.Icon(icon, iconsize, point)
                    );
                    
                    //マーカー名と詳細ボタンをポップアップで表示
                    marker.tag = regist_name;
                    marker.tag += '<button onclick="onClickInfo('+"'"+regist_info.title+"','"+regist_info.detail+"','"+regist_info.img+"'"+')">詳しく</button>';
    
                    // マーカーをタップした際にポップアップを表示
                    marker.events.register("touchstart", marker, function(event) {
                     // すでに別なポップアップが開いていたら消す
                     if (popup) map.removePopup(popup);
                     // ポップアップを作成
                     popup = new OpenLayers.Popup("chicken",
                     event.object.lonlat,
                     new OpenLayers.Size(100,50),
                     event.object.tag,
                     true);
                     // 作成したポップアップを地図に追加
                     map.addPopup(popup);
                     });
    
                    markers.addMarker(marker);
                }
            });
       } ;
    
    };

function selectIcon(type) {
    //マーカータイプでアイコンを変更
    var icon = 'img/point_na32.png';
    switch(type){
        case 'イベント':    icon = 'img/marker_ibe32.png'; break;
        case '観光':        icon = 'img/marker_kan32.png'; break;
        case 'クーポン':    icon = 'img/marker_cuu32.png'; break;
        case '避難所':      icon = 'img/marker_hin32.png'; break;
        case '現在地':      icon = 'img/me2.png'; break;
        case '矢':           icon = 'img/arrow.png'; break;
    }
    return icon;
}


//チェックボックス
function Checkbox(){
 var flag = false; // 選択されているか否かを判定する変数
   // チェックボックスの数だけ判定を繰り返す
    fn.load('map.html'); //再読み込み        
     
    for(var i=0; i<document.chbox.elements.length-1;i++){
        // i番目のチェックボックスがチェックされているかを判定
        if(document.chbox.elements[i].checked){
        flag = true;
            if(document.chbox.elements[i].value=="イベント"){
                checkDataStore='Marker_Event';
                }
            else if(document.chbox.elements[i].value=="観光"){
                checkDataStore='Marker_Kanko';
                }
            else if(document.chbox.elements[i].value=="クーポン"){
                checkDataStore='Marker_Coupon';
                }
            else if(document.chbox.elements[i].value=="避難所"){
                checkDataStore='Marker_Hinan';
                }
                find_geopoint();
        }
    }
}

function search(){
    list=new Array;
list[0]="apple";
list[1]="orange";
    for(i=0;i<list.length;i++){
document.write("<option value="+list[i]+">"+list[i]+"</option>");
}
 
}


//探索
function tracking() {
    switch(mode){
        case 0: //現在地を非表示
            mode = 1;  
            tracking_mode.innerHTML = '現在地を表示';
            break; 
    
        case 1: //現在地を表示
            watch = navigator.compass.watchHeading(
              function (heading) {
                $("#compass")
                  .css("transform", "rotate(" + heading.magneticHeading + "deg)");
                   //console.log('Orientation: ' + heading.magneticHeading);
              },
              function (err) {
                //console.log('watchHeading:'+err.message);
              },
              {frequency: 1000}
            );
            mode = 2;
            tracking_mode.innerHTML = '現在地を中心に表示';
            break;
            
        case 2: //現在地を中心に表示
            navigator.compass.clearWatch(watch);
            mode = 0;
            $("#compass")
                  .css("transform", "rotate(0deg)");
            tracking_mode.innerHTML = '現在地を非表示';
            break;
    }
}
    
    function refresh() {
      navigator.geolocation.getCurrentPosition(
        function(pos) {
          lonLat = new OpenLayers.LonLat(
            pos.coords.longitude,
            pos.coords.latitude ).transform(
              new OpenLayers.Projection("EPSG:4326"),
              map.getProjectionObject() );
          map.setCenter(lonLat);
//        showMsg('getCurrentPosition',
//          pos.coords.longitude + ', ' +  pos.coords.latitude);
        },
        function(err) {
          console.log('getCurrentPosition:'+err.message);
        },
        {maximumAge: 10000, timeout: 5000, enableHighAccuracy: true}
      );
    }


