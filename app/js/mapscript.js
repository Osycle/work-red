
var markerStyle_1 = 'img/icons/marker-green.png',
		markerStyle_2 = 'img/icons/marker-red.png',
		markerStyle_3 = 'img/icons/marker-offices-2.png',

		rentProperty = $("[data-rent-checkboxes] [data-rent-property]"),
		rentFieldNum = $("[data-rent-coms] [data-rent-field-num]"),
		rentFieldVal = $("[data-rent-coms] [data-rent-field-val]"),
		rentAreaItems = $(".rent-items .wrapper-container"),
		rentBar = $(".rent-bar"),
		rentSelectArea = $("#rent_select_area")
		;









/*Areas*/
window.Areas = {
	items: [],
	currentAreaInc: undefined,
	areasTitles: [
		"Юнусабадский район",
		"Мирзо-Улугбекский район",
		"Яшнободский район",
		"Мирабадский район",
		"Бектемирский район",
		"Зангиатинский район",
		"Сергелийский район",
		"Яккасарайский район",
		"Чиланзарский район",
		"Учтепинский район",
		"Шайхантахурский район",
		"Олмазорский район"
	],
	activeArea: function(inc){
		var that = this;
		Areas.currentAreaInc = inc;
		$(that.items).map(function(i ,el){
			//console.log(that.areasTitles[inc], el.options.get("title"));
			if( that.areasTitles[inc] == el.options.get("title") ){

				el.options.set({
					fillColor: "#cc2527",
					strokeColor: "#cc2527"
				});
				el.options.get("placemark").properties.set({active: true})
				el.options.get("placemark").options.set({
					iconLayout: ymaps.templateLayoutFactory.createClass(
						'<div class="area-placemark is-active">$[properties.iconContent]</div>'
						)
				});

			}else{
				el.options.set({
					fillColor: "#cc252700",
					strokeColor: "#cc252700"
				});
				el.options.get("placemark").properties.set({active: false})
				el.options.get("placemark").options.set({
					iconLayout: ymaps.templateLayoutFactory.createClass(
						'<div class="area-placemark">$[properties.iconContent]</div>'
						)
				});
			}
		});
	},
	drawPolygon: function(arr){
		window.mata = arr;

		var title, description, address, coordinates, bounds;
		
		for (var i = 0; i < arr.length; i++) {

			title = arr[i].data.items[0].title;
			description = arr[i].data.items[0].description;
			address = arr[i].data.items[0].address;
			coordinates = arr[i].data.items[0].coordinates;
			bounds = arr[i].data.items[0].bounds;

			/*
				Placemark района
			*/
	    // Создание метки с круглой активной областью.
	    window.markerLayout = ymaps.templateLayoutFactory.createClass('<div class="area-placemark">$[properties.iconContent]</div>');

	    window.areaPlacemark = new ymaps.Placemark(
	        arr[i].data.exactResult.coordinates, {
	            //hintContent: 'Метка с круглым HTML макетом'
	            active: false,
	            iconContent: title
	        }, {
	            iconLayout: markerLayout,
	            zIndex: 700,
	            iconShape: {
	              type: 'Circle',
	              // Круг описывается в виде центра и радиуса
	              coordinates: [0, 0],
	              radius: 0
	            },
	            iconColor: '#ff0000'
	            // Описываем фигуру активной области "Круг".
	        }
	    );
	    Utils.currentMap.geoObjects.add(areaPlacemark);



			var polygon = arr[i].data.items[0].displayGeometry.geometries[0];
			var areasPolygon = new ymaps.Polygon(polygon, {}, {
					inc: i,
					title: title,
					description: description,
					address: address,
					coordinates: coordinates,
					bounds: bounds,
					//fillImageHref: 'images/lake.png',
					fillMethod: 'stretch',
					fillColor: "#cc252700",
					fillOpacity: "0.4",
					placemark: areaPlacemark,
					type: "polygon",
					strokeColor: "#cc252700",
					strokeWidth: 2,
					stroke: true
				}
			);
			Areas.items.push(areasPolygon);
			Utils.currentMap.geoObjects.add(areasPolygon);


			/*
				Наведение на район
			*/
			areasPolygon.events.add("mouseenter", function(e){
				var that = e.get("target");
				if( Areas.areasTitles[Areas.currentAreaInc] != that.options.get("title") )
					that.options.set({
						fillColor: "#fff",
						strokeColor: "#cc2527"
					});
				if( !(that.options.get("placemark").properties.get("active")) )
					that.options.get("placemark").options.set({
						iconLayout: ymaps.templateLayoutFactory.createClass('<div class="area-placemark [if !properties.active]is-hover[endif]">$[properties.iconContent]</div>')
					});
			});
			areasPolygon.events.add("mouseleave", function(e){
				var that = e.get("target");
				if( Areas.areasTitles[Areas.currentAreaInc] != that.options.get("title") )
					that.options.set({
						fillColor: "#cc252700",
						strokeColor: "#cc252700"
					});
				if( !(that.options.get("placemark").properties.get("active")) )
					that.options.get("placemark").options.set({
						iconLayout: ymaps.templateLayoutFactory.createClass('<div class="area-placemark">$[properties.iconContent]</div>')
					});
			});


			/*
				Клик по района
			*/
			areasPolygon.events.add("click", function(e){

				var that = e.get("target"), 
						inc = that.options.get("inc");

				Areas.activeArea(inc);
				Areas.currentArea = that;

				Rent.hideAll(); 
				Utils.drawClear();

				if( Utils.searchDots ){
					Utils.searchControl.clear();
					Utils.searchDots = undefined;
					Rent.besideBalloon = undefined;
				}
				if( Rent.besideEntitySelect && $("[name='typebeside']:checked").length > 0){
					$("[name='typebeside']:checked")[0].checked = false;
					Rent.besideEntitySelect.html("");
				}
				$(rentSelectArea).val(Areas.areasTitles[inc]).trigger("change.select2");
				//Rent.apartments
				Rent.objectsContainingPolygon = Rent.apartments.searchInside(Areas.currentArea);
				Rent.objectsContainingPolygon.each(function(el, i){
					el.options.set({
						visible: true
					});
				})
				Rent.mainCoordinates = Areas.currentArea.options.get("coordinates");
				Utils.currentMap.setCenter(Rent.mainCoordinates, 12, {duration: 500});
				Rent.filterBar(Rent.objectsContainingPolygon);
			})

		}
	},


};


















