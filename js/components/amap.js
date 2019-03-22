/**
 * 高德实时定位API请求
 */
var isReady = 0;
var ll;
mapObj = new AMap.Map('iCenter');
mapObj.plugin('AMap.Geolocation', function() {
	geolocation = new AMap.Geolocation({
		enableHighAccuracy: true,
		timeout: 10000,
		maximumAge: 0,
		convert: true,
	});
	getMyPostion();
	var timer = setInterval(getMyPostion, 20000);

	function getMyPostion() {
		geolocation.getCurrentPosition();
	}
	AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
	AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
	function onComplete(data) {
		var tmp = new Array(data.position.lng, data.position.lat);
		if (ll != null && ll[0] == tmp[0] && ll[1] == tmp[1]) return;
		ll = tmp;
		map.flyTo({
			center: [ll[0], ll[1]],
		});
		isReady++;
		if (isReady == 2) mapMe(ll, 0);
	}

	function onError(error) {
		console.error(error);
	}
});
