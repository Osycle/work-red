
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
			if( that.areasTitles[inc] == el.options.get("title") )
				el.options.set({
					fillColor: "#cc2527",
					strokeColor: "#cc2527"
				})
			else
				el.options.set({
					fillColor: "#cc252700",
					strokeColor: "#cc252700"
				});
		});
	},
	drawPolygon: function(arr){
		window.mata = arr;
		for (var i = 0; i < arr.length; i++) {
			var polygon = arr[i].data.items[0].displayGeometry.geometries[0].coordinates[0];
			//console.log(polygon[0].coordinates[0]);
			
			var areasPolygon = new ymaps.Polygon([polygon],
				{
					// Содержимое балуна.
					//balloonContent: "Рыбные места"+i
				}, {
					inc: i,
					title: arr[i].data.items[0].title,
					description: arr[i].data.items[0].description,
					address: arr[i].data.items[0].address,
					coordinates: arr[i].data.items[0].coordinates,
					bounds: arr[i].data.items[0].bounds,
					//fillImageHref: 'images/lake.png',
					fillMethod: 'stretch',
					fillColor: "#cc252700",
					fillOpacity: "0.4",
					type: "polygon",
					strokeColor: "#cc252700",
					strokeWidth: 2,
					stroke: true
				}
			);
			Areas.items.push(areasPolygon);
			Utils.currentMap.geoObjects.add(areasPolygon);

			areasPolygon.events.add("mouseenter", function(e){
				var that = e.get("target");
				if( Areas.areasTitles[Areas.currentAreaInc] != that.options.get("title") )
					that.options.set({
						fillColor: "#fff",
						strokeColor: "#cc2527"
					});
			});
			areasPolygon.events.add("mouseleave", function(e){
				var that = e.get("target");
				if( Areas.areasTitles[Areas.currentAreaInc] != that.options.get("title") )
					that.options.set({
						fillColor: "#cc252700",
						strokeColor: "#cc252700"
					});
			});

			areasPolygon.events.add("click", function(e){
				var that = e.get("target");
				var inc = that.options.get("inc");
				Areas.activeArea(inc);

				if( Rent.apartments ){
					Rent.apartments.setOptions({
						visible: false
					});
					//Rent.apartments.removeFromMap(Utils.currentMap);
				}
				rentCom.map(function(i, el){
					var val = $(el).val();
					if( !isNaN(val*1) && val != ""){
						//console.log( $(el).val(), (val != "") );
					}
						
				})
				//Rent.apartments
				var polygon = Areas.items[Areas.currentAreaInc];
				var objectsContainingPolygon = Rent.apartments.searchInside(polygon);
				objectsContainingPolygon.each(function(el, i){
					el.options.set({
						visible: true
					});
				})

				Rent.filterBar(Rent.apartments);

			})

		}
	},


};
var rentProperty = $("[data-rent-checkboxes] [data-rent-property]");
var rentCom = $("[data-rent-coms] [data-rent-field]");

/*Rent*/
window.Rent = {

	filterBar: function(obj){
		var propertyAttr;
		var item;
		var property;
		var elInput;
		obj.each(function(objItem, i){
			item = objItem.options.get("item");
			property = item.property;
			var novalid;
			for (var i = 0; i < rentProperty.length; i++) {
				elInput = rentProperty[i];
				propertyAttr = $(rentProperty[i]).attr("data-rent-property")
				if( !(property[propertyAttr] == elInput.checked || property[propertyAttr]) ){
					novalid = true;
					console.log( "property:"+property[propertyAttr], elInput, elInput.checked );
					break;
				}
				//console.info(el.checked);
			}
			for (var i = 0; i < rentCom.length; i++) {
				rentCom[i] = $(rentCom[i]);
				var fieldName = rentCom[i].attr("data-rent-field");

				var min = rentCom[i].filter("[data-rent-min]").val()*1 || 0;
				var max = rentCom[i].filter("[data-rent-max]").val()*1 || Infinity;

				if ( min <= item[fieldName] && item[fieldName] <= max ) {
					//console.log("Прошел", min, max, item[fieldName], min < item[fieldName]);
				}else{
					novalid = true;
					//console.log("НЕПрошел");
					break;
				}

			}
			if( novalid ){
				objItem.options.set({
					//iconLayout: 'default#image',
					//iconImageHref: "img/icons/marker-offices-2.png",
					//iconImageSize: [29, 41],
					visible: false
				});
			}
			rentProperty.map(function(i, el){
			})
		})
	}
}

