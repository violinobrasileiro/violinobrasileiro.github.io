/* Music list filtering (music.html).
   Levels: "01" iniciante, "02" intermediário, "03" avançado, "all". */

function filterObjects(c){
	var x, i;
	x = document.getElementsByClassName("music-list-item");
	if (c == "all") c = "";
	for (i=0; i < x.length; i++) {
		removeClass (x[i], "show");
		if(x[i].className.indexOf(c) > -1) addClass(x[i], "show")
	}
}

/* highlight the matching filter button */
function setActiveTag(level){
	var tags = document.querySelectorAll(".ListFilterTag .filterTag");
	var index = { "all": 0, "01": 1, "02": 2, "03": 3 };
	var active = index[level] != null ? index[level] : 0;
	for (var i = 0; i < tags.length; i++){
		removeClass(tags[i], "TagSelected");
	}
	if (tags[active]) addClass(tags[active], "TagSelected");
}

/* filter + highlight together (used by the buttons and on page load) */
function applyFilter(level){
	filterObjects(level);
	setActiveTag(level);
}

function addClass(element, name){
	var i, arr1, arr2;
	arr1 = element.className.split(" ");
	arr2 = name.split(" ");
	for(i=0; i < arr2.length; i++){
		if (arr1.indexOf(arr2[i]) == -1){
			element.className += " " + arr2[i];
		}
	}

}

function removeClass(element, name){
	var i, arr1, arr2;
	arr1 = element.className.split(" ");
	arr2 = name.split(" ");
	for(i=0; i < arr2.length; i++){
		while (arr1.indexOf(arr2[i]) > -1){
			arr1.splice(arr1.indexOf(arr2[i]), 1);
		}
	}
	element.className = arr1.join(" ");
}

/* On load: if the URL carries ?nivel=01|02|03 (from the home page level
   cards), open the list already filtered to that level. Otherwise show all.
   No-op on pages without a music list. */
(function(){
	if (document.getElementsByClassName("music-list-item").length === 0) return;
	var match = (window.location.search || "").match(/[?&]nivel=(0[123]|all)/);
	applyFilter(match ? match[1] : "all");
})();
