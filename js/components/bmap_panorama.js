/**
 * 百度地图实景图
 * @author ydx
 * @date 2019-03-24
 */
Config.BMap_Panorama = {
	GetPanoramaImgs: function(location, successCallBack, errorCallBack) {
		var param = {
			url: Config.panoramaImgUrl,
			data: {
				ak: Config.baidu_key,
				width: 512,
				height: 256,
				location: location,
				fov: 180, //水平方向范围，范围[10,360]，fov=360即可显示整幅全景图
			},
		};
		var xhr = new XMLHttpRequest();

		xhr.open('GET', param.url + Config.Util.getParamsString(param.data));
		xhr.responseType = 'blob';

		xhr.onload = function() {
			if (this.status == 200) {
				var blob = this.response;
				var img = document.createElement('img');
				img.onload = function(e) {
					window.URL.revokeObjectURL(img.src);
				};
				img.src = window.URL.createObjectURL(blob);
				successCallBack(img);
			}
		};

		xhr.onerror = function(error) {
			errorCallBack(error);
		};

		xhr.send();
	},
	/**
	 * 街景页
	 * @param {*} pageUrl 跳转页面
	 * @param {*} param 参数
	 */
	GetPanoramaPage: function(pageUrl, param) {
		if (!pageUrl && !param) return;
		pageUrl += Config.Util.getParamsString(param);
		window.open(pageUrl);
	},
};
