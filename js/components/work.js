/**
 * 业务
 */
var walkingroute;
var punchpoint = new Array();
var waterstation = new Array();
var startendlocation = new Array();
var toiletpoint = new Array();
var parkingPoints = new Array();
var intersectionlocation = new Array();
var reminds = new Array();
var currentpointimg;
map.on('load', function() {
	/* Config.Data.getData(
		{
			url: Config.dataUrl,
		},
		function(result) {
			var roadNodeArray = [];
			for (let index = 0; index < result.length; index++) {
				const json = result[index];
				var lineNodes = [];
				json['nodes'].forEach(obj => {
					var point = obj['p'].split(',');
					var gci02Point = coordtransform.bd09togcj02(+point[0], +point[1]);
					var wgs84Point = coordtransform.gcj02towgs84(gci02Point[0], gci02Point[1]);
					roadNodeArray.push([+wgs84Point[0], +wgs84Point[1]]);
				});
			}
		},
		function(error) {
			console.error(error);
		}
    ); */

	Config.Data.getData(
		{
			url: 'data/EggWalkathon2019.json',
		},
		function(json) {
			var data = json.features;
			for (var i = 0; i < data.length; i++) {
				if (data[i].geometry.type == 'LineString') {
					walkingroute = data[i];
				} else {
					if (data[i].properties.type_id == 0) {
						startendlocation.push(data[i]);
					} else if (data[i].properties.type_id == 1) {
						punchpoint.push(data[i]);
					} else if (data[i].properties.type_id == 2) {
						waterstation.push(data[i]);
					} else if (data[i].properties.type_id == 3) {
						parkingPoints.push(data[i]);
					} else if (data[i].properties.type_id == 4) {
						toiletpoint.push(data[i]);
					} else if (data[i].properties.type_id == 5) {
						intersectionlocation.push(data[i]);
					} else if (data[i].properties.type_id == 6) {
						reminds.push(data[i]);
					}
				}
			}
			isReady++;
			if (isReady == 2) mapMe(ll, 0);
			map.addSource('mapSource', {
				type: 'geojson',
				data: json,
			});
			map.addLayer({
				id: 'route',
				type: 'line',
				source: 'mapSource',
				layout: {
					'line-join': 'round',
					'line-cap': 'round',
				},
				paint: {
					'line-color': '#3260d6',
					'line-width': 8,
				},
			});
			map.loadImage('resources/selfLocation.png', function(error, image) {
				if (error) throw error;
				map.addImage('selfLocation', image);
			});
			map.loadImage('resources/water.png', function(error, image) {
				if (error) throw error;
				map.addImage('water', image);
				map.addLayer({
					id: 'waters',
					type: 'symbol',
					source: 'mapSource',
					layout: {
						'icon-image': '{icon}',
						'text-field': '{title}',
						'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
						'text-offset': [0, 1.0],
						'text-anchor': 'top',
						'icon-allow-overlap': true,
					},
					filter: ['==', 'type_id', 2],
				});

				layerClick('waters');
			});
			map.loadImage('resources/toilet.png', function(error, image) {
				if (error) throw error;
				map.addImage('toilet', image);
				map.addLayer({
					id: 'toilets',
					type: 'symbol',
					source: 'mapSource',
					layout: {
						'icon-image': '{icon}',
						'text-field': '{title}',
						'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
						'text-offset': [0, 1.0],
						'text-anchor': 'top',
						'icon-allow-overlap': false,
					},
					filter: ['==', 'type_id', 4],
				});

				layerClick('toilets');
			});
			map.loadImage('resources/parking.png', function(error, image) {
				if (error) throw error;
				map.addImage('parking', image);
				map.addLayer({
					id: 'parkings',
					type: 'symbol',
					source: 'mapSource',
					layout: {
						'icon-image': '{icon}',
						'text-field': '{title}',
						'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
						'text-offset': [0, 1.0],
						'text-anchor': 'top',
						'icon-allow-overlap': false,
					},
					filter: ['==', 'type_id', 3],
				});
				layerClick('parkings');
			});
			map.loadImage('resources/location.png', function(error, image) {
				if (error) throw error;
				map.addImage('location', image);
				map.addLayer({
					id: 'PunchingPoints',
					type: 'symbol',
					source: 'mapSource',
					layout: {
						'icon-image': '{icon}',
						'text-field': '{title}',
						'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
						'text-offset': [0, 1.0],
						'text-anchor': 'top',
						'icon-allow-overlap': true,
					},
					filter: ['==', 'type_id', 1],
				});
				//实景图 ydx 2019-03-24
				map.on('click', 'PunchingPoints', function(evt) {
					var lngLat = evt.lngLat,
						properties = evt.features[0]['properties'];
					Config.BMap_Panorama.GetPanoramaImgs(
						lngLat['lng'] + ',' + lngLat['lat'],
						function(img) {
							var content = '<div><h1>' + properties['title'] + '</h1><div id="imgDiv"></div></div>';
							var popup = getPopupFuncs(lngLat, content);
							if (popup) {
								$('#imgDiv').html(img);
							}
						},
						function(error) {}
					);
				});
			});
			map.loadImage('resources/endpoint.png', function(error, image) {
				if (error) throw error;
				map.addImage('endpoint', image);
				map.addLayer({
					id: 'endpoints',
					type: 'symbol',
					source: 'mapSource',
					layout: {
						'icon-image': '{icon}',
						'text-field': '{title}',
						'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
						'text-offset': [0, 1.0],
						'text-anchor': 'top',
						'icon-allow-overlap': true,
					},
					filter: ['==', 'type_id', 0],
				});
				//终点 ydx 2019-03-24
				layerClick('endpoints');
			});
		},
		function(error) {
			console.error(error);
		}
	);
});

