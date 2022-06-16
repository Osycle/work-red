


var areas


$.ajax({
	dataType: "json",
	// type: "GET",
	async: false,
	url: "/js/mahalla.json",
	success: function(response){
		areas = response

		// console.log(response)
	}
})

var areasExport = []
for (let i = 0; i < areas.length; i++) {
	var geoObjItem = areas[i].data.items[0];
	var geometries = geoObjItem.displayGeometry.geometries
	geoObjItem.coordinates = geoObjItem.coordinates.reverse()

	for (let i = 0; i < geometries.length; i++) {
	var geoCoords = geometries[i].coordinates;
		for (let i = 0; i < geoCoords.length; i++) {
			geoCoords[i] = geoCoords[i].map(coords=>{
				return coords.reverse()
			})
		}
	}
	areasExport.push(geoObjItem)
}
export default areasExport;



