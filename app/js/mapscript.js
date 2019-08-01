window.Face = {};
window.Utils = {
	searchDots: undefined,
	searchControl: undefined,
	searchInit: function(){
		var that = this;
		// Создадим экземпляр элемента управления «поиск по карте»
		// с установленной опцией провайдера данных для поиска по организациям.
		that.searchControl = new ymaps.control.SearchControl({
			options: {
				//float: 'right',
				//floatIndex: 100,
				noPlacemark: false,
				//noCentering: true,
				//noPopup: true,
				useMapBounds: true,
				visible: false,
				//kind: "route",
				checkZoomRange: true,
				//resultsPerPage: 20,
				//showFeedbackAfterResults: true,
				strictBounds: true,
				//boundedBy: circle.geometry.getBounds(),
				results: 50,
				provider: 'yandex#search'	
			}
		});
		

		that.currentMap.controls.add(that.searchControl);
	},

	drawPoligon: function(arr){
		window.mata = arr;
		console.log(arr);
		Face.areas = [];
		for (var i = 0; i < arr.length; i++) {
			var poligon = arr[i].data.items[0].displayGeometry.geometries[0].coordinates[0];
			//console.log(poligon[0].coordinates[0]);
			
			var myPolygon = new ymaps.Polygon([
					// Указываем координаты вершин многоугольника.
					poligon
				],
				// Описываем свойства геообъекта.
				{
					// Содержимое балуна.
					balloonContent: "Рыбные места"
				}, {
					// Описываем опции геообъекта.
					// Фоновое изображение.
					//fillImageHref: 'images/lake.png',
					// Тип заливки фоном.
					fillMethod: 'stretch',
					fillColor: "#cc2527",
					fillOpacity: "0.5",
					strokeColor: "#cc2527",
					strokeWidth: 3,
					// Убираем видимость обводки.
					stroke: true
				}
			);
			console.log(poligon);
			var item = {
				title: arr[i].data.items[0].title,
				description: arr[i].data.items[0].description,
				address: arr[i].data.items[0].address,
				coordinates: arr[i].data.items[0].coordinates,
				bounds: arr[i].data.items[0].bounds,
				poligon: myPolygon
			}
			Face.areas.push(item);
			Utils.currentMap.geoObjects.add(myPolygon);
			myPolygon.events.add("mouseenter", function(e, item){
				console.log(Face.areas[i]);
				console.log(e);
			})
		}
	},

	drawCircle: function(radius){
		// Создаем круг.
		var circle = new ymaps.Circle([
				// Координаты центра круга.
				mainLatLng,
				// Радиус круга в метрах.
				radius
			], {}, {
				fillColor: "#cc25271f",
				strokeColor: "#2121213d",
				strokeOpacity: 0.8,
				strokeWidth: 5
			});

		// Добавляем круг на карту.
		this.currentMap.geoObjects.add(circle);
		//circle.editor.startEditing();
		return circle;
	},

	dotsInCircle: function(dots, circle){

		var radiusStart = circle.geometry.getBounds()[0],
				radiusEnd = circle.geometry.getBounds()[1],
				dotLat, dotLng;

		console.log(dots);
		for (var i = 0; i < dots.length; i++) {
			dotLat = dots[i].geometry.getCoordinates()[0];
			dotLng = dots[i].geometry.getCoordinates()[1];
			dots[i].options.set({
				iconLayout: 'default#image',
				iconImageHref: "img/icons/marker-offices-2.png",
				iconImageSize: [29, 41]
			});
			if( dotLat > radiusStart[0] && dotLng > radiusStart[1] && dotLat < radiusEnd[0] && dotLng < radiusEnd[1]){
				dots[i].options.set('visible', true);
			}else{
				dots[i].options.set('visible', false);
			}
		}
	}


}

window.initBeside = function(mainLatLng) {
	console.log(mainLatLng);
	Utils.currentMap = new ymaps.Map('map-beside', {
		center: mainLatLng,
		zoom: 14,
		checkZoomRange: true,
		restrictMapArea: true,
		searchControlProvider: 'yandex#search',
		controls: []
	})

	Utils.searchInit();
	var circle = Utils.drawCircle(1000);
	// Фильтрация точек относительно радиуса
	$("[data-search-enty]").eq(0).trigger("click");
	

	Utils.searchControl.events.add("load", function(e){
		e.preventDefault();
		Utils.searchDots = Utils.searchControl.getResultsArray();
		Utils.dotsInCircle(Utils.searchDots, circle);
	});



	var marker = new ymaps.Placemark(mainLatLng, {
		balloonContent: 'Название квартиры <br> <big class="color-1">75 000</big>'
	}, {
		iconLayout: 'default#image',
		iconImageHref: "img/icons/marker-green.png",
		iconImageSize: [21, 30]
	});
	Utils.currentMap.geoObjects.add(marker);


	return Utils.currentMap;

}



window.initRent = function(mainLatLng) {

	$.ajax({
		type: "GET",
    url: "areaspoligon.json",
		success: function(response){
			Utils.drawPoligon(response);
		},
    complete: function(response){}
	});

	Utils.currentMap = new ymaps.Map('map-rent', {
		center: mainLatLng,
		zoom: 12,
		checkZoomRange: true,
		restrictMapArea: true,
		searchControlProvider: 'yandex#search',
		controls: []
	})

	Utils.searchInit();
	
	Utils.searchControl.events.add("load", function(e){
		
	});






	var marker = new ymaps.Placemark(mainLatLng, {
		balloonContent: 'Название квартиры <br> <big class="color-1">75 000</big>'
	}, {
		iconLayout: 'default#image',
		iconImageHref: "img/icons/marker-green.png",
		iconImageSize: [21, 30]
	});
	Utils.currentMap.geoObjects.add(marker);






	return Utils.currentMap;

}









/*
	other

*/
$(".beside-nav").on("click", "[data-search-enty]", function(){
	var searchRequest = $(this).attr("data-search-enty");
	console.log(searchRequest);
	Utils.searchControl.search(searchRequest);
});

