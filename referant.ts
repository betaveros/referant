/// <reference path ="jquery/jquery.d.ts"/>
/// <reference path ="jquery/jquery-ui.d.ts"/>

interface Image {
	filename: string;
	keywords: string[];
	colors: string[];
}

const images: Image[] = [
	{
		filename: 'dog1.jpg',
		keywords: ['dog'],
		colors: ['white', 'black'],
	},
	{
		filename: 'dog2.jpg',
		keywords: ['dog'],
		colors: ['orange'],
	},
	{
		filename: 'dog3.jpg',
		keywords: ['dog'],
		colors: ['orange'],
	},
	{
		filename: 'dog4.jpg',
		keywords: ['dog'],
		colors: ['black'],
	},
	{
		filename: 'dog5.jpg',
		keywords: ['dog'],
		colors: ['orange', 'white'],
	},
	{
		filename: 'dog6.jpg',
		keywords: ['dog'],
		colors: ['orange', 'white'],
	},
];

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

interface Filter {
	key: string;
	value: string;
	element: JQuery;
}

const filterNames : string[] = ["red", "yellow", "blue", "green", "purple", "orange", "white", "gray", "black"];

let activeFilters = new Map();

$(document).ready(function () {
	const select = $('#color-select');
	for(const filter of filterNames) {
		const button = $(document.createElement('button'));
		button.css('background-color', filter);
		button.click(function () {
			makeFilter('colors', filter);
		});
		select.append(button);
	}
});

function matchesQuery(image: Image, query0: string): boolean {
	const query = query0.toLowerCase();
	return (image.filename.indexOf(query) !== -1 ||
		image.keywords.indexOf(query) !== -1);
}
function matchesFilter(image: Image, filter: Filter): boolean {
	return image[filter.key].indexOf(filter.value) !== -1;
}

function updateSearchResults() {
	$('#search-results').empty();
	const query = $('#search-query').val();
	for (const image of images) {
		if (matchesQuery(image, query.toString()) &&
			Array.from(activeFilters.values()).every((filter) =>
				matchesFilter(image, filter))) {
			const $img = $('<img/>', {
				src: image.filename
			});
			$('#search-results').append($img);
		}
	}
}

$('#search-query').keyup(updateSearchResults);

function makeFilter(key: string, name: string) {
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
		x.addClass('btn');
		x.text('x');
		const writing = $(document.createElement('span'));
		writing.text(name);
		thing.append(x);
		thing.append(writing);
		const filter: Filter = {
			key: key,
			value: name,
			element: thing,
		};
		$('#filterlist').append(thing);
		activeFilters.set(name, filter);
		updateSearchResults();
		x.click(function() {
			thing.remove();
			activeFilters.delete(name);
			updateSearchResults();
		})
	}
}
function addImage(filename: string, alt: string): void {
	const $img = $('<div>');
	$img.addClass('layout-image');
	$img.append(`
		<img src="${filename}" alt="${alt}">
		<div class="ui-resizable-handle ui-resizable-nw" id="nwgrip"></div>
		<div class="ui-resizable-handle ui-resizable-ne" id="negrip"></div>
		<div class="ui-resizable-handle ui-resizable-sw" id="swgrip"></div>
		<div class="ui-resizable-handle ui-resizable-se" id="segrip"></div>
	`);
	$img.draggable();
	$img.resizable({
		aspectRatio: true,
		handles: {
			'nw': '.ui-resizable-nw',
			'ne': '.ui-resizable-ne',
			'sw': '.ui-resizable-sw',
			'se': '.ui-resizable-se',
		}
	});
	$img.mousedown(() => {
		$('.layout-image').removeClass('layout-area-selected');
		$img.addClass('layout-area-selected');
	});
	$('.layout-area').append($img);
}
$(document).ready(() => {
	$('#new-image-button').click(() => {
		addImage(`dog${Math.floor(Math.random() * 6) + 1}.jpg`, "dog");
	});
});
