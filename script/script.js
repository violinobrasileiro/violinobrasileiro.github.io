/* Music list (music.html): level filter + "load more" pagination.
   Levels: "01" iniciante, "02" intermediário, "03" avançado, "all". */

var ML_PAGE_SIZE = 10;
var mlLevel = "all";
var mlShown = ML_PAGE_SIZE;

function mlMatches(item, level) {
	return level === "all" || item.className.indexOf(level) > -1;
}

/* show the first `mlShown` items of the current level, hide the rest,
   and update the "Ver mais" button */
function mlRender() {
	var items = document.getElementsByClassName("music-list-item");
	var i, matched = 0, visible = 0;
	for (i = 0; i < items.length; i++) {
		removeClass(items[i], "show");
		removeClass(items[i], "paged-out");
		if (!mlMatches(items[i], mlLevel)) continue;
		matched++;
		addClass(items[i], "show");
		if (visible < mlShown) {
			visible++;
		} else {
			addClass(items[i], "paged-out");
		}
	}
	var btn = document.getElementById("ml-load-more");
	if (btn) btn.hidden = mlShown >= matched;
}

/* kept name for the inline onclick handlers / deep-link init */
function filterObjects(c) {
	mlLevel = (!c || c === "all") ? "all" : c;
	mlShown = ML_PAGE_SIZE;
	mlRender();
}

function mlLoadMore() {
	mlShown += ML_PAGE_SIZE;
	mlRender();
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

/* On load: build the "Ver mais" button, then honour ?nivel=01|02|03 from
   the home page level cards (defaults to all). No-op without a music list. */
(function(){
	var list = document.getElementById("music-list");
	if (!list || document.getElementsByClassName("music-list-item").length === 0) return;

	var btn = document.createElement("button");
	btn.id = "ml-load-more";
	btn.type = "button";
	btn.className = "ml-load-more";
	btn.textContent = "Ver mais";
	btn.addEventListener("click", mlLoadMore);
	list.appendChild(btn);

	var match = (window.location.search || "").match(/[?&]nivel=(0[123]|all)/);
	applyFilter(match ? match[1] : "all");
})();
