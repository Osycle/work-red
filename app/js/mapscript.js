

function init() {


	window.myMap = new ymaps.Map('map-beside', {
		center: [41.326892, 69.313324],
		zoom: 14,
		controls: []
	});



	// Создадим экземпляр элемента управления «поиск по карте»
	// с установленной опцией провайдера данных для поиска по организациям.
	window.searchControl = new ymaps.control.SearchControl({
		options: {
			float: 'right',
			floatIndex: 100,
			noPlacemark: false,
			provider: 'yandex#search'
		}
	});
	window.resultsDots;
	searchControl.events.add("load", function(){
		resultsDots = searchControl.getResultsArray();
		console.log("load");
	});
	myMap.events.add("wheel", function(){
		console.log("wheel");
	})



	window.dotsInCircle = function (dots){

		var radiusStart = myCircle.geometry.getBounds()[0],
				radiusEnd = myCircle.geometry.getBounds()[1],
				dotLat, dotLng;

		//console.log(radiusStart);
		for (var i = 0; i < dots.length; i++) {
			dotLat = dots[i].geometry.getCoordinates()[0];
			dotLng = dots[i].geometry.getCoordinates()[1];
			if( dotLat > radiusStart[0] && dotLng > radiusStart[1] && dotLat < radiusEnd[0] && dotLng < radiusEnd[1]){
				dots[i].options.set('visible', true);
			}else{
				dots[i].options.set('visible', false);
			}
		}

	}

	window.trans = function(){
		//https://api.rasp.yandex.net/v3.0/search/?apikey=a3c70097-3283-4cda-9fd3-ae19d86d07d2&format=json&from=c146&to=c213&lang=ru_RU&page=1&date=2019-08-02
		//https://api.rasp.yandex.net/v3.0/search/?apikey={ключ}&format=json&from=c146&to=c213&lang=ru_RU&page=1&date=2015-09-02
			$.ajax({
				type: "GET",
				url: "https://api.rasp.yandex.net/v3.0/search/",
				crossDomain: true,
				data: {
					apikey: "a3c70097-3283-4cda-9fd3-ae19d86d07d2",
					format: "json",
					from: "c146",
					to: "c213",
					lang: "ru_RU",
					page: "1",
					date: "2019-08-02"
				},
				success: function(data){
					console.log("success")
				},
				statusCode: {
					404: function(){alert( "page not found" );}
				},
				complete: function(){}
			});
	}

	myMap.controls.add(searchControl);
	
	// прямоугольной области карты.

	window.searchEnty = function(org){
		searchControl.search(org);
	}







	var marker = new ymaps.Placemark([41.326892, 69.313324], {
		balloonContent: 'ЗАО "САГА-Сервис" Россия, Москва, улица Мельникова, 3к5 (Офис работает: 9:00-18:00 кроме выходных и праздничных дней) http://sagakkm.ru info@sagakkm.ru +7 (495) 123-65-29 +7 (495) 123-65-74'
	}, {
		preset: 'islands#glyphIcon',            
		iconGlyph: 'wrench',
		iconImageSize: [48, 48],
		iconGlyphColor: 'gray'
	});
	myMap.geoObjects.add(marker);


	// Создадим мульти-маршрут и добавим его на карту.
	window.multiRoute = new ymaps.multiRouter.MultiRoute({
	    referencePoints: [
	        '"162269363439"", "Узбекистан, Ташкент, улица Буюк Ипак Йули'],
	}, {
	    editorDrawOver: false,
	    wayPointDraggable: true,
	    viaPointDraggable: true,
	    // Зададим собственное оформление линий мультимаршрута.
	    routeStrokeColor: "000088",
	    routeActiveStrokeColor: "ff0000",
	    pinIconFillColor: "ff0000",
	    boundsAutoApply: true,
	    zoomMargin: 30
	});
	myMap.geoObjects.add(multiRoute);

  //var routeButtonControl = new ymaps.control.RouteButton();
  //myMap.controls.add(routeButtonControl); 



	// Создаем круг.
	window.myCircle = new ymaps.Circle([
			// Координаты центра круга.
			[41.326892, 69.313324],
			// Радиус круга в метрах.
			1000
		], {}, {
			// Задаем опции круга.
			// Цвет заливки.
			fillColor: "#DB709377",
			// Цвет обводки.
			strokeColor: "#990066",
			// Прозрачность обводки.
			strokeOpacity: 0.8,
			// Ширина обводки в пикселях.
			strokeWidth: 5
		});

	// Добавляем круг на карту.
	//myMap.geoObjects.add(myCircle);
	myCircle.events.add("geometrychange", function(){
				
	})
	//myCircle.editor.startEditing();

	// Изменение радиуса круга
	$(document).on("change", "[name='circleradius']", function(){
		var val = $(this).val().trim()*1;
		if( isNaN(val) )
			return;
		myCircle.geometry.setRadius(val);		
	})



	myMap.events.add("zoom", function(){
		//console.log(this);
	})
	// Включаем редактирование круга.






}

ymaps.ready(init);






/*
	other

*/
$(".beside-nav").on("click", "[data-search-enty]", function(){
	searchRequest = $(this).attr("data-search-enty");
	console.log(searchRequest);
	searchEnty(searchRequest);
})

