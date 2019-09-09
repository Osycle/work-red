"use strict";



(function() {
	$(function() {



		/*AOS*/
		if( "AOS" in window ){
			AOS.init({
				offset: 100,
				once: true,
				duration: 1100,
				delay: 150
			});
			setTimeout(function() { AOS.refresh(); }, 1);
		}


		/* SELECT2 */
		
		if ( $(".js-select").length )
			$(".js-select").select2({
				placeholder: "Выберите...",
				allowClear: false,
				minimumResultsForSearch: Infinity,
				dropdownParent: ($('.select2-wrapper').length > 0) ? $('.select2-wrapper') : false
			});

		if ( $(".js-select-search").length )
			$(".js-select-search").select2({
				placeholder: "Выберите...",
				allowClear: false,
				minimumResultsForSearch: Infinity
			});



		


		/*Owl carousel*/
		var owlBtn = [
			'<span class="owl-btn previous">'+
				'<i class="icm icm-arrow-pointing-to-right"></i>'+
			'</span><span class="owl-btn-t">пред.</span>', 
			'<span class="owl-btn-t">след.</span><span class="owl-btn next">'+
				'<i class="icm icm-arrow-pointing-to-right"></i>'+
			'</span>'
		]
		var owlBtnMin = [
			'<span class="owl-btn previous">'+
				'<i class="icm icm-arrow-pointing-to-right"></i>', 
			'<span class="owl-btn next">'+
				'<i class="icm icm-arrow-pointing-to-right"></i>'+
			'</span>'
		]


		

		$(".short-news-items.owl-carousel").owlCarousel({
			nav: !checkSm(),
			//items: 3,
			dots: false,
			dotsEach: true,
			autoplay: true,
			mouseDrag: false,
			touchDrag: true,
			//pullDrag: false,
			stagePadding: 18,
			responsive:{
				0:{items:1},
				991:{items:4}
			},
			navText : owlBtn,
			margin: 22
		});
		$(".apartment-slider-items.owl-carousel").owlCarousel({
			nav: checkSm(),
			//items: 3,
			dots: !checkSm(),
			dotsEach: true,
			autoplay: true,
			mouseDrag: false,
			touchDrag: true,
			//pullDrag: false,
			stagePadding: 0,
			responsive:{
				0:{items:1},
				991:{items:1}
			},
			navText : owlBtnMin,
			margin: 0
		});

		$(".specialists-items.owl-carousel").owlCarousel({
			nav: true,
			//items: 3,
			dots: false,
			dotsEach: true,
			autoplay: true,
			mouseDrag: false,
			touchDrag: true,
			//pullDrag: false,
			stagePadding: 20,
			responsive:{
				0:{items:1},
				991:{items:4}
			},
			navText : owlBtn,
			margin: 20
		});


		if( $(".owl-nav-style-1").length > 0 ){
			$(".owl-nav-style-1").map(function( i, el ){
				$(el).find(".owl-prev").after($(el).find(".owl-dots"));
			})
			
		}
		$(".short-reviews-items.owl-carousel").owlCarousel({
			nav: !checkSm(),
			//items: 3,
			dots: false,
			dotsEach: true,
			autoplay: true,
			mouseDrag: false,
			touchDrag: true,
			//pullDrag: false,
			//stagePadding: 18,
			responsive:{
				0:{items:1},
				991:{items:2}
			},
			navText : owlBtn,
			margin: 30
		});

		

		/*FANCYBOX*/
		if ($("[data-fancybox]").length != 0)
			$("[data-fancybox]").fancybox({
				afterShow: function(instance, current) {},
				animationEffect : "zoom",
				animationDuration : 800,
				thumbs : {
					autoStart   : true
				},
				touch : false,
				transitionDuration : 366,
				transitionEffect: "zoom-in-out"
			});
		// SMOTHSCROLL-LINK
		if( "smoothScroll" in window )
			smoothScroll.init({
				easing: 'easeInOutCubic',
				offset: 85
			});
		/*ELEVATEZOOM*/
		if ( !checkSm() && $("[data-zoom-image]:not([group])").length )
			var x = $("[data-zoom-image]:not([group])").elevateZoom({
				scrollZoom: true,
				zoomWindowFadeIn: 500,
				zoomWindowFadeOut: 500,
				lensFadeIn: 300,
				lensFadeOut: 300,
				//cursor: 'pointer', 
				tint: true,
				tintColour: '#000',
				tintOpacity: 0.5,
				//zoomType        : "lens",
				//lensShape : "round",
				//lensSize    : 200,
				imageCrossfade: true,
				easing: true
			});



		//MIN-MENU
		$("#min-menu").mmenu({
			extensions: [
				"wrapper-bg", // wrapper-bg black
				"theme-dark",
				//"theme-white",
				//"fullscreen",
				"listview-50",
				"fx-panels-slide-up",
				"fx-listitems-drop",
				"border-offset",
				"position-front",
				"position-right"
			],
			navbar: {
				title: "Меню"
			},
			navbars: [{
					height: 0,
					content: [
						// '<div class="close-btn close-content bar">' +
						// '<a  href="#page" ><span class="icon-bar"></span><span class="icon-bar"></span></a>' +
						// '</div>'
					]
				},
				{
					content: ["prev", "title"]
				}
			]
		}, {});







		/*FLIKITY*/
		var arrowStyle = "M 198.608,246.104 382.664,62.04 c 5.068,-5.056 7.856,-11.816 7.856,-19.024 0,-7.212 -2.788,-13.968 -7.856,-19.032 L 366.536,7.864 C 361.476,2.792 354.712,0 347.504,0 340.296,0 333.54,2.792 328.476,7.864 L 109.328,227.008 c -5.084,5.08 -7.868,11.868 -7.848,19.084 -0.02,7.248 2.76,14.028 7.848,19.112 l 218.944,218.932 c 5.064,5.072 11.82,7.864 19.032,7.864 7.208,0 13.964,-2.792 19.032,-7.864 l 16.124,-16.12 c 10.492,-10.492 10.492,-27.572 0,-38.06 z";

		/*bnr-carousel*/
		if( $(".bnr-carousel .carousel-items figure").length ){
			window.bnrCarousel = $(".bnr-carousel").children(".carousel-items").flickity({
				imagesLoaded: true,
				autoPlay: false,
				pauseAutoPlayOnHover: true,
				arrowShape: "M 30,50 L 55,75 L 60,70 L 40,50  L 60,30 L 55,25 Z",
				initialIndex: 0,
				friction: 1,
				selectedAttraction: 1,
				prevNextButtons: true,
				draggable: false,
				wrapAround: true,
				pageDots: false,
				contain: false,
				percentPosition: true,
				cellSelector: 'figure',
				cellAlign: "center"
			});
			bnrCarousel.data("flickity");

			$(".bnr-carousel .carousel-items").append("<div class='container-arrows'></div>").find(".container-arrows").append($(".bnr-carousel .carousel-items .flickity-prev-next-button"))

			//$(".bnr-carousel .container-arrows").append('<button class="flickity-prev-next-button previous" type="button" aria-label="previous"><svg viewBox="0 0 100 100"><path d="M 30,50 L 55,75 L 60,70 L 40,50  L 60,30 L 55,25 Z" class="arrow"></path></svg></button><button class="flickity-prev-next-button next" type="button" aria-label="next"><svg viewBox="0 0 100 100"><path d="M 30,50 L 55,75 L 60,70 L 40,50  L 60,30 L 55,25 Z" class="arrow" transform="translate(100, 100) rotate(180) "></path></svg></button>');


		}

		if( $(".apartment-slider-items").length ){
			var apartmentSlider = $(".apartment-slider-items")
			apartmentSlider.flickity({
					imagesLoaded: true,
					autoPlay: 6000,
					pauseAutoPlayOnHover: true,
					arrowShape: "M 10,50 L 70,100 L 70,90 L 70,50  L 70,10 L 70,0 Z",
					initialIndex: 0,
					//friction: 1,
					//selectedAttraction: 1,
					prevNextButtons: true,
					draggable: false,
					wrapAround: true,
					pageDots: true,
					contain: false,
					percentPosition: true,
					cellSelector: 'figure',
					cellAlign: "center"
				});
			apartmentSlider.data("flickity");
			$('[data-fancybox="apartment"]').fancybox({
				afterShow: function(instance, current) {},
				animationEffect : "zoom",
				animationDuration : 800,
				loop: true,
				fullScreen : {
					autoStart : true,
				},
				thumbs : {
					autoStart   : false
				},
				touch : false,
				transitionDuration : 366,
				transitionEffect: "zoom-in-out"
			});
			apartmentSlider.find("figure").on("click", function(){
				apartmentSlider.flickity("next");
				console.log(this);
			})
			$(".btn-slide-fullscreen").on("click", function(){
				$('[data-fancybox="apartment"]')
				.eq(apartmentSlider.find("figure.is-selected").index()).click();
			});
		}

    // Прибавление-убавление значении
    (function(){
      var form = $("[data-counter]") || null;;
      if( !form )
        return;
      var cntfactor = form.attr("data-counter")*1;

      $(document).on("click", "[data-counter-btn]", function(){
        var cntVal;
        var cntInput = $(this).closest( form ).find("[data-counter-input]");
        
        cntVal = (cntInput.val()*1);

        if( $(this).hasClass("plus") )
          cntVal = cntVal + cntfactor;
        if( $(this).hasClass("minus") & cntVal > 0 )
          cntVal = cntVal - cntfactor;
        if( isNaN( cntVal ) || cntVal < 0) cntVal = 0;
        cntInput.val( cntVal ).attr("value", cntVal)
      })
      $(".cnt-input").on( "keypress", function(e){
        //console.log(this, e);
      } )

    })();


    
		/* datepicker */
		( function( factory ) {
			if ( typeof define === "function" && define.amd ) {
				// AMD. Register as an anonymous module.
				define( [ "../widgets/datepicker" ], factory );
			} else {
				// Browser globals
				factory( jQuery.datepicker );
			}
		}( function( datepicker ) {

		datepicker.regional.ru = {
			closeText: "Закрыть",
			prevText: "&#x3C;Пред",
			nextText: "След&#x3E;",
			currentText: "Сегодня",
			monthNames: [ "Январь","Февраль","Март","Апрель","Май","Июнь",
			"Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь" ],
			monthNamesShort: [ "Янв","Фев","Мар","Апр","Май","Июн",
			"Июл","Авг","Сен","Окт","Ноя","Дек" ],
			dayNames: [ "воскресенье","понедельник","вторник","среда","четверг","пятница","суббота" ],
			dayNamesShort: [ "вск","пнд","втр","срд","чтв","птн","сбт" ],
			dayNamesMin: [ "Вс","Пн","Вт","Ср","Чт","Пт","Сб" ],
			weekHeader: "Нед",
			dateFormat: "dd.mm.yy",
			firstDay: 1,
			isRTL: false,
			showMonthAfterYear: false,
			yearSuffix: "" };
		datepicker.setDefaults( datepicker.regional.ru );

		return datepicker.regional.ru;

		} ) );
		$.datepicker.regional[ "ru" ];

		$( ".datepicker-select" ).datepicker({
      showOn: "button",
      buttonText: "<i class='fa fa-calendar'></i>"
    });




		window.onLoaded = function() {
			/*MASONRY*/
			if ($(".grid-img").length != 0) {
				var $grid = $(".grid-img").masonry({
					itemSelector: ".grid-img-item",
					columnWidth: ".grid-img-sizer",
					percentPosition: true
				});
			}
			$(window).trigger("resize");
		}
		preLoader.preImg();
		
		//Лимит текста
		$("[data-text-limit]").map(function( i, el ){
			el = $(el);
			var text = el.text();
			var textLimit = el.attr("data-text-limit");
			if( text.length > textLimit*1 ){
				console.log(textLimit);
				text = text.substring(0, textLimit )
				el.text( text+ " ..." );
			}
		})

		// megamenu
		$(".header-top label[for]").on("click", function(){
			var that = $(this);
			var input = $( "#" + that.attr("for") );
			var li = that.closest("li");
			window.menuCurrentItem = input;

			li.siblings().removeClass("active");

			if( that.closest("li").hasClass("active") )
				that.closest("li").removeClass("active");
			else
				that.closest("li").addClass("active");

			console.log(that);
			setTimeout(function(){
				var openedStatus = $(".megamenu input[name=\"mega\"]").filter(function(i,el){ return el.checked;})
				if( openedStatus.length > 0)
					$(".megamenu").addClass("opened");
				else
					$(".megamenu").removeClass("opened");

			}, 2);

				if( input[0].checked )
					setTimeout(function(){
						input[0].checked = false;
					}, 1)
		})
		// fix megamenu
		$("main").on("click", function(){
			try{
				var id = $(menuCurrentItem).attr("id");
				$(".bargain-menu li.active label").trigger("click");
				menuCurrentItem[0].checked = false;
			}catch(e){}
		})


		//SCROLL
		var minMenu = $(".header-scroll") || null;
		var headerRange = false;
		var staffProgressStatus = false;
		$(window).on("scroll", function(e) {

			//Адаптация хедера при скролинге
			if ($(window).scrollTop() > 100 && headerRange == false) {

				headerRange = true;
				if (minMenu) minMenu.addClass("scrolled");

			} else if ($(window).scrollTop() < 100 && headerRange == true) {
				headerRange = !true;
				if (minMenu) minMenu.removeClass("scrolled");
			} //.originalEvent.wheelDelta

			if( $(".entity-bar-area").length < 0 ){

				var entityBarArea = $(".entity-bar-area");
				var entityBar = $(".entity-bar");
				var enContent = ( ($(".entity-content").offset().top) <= ($(window).scrollTop() + $(window).height() - ($(".entity-content").height() + 350)) )

				if( (entityBarArea.offset().top) <= ($(window).scrollTop() + 70) && !enContent){
					if(!entityBar.hasClass("entity-bar-fixed")){
						entityBar.addClass("entity-bar-fixed");
						$("main").before(entityBar);
					}
					console.log("В зоне", enContent);
				}else if( entityBar.hasClass("entity-bar-fixed") ){
					entityBar.removeClass("entity-bar-fixed");
					entityBarArea.after(entityBar);
					//console.log("не в зоне");
				}
			}

		});
		$(window).trigger("scroll");



/**
 * Ипотека
 * Рассчёт аннуитетного платежа 
 *
 */
if( $("#mortgage_rate").length > 0 ){
	var sumRange = $("#sum_range");
	var monthRange = $("#month_range");
	var sumRangeInput = $("#month_range_input");
	var monthRangeInput = $("#month_range_input");
	var mortagageRate = $("#mortgage_rate");

	var mortgageAmount = sumRange.ionRangeSlider({
		//type: "double",
		min: 10e6,
		max: 2e9,
		from: 0,
		to: 0,
		postfix: " сум",
		step: 100,
		grid: false,
	  onChange: function (data) {
	  	$("#sum_range_input").val(data.from);
	  	monthlyFeeChange();
	  }
	}).data("ionRangeSlider");

	var mortgageMonth = monthRange.ionRangeSlider({
		//type: "double",
		min: 1,
		max: 240,
		from: 0,
		to: 0,
		postfix: " мес",
		step: 1,
		grid: false,
	  onChange: function (data) {
	  	$("#month_range_input").val(data.from);
	  	monthlyFeeChange();
	  }
	}).data("ionRangeSlider");

	$(".mortagage-calc input").on("keyup", function(){

		var that = $(this);

		switch(that[0].id){
			case "sum_range_input": 
				mortgageAmount.update({ from: that.val() });break;
			case "month_range_input": 
				mortgageMonth.update({ from: that.val() });break;
		}
		monthlyFeeChange();

	});

	function monthlyFeeChange() {
		var sumVal;
		var monthVal;

		sumVal = sumRange.val();
		monthVal = monthRange.val();
		var monthlyFeeVal = monthlyFee(sumVal, monthVal, mortagageRate.val());
		var priceText =  roundFix(monthlyFeeVal, 2, true);
		console.log(priceText);
		if( priceText == "NaN" )
			return;
		$(".mortagage-total .cnt-price").text( priceText + " сум");
	}

	// Функция расчёта Ипотеки
	 window.monthlyFee = function(sumVal, monthVal, rate, onModal) {
	 	rate = rate/1200;
	 	var currentDebt = sumVal;
	 	var cntPow = Math.pow(( 1 + rate ), monthVal );
		var mFee =  sumVal * (rate * cntPow / (cntPow - 1));


		if( !onModal )
			return mFee;

		var mainDebt;
		var interestCharges;
		var tpl;

		$(".mortgage-table tbody").text("");
	 	for (var i = 0; i < monthVal; i++) {
	 		interestCharges = currentDebt * rate
	 		mainDebt = mFee - interestCharges; 
	 		currentDebt = currentDebt - mainDebt;
	 		
	 		tpl =	'<tr>' +
							'<td>' + roundFix(i+1, 2, true) + '</td>' +
							'<td>' + roundFix(currentDebt+mainDebt, 2, true) + '</td>' +
							'<td>' + roundFix(interestCharges, 2, true) + '</td>' +
							'<td>' + roundFix(mainDebt, 2, true) + '</td>' +
							'<td>' + roundFix(mFee, 2, true) + '</td>' +
						'</tr>';

			$(".mortgage-table tbody").append(tpl);

	 		//console.log(i+1, currentDebt+mainDebt , interestCharges, mainDebt);
	 	}
	 	$.fancybox.open({
	 		src  : '#mortgage-table',
	 		touch : false
	 	})
		return mFee;
	}
	$("#mortgage_rate").on("change", function(){
		monthlyFeeChange();
	})

	$(document).on( "click", "#detail_payment", function(){
		var sumVal = sumRange.val();
		var monthVal = monthRange.val();

		$(".mortgage-sum-text").text(sumVal);
		$(".mortgage-month-text").text(monthVal);
		$(".mortgage-rate-text").text(mortagageRate.val()+"%");

		monthlyFee(sumVal, monthVal, mortagageRate.val(), true);

	})
	monthlyFeeChange();
}




$("main").on("submit", "#search_form", function(e){
	e.preventDefault();
	var that = $(this);
	var val = that.find("[name='query']").val()
	var searchRequest = encodeURI(val);

	var searchLink =  that.find(".js-select-search option:checked").attr("data-search-link");

	window.ret = searchLink+("#search('" + searchRequest + "')");
	location.assign(ret);
	//location.reload();
})


/*
	Мгновенная оценка
*/

$("main").on("click", "[data-zone-num]", function(){
	var that = $(this);
	var int = that.attr("data-zone-num");
	$("[data-zone-num]").removeClass("active");
	window.currentZoneInt = int;
	var collections = $("[data-zone-num='"+int+"']");
	var zonePrice = $(".zone-price-"+int).attr("data-zone-price")
	$("[name='zoneprice']").attr("value", zonePrice);
	collections.addClass("active");
	$(".form-assessment-calc").trigger("submit");
});

$("main").on("change", "[data-zone-factor]", function(e){
	$(".form-assessment-calc").trigger("submit");
})
$("main").on("submit", ".form-assessment-calc", function(e){
	e.preventDefault();
	var that = $(this);
	window.endPrice = 0;
	var zonePrice = $("[name='zoneprice']").val();
	that.find("[data-zone-factor]").map(function(i, el){
		endPrice += (zonePrice * $(el).val()) - zonePrice;
	})
	endPrice = zonePrice*1 + endPrice*1
	$("[data-price-output]").text( Math.round(endPrice) )
})



/*
	Валюта
*/
window.currency = "";
window.currencySelect = $(".currency-select");
if( !localStorage.currency && currencySelect.length){
	currency = currencySelect.eq(0).val();
	localStorage.currency = currency;
	console.log(currency);
}else if(currencySelect.length){
	currencySelect.val(localStorage.currency);
}

switch(localStorage.currency){
	case "US":
		$("html").addClass("currency-price-us");
		break;
	case "USD":
		$("html").addClass("currency-price-usd");
		break;
}
$(document).on("change", ".currency-select", function(){
	var that = $(this);
	//$(that.selectedOptions).val();
	currency = that.val();
	localStorage.currency = currency;
	console.log(that.val());
	location.reload();
})



	});
})(jQuery);

