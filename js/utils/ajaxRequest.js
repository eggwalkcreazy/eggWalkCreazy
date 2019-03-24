/**
 * ajax请求工具
 * @author ydx
 * @date 2019-03-21
 */
Config.Util = {
	ajaxGetRequest: function(param, responseType) {
		var pormise = new Promise(function(resolve, reject) {});
		if (responseType) {
			var xhr = new XMLHttpRequest();

			xhr.open('GET', param.url + this.getParamsString(param.data));
			xhr.responseType = 'blob';

			xhr.onload = function() {
				pormise = new Promise(function(resolve, reject) {
					if (xhr.status == 200) {
						resolve(xhr.response);
					} else {
						reject(xhr.response);
					}
				});
				return pormise;
			};

			xhr.onerror = function(error) {
				// pormise.reject(error);
			};

			xhr.send();
		} else {
			if (jQuery) {
				var $deferred = new $.Deferred();
				$.ajax({
					type: 'GET',
					url: param.url,
					data: param.data,
					dataType: 'json',
					success: function(result) {
						$deferred.resolve(result);
					},
					error: function(error) {
						$deferred.reject(error);
					},
				});
				return $deferred;
			} else if (window.fetch) {
				fetch(param.url)
					.then(function(response) {
						return response.json;
					})
					.then(function(json) {
						pormise.resolve(json);
					})
					.catch(function(error) {
						pormise.reject(error);
					});
				return pormise;
			}
		}
	},

	getParamsString: function(param) {
		var paramsString = '?';
		for (var key in param) {
			if (param.hasOwnProperty(key)) {
				paramsString += key + '=' + param[key] + '&';
			}
		}
		return paramsString.substring(0, paramsString.lastIndexOf('&'));
	},
};
