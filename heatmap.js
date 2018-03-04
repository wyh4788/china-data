var mapboxAccessToken = "pk.eyJ1Ijoid3loNDc4OCIsImEiOiJjamR6ZXQydWo1ZDE1MndwMGp0MGZjYnRpIn0.GP3Vl6aM8Tnu1SERkaa7Tg"
var map = L.map('map').setView(new L.LatLng(40, 104.5), 4);
var geojson;
var description = document.getElementById('map').getAttribute('value');

var info = L.control();

var map_scale = {
	"no_gender": [0.1, 0.2, 0.35, 0.85, 1.5, 2.3, 7.0, 20.0],
	"gender": [1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7],
}

info.onAdd = function(map) {
	this._div = L.DomUtil.create("div", "info");
	this.update();
	return this._div;
};

info.update = function(props) {
	this._div.innerHTML =
		"<h4>" + description +"</h4>" +
		(props
			? "<b>" +
				props.name +
				"</b><br />" +
				props.density +
				""
			: "Hover over a province");
};

info.addTo(map);


L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
	id: 'mapbox.light',
	attribution: 'OSM'
}).addTo(map);

function getColor(d) {
	var scale = [];
	if (description == "China Immigration-Emigration Ratio"){
		scale = map_scale['no_gender'];
	}
	else {
		scale = map_scale['gender'];
	}

	return d > scale[6] ? '#800026' :
				 d > scale[5]  ? '#BD0026' :
				 d > scale[4]  ? '#E31A1C' :
				 d > scale[3]  ? '#FC4E2A' :
				 d > scale[2]   ? '#FD8D3C' :
				 d > scale[1]   ? '#FEB24C' :
				 d > scale[0]   ? '#FED976' :
										'#FFEDA0';
}

function style(feature) {
		return {
				fillColor: getColor(feature.properties.density),
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7
		};
}

function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			weight: 5,
			color: "#666",
			dashArray: "",
			fillOpacity: 0.7
		});

		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}

		info.update(layer.feature.properties);
	}

	var geojson;

	function resetHighlight(e) {
		geojson.resetStyle(e.target);
		info.update();
	}

	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
	}

function onEachFeature(feature, layer) {
		layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
		});
}

geojson = L.geoJson(statesData, {
		style: style,
		onEachFeature: onEachFeature
}).addTo(map);

var legend = L.control({ position: "bottomright" });

legend.onAdd = function(map) {
	var temp_grade = [];
	if (description == "China Immigration-Emigration Ratio"){
		temp_grade = map_scale['no_gender'];
	}
	else {
		temp_grade = map_scale['gender'];
	}
	var div = L.DomUtil.create("div", "info legend"),
		grades = temp_grade,
		labels = [],
		from,
		to;

	for (var i = 0; i < grades.length; i++) {
		from = grades[i];
		to = grades[i + 1];

		labels.push(
			'<i style="background:' +
				getColor(from) +
				'"></i> ' +
				from +
				(to ? "&ndash;" + to : "+")
		);
	}

	div.innerHTML = labels.join("<br>");
	return div;
};

legend.addTo(map);