/*Rent*/
window.Rent = {

	template: 
						'<div class="rect-def">'+
							'<div class="wrapper-flex">'+
								'<span class="{{sold}} sales">Продано</span>'+
								'<span class="{{recommended}} recmd">Рекомендуем</span>'+
								'<div class="img-content">'+
									'<div class="img" style="background-image: url(\'{{imageUrl}}\');"></div>'+
								'</div>'+
								'<div class="desc-content text-item p-min">'+
									'<h5><a href="{{url}}">{{title}}</a></h5>'+
									'<div class="btn-content">'+
										'<form action="" id="favorites">  '+
          						'<button type="submit" name="favorites" value="{{articleId}}">Сохранено в мой REDD <i class="icm fa-1-5x icm-favorite-heart-button p-l-10 color-1"></i></button>'+
        						'</form>'+
									'</div>'+
									'<div class="detail-info m-v-15">'+
										'<span class="fig">'+
											'<i class="icm icm-doorway"></i>'+
											'<span>Комнаты:</span> '+
											'<span class="cnt">{{rooms}}</span>'+
										'</span>'+
										'<span class="fig">'+
											'<i class="icm icm-house-plan-scale"></i>'+
											'<span>Площадь: </span>'+
											'<span class="cnt">{{square}} кв. м</span>'+
										'</span>'+
									'</div>'+
									'<p><i class="icm icm-price-tag-1 p-r-15"></i><span class="price va-middle">{{price}}</span></p>'+
									'<hr>'+
									'<div class="summary">'+
										'<p>{{description}}</p>'+
										'<a href="{{url}}"><u>Подробнее</u></a>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'
	,

	apartments: undefined, 


	/*
		Генерируем карточку квартиры
	*/
	fabric: function(){

		var template, item;



		var old = rentAreaItems.find(".rect-def").removeClass("animate-start");
		setTimeout(function(){
			old.remove();
		}, 500)
		Rent.apartmentsSelected.map(function(obj, i){

			item = obj.options.get("item");
			template = Rent.template;
			if( item.tactic == "sold" )
				template = template.replace(/{{sold}}/gim, "show") // добавляем класс
			if( item.recommended )
				template = template.replace(/{{recommended}}/gim, "show") // добавляем класс

			/**
				Имена переменных в шаблоне карточки квартиры
				зависимы от ключей объектов
			*/
			for (var i in item){
				template = template.replace(new RegExp("{{"+i+"}}", "gim"), item[i]);
			} 
			

			template = template.replace(/{{\w*}}/gim, ""); // Обнуляем пустые переменные в шаблоне			

			rentAreaItems.append(template); // Вставляем в контейнер квартир

		})

		setTimeout(function(){
			rentAreaItems.find(".rect-def").addClass("animate-start");
		}, 500)
	},

	/*
		Фильтрация
	*/
	filterBar: function(obj){

		var propertyAttr, item, property, elInput;

		this.apartmentsSelected = [];
		//rentAreaItems.html(""); // Очищаем контейнер квартир

		obj.each(function(objItem, i){
			item = objItem.options.get("item");
			property = item.property;
			var novalid;
			for (var i = 0; i < rentProperty.length; i++) {
				elInput = rentProperty[i];
				propertyAttr = $(rentProperty[i]).attr("data-rent-property")
				if( !(property[propertyAttr] == elInput.checked || property[propertyAttr]) ){
					novalid = true;
					break;
				}
				//console.info(el.checked);
			}
			for (var i = 0; i < rentFieldNum.length; i++) {
				rentFieldNum[i] = $(rentFieldNum[i]);
				var fieldName = rentFieldNum[i].attr("data-rent-field-num");

				var min = rentFieldNum[i].filter("[data-rent-min]").val()*1 || 0;
				var max = rentFieldNum[i].filter("[data-rent-max]").val()*1 || Infinity;

				if ( min <= item[fieldName] && item[fieldName] <= max ) {

				}else{
					novalid = true;break;
				}
			}
			for (var i = 0; i < rentFieldVal.length; i++) {
				rentFieldVal[i] = $(rentFieldVal[i]);
				var fieldName = rentFieldVal[i].attr("data-rent-field-val");
				console.log(fieldName, rentFieldVal[i].val(), item[fieldName]);
				if ( rentFieldVal[i].val() ==  item[fieldName] ) {
					
				}else{
					novalid = true;break;
				}
			}


			if( novalid ){
				objItem.options.set({
					visible: false
				});
			}else{
				Rent.apartmentsSelected.push(objItem);
				objItem.options.set({
					visible: true
				});
			}
		})
		Rent.fabric();
		$("[data-rent-select-cnt]").text(Rent.apartmentsSelected.length);
	},

	hide: function(obj){
		if( obj )
			obj.each(function(el, i){
				el.options.set({
					visible: false
				});
			})
	},

	/*
		Скрыть все квартиры
	*/
	hideAll: function(areaStatus){
		if( this.apartments ){
			this.apartments.setOptions({
				visible: false
			});
			if(areaStatus)
				Areas.activeArea(null);
		}
	},


	drop: function(){
		Rent.hideAll(true); 
		Utils.drawClear();
	}

}
















