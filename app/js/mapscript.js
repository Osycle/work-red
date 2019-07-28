

function init() {

	var mainDot = [41.326892, 69.313324];

	window.myMap = new ymaps.Map('map-beside', {
		center: mainDot,
		zoom: 14,
		zoomRange: [16, 17],
		checkZoomRange: true,
		restrictMapArea: true,
		searchControlProvider: 'yandex#search',
		controls: []
	})

	myMap.zoomRange._zoomRange = [16, 17];



	// Создаем круг.
	window.myCircle = new ymaps.Circle([
			// Координаты центра круга.
			mainDot,
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
			//noPlacemark: false,
			//noCentering: true,
			//noPopup: true,
			useMapBounds: true,
			visible: false,
			//kind: "route",
			checkZoomRange: true,
			//resultsPerPage: 20,
			//showFeedbackAfterResults: true,
			strictBounds: true,
			boundedBy: myCircle.geometry.getBounds(),
			results: 30,
			provider: 'yandex#search'	
		}
	});
	window.resultsDots;
	searchControl.events.add("load", function(e){
		resultsDots = searchControl.getResultsArray();
		console.log("load");
		myMap.zoomRange.get([16, 17]);
		dotsInCircle(resultsDots);
		
		setTimeout(function(){
			//myMap.ZoomRange(myMap, [0, 17]);
		},2000)
		// setTimeout(function(){
		// 	myMap.setZoom(16);

		// },2000)
		console.log(e);
	});
	myMap.events.add("wheel", function(){
		//console.log("wheel");
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
				console.log(dots[i]);
				window["zx"+i] = dots[i];
			}else{
				console.log("false");
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
	
	// прямоугольной области карты.

	window.searchEnty = function(org){
		//searchControl.options.results = 1;
		searchControl.search(org);

	}

    // Поиск координат центра Нижнего Новгорода.
    window.geogeo = ymaps.geocode(mainDot, {
        results: 10,
         // Ограничение поиска видимой областью карты.
        kind: "route",
   			boundedBy: myMap.getBounds(),
   			// Жесткое ограничение поиска указанной областью.
   			strictBounds: true
    }).then(function (res) {
            // Выбираем первый результат геокодирования.
            window.res = res;
            // for (var i = 0; i < 10; i++) {
            // console.log(res.geoObjects.get([i]));
            // }
            var firstGeoObject = res.geoObjects.get(0),
                // Координаты геообъекта.
                coords = firstGeoObject.geometry.getCoordinates(),
                // Область видимости геообъекта.
                bounds = firstGeoObject.properties.get('boundedBy');

            firstGeoObject.options.set('preset', 'islands#darkBlueDotIconWithCaption');
            // Получаем строку с адресом и выводим в иконке геообъекта.
            firstGeoObject.properties.set('iconCaption', firstGeoObject.getAddressLine());

            // Добавляем первый найденный геообъект на карту.
            myMap.geoObjects.add(firstGeoObject);
            // Масштабируем карту на область видимости геообъекта.
            myMap.setBounds(bounds, {
                // Проверяем наличие тайлов на данном масштабе.
                checkZoomRange: true
            });

            /**
             * Все данные в виде javascript-объекта.
             */
            console.log('Все данные геообъекта: ', firstGeoObject.properties.getAll());
            /**
             * Метаданные запроса и ответа геокодера.
             * @see https://api.yandex.ru/maps/doc/geocoder/desc/reference/GeocoderResponseMetaData.xml
             */
            console.log('Метаданные ответа геокодера: ', res.metaData);
            /**
             * Метаданные геокодера, возвращаемые для найденного объекта.
             * @see https://api.yandex.ru/maps/doc/geocoder/desc/reference/GeocoderMetaData.xml
             */
            console.log('Метаданные геокодера: ', firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData'));
            /**
             * Точность ответа (precision) возвращается только для домов.
             * @see https://api.yandex.ru/maps/doc/geocoder/desc/reference/precision.xml
             */
            console.log('precision', firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData.precision'));
            /**
             * Тип найденного объекта (kind).
             * @see https://api.yandex.ru/maps/doc/geocoder/desc/reference/kind.xml
             */
            console.log('Тип геообъекта: %s', firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData.kind'));
            console.log('Название объекта: %s', firstGeoObject.properties.get('name'));
            console.log('Описание объекта: %s', firstGeoObject.properties.get('description'));
            console.log('Полное описание объекта: %s', firstGeoObject.properties.get('text'));
            /**
            * Прямые методы для работы с результатами геокодирования.
            * @see https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/GeocodeResult-docpage/#getAddressLine
            */
            console.log('\nГосударство: %s', firstGeoObject.getCountry());
            console.log('Населенный пункт: %s', firstGeoObject.getLocalities().join(', '));
            console.log('Адрес объекта: %s', firstGeoObject.getAddressLine());
            console.log('Наименование здания: %s', firstGeoObject.getPremise() || '-');
            console.log('Номер здания: %s', firstGeoObject.getPremiseNumber() || '-');

            /**
             * Если нужно добавить по найденным геокодером координатам метку со своими стилями и контентом балуна, создаем новую метку по координатам найденной и добавляем ее на карту вместо найденной.
             */
            /**
             var myPlacemark = new ymaps.Placemark(coords, {
             iconContent: 'моя метка',
             balloonContent: 'Содержимое балуна <strong>моей метки</strong>'
             }, {
             preset: 'islands#violetStretchyIcon'
             });

             myMap.geoObjects.add(myPlacemark);
             */
        });





	var marker = new ymaps.Placemark(mainDot, {
		balloonContent: 'ЗАО "САГА-Сервис" Россия, Москва, улица Мельникова, 3к5 (Офис работает: 9:00-18:00 кроме выходных и праздничных дней) http://sagakkm.ru info@sagakkm.ru +7 (495) 123-65-29 +7 (495) 123-65-74'
	}, {
		preset: 'islands#glyphIcon',            
		iconGlyph: 'wrench',
		iconImageSize: [48, 48],
		iconGlyphColor: 'gray'
	});
	myMap.geoObjects.add(marker);



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

