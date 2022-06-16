
var
		rentProperty = $("[data-rent-checkboxes] [data-rent-property]"),
		rentFieldNum = $("[data-rent-coms] [data-rent-field-num]"),
		rentFieldVal = $("[data-rent-coms] [data-rent-field-val]"),
		rentAreaItems = $(".rent-items .wrapper-container"),
		rentBar = $(".rent-bar"),
		rentSelectAreas = $(".rent-select-area, #rent_select_area")
		;



window.markerStyle_1 = window.markerStyle_1 || 'img/icons/marker-green.png';
window.markerStyle_2 = window.markerStyle_2 || 'img/icons/marker-red.png';
window.markerStyle_3 = window.markerStyle_3 || 'img/icons/marker-offices-2.png';


RegExp.escape= function(s) {
	return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

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
				$(rentSelectAreas).val(Areas.areasTitles[inc]).trigger("change.select2");
				//Rent.apartments
				Rent.objectsContainingPolygon = Rent.apartments.searchInside(Areas.currentArea);
				Rent.objectsContainingPolygon.each(function(el, i){
					el.options.set({
						visible: true
					});
				})
				Utils.currentCenter = Areas.currentArea.options.get("coordinates");
				Utils.currentMap.setCenter(Utils.currentCenter, 12, {duration: 500});
				Rent.filterBar();


				$('[name="renttools"]').map( function(i, el){
					el.checked = false;
				});

				// Запуск инструмента
				hashTools();

			})

		}
	},


};


















/*Rent*/
/**
*	@param [objectsContainingPolygon] {Object} Обекты текущей выборки
*	@param [template] {String} Шаблон карточки
*	@param [apartments] {Object} Все объекты квартир
*	@function [filterBar] {Object} Фильр квартир
*/