/**
 * 获取弹框
 * @param {*} lngLat
 * @param {*} content 内容
 * @author ydx
 */
function getPopupFuncs(lngLat, content) {
	var markerHeight = 50,
		markerRadius = 10,
		linearOffset = 25;
	var popupOffsets = {
		top: [0, 0],
		'top-left': [0, 0],
		'top-right': [0, 0],
		bottom: [0, -markerHeight],
		'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
		'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
		left: [markerRadius, (markerHeight - markerRadius) * -1],
		right: [-markerRadius, (markerHeight - markerRadius) * -1],
	};
	var popup = new mapboxgl.Popup({ offset: popupOffsets, className: 'my-class' })
		.setLngLat(lngLat)
		.setHTML(content)
		.addTo(map);
	return popup;
}

function drawMyLocation(location) {
	var currentpoint = turf.point(location);
	if (map.getSource('currentpoint') != null) map.getSource('currentpoint').setData(currentpoint);
	else {
		map.addSource('currentpoint', {
			type: 'geojson',
			data: currentpoint,
		});
	}
	if (currentpointimg == null) {
		map.loadImage('resources/selfLocation.png', function(error, image) {
			if (error) throw error;
			currentpointimg = image;
			map.addImage('locationicon', currentpointimg);
			map.addLayer({
				id: 'currentpointlayer',
				type: 'symbol',
				source: 'currentpoint',
				layout: {
					'icon-image': 'locationicon',
					'icon-size': 1,
					'icon-allow-overlap': false,
					visibility: 'visible',
				},
			});
		});
	} else {
		if (map.getLayer('currentpointlayer') == null) {
			map.addLayer({
				id: 'currentpointlayer',
				type: 'symbol',
				source: 'currentpoint',
				layout: {
					'icon-image': 'locationicon',
					'icon-size': 1,
					'icon-allow-overlap': false,
					visibility: 'visible',
				},
			});
		}
	}
	layerClick('currentpointlayer');
}

/**
 * 图层点击
 * @param {*} layerId 图层id
 * @author ydx
 * @date 2019-03-24
 */
