/**
 * ajax请求工具
 * @author ydx
 * @date 2019-03-21
 */
Config.Util = {
	ajaxGetRequest: function(param) {
		var pormise = Promise;
		if (jQuery) {
			var $deferred = new $.Deferred();
			$.ajax({
				type: 'GET',
				url: param.url,
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
		} else {
			var xhr = new XMLHttpRequest();

			xhr.open('GET', param.url);

			xhr.onload = function(result) {
				pormise.resolve(json);
			};

			xhr.onerror = function(error) {
				pormise.reject(error);
			};

			xhr.send();
		}
		return pormise;
	},
};