var isWebkit = /Webkit/i.test(navigator.userAgent),
		isChrome = /Chrome/i.test(navigator.userAgent),
		isMac = /Mac/i.test(navigator.userAgent),
		isMobile = !!("ontouchstart" in window),
		isAndroid = /Android/i.test(navigator.userAgent),
		isEdge = /Edge/i.test(navigator.userAgent);


// COMMON FUNCTION

setTimeout(function() {
	//jQuery FUNCITON
	$.fn.onResized = function() {
		onResized(function() {
			this;
		});
		return this;
	};
}, 10);




function checkSm() {
	return $(document).width() <= 991;
}

function checkMd() {
	return $(document).width() < 1199 && !checkSm();
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomIntFloat(min, max) {
	return Math.random() * (max - min) + min;
}

function onResized(f) {
	if (typeof f === "function") f();
	$(window).on("resize", function(e) {
		if (typeof f === "function") f();
	});
	return this;
}

function scrolledDiv(el) {
	try {
		var docViewTop = $(window).scrollTop(),
			docViewBottom = docViewTop + $(window).height(),
			elTop = $(el).offset().top,
			elBottom = elTop + $(el).height() / 1.8;
	} catch (err) {
		console.error();
	}

	return elBottom <= docViewBottom && elTop >= docViewTop;
}

function intSpace( n, char ){
	var char = char || " ";
	if( isNaN(n*1) )
		return false;
	n += "";
	n = new Array(4 - n.length % 3).join("U") + n;
	var newInt = (n.replace(/([0-9U]{3})/g, "$1"+char).replace(/U/g, "")).trim();
	if( newInt.substring(newInt.length-1) == char)
		newInt = newInt.substring(0, newInt.length-1);
	if( newInt.substring(0, 1) == char)
		newInt = newInt.substring(1);

	return newInt;
}
function roundFix( num, cnt, space ){
	num += "";
	if( !(/\./.test(num)) ){
		if( space )
			return intSpace(num);
		return num;
	}
	var int = num.split(".")[0];
	var float = num.split(".")[1];
	if(space){
		int = intSpace(int);
		return (int+"."+float.substring( 0,  cnt));
	}
	return (int+"."+float.substring( 0,  cnt)) * 1;
}

