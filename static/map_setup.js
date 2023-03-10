// グローバル変数
var map;
// 機体マーカー
var markerHandle;

function map_init() {
    //地図を表示するdiv要素のidを設定
    map = L.map('mapcontainer', {zoomControl:false});
    //地図の中心とズームレベルを指定
    map.setView([35.40, 136], 5);      
    //表示するタイルレイヤのURLとAttributionコントロールの記述を設定して、地図に追加する
    var gsi = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', 
        {attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"})
    var gsiphoto = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg',
    {minZoom:2,maxZoom:18,attribution: "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>地理院タイル</a>"});
    var gsipale = L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
    {attribution: "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>地理院タイル</a>"});
    //オープンストリートマップのタイル
    var osm = L.tileLayer('http://tile.openstreetmap.jp/{z}/{x}/{y}.png',
    {  attribution: "<a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors" });
    //baseMapsオブジェクトのプロパティに3つのタイルを設定
    var baseMaps = {
        '地理院地図' : gsi,
        '地理院写真' : gsiphoto,
        '淡色地図' : gsipale,
        'OSM' : osm
    };
    // layers コントロールにbaseMapsおｂジェクトを設定して地図に追加
    // コントロール内にプロパティがでる
    L.control.layers(baseMaps).addTo(map);
    // とりあえずデフォルト
    gsi.addTo(map);
    //スケールコントロールを最大幅200px,右下、単位ｍで地図に追加
    L.control.scale({ maxWidth: 200, position: 'bottomright', imperial: false }).addTo(map);
    //ズームコントロールを左下に
    L.control.zoom({ position: 'bottomleft'}).addTo(map);
    //最初から定義するマーカー
    // 座標を作る
    var mpoint = [35.8797, 140.3405];
    // センターとズームを移動
    map.setView(mpoint,15);
    // 仮にセット
        var uavmarker = L.icon({ iconUrl: './static/uavmarker2.png', iconRetinaUrl: './static/uavmarker2.png', 
    iconSize:[50,50], iconAnchor:[25,25], popupAnchor:[0,-50]});
    
    markerHandle = L.Marker.movingMarker([mpoint], [],
        { rotationAngle:0,
          rotationOrigin: 'center center',
          contextmenu: true,
          title:'uav',
          contextmenuItems: [{
            text: 'uav',
            index: 0
          },{
            separator: true,
            index: 1
          }]
        });
    markerHandle.bindPopup( buildPopmsg(mpoint, 0, 0) ); // pop up msg
    markerHandle.options.icon = uavmarker;
    markerHandle.addTo( map );

    // 地図上のclickイベントの設定
    map.on('click', onMapClick);
    
} // end of init()

function buildPopmsg([lat, lon], alt, ang){
    uavPopmsg = "緯度:" + lat + " 経度:" + lon + '<br/>';
    uavPopmsg = alt + "[m],"+ ang + '[deg]';
    return uavPopmsg
}
function onMapClick(e){
    //地図のクリックイベントハンドラー
    //クリック地点にマーカー追加、マーカーのclickイベントでonMarkerClick関数を設定
    var mk = L.marker(e.latlng).on('click',onMarkerClick).addTo(map);
    mk.bindPopup(e.latlng.toString()).openPopup();
    //        mk.bindPopup(on('click', onMarkerClick));
}
function onMarkerClick(e){
    // マーカーのclickイベントで呼ばれる
    // クリックされると削除
    map.removeLayer(e.target);
}

function onUAVMove(lat, lon, alt, ang){
    markerHandle.moveTo([lat,lon], 1000);
    markerHandle.setRotationAngle(ang);
    markerHandle.setPopupContent(buildPopmsg([lat, lon], alt, ang));

}