window.Rent = {
	apartments: undefined, 
	objectsContainingPolygon: {},
	template: 
						'<div class="rect-def">'+
							'<div class="wrapper-flex">'+
								'<span class="{{sold}} sales">Продано</span>'+
								'<span class="{{recommended}} recmd">Рекомендуем</span>'+
								'<div class="img-content">'+
									'<div class="img" style="background-image: url(\'{{images}}\');"></div>'+
								'</div>'+
								'<div class="desc-content text-item p-min">'+
									'<h5><a href="{{url}}">{{title}}</a></h5>'+
									'<div class="btn-content">'+
										'<form action="" class="favorites">  '+
          						'<button type="button" name="favorites" value="{{articleId}}">Сохранено в мой REDD <i class="icm fa-1-5x icm-favorite-heart-button p-l-10"></i></button>'+
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
									'<p><i class="icm icm-price-tag-1 p-r-15"></i><span class="price price-us va-middle">{{price}}</span><span class="price price-usd va-middle">{{priceSum}}</span></p>'+
									'<hr>'+
									'<div class="summary">'+
										'<p>{{description}}</p>'+
										'<a href="{{url}}" target="_blank"><u>Подробнее</u></a>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'
	,

	


	/*
		Генерируем карточку квартиры
	*/
	fabric: function(obj){

		var template, item;



		var old = rentAreaItems.find(".rect-def").removeClass("animate-start");
		setTimeout(function(){
			old.remove();
		}, 500)
		obj.each(function(obj, i){

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

		});
		setTimeout(function(){
			// TODO
			rentAreaItems.find(".rect-def").map(function(i, el){
				el = $(el);
				var price = el.find(".price-us").text();
				var priceSum = el.find(".price-usd").text();
				var stylePrice = intSpace(price, ",");
				var stylePriceSum = intSpace(priceSum, ",");
				if( stylePrice ){
					el.find(".price-us").text(stylePrice + " $");
				}
				if( stylePriceSum )
					el.find(".price-usd").text(stylePriceSum + " сум");
			})
		}, 400);
		

		setTimeout(function(){
			rentAreaItems.find(".rect-def").addClass("animate-start");
		}, 500)
	},

	/*
		Фильтрация
	*/
	filterBar: function(obj){
		var obj = obj || this.objectsContainingPolygon;
		var propertyAttr, item, property, elInput;

		window.apartmentsSelected = [];
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


				if ( !(min <= item[fieldName] && item[fieldName] <= max) ){
					novalid = true;break;
				}

			}
			for (var i = 0; i < rentFieldVal.length; i++) {
				rentFieldVal[i] = $(rentFieldVal[i]);
				var fieldName = rentFieldVal[i].attr("data-rent-field-val");
				if ( !(rentFieldVal[i].val() ==  item[fieldName] || rentFieldVal[i].val() == "all") ) {
					novalid = true;break;
				}
			}


			if( novalid ){
				objItem.options.set({
					visible: false
				});
			}else{
				apartmentsSelected.push(objItem);
				objItem.options.set({
					visible: true
				});
			}
		})
		//Rent.objectsContainingPolygon = ymaps.geoQuery(apartmentsSelected);
		var newObjects = ymaps.geoQuery(apartmentsSelected);
		$("[data-rent-select-cnt]").text(apartmentsSelected.length);
		Rent.fabric(newObjects);
		return apartmentsSelected.length;
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
		Поиск по ключевым словам
	*/
	search: function(words){
		words = words.trim();
		if( words.length < 3 )
			return;
		var searchArray = [], keywords, found;
		Rent.drop();
		Rent.apartments.each(function(el, i){
			keywords = el.properties.get("keywords");
			found = keywords.match(new RegExp(RegExp.escape(words), "gim"))
			if( found )
				searchArray.push(el);
			
		});
		Rent.objectsContainingPolygon = ymaps.geoQuery(searchArray);
		Rent.filterBar();
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
		if( Utils.user.geoObject )
			Utils.currentMap.geoObjects.remove(Utils.user.geoObject);
	},

	/*
		Показать все квартиры
	*/
	visibleAll: function(){
		if( this.apartments ){
			this.apartments.setOptions({
				visible: true
			});
		}
		return this.apartments;
	},

	drop: function(){
		Rent.hideAll(true); 
		Utils.drawClear();
	},

	/*
		Дополнительные функций
	*/
	/*Рисуем*/
	draw: function(bool){
		ymaps.ready(['ext.paintOnMap']).then(function () {

	    var paintProcess, styles, currentIndex = 0, drawGeoObject;

	    // Опции многоугольника или линии.
	    styles = [
	    	{
	    		strokeColor: '#000000', 
	    		strokeOpacity: 0.6, 
	    		strokeWidth: 5, 
	    		fillColor: '#fff', 
	    		fillOpacity: 0.3
	    	}
	    ];

	    // Подпишемся на событие нажатия кнопки мыши.
	    Utils.currentMap.events.add('mousedown', function (e) {
	      // Если кнопка мыши была нажата с зажатой клавишей "alt", то начинаем рисование контура.
	      var buttonNum = e.get('domEvent').originalEvent.button;
	      if(buttonNum == 2)
	      	e.preventDefault();

	      console.log(e.get('domEvent').originalEvent.button, e);
	      if(!$('[data-action="draw"]')[0].checked)
	      	return;
				if (buttonNum == 2) {
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
          drawGeoObject = new ymaps.Polygon([coordinates], {}, styles[currentIndex]);
          drawGeoObject.properties.set({
          	class: "figure"
          })
          Utils.currentMap.geoObjects.add(drawGeoObject);
          Utils.currentCenter = Utils.center
					Rent.objectsContainingPolygon = Rent.apartments.searchInside(drawGeoObject);
					
					Rent.filterBar();
	       }
	    });
	  });
	},

	/*Находим по GPS*/
	gps: function(){
		var location = ymaps.geolocation.get();
		// Асинхронная обработка ответа.
		//Utils.user.geoObject.options.set({id: "old"})
		//ymaps.geoQuery(Utils.currentMap.geoObjects).search('options.id = "old"')
		if(!$('[data-action="gps"]')[0].checked){
			if( Utils.user.geoObject )
		  	Utils.currentMap.geoObjects.remove(Utils.user.geoObject);
  		return;
		}
		location.then(
		  function(result) {

		    // Добавление местоположения на карту.
		    Utils.user.geoObject = result.geoObjects;
		    Utils.currentCenter = result.geoObjects.position;
		    Utils.user.geoObject.properties.set({
		    	class: "figure"
		    })
		    Utils.currentMap.geoObjects.add(Utils.user.geoObject);


				Utils.currentMap.setCenter(Utils.currentCenter, 14, {duration: 300});

				// Рисуем круг
				Utils.circle = Utils.drawCircle(1500, Utils.currentCenter);
				Rent.objectsContainingPolygon = Rent.apartments.searchInside(Utils.circle);
				Rent.filterBar();

		  },
		  function(err) {
		    console.log('Ошибка: ' + err);
		  }
		);
	},

	/*Показать все квартиры*/
	whole: function(){
		if(!$('[data-action="whole"]')[0].checked){
			return;
		}
		Rent.objectsContainingPolygon = Rent.visibleAll();
		Rent.filterBar();
		Utils.currentCenter = Utils.center;
		Utils.currentMap.setCenter(Utils.center, 12, {duration: 500});
	},

	/*Найти вокруг метро*/
	found: function(searchRequest, actionName){

		Utils.searchControl.search(searchRequest);
		return;

	 	if(!$('[data-action="'+actionName+'"]')[0].checked && !force)
	  	return;
		var foundGeoObjects = [], firstLoad = false;

		Utils.searchInit(50);
		Utils.currentMap.setCenter(Utils.center, 12, {duration: 0});
		Utils.searchControl.search(searchRequest);
		
		
		Utils.searchControl.events.add("load", function(e){
			if( firstLoad )
				return;
			firstLoad = true;

			Utils.searchDots = Utils.searchControl.getResultsArray();

			Utils.searchDots.forEach(function(el, i){
				var circle = Utils.drawCircle(600, el.geometry.getCoordinates());
				circle.options.set({
					visible: false
				});
				circle.properties.set({
					classType: "foundCircle"
				});

			})
			// Рисуем круг
			//Utils.circle = Utils.drawCircle(1500, data.coordinates);
			
			window.circles = ymaps.geoQuery(Utils.currentMap.geoObjects).search('properties.classType = "foundCircle"')
			circles.each(function(el, i){
				var circleObjects = Rent.apartments.searchInside(el)
				circleObjects.each(function(el, i){
					foundGeoObjects.push(el);
					el.options.set({
						visible: true
					});

				})
			})
			Rent.objectsContainingPolygon = ymaps.geoQuery(foundGeoObjects);
			Rent.filterBar();
		});
	}


}
