/*Utils*/
window.Utils = {

	searchDots: undefined,
	searchControl: undefined,
	user: {},

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
				results: 30,
				provider: 'yandex#search'	
			}
		});
		
		that.currentMap.controls.add(that.searchControl);
	},


	/*
		Круг
	*/
	drawCircle: function(radius, latlng){
		// Создаем круг.
		var circle = new ymaps.Circle([
				// Координаты центра круга.
				latlng,
				// Радиус круга в метрах.
				radius
			], {}, {
				fillColor: "#ffffff",
				fillOpacity: 0.5,
				strokeColor: "#000",
				strokeOpacity: 0.8,
				strokeWidth: 3
			});

		// Добавляем круг на карту.
		this.currentMap.geoObjects.add(circle);
		//circle.editor.startEditing();
		return circle;
	},

	/*
		Рисование на карте
	*/
	draw: function(bool){
		ymaps.ready(['ext.paintOnMap']).then(function () {

	    var paintProcess;

	    // Опции многоугольника или линии.
	    var styles = [
	    	{
	    		strokeColor: '#000000', 
	    		strokeOpacity: 0.6, 
	    		strokeWidth: 5, 
	    		fillColor: '#fff', 
	    		fillOpacity: 0.3
	    	}
	    ];

	    var currentIndex = 0;

	    // Подпишемся на событие нажатия кнопки мыши.
	    Utils.currentMap.events.add('mousedown', function (e) {
	      // Если кнопка мыши была нажата с зажатой клавишей "alt", то начинаем рисование контура.
	      if(!$('[data-action="draw"]')[0].checked)
	      	return;
				if (e.get('altKey')) {
					if (currentIndex == styles.length - 1) {
						currentIndex = 0;
					}else{
						currentIndex++;
					}
					paintProcess = ymaps.ext.paintOnMap(Utils.currentMap, e, {style: styles[currentIndex]});
				}
	    });

	    // Подпишемся на событие отпускания кнопки мыши.
	    Utils.currentMap.events.add('mouseup', function (e) {
	    	if(!$('[data-action="draw"]')[0].checked)
	      	return;
	      if(paintProcess){
          // Получаем координаты отрисованного контура.
          var coordinates = paintProcess.finishPaintingAt(e);
          paintProcess = null;

          // Убираем не нужное на карте
					Rent.hide(Rent.objectsContainingPolygon);
					Rent.drop();

          // В зависимости от состояния кнопки добавляем на карту многоугольник или линию с полученными координатами.
          Utils.drawGeoObject = new ymaps.Polygon([coordinates], {}, styles[currentIndex]);
          Utils.currentMap.geoObjects.add(Utils.drawGeoObject);
          
					Rent.objectsContainingPolygon = Rent.apartments.searchInside(Utils.drawGeoObject);
					
					Rent.filterBar(Rent.objectsContainingPolygon);
	       }
	    });
	  });
	},

	gps: function(){
		var location = ymaps.geolocation.get();
		// Асинхронная обработка ответа.
		//Utils.user.geoObjects.options.set({id: "old"})
		//ymaps.geoQuery(Utils.currentMap.geoObjects).search('options.id = "old"')
		if(!$('[data-action="gps"]')[0].checked){
			if( Utils.user.geoObjects )
		  	Utils.currentMap.geoObjects.remove(Utils.user.geoObjects);
  		return;
		}
		location.then(
		  function(result) {

		    // Добавление местоположения на карту.
		    Utils.user.geoObjects = result.geoObjects;
		    Utils.user.location = result.geoObjects.position;

		    Utils.currentMap.geoObjects.add(Utils.user.geoObjects);


				Utils.currentMap.setCenter(Utils.user.location, 14, {duration: 300});

				// Рисуем круг
				Utils.circle = Utils.drawCircle(1500, Utils.user.location);
				Rent.objectsContainingPolygon = Rent.apartments.searchInside(Utils.circle);
				Rent.filterBar(Rent.objectsContainingPolygon);

		  },
		  function(err) {
		    console.log('Ошибка: ' + err)
		  }
		);
	},

	drawClear: function(){
		if( Utils.drawGeoObject )
			Utils.currentMap.geoObjects.remove(Utils.drawGeoObject);
		if( Utils.circle )
			Utils.currentMap.geoObjects.remove(Utils.circle);
	},


	/*
		Масштабирование при зажатом ctrl
	*/
	ctrlZoom: function(){

		Utils.currentMap.behaviors.disable('scrollZoom');

		var ctrlKey = false;
		var ctrlMessVisible = false;
		var timer;

		// Отслеживаем скролл мыши на карте, чтобы показывать уведомление
		Utils.currentMap.events.add(['wheel', 'mousedown'], function(e) {
		    if (e.get('type') == 'wheel') {
		        if (!ctrlKey) { // Ctrl не нажат, показываем уведомление
		            $('#ymap_ctrl_display').fadeIn(300);
		            ctrlMessVisible = true;
		            clearTimeout(timer); // Очищаем таймер, чтобы продолжать показывать уведомление
		            timer = setTimeout(function() {
		                $('#ymap_ctrl_display').fadeOut(300);
		                ctrlMessVisible = false;
		            }, 1500);
		        }
		        else { // Ctrl нажат, скрываем сообщение
		            $('#ymap_ctrl_display').fadeOut(100);
		        }
		    }
		    if (e.get('type') == 'mousedown' && ctrlMessVisible) { // Скрываем уведомление при клике на карте
		        $('#ymap_ctrl_display').fadeOut(100);
		    }
		});
		// Обрабатываем нажатие на Ctrl
		$(document).keydown(function(e) {
		    if (e.which === 17 && !ctrlKey) { // Ctrl нажат: включаем масштабирование мышью
		        ctrlKey = true;
		        Utils.currentMap.behaviors.enable('scrollZoom');
		    }
		});
		$(document).keyup(function(e) { // Ctrl не нажат: выключаем масштабирование мышью
		    if (e.which === 17) {
		        ctrlKey = false;
		        Utils.currentMap.behaviors.disable('scrollZoom');
		    }
		});
	},


	/*
		Поиск относительно координат круга
	*/
	dotsInCircle: function(dots, circle){

		var radiusStart = circle.geometry.getBounds()[0],
				radiusEnd = circle.geometry.getBounds()[1],
				dotLat, dotLng;

		for (var i = 0; i < dots.length; i++) {
			dotLat = dots[i].geometry.getCoordinates()[0];
			dotLng = dots[i].geometry.getCoordinates()[1];
			dots[i].options.set({
				iconLayout: 'default#image',
				iconImageHref: markerStyle_3,
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















window.initBeside = function(itemOptions) {
	var latlng = itemOptions.mainLatLng;
	Utils.currentMap = new ymaps.Map('map-beside', {
		center: latlng,
		zoom: 14,
		checkZoomRange: true,
		restrictMapArea: true,
		searchControlProvider: 'yandex#search',
		controls: []
	})

	Utils.searchInit();
	var circle = Utils.drawCircle(1000, latlng);

	// Фильтрация точек относительно радиуса
	$("[data-search-enty]").eq(0).trigger("click");
	
	Utils.searchControl.events.add("load", function(e){
		e.preventDefault();
		Utils.searchDots = Utils.searchControl.getResultsArray();
		Utils.dotsInCircle(Utils.searchDots, circle);
	});



	var marker = new ymaps.Placemark(latlng, {
		balloonContent: itemOptions.mainBalloonContent
	}, {
		iconLayout: 'default#image',
		iconImageHref: markerStyle_1,
		iconImageSize: [21, 30]
	});
	Utils.currentMap.geoObjects.add(marker);


	return Utils.currentMap;

}






















window.initRent = function(itemOptions, callback) {

	var latlng = itemOptions.mainLatLng;
	Utils.currentMap = new ymaps.Map("map-rent", {
		center: latlng,
		zoom: 12,
		checkZoomRange: true,
		restrictMapArea: true,
		searchControlProvider: "yandex#search",
		controls: ["zoomControl", "typeSelector", "fullscreenControl"]
	})


	Areas.drawPolygon(areasPolygon);

	$.ajax({
		type: "GET",
    url: "apartments.json",
		success: function(response){
			Rent.objects = [];
			var balloonTemplate, latlng;



			$(response).map(function(i, el){


				balloonTemplate = 
					'<div class="rent-balloon">'+
						'<a href="'+el.url+'" target="_blank">'+el.title+'</a>'+
						'<p>Комнат: '+el.rooms+'</p>'+
						'<p>Цена: '+el.price+'</p>'+
					'</div>';

				Rent.objects.push(new ymaps.Placemark(el.coordinates, {
					balloonContent: balloonTemplate
				}, {
					item: el
				}));

			});


			//Rent.hideAll();

			Rent.apartments = ymaps.geoQuery(Rent.objects).addToMap(Utils.currentMap);
			Rent.apartments.each(function(el, i){
				
				var sold = el.options.get("item").tactic;
				el.options.set({
					type: "point",
					iconLayout: 'default#image',
					iconImageHref: sold == "null" ? markerStyle_1 : markerStyle_2,
					iconImageSize: [21, 30],
					visible: false
				});
			});
			// Callback
			if( typeof callback == "function" ) callback();

		},
    error: function(response){
    	console.log("Ошибка в файле %cjson", "color:#90AF13;text-transform:uppercase;");
    },
    complete: function(response){}
	});


	Utils.searchInit();

	Rent.besideEntitySelect = $('#beside_entity_select');

	// Событие при пойске
	Utils.searchControl.events.add("load", function(e){
		e.preventDefault();
		Utils.searchDots = Utils.searchControl.getResultsArray();
		Rent.besideEntitySelect.html("");
		for (var i = 0; i < Utils.searchDots.length; i++) {
			// Объект с данными о точках
			var data = {
				id: i,
				idCompany: Utils.searchDots[i].properties.get("id"),
				name: Utils.searchDots[i].properties.get("name"),
				description: Utils.searchDots[i].properties.get("description"),
				coordinates: Utils.searchDots[i].geometry.getCoordinates()
			}
			var newOption = new Option(data.name, data.id, false, false);
			$(newOption).attr("data-all", JSON.stringify(data));
			Rent.besideEntitySelect.append(newOption).trigger('change.refresh');

		}
		// Сортируем строки по имени
		var sortOptions = Rent.besideEntitySelect.find('option').sort(function(a, b){
			var nameA = a.textContent.toLowerCase(), 
					nameB = b.textContent.toLowerCase();
			if (nameA < nameB) 
			  return -1;
			if (nameA > nameB)
			  return 1;
			return 0;
		})
		Rent.besideEntitySelect.append(sortOptions);
		
		
	});

	// Выбор организации
	Rent.besideEntitySelect.on("change.once", function(){

		try{

			var data = JSON.parse($(this.selectedOptions).attr("data-all"));
			Rent.besideBalloon = ymaps.geoQuery(Utils.searchDots).search("properties.id = '" + data.idCompany + "'").get(0);



			Rent.mainCoordinates = Rent.besideBalloon.geometry.getCoordinates();
			Utils.currentMap.setCenter(Rent.mainCoordinates, 14, {duration: 300});

			// Скрываем не нужно на карте
			Rent.drop();
			Rent.hide(Rent.objectsContainingPolygon);


			// Рисуем круг
			Utils.circle = Utils.drawCircle(1500, data.coordinates);


			Rent.objectsContainingPolygon = Rent.apartments.searchInside(Utils.circle);
			Rent.filterBar(Rent.objectsContainingPolygon);

		}catch(e){
			console.info(e);
		}
	})
	$("main").on("click", "[data-search-enty]", function(){
		Rent.drop();
	})

	Utils.ctrlZoom();



	return Utils.currentMap;

}









/*
	Событии
*/

// Поиск организации
$("main").on("click", "[data-search-enty]", function(){
	var searchRequest = $(this).attr("data-search-enty");
	Utils.searchControl.search(searchRequest);
});


// Изменение ширины карты
$("main").on("click", "#map-rent .btn-change", function(){
	var container = $("[data-reconstruction]");
	var status = container.attr("data-reconstruction");
	switch(status){
		case "1":
			container.attr("data-reconstruction", "2");break;
		case "2":
			container.attr("data-reconstruction", "3");break;
		case "3":
			container.attr("data-reconstruction", "1");break;

	}
	Utils.currentMap.container.fitToViewport();
	Utils.currentMap.setCenter(Rent.mainCoordinates, Utils.currentMap.getZoom(), {duration: 1000});
})


// Показать по фильтру
$("main").on("click", ".rent-bar .btn-view", function(){
	//Rent.filterBar(Rent.objectsContainingPolygon);
	$("[data-reconstruction]").attr("data-reconstruction", "2").addClass("active");
	Utils.currentMap.container.fitToViewport();
	Utils.currentMap.setCenter(Rent.mainCoordinates, Utils.currentMap.getZoom(), {duration: 1000});

})

// Возврат к фильтру
$("main").on("click", ".btn-backbar", function(){
	$("[data-reconstruction]").attr("data-reconstruction", "2").removeClass("active");
	Utils.currentMap.container.fitToViewport();
	Utils.currentMap.setCenter(Rent.mainCoordinates, 12, {duration: 500});
})

// Фильтрация
$("main").on("change", "[data-rent-field-num], [data-rent-property], [data-rent-field-val]", function(){
	Rent.filterBar(Rent.objectsContainingPolygon);
});

$(rentSelectArea).on("change", function(){
	var index = $(this.selectedOptions).attr("data-i");
	Areas.items[index].events.fire("click");
	console.log( $(this).val() );
})

// Toggle class
$("main").on("click", '[data-toggle="class"]', function(e){
	e.preventDefault();
	$($(this).attr("href")).toggleClass("active");
	if( $(this).hasClass("scroll-top") )
		$(".rent-wrapper").animate({scrollTop:0}, '500');
})
$("main").on("click", '[data-active]', function(e){
	e.preventDefault();
	var that = $(this);
	var markAttr = $(that).attr("data-active");
	//console.log( $("[data-active='" + markAttr + "']"),  markAttr)
	$("[data-active='" + markAttr + "']").removeClass("active");
	that.addClass("active");
})

$("main").on("change", '[name="renttools"]', function(e){
	var that = $(this);
	console.log(this.checked);
	//e.preventDefault();
	$('[name="renttools"]')
		.filter(":not(#"+that.attr("id")+")")
		.map( function(i, el){
			el.checked = false;
		});


	var action = that.attr("data-action");
	Rent.drop();
	switch(action){
		case "draw":
			Utils.draw();break;
		case "gps":
			Utils.gps();break;

	}	


})

