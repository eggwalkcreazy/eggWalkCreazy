mapboxgl.accessToken = Config.accessToken;
// mapboxgl.config.API_URL = Config.API_URL;
const map = new mapboxgl.Map({
	container: 'map',
	style: Config.style,
	center: Config.mapCenter,
	zoom: Config.defaultLevel,
});