function layerClick(layerId) {
	map.on('click', layerId, function(evt) {
		var lngLat = evt.lngLat,
			properties = evt.features[0]['properties'];
		var content = '<div><h1>' + properties['title'] + '</h1></div>';
		var popup = getPopupFuncs(lngLat, content);
	});
}

function mapMe(location, speed) {
	drawMyLocation(location);
	var mapbounds = map.getBounds();
	if (
		location[0] <= mapbounds._sw.lng ||
		location[0] >= mapbounds._ne.lng ||
		location[1] <= mapbounds._sw.lat ||
		location[1] >= mapbounds._ne.lat
	) {
		map.easeTo({
			center: location,
		});
	}
	calculateDis(location, speed);
	isReady = 0;
}

function calculateDis(location, speed) {
	var distanceresult1 = ''; //偏离路线提醒
	var distanceresult11 = ''; //接近厕所提醒
	var distanceresult14 = ''; //水站提醒
	var distanceresult12 = ''; //接近卡点提醒
	var distanceresult13 = ''; //危险提醒
	var distanceresult2 = ''; //距离下个卡站距离
	var distanceresult3 = ''; //距离下个水站距离
	var distanceresult4 = ''; //距离终点距离
	var pt = {
		type: 'Feature',
		properties: {},
		geometry: {
			type: 'Point',
			coordinates: location,
		},
	};
	var distance = (turf.pointToLineDistance(pt, walkingroute, { units: 'kilometers' }) * 1000).toFixed(0);
	var nearestPoint = turf.nearestPointOnLine(walkingroute, pt, { units: 'kilometers' });
	if (distance > 30) {
		distanceresult1 += '您已偏移路线，当前偏移距离: ' + distance + ' m；';
		var deviationline = turf.lineString([location, nearestPoint.geometry.coordinates]);
		if (map.getSource('deviationline') != null) map.getSource('deviationline').setData(deviationline);
		else {
			map.addSource('deviationline', {
				type: 'geojson',
				data: deviationline,
			});
		}
		if (map.getLayer('deviationlinelayer') == null) {
			map.addLayer({
				id: 'deviationlinelayer',
				type: 'line',
				source: 'deviationline',
				layout: {
					visibility: 'visible',
					'line-cap': 'butt',
				},
				paint: {
					'line-width': 3,
					'line-color': '#FF0000',
					'line-opacity': 0.2,
					'line-dasharray': [1, 1],
				},
			});
		}
	}
	var from = turf.point(location);
	//危险提醒
	for (var j = 0; j < intersectionlocation.length; j++) {
		var to = intersectionlocation[j];
		var options = { units: 'kilometers' };
		var dis = turf.distance(from, to, options);
		if (dis * 1000 < 30) {
			distanceresult11 += '安全提示：' + intersectionlocation[j].properties.title + '；';
			break;
		}
	}
	//打卡点
	for (var j = 0; j < punchpoint.length; j++) {
		var to = punchpoint[j];
		var options = { units: 'kilometers' };
		var dis = turf.distance(from, to, options);
		if (dis * 1000 < 100) {
			distanceresult12 += '接近' + punchpoint[j].properties.title + '；';
			break;
		}
	}
	//水站
	for (var j = 0; j < waterstation.length; j++) {
		var to = waterstation[j];
		var options = { units: 'kilometers' };
		var dis = turf.distance(from, to, options);
		if (dis * 1000 < 100) {
			distanceresult12 += '接近' + waterstation[j].properties.title + '；';
			break;
		}
	}
	//厕所
	for (var j = 0; j < toiletpoint.length; j++) {
		var to = toiletpoint[j];
		var options = { units: 'kilometers' };
		var dis = turf.distance(from, to, options);
		if (dis * 1000 < 100) {
			distanceresult11 += '接近' + toiletpoint[j].properties.title + '；';
			break;
		}
	}
	//距离水站距离
	var result2;
	for (var i = 0; i < waterstation.length; i++) {
		var sliced = turf.lineSlice(from, waterstation[i], walkingroute);
		var tmp = turf.length(sliced, { unit: 'kilometers' });
		if (result2 == null) {
			result2 = tmp;
			continue;
		}
		result2 = result2 < tmp ? result2 : tmp;
	}
	//toast提示
	for (var j = 0; j < reminds.length; j++) {
		var to = reminds[j];
		var options = { units: 'kilometers' };
		var dis = turf.distance(from, to, options);
		if (dis * 1000 < 50) {
			var title = reminds[j].properties.title;
			var subtitle = reminds[j].properties.subtitle;
			addToast(title, subtitle);
			break;
		}
	}
	var thedis2 = '';
	if (distance > 30) {
		result2 += distance / 1000;
	}
	if (result2 < 1) {
		result2 *= 1000;
		result2 = result2.toFixed(0);
		thedis2 = result2 + 'm';
	} else {
		result2 = result2.toFixed(2);
		thedis2 = result2 + 'km';
	}
	distanceresult3 += '距最近的水站: ' + thedis2 + '；';
	//距离打卡点距离
	var result3;
	for (var i = 0; i < punchpoint.length; i++) {
		var sliced = turf.lineSlice(from, punchpoint[i], walkingroute);
		var tmp = turf.length(sliced, { unit: 'kilometers' });
		if (result3 == null) {
			result3 = tmp;
			continue;
		}
		result3 = result3 < tmp ? result3 : tmp;
	}
	var thedis3 = '';
	if (distance > 30) {
		result3 += distance / 1000;
	}
	if (result3 < 1) {
		result3 *= 1000;
		result3 = result3.toFixed(0);
		thedis3 = result3 + 'm';
	} else {
		result3 = result3.toFixed(2);
		thedis3 = result3 + 'km';
	}
	distanceresult2 += '距最近的打卡点: ' + thedis3 + '；';
	var ep = startendlocation[1];
	var sliced = turf.lineSlice(from, ep, walkingroute);
	var result4 = turf.length(sliced, { unit: 'kilometers' });
	if (distance > 30) {
		result4 += distance / 1000;
	}
	var thedis4 = '';
	if (result4 < 1) {
		result4 *= 1000;
		result4 = result4.toFixed(0);
		thedis4 = result4 + 'm';
	} else {
		result4 = result4.toFixed(2);
		thedis4 = result4 + 'km';
	}
	distanceresult4 += '距离终点还有: ' + thedis4 + '；';
	var result1 = '';
	if (distanceresult1.length > 0) {
		result1 = distanceresult1;
	} else {
		if (distanceresult13.length > 0) {
			result1 = distanceresult13;
		} else if (distanceresult12.length > 0) {
			result1 = distanceresult12;
		} else if (distanceresult14.length > 0) {
			result1 = distanceresult14;
		} else if (distanceresult11.length > 0) {
			result1 = distanceresult11;
		}
	}
	var bottominfo = document.getElementById('bottominfo');
	var hhh =
		(result1.length > 0 ? 18 : 0) +
		(distanceresult2.length > 0 ? 18 : 0) +
		(distanceresult3.length > 0 ? 18 : 0) +
		(distanceresult4.length > 0 ? 18 : 0) +
		2;
	bottominfo.style.height = hhh + 'px';
	bottominfo.innerHTML =
		'<div>' +
		result1 +
		'</div>' +
		'<div>' +
		distanceresult2 +
		'</div>' +
		'<div>' +
		distanceresult3 +
		'</div>' +
		'<div>' +
		distanceresult4 +
		'</div>';
}

function addToast(title, subtitle) {
	$.Toast(title, subtitle, 'notice', {
		stack: true,
		has_icon: true,
		has_close_btn: true,
		fullscreen: true,
		timeout: 3500,
		sticky: false,
		has_progress: true,
		rtl: false,
	});
}