/*Utils*/
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
				results: 30,
				provider: 'yandex#search'	
			}
		});
		

		that.currentMap.controls.add(that.searchControl);
	},


	drawCircle: function(radius, latlng){
		// Создаем круг.
		var circle = new ymaps.Circle([
				// Координаты центра круга.
				latlng,
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
		iconImageHref: "img/icons/marker-green.png",
		iconImageSize: [21, 30]
	});
	Utils.currentMap.geoObjects.add(marker);


	return Utils.currentMap;

}



window.initRent = function(itemOptions) {

	var latlng = itemOptions.mainLatLng;
	Utils.currentMap = new ymaps.Map('map-rent', {
		center: latlng,
		zoom: 12,
		checkZoomRange: true,
		restrictMapArea: true,
		searchControlProvider: 'yandex#search',
		controls: []
	})
	
	Areas.drawPolygon(areasPolygon);
	//Areas.activeArea(0);

	$.ajax({
		type: "GET",
    url: "apartments.json",
		success: function(response){
			//console.log(response);
			//Areas.activeArea(0);			
			Rent.objects = [];
			$(response).map(function(i, el){
				var latlng = [ el.lat, el.lng ];
				Rent.objects.push(new ymaps.Placemark(latlng, {
					balloonContent: el.balloonContent
				}, {
					item: el
				}));

			})


			if( window.Rent.apartments ){
				Rent.apartments.setOptions({
					visible: false
				});

			}

			Rent.apartments = ymaps.geoQuery(Rent.objects).addToMap(Utils.currentMap);
			Rent.apartments.each(function(el, i){
				console.log(el);
				el.options.set({
					type: "point",
					iconLayout: 'default#image',
					iconImageHref: "img/icons/marker-green.png",
					iconImageSize: [21, 30],
					visible: false
				});
			})

		},
    complete: function(response){}
	});


	Utils.searchInit();

	var besideEntitySelect = $('#beside-entity');
	Utils.searchControl.events.add("load", function(e){
		e.preventDefault();
		Utils.searchDots = Utils.searchControl.getResultsArray();
		//Utils.dotsInCircle(Utils.searchDots, circle);
		besideEntitySelect.html("");
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
			besideEntitySelect.append(newOption).trigger('change.refresh');

		}
		//сортируем строки по имени
		var sortOptions = besideEntitySelect.find('option').sort(function(a, b){
			var nameA = a.textContent.toLowerCase(), 
					nameB = b.textContent.toLowerCase();
			if (nameA < nameB) 
			  return -1;
			if (nameA > nameB)
			  return 1;
			return 0;
		})
		besideEntitySelect.append(sortOptions);
		
		
	});

	besideEntitySelect.on("change.once", function(){
		try{
			var data = JSON.parse($(this.selectedOptions).attr("data-all"));
			Rent.currentBalloon = ymaps.geoQuery(Utils.searchDots).search("properties.id = '" + data.idCompany + "'").get(0);
			console.log(data);
			Utils.currentMap.panTo(Rent.currentBalloon.geometry.getCoordinates(), {

				callback: function () {
					setTimeout(function(){
						Rent.currentBalloon.balloon.open();
					}, 2000)

				}

			});
			setTimeout(function(){
				Rent.currentBalloon.balloon.open();
			}, 2000)
			//Rent.currentBalloon.get(0).balloon.open();
			Rent.circle = Utils.drawCircle(1500, data.coordinates);

			var objectsContainingPolygon = Rent.apartments.searchInside(Rent.circle);
			objectsContainingPolygon.each(function(el, i){
				el.options.set({
					visible: true
				});
			})


		}catch(e){
			console.info(e);
		}
	})


	//var circle = Utils.drawCircle(1500, latlng);
	//Utils.dotsInCircle(Utils.searchDots, circle);








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
$(".rent").on("click", "[data-search-enty]", function(){
	var searchRequest = $(this).attr("data-search-enty");
	console.log(searchRequest);
	Utils.searchControl.search(searchRequest);
});

