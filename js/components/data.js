/**
 * 数据加载
 * @author ydx
 * @date 2019-03-21
 */
Config.Data = {
	getData: function(param, successCallback, errorCallback) {
		var data = null;
		Config.Util.ajaxGetRequest(param).then(
			function(result) {
				successCallback(result);
			},
			function(error) {
				errorCallback(error);
			}
		);
	},
};