/*Utils*/
window.Utils = {

	searchDots: undefined,
	searchControl: undefined,
	center: [41.311151, 69.279737],
	user: {},

	searchInit: function(resultsQuantity){
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
				results: resultsQuantity ? resultsQuantity : 30,
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
		circle.properties.set({
			class: "figure",
			classType: "circle"
		});
		//circle.editor.startEditing();
		return circle;
	},

	drawClear: function(){
		var figure = ymaps.geoQuery(Utils.currentMap.geoObjects).search('properties.class = "figure"');
		figure.each(function(el, i){
			Utils.currentMap.geoObjects.remove(el);
		})
	},


	/*
		Масштабирование при зажатом ctrl
	*/
	ctrlZoom: function(){

		Utils.currentMap.behaviors.disable('scrollZoom');

		var ctrlKey = false,
				ctrlMessVisible = false,
				timer;

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

/*
	Дополнительные функции карты
*/














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

	Utils.searchInit(50);
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
















$.ajax({
	url: `
		https://yandex.uz/maps/api/search?
		ajax=1
		&mode=uri
		&lang=ru_UZ
		&origin=maps-form
		&yandex_gid=10335
		&client_usecase=suggest
		&experimental%5B0%5D=rearr%3Dscheme_Local%2FGeo%2FAdvertOnlyOpenNow%3D1
		&test-buckets=594584%2C0%2C4%3B595765%2C0%2C37%3B182560%2C0%2C82%3B589114%2C0%2C65%3B595372%2C0%2C34%3B90498%2C0%2C51%3B46450%2C0%2C6%3B204310%2C0%2C17%3B594719%2C0%2C30
		&snippets=masstransit%2F2.x%2Cpanoramas%2F1.x%2Cbusinessrating%2F1.x%2Cbusinessimages%2F1.x%2Cphotos%2F2.x%2Cexperimental%2F1.x%2Csubtitle%2F1.x%2Cvisits_histogram%2F2.x%2Ctycoon_owners_personal%2F1.x%2Ctycoon_posts%2F1.x%2Crelated_adverts%2F1.x%2Crelated_adverts_1org%2F1.x%2Ccity_chains%2F1.x%2Croute_point%2F1.x%2Ctopplaces%2F1.x%2Cmetrika_snippets%2F1.x%2Cplace_summary%2F1.x%2Conline_snippets%2F1.x%2Cbuilding_info_experimental%2F1.x%2Cprovider_data%2F1.x%2Cservice_orgs_experimental%2F1.x%2Cbusiness_awards_experimental%2F1.x%2Cbusiness_filter%2F1.x%2Cattractions%2F1.x%2Cpotential_company_owners%3Auser%2Cpin_info%2F1.x%2Clavka%2F1.x%2Cbookings%2F1.x%2Cbookings_advert%2F1.x%2Cbookings_personal%2F1.x%2Ctrust_features%2F1.x%2Cplus_offers_experimental%2F1.x%2Cfuel%2F1.x%2Crealty_experimental%2F2.x%2Cmatchedobjects%2F1.x%2Cdiscovery%2F1.x%2Ctopobjects%2F1.x%2Chot_water%2F1.x
		&results=1
		&s=238517540
		&sessionId=1655204567738_446794
		&spn=0.010257%2C0.005730
		&text=%D0%BC%D0%B0%D1%85%D0%B0%D0%BB%D0%BB%D1%8F%20%D0%91%D0%B5%D0%B3%D1%83%D0%B1%D0%BE%D1%80
		&uri=ymapsbm1%3A%2F%2Fgeo%3Fll%3D69.318146%252C41.370953%26spn%3D0.011726%252C0.005623%26text%3D%25D0%25A3%25D0%25B7%25D0%25B1%25D0%25B5%25D0%25BA%25D0%25B8%25D1%2581%25D1%2582%25D0%25B0%25D0%25BD%252C%2520%25D0%25A2%25D0%25B0%25D1%2588%25D0%25BA%25D0%25B5%25D0%25BD%25D1%2582%252C%2520%25D0%25AE%25D0%25BD%25D1%2583%25D1%2581%25D0%25B0%25D0%25B1%25D0%25B0%25D0%25B4%25D1%2581%25D0%25BA%25D0%25B8%25D0%25B9%2520%25D1%2580%25D0%25B0%25D0%25B9%25D0%25BE%25D0%25BD%252C%2520%25D0%25BC%25D0%25B0%25D1%2585%25D0%25B0%25D0%25BB%25D0%25BB%25D1%258F%2520%25D0%2591%25D0%25B5%25D0%25B3%25D1%2583%25D0%25B1%25D0%25BE%25D1%2580
		&ll=69.300066%2C41.376855
		&suggest_reqid=1655209539000833-2963192521-suggest-maps-yp-2
		&csrfToken=046aeca0be5605773c705e8ea3703a46b8545195%3A1655204567
			`,
	success: (d)=>{
		console.log(d)
	},
	type: "GET",
})
$.ajax({
	url: `
		https://yandex.uz/maps/api/search?
		ajax=1
		&client_usecase=suggest
		&csrfToken=046aeca0be5605773c705e8ea3703a46b8545195%3A1655204567
		&experimental%5B0%5D=rearr%3Dscheme_Local%2FGeo%2FAdvertOnlyOpenNow%3D1
		&lang=ru_UZ
		&ll=69.300066,41.376855
		&mode=uri
		&origin=maps-form
		&results=1
		&s=238517540
		&sessionId=1655204567738_446794
		&snippets=masstransit%2F2.x%2Cpanoramas%2F1.x%2Cbusinessrating%2F1.x%2Cbusinessimages%2F1.x%2Cphotos%2F2.x%2Cexperimental%2F1.x%2Csubtitle%2F1.x%2Cvisits_histogram%2F2.x%2Ctycoon_owners_personal%2F1.x%2Ctycoon_posts%2F1.x%2Crelated_adverts%2F1.x%2Crelated_adverts_1org%2F1.x%2Ccity_chains%2F1.x%2Croute_point%2F1.x%2Ctopplaces%2F1.x%2Cmetrika_snippets%2F1.x%2Cplace_summary%2F1.x%2Conline_snippets%2F1.x%2Cbuilding_info_experimental%2F1.x%2Cprovider_data%2F1.x%2Cservice_orgs_experimental%2F1.x%2Cbusiness_awards_experimental%2F1.x%2Cbusiness_filter%2F1.x%2Cattractions%2F1.x%2Cpotential_company_owners%3Auser%2Cpin_info%2F1.x%2Clavka%2F1.x%2Cbookings%2F1.x%2Cbookings_advert%2F1.x%2Cbookings_personal%2F1.x%2Ctrust_features%2F1.x%2Cplus_offers_experimental%2F1.x%2Cfuel%2F1.x%2Crealty_experimental%2F2.x%2Cmatchedobjects%2F1.x%2Cdiscovery%2F1.x%2Ctopobjects%2F1.x%2Chot_water%2F1.x
		&spn=0.010257%2C0.005730
		&suggest_reqid=1655209539000833-2963192521-suggest-maps-yp-2
		&test-buckets=594584,0,4;595765,0,37;182560,0,82;589114,0,65;595372,0,34;90498,0,51;46450,0,6;204310,0,17;594719,0,30
		&text=махалля Бегубор
		&uri=ymapsbm1%3A%2F%2Fgeo%3Fll%3D69.318146%252C41.370953%26spn%3D0.011726%252C0.005623%26text%3D%25D0%25A3%25D0%25B7%25D0%25B1%25D0%25B5%25D0%25BA%25D0%25B8%25D1%2581%25D1%2582%25D0%25B0%25D0%25BD%252C%2520%25D0%25A2%25D0%25B0%25D1%2588%25D0%25BA%25D0%25B5%25D0%25BD%25D1%2582%252C%2520%25D0%25AE%25D0%25BD%25D1%2583%25D1%2581%25D0%25B0%25D0%25B1%25D0%25B0%25D0%25B4%25D1%2581%25D0%25BA%25D0%25B8%25D0%25B9%2520%25D1%2580%25D0%25B0%25D0%25B9%25D0%25BE%25D0%25BD%252C%2520%25D0%25BC%25D0%25B0%25D1%2585%25D0%25B0%25D0%25BB%25D0%25BB%25D1%258F%2520%25D0%2591%25D0%25B5%25D0%25B3%25D1%2583%25D0%25B1%25D0%25BE%25D1%2580
		&yandex_gid=10335
			`,
	success: (d)=>{
		console.log(d)
	},
	type: "GET",
})
var osld = encodeURIComponent(encodeURI("=Узбекистан, Ташкент, Юнусабадский район, махалля Богишамол").replaceAll(",", "%2C"))
var osld = decodeURIComponent(decodeURI("%3D%25D0%25A3%25D0%25B7%25D0%25B1%25D0%25B5%25D0%25BA%25D0%25B8%25D1%2581%25D1%2582%25D0%25B0%25D0%25BD%252C%2520%25D0%25A2%25D0%25B0%25D1%2588%25D0%25BA%25D0%25B5%25D0%25BD%25D1%2582%252C%2520%25D0%25AE%25D0%25BD%25D1%2583%25D1%2581%25D0%25B0%25D0%25B1%25D0%25B0%25D0%25B4%25D1%2581%25D0%25BA%25D0%25B8%25D0%25B9%2520%25D1%2580%25D0%25B0%25D0%25B9%25D0%25BE%25D0%25BD%252C%2520%25D0%25BC%25D0%25B0%25D1%2585%25D0%25B0%25D0%25BB%25D0%25BB%25D1%258F%2520%25D0%2591%25D0%25BE%25D0%25B3%25D0%25B8%25D1%2588%25D0%25B0%25D0%25BC%25D0%25BE%25D0%25BB"))

var mah = ["Бегубор","Богишамол","Нурмакон","Мингчинор","Ифтихор","Уста Ширин","Буюк турон","Кашкар","Богиэрам","Бодомзор","Хусниобод","Акбаробод","Кадирдон","Увайсий","Севинч","Ахилобод","Юнус ота","Янгитарнов","Фирдавсий","Мирзо Улугбек","Ахмад Дониш","Мурувват","Минор","Шайх Шивли","Бузсув","Отчопар-1","Отчопар-2","Янгибог","Шахристон","Узбекистон Мустакиллиги","Кўшчинор","Собиробод","Йулайрик","Адолат","Кулолкўргон","Биллур","Гайратий","Матонат","Богибўстон","Обод","Турк-кургон","Жомий","Янги Арик","Анарзор","Юнусобод","Туркистон","Астробод","Тикланиш","Шарк-Хакикати","Хасанбой","Исломобод","Посира","Катта Хасанбой","Хамкоробод","Уч кахрамон","Янги Хаёт","Халкабог","Бободехкон","Юртобод","Шоштепа","Мехнатобод","Октепа","Хиёбонтепа","Диёробод","Фозилтепа","Ўрикзор","Кўксарой","Зарафшон","Кўргонтепа","Гузар","Пахтакор","Дегрез","Чўпон-ота","Богистон","Истирохат","Янгийўл","Хамдўст","Богичинор","Ширин","Тепакўргон","Шофайиз-боги","Козигузар","Алихонтўра Согуний","Дийдор","Катта-Кани","Шафтолизор","Бекобод","Жарбулок","Ибрат","Шарк-гули","Кор-ёгди","Найман","Давлатобод","Хайратий","Нуробод","Бирлик","Абдулла Кодирий","Хуршид","Учтепа","Кўркамобод","Куйидархон","Чаманзор","Юсуф Саккокий","Латифгузар","Такачи","Ок-масжид","Бешкайрогоч","Зулфизар","Ўткир","Хожиобод","Кўхна-чўпонота","Заргарлик","Богобод","Тинчликобод","Фарход","Журжоний","Ватан","Ватанпарвар","Кўкча-октепа","Хуросон","Шарк-юлдузи","Хондамир","Нишаб-арик","Табассум","Шон-Шухрат","Ачабод","Шифокорлар","Жийдали","Чаманбог","Эски шахар","Юкори Бешкўргон","Нихол","Орзу","Аллон","Мойарик","Университет","Чилтугон","Ахил","Мирзо голиб","Зиё","Иброхим ота","Чустий","Куёш","Юкори Себзор","Себзор","Янги Себзор","Мискин","Чигатой октепа","Хофиз Кухакий","Хастимом","Гулзор","Гулсарой","Тараккиёт","Хончорбог","Намуна","Хазрати Имом","Абу Бакр Шоший","Кўштут","Чигатой Дарвоза","Олимпия","Беруний","Хислат","Ёшлик","Мустакиллик","Галаба","Умид","Янги Тошкент","Тепагузар","Шодиёна","Пахта","Чукурсой","Ислом ота","Олтинсой","Гани Аъзамов","Гуруч арик","Корасарой","Гузарбоши","Чимбой","Истикбол","Кичкирик","Бўстонобод","Фидойилар","Алимкент","Истиклол","Дўстобод","Маърифат","Жўрабек","Ўрта Масжид","Бехизор","Кўйликобод","Катта кўйлик","Олмос","Янги Давр","Бунёдкор","Кўксарой","Хосиятли","Уйсозлар","Мумтоз","М.Ашрафий","Тарнов Боши","Янгикўргон","Жаркўргон","Тўйтепа","Чўлпон","Бойкўргон","Симург","Машинасозлар","Яшнобод","Асалобод","Икбол","Махмур","Фазогир","Авиасозлар","Ахмад Яссавий","Ширинобод","Бойсун","Беш бола","Нодира","Парвоз","Янгинур","Ойдинкўл","Донишманд","Дилбог","Илтифот","Катта Янгиобод","Шохимардон","Бешарик","Баркамол","Шохсанам","Тонг","Бирлашган","Наврўзобод","Ватандош","Амир Темур","Тузел","Мохинур","Ал Бухорий","Гўзал","Ўқчи-Олмазор","Авайхон","Олтинтепа","Олмачи","Турон","Сайрам","М.Исмоилий","Асака","Нур","Окибат","Х.Олимжон","Шахрисабз","Улугбек","Лашкарбеги","Мустакиллик","Оккўргон","Олий Химмат","Навнихол","Шахриобод","Катта ялангоч ота","Камолот","Феруза","Мунавваркори","Бўз","Элобод","Подшобог","Буюк Ипак йўли","Дархон","Ялангоч","Шўр тепа","Нодирабегим","Бахор","Олимлар","Ш.Бурхонов","Алишер Навоий","Катта Олтинтепа","Алпомиш","Султония","Шалола","Х.Абдуллаев","Богимайдон","Уйгониш","Ал-Фаробий","Тракторсозлар","Ахиллик","Азамат","Юзработ","Ахмад Югнакий","Хумоюн","Бешкапа","Чимён","Гулсанам","Катта корасув","Минглола","Янги Авайхон","Бек Тўпи","Ал-Хоразмий","Катта Хирмонтепа","Шарк","Шараф","Кўтарма","Чўпон-Ота","Тирсакобод","Гавхар","I-Чарх Комолон","Катта Олмазор","Бешёгоч","Лутфий","Хирмонтепа","Фидокор","Мехржон","Бахористон","Дўмбиробод","Бешчинор","Дилобод","Навбахор","Халклар Дўстлиги","Ок-Тепа","Катта Дўмбиробод","1-Катортол","Катта козиробод","III-Чарх Комолон","Хонтўпи","Шарк Тонги","Хайробод","Гулистон","Нафосат","Кичик Хирмонтепа","Мевазор","Яккабог","Бўрижар","Яккатут","Шухрат","Заркўргон","Наккошлик","Ботирма","Катортол","II-Катортол","Богзор","Новза","Чилонзор","1-Катта Чилонзор","3-Катта Чилонзор","2-Катта Чилонзор","II-Чарх Комолон","Бешгўрғон","Эски Жарарик","Обиназир","Ибн Сино","Шодлик","Янги Белтепа","Белтепа","Катта октепа","Маннон Уйгур","Кўкча","Ипакчи","Янгиобод","Коратош","Зангиота","Катта ховуз","Кохота","Ўрда","Лабзак","Бўстон","Тахтапул","Хувайдо","Гулбозор","Зафаробод","Янги Жарарик","Катта Жарарик","Ўзбекистон","Илгор","Жарарик","Бог кўча","Гулобод","Сархумдон","Янги шахар","Чорсу","Хадра","Шайхонтохур","Жангох","Ўкчи","Чакар","Эшонгузар","Янги Комолон","Комолон","Катта бог","Комолон Дарвоза","Чархновза","Самарканд Дарвоза","Кўкча Дарвоза","Оклон","Сузукота","Шофайз","Олим Хўжаев","Олмазор","Тинчлик","Кўшкоргон","Мададкор","Навкирон","Ал Фаргоний","Чорбог","Викор","Йўлдош","Чарогон","Нилуфар","Иттифок","Нурхаёт","Саховат","Сохибкрон","Зийнат","Хабибий","Олтин водий","Учувчилар","Халкобод","Маданият","Шукрона","Зиёкор","Асробод","Кумарик","Қубай тепа","Жунарик","Ўзгариш","Бунёдобод","Эзгулик","Янги Сергели","Сугдиёна","Кипчок","Курувчилар","Хонобод","Дарёбўйи","Дўстлик","Ёркин хаёт","Олчазор","Софдил","Мехригиё","Нўғойқўрғон","Чоштепа","Янги Чоштепа","Паст Дархон","Ташаббус","Янги Умид","Хумо","Юқори Дархон","Салар","Тонг Юлдузи","Фуркат","Олтинкўл","Баратхўжа","Файзиобод","Парвона","Кўйлик Ота","Мовароуннахр","Корасув","Ок-уй","Байналминал","Миробод","Афросиёб","Ат-Термизий","Ш.Рашидов","Заминобод","Темирйўлчилар","Билимдон","Абдулла Авлоний","Саракул","Янги Замон","Абдурауф Фитрат","Инокобод","Наврўз","Банокатий","Янги Миробод","Биродарлик","Истиклолобод","Зиёнур","Толарик","Юксалиш","Ойбек","Мингўрик","Лолазор","Фаровон","Баёт","Чинор","Янги кўйлик","Яккасарой","Бошлик","Мухандислар","Шохжахон","Мерос","Ракатбоши","Юнус Ражабий","Хамид Сулаймонов","Богсарой","Кушбеги","Бобур","Дамарик","Абдулла Каххор","Конституция","Беларик","Ракат","Дилбулок","Тўкимачи","Муқимий","Тепа","Армугон","Чашма","Зилола","Миришкор","Рохат","Мажнунтол","Икбол","Абай","Хусайин Бойкаро","Бектемир","Олтинтопган","Нурафшон","Бинокор"]
var idmah = []
for (let i = 0; i < mah.length; i++) 
	$.ajax({
		url: `https://suggest-maps.yandex.uz/suggest-geo?`,
		data: {
			"add_chains_loc":"1",
			"add_rubrics_loc":"1",
			"bases":"geo",
			"client_reqid":"1655204379167_153140",
			"fullpath":"1",
			"lang":"ru_UZ",
			"ll":"69.29195349999998,41.328193199204925",
			"origin":"maps-search-form",
			"outformat":"json",
			"part":"махалля "+mah[i],
			"pos":"19",
			"spn":"0.0319668390436334,0.010182991530925278",
			"v":"9"
		},
		success: (d)=>{
			idmah.push(d.results[0].personalization_info.where.source_id)
			console.log(idmah)
		},
		type: "GET",
	})





window.initRent = function(itemOptions, callback) {
	checkeGeo();
	var latlng = itemOptions.mainLatLng;
	Utils.currentMap = new ymaps.Map("map-rent", {
		center: latlng,
		zoom: 12,
		checkZoomRange: true,
		restrictMapArea: true,
		searchControlProvider: "yandex#search",
		controls: ["zoomControl", "typeSelector", "fullscreenControl", "searchControl"]
	})


	Areas.drawPolygon(areasPolygon);

	$.ajax({
		type: "GET",
    url: itemOptions.url,
		success: function(response){
			Rent.objects = [];
			var balloonTemplate, latlng;



			$(response).map(function(i, el){


				balloonTemplate = 
					'<div class="rent-balloon">'+
						'<p><a href="'+el.url+'" target="_blank">'+el.title+'</a></p>'+
						'<img src="'+el.images+'">'+
						'<p>Комнат: '+el.rooms+'</p>'+
						'<p>Площадь: '+el.square+' кв. м</p>'+
						'<p>Цена: '+
							'<span class="price-usd">'+intSpace(el.priceSum, ",")+' сум</span>'+
							'<span class="price-us">'+intSpace(el.price, ",")+' $</span>'+
							'</p>'+
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
				el.properties.set({
					keywords: el.options.get("item").keywords
				})
				el.options.set({
					type: "point",
					iconLayout: 'default#image',
					iconImageHref: sold == "sold" ? markerStyle_2 : markerStyle_1,
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


	Utils.searchInit(50);

	Rent.besideEntitySelect = $('#beside_entity_select');

	// Событие при пойске (load)
	Utils.searchControl.events.add("load", function(e){
		Utils.searchDots = Utils.searchControl.getResultsArray();
		ymaps.geoQuery(Utils.searchDots).each(function(el, i){
			el.events.add("click", function(e){
				//e.preventDefault();
				var that = e.get("target");

				Rent.drop();
				Rent.hide(Rent.objectsContainingPolygon);

				Utils.currentCenter = that.geometry.getCoordinates();

				// Рисуем круг
				Utils.circle = Utils.drawCircle(1500, Utils.currentCenter);
				Utils.currentMap.setCenter(that.geometry.getCoordinates(), 14, {duration: 0});

				// Скрываем не нужно на карте
				Rent.objectsContainingPolygon = Rent.apartments.searchInside(Utils.circle);
				Rent.filterBar();
				console.log(that);
			})
		})
		//Rent.besideBalloon = ymaps.geoQuery(Utils.searchDots).search("properties.id = '" + data.idCompany + "'").get(0);
		/*

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
		
		*/
	});

	// Выбор организации
	Rent.besideEntitySelect.on("change.once", function(){

		try{

			var data = JSON.parse($(this.selectedOptions).attr("data-all"));
			Rent.besideBalloon = ymaps.geoQuery(Utils.searchDots).search("properties.id = '" + data.idCompany + "'").get(0);



			Utils.currentCenter = Rent.besideBalloon.geometry.getCoordinates();
			Utils.currentMap.setCenter(Utils.currentCenter, 14, {duration: 300});

			// Скрываем не нужно на карте
			Rent.drop();
			Rent.hide(Rent.objectsContainingPolygon);


			// Рисуем круг
			Utils.circle = Utils.drawCircle(1500, data.coordinates);


			Rent.objectsContainingPolygon = Rent.apartments.searchInside(Utils.circle);
			Rent.filterBar();

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
	Utils.currentMap.setCenter(Utils.currentCenter, Utils.currentMap.getZoom(), {duration: 1000});
})


// Показать по фильтру
$("main").on("click", ".rent-bar .btn-view", function(){
	//Rent.filterBar();
	$("[data-reconstruction]").attr("data-reconstruction", "2").addClass("active");
	Utils.currentMap.container.fitToViewport();
	Utils.currentMap.setCenter(Utils.currentCenter, Utils.currentMap.getZoom(), {duration: 1000});

})

// Возврат к фильтру
$("main").on("click", ".btn-backbar", function(){
	$("[data-reconstruction]").attr("data-reconstruction", "2").removeClass("active");
	Utils.currentMap.container.fitToViewport();
	Utils.currentMap.setCenter(Utils.currentCenter, 12, {duration: 500});
})

// Фильтрация
$("main").on("change", "[data-rent-field-num], [data-rent-property], [data-rent-field-val]", function(){
	Rent.filterBar();
});


$(rentSelectAreas).on("change", function(){
	var index = $(this.selectedOptions).attr("data-i");
	if( index == "all" ){
		$('[data-action="whole"]').trigger("click");
		return;
	}

	Areas.items[index].events.fire("click");
	$(rentSelectAreas).map(function(i ,el){
		$(el).val(Areas.areasTitles[index]).trigger("change.select2");
	})

});






/*
	Инструментальный раутер хеш
*/

window.hash = decodeURI(location.hash);
window.search = function(){
	var textRequest = hash.match(/(search=)|(\(.*\))/gim)[0].replace(/[('")]/gim, "");
	$("#search_keywords").attr("value", textRequest).trigger("change");
	window.hashToolsStatus = true;
	location.hash = "";
}

window.hashFunc = function(functionName){
	var reg = new RegExp(functionName+"|\\([\'\"].*[\'\"]\\)", "gim")
	var diffusion = hash.match(reg);
	return diffusion[1].match(/\w+/gim);
}
window.toolStart = function(){
		var task = hashFunc("toolStart");
		if( !task )
			return;
		window.task = task[1]; // [0] Беру только первый переметр из массива

		var input = $("[data-action="+task+"]");

		if( input.length )
			input.trigger("click");
		
		window.hashToolsStatus = true;
}
window.hashTools = function(){
	if( window.hashToolsStatus )
		return;
	try{
		if( (/(toolStart)/gim).test(location.hash) ){
			toolStart();
		}
		if( (/(search)/gim).test(location.hash) ){
			search();
		}
	}catch(e){
		console.log("ошибка в функций %chashTools", "color:#00007f;",", подробнее пременной hashToolsError");
		window.hashToolsError = e;
	}
}






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
	//console.log(this.checked);
	//e.preventDefault();
	$('[name="renttools"]')
		.filter(":not(#"+that.attr("id")+")")
		.map( function(i, el){
			el.checked = false;
		});


	var action = that.attr("data-action");
	Rent.drop();
	Utils.searchControl.clear();

	if( action == "draw" && this.checked )
		$("#draw_textbox").addClass("active");
	else
		$("#draw_textbox").removeClass("active");
	
	switch(action){

		case "draw":
			Rent.draw();break;

		case "gps":
			Rent.gps();break;

		case "whole":
			Rent.whole();break;

		case "found":
			Rent.found("метро", action);break;

		case "schools":
			Rent.found("школа", action);break;



	}	

})
// Поиск
$("main").on("change", '#search_keywords', function(e){
	Rent.search( this.value );
})
// В избранное
$("main").on("click", '.rect-def [name="favorites"]', function(e){
	var that = $(this);
	$.ajax({
    type: "POST",
    url: "http://redd.lifestyle.uz/public/favorites.php",
    data: {
			favorites: that.val()
		},
    success: function(response) {
    	if( response.match(/add/gim) )
    		that.find("i").addClass("color-1");
    	if( response.match(/delete/gim) )
    		that.find("i").removeClass("color-1");
    },
    error: function(response) {
    	console.log("Ошибка при запросе на добавление в %cИзбранное", "color:#90AF13;text-transform:uppercase;");
    },
    complete: function(response) {}
	});
})


// Доступные стройки
$("main").on("change", '[name="pricebox"]', function(){
	$(".pricebox").find('[data-rent-field-num]').attr("value", "");

	window.currentPriceboxInputId = this.id;
	console.log(this.checked)
	var that = $(this);
	var min = that.attr("data-placebox-min")
	var max = that.attr("data-placebox-max")
	that.closest("div").find("[data-rent-min]").attr("value", min)
	that.closest("div").find("[data-rent-max]").attr("value", max)

	Rent.filterBar();
	$(".btn-hider").trigger("click");
})
$("main").on("click", '.btn-hider', function(){
	window.markBlock = $(".pricebox");
	markBlock.toggleClass("hider");
})


window.checkeGeo = function(){
  navigator.geolocation.getCurrentPosition(function(position) {

    // Get the coordinates of the current possition.
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;

    console.log(position.coords);

  });
}