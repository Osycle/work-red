

function init() {

	var mainDot = [41.326892, 69.313324];

	window.myMap = new ymaps.Map('map-beside', {
		center: mainDot,
		zoom: 14,
		checkZoomRange: true,
		restrictMapArea: true,
		searchControlProvider: 'yandex#search',
		controls: []
	})




	// Создаем круг.
	window.myCircle = new ymaps.Circle([
			// Координаты центра круга.
			mainDot,
			// Радиус круга в метрах.
			1000
		], {}, {
			fillColor: "#cc25271f",
			strokeColor: "#2121213d",
			strokeOpacity: 0.8,
			strokeWidth: 5
		});

	// Добавляем круг на карту.
	if( $("[data-beside-circle]").length > 0 )
		myMap.geoObjects.add(myCircle);
	//myCircle.editor.startEditing();

	// Изменение радиуса круга
	$(document).on("change", "[name='circleradius']", function(){
		var val = $(this).val().trim()*1;
		if( isNaN(val) )
			return;
		myCircle.geometry.setRadius(val);		
	})



	// Создадим экземпляр элемента управления «поиск по карте»
	// с установленной опцией провайдера данных для поиска по организациям.
	window.searchControl = new ymaps.control.SearchControl({
		options: {
			//float: 'right',
			//floatIndex: 100,
			noPlacemark: false,
			//noCentering: true,
			//noPopup: true,
			useMapBounds: true,
			visible: !false,
			//kind: "route",
			checkZoomRange: true,
			//resultsPerPage: 20,
			//showFeedbackAfterResults: true,
			strictBounds: true,
			boundedBy: myCircle.geometry.getBounds(),
			results: 50,
			provider: 'yandex#search'	
		}
	});
	window.resultsDots;
	searchControl.events.add("load", function(e){
		e.preventDefault();
		resultsDots = searchControl.getResultsArray();
		dotsInCircle(resultsDots);
	});
	myMap.events.add("wheel", function(){
		//console.log("wheel");
	})

	


	// Фильтрация точек относительно радиуса
	window.dotsInCircle = function (dots){

		var radiusStart = myCircle.geometry.getBounds()[0],
				radiusEnd = myCircle.geometry.getBounds()[1],
				dotLat, dotLng;

		//console.log(radiusStart);
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
				//console.log(dots[i]);
				//window["zx"+i] = dots[i];
			}else{
				//console.log("false");
				dots[i].options.set('visible', false);
			}
		}

	}

	window.trans = function(){
		//https://api.rasp.yandex.net/v3.0/search/?apikey=a3c70097-3283-4cda-9fd3-ae19d86d07d2&format=json&from=c146&to=c213&lang=ru_RU&page=1&date=2019-08-02
		
			$.ajax({
				type: "GET",
				url: "https://geocode-maps.yandex.ru/1.x",
				crossDomain: true,
				data: {
					apikey: "a3c70097-3283-4cda-9fd3-ae19d86d07d2",
					geocode: "метро",
					format: "json"
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
	
	window.searchEnty = function(org){
		searchControl.search(org);
	}




	var marker = new ymaps.Placemark(mainDot, {
		balloonContent: 'Название квартиры <br> <big class="color-1">75 000</big>'
	}, {
		iconLayout: 'default#image',
		iconImageHref: "img/icons/marker-green.png",
		iconImageSize: [21, 30]
	});
	myMap.geoObjects.add(marker);



	myMap.events.add("zoom", function(){
		//console.log("zoom");
	})
	// Включаем редактирование круга.


	$("[data-search-enty]").eq(0).trigger("click");



}

ymaps.ready(init);






/*
	other

*/
$(".beside-nav").on("click", "[data-search-enty]", function(){
	searchRequest = $(this).attr("data-search-enty");
	console.log(searchRequest);
	searchEnty(searchRequest);
});

