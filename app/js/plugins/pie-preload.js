    


window.preLoader = {
  preBox: ".pre-box",
  enter: false,
  status: $(".pre-box").hasClass("in"),

  preToggle: function(bool, func) {
    var endtime = 600;
    if (!this.enter) return;
    if (typeof func === "function")
      setTimeout(function() {
        func();
      }, endtime);
    var preBox = $(this.preBox);

    bool || this.status ?
      preBox.removeClass("in").setTimeout(function() {
        $(preBox).hide();
      }, endtime) :
      preBox
      .show()
      .addClass("in")
      .find(".box-content");

    return (this.status = !this.status);
  },

  preImg: function(img) {
    var images = img || document.images,
      imagesTotalCount = images.length,
      imagesLoadedCount = 0,
      preloadPercent = $(".percent").text("0 %");

    if (imagesTotalCount == 0) {
      preOnload();
      $(preloadPercent).text("100 %");
    }

    for (var i = 0; i < imagesTotalCount; i++) {
      var image_clone = new Image();
      image_clone.onload = image_loaded;
      image_clone.onerror = image_loaded;
      image_clone.src = images[i].src;
    }

    function preOnload() {
      onLoaded();
    }

    function image_loaded() {
      imagesLoadedCount++;

      var per = (100 / imagesTotalCount * imagesLoadedCount) << 0;

      setTimeout(function() {
        //console.log(per);
        $(preloadPercent).text(per + "%");
      }, 1);

      if (imagesLoadedCount >= imagesTotalCount) preOnload();
    }
  }
};
preLoader.preImg();