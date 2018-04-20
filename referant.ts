/// <reference path ="jquery/jquery.d.ts"/>
/// <reference path ="jquery/jquery-ui.d.ts"/>

$('.nav-tab').click(function () {
	$('.nav-tab').removeClass('nav-selected');
	let $tab = $(this);
	$tab.addClass('nav-selected');
	$('.main-tab').hide();
	$('.' + $tab.data('tab')).show();
});

$('#search-button').click(function () {
	$('#search-dialog').toggle();
});
function makeFolder() {
	let $div = $(document.createElement('div'));
	$div.addClass('folder');
	let $img = $(document.createElement('img'));
	$img.attr('src', 'folders.png');
	$div.append($img);
	return $div;
}
$('#new-folder-button').click(function () {
	$('.main-folders').append(makeFolder());
});
interface DragStatus {
	x: number;
	y: number;
};
$('.layout-img').draggable();
$('.layout-img').resizable({
	aspectRatio: true,
	handles: {
		'nw': '.ui-resizable-nw',
		'ne': '.ui-resizable-ne',
		'sw': '.ui-resizable-sw',
		'se': '.ui-resizable-se',
	}
});
let colorVisible = true;
$('#color-activate').click(function () {
	colorVisible = !colorVisible;
    if (colorVisible) {
        $('#color-select').show();
    } else {
        $('#color-select').hide();
    }
});

const filterNames : string[] = ["red", "yellow", "blue", "green", "purple", "orange", "white", "gray", "black"];

let activeFilters = new Map();

$(document).ready(function () {
	const select = $('#color-select');
	for(const filter of filterNames) {
		const button = $(document.createElement('button'));
		button.css('background-color', filter);
		button.click(function () {
			makeFilter(filter);
		});
		select.append(button);
	}
});

function makeFilter(name: string) {
	console.log(activeFilters);
	if(activeFilters.has(name)) {
		const item = activeFilters.get(name)
		item.addClass('attention');
		item.on('animationend', function (e) {
			if(e.originalEvent.animationName === 'attention') {
				item.removeClass('attention');
			}
		})
	} else {
		const thing = $(document.createElement('div'));
		const x = $(document.createElement('button'));
		x.text('x');
		const writing = $(document.createElement('span'));
		writing.text(name);
		thing.append(x);
		thing.append(writing);
		activeFilters.set(name, thing);
		$('#filterlist').append(thing);
		x.click(function() {
			thing.remove();
			activeFilters.delete(name);
		})
	}
}