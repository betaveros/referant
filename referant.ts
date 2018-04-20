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
	{
		filename: 'iguana.jpg',
		keywords: ['lizard', 'iguana'],
		colors: ['green']
	},
	{
		filename: 'cat.jpg',
		keywords: ['cat'],
		colors: ['gray', 'blue'],
	},
	{
		filename: 'pond1.jpg',
		keywords: ['pond', 'water'],
		colors: ['blue', 'green'],
	},
	{
		filename: 'lava.jpeg',
		keywords: ['lava'],
		colors: ['red', 'gray']
	},
	{
		filename: 'forest.jpg',
		keywords: ['forest'],
		colors: ['green']
	},
	{
		filename: 'jelly.jpg',
		keywords: ['jellyfish', 'jelly'],
		colors: ['blue', 'orange']
	}
];

let filesystem: any[] = [];

$('.nav-tab').click(function () {
	$('.nav-tab').removeClass('nav-selected');
	let $tab = $(this);
	$tab.addClass('nav-selected');
	$('.main-tab').hide();
	$('.' + $tab.data('tab')).show();
});

let shown : boolean = true;
$('#header-dialog').click(function() {
	shown = !shown;
	if(shown) {
		$('#main-dialog').show();
		$('#triangle').html('&#x25B2;');
	} else {
		$('#main-dialog').hide();
		$('#triangle').html('&#x25BC;');
	}
})

$('#search-button').click(function () {
	$('#search-dialog').toggle();
});

interface Folder {
	name: string;
	elements: any[];
	isFolder: boolean;
}

function makeFolder(name: string) : Folder {
	let $div = $(document.createElement('div'));
	$div.addClass('folder');
	let $img = $(document.createElement('img'));
	$img.attr('src', 'folders.png');
	let label = $(document.createElement('span'));
	label.text(name);
	$div.append($img);
	$div.append(label);
	return $div;
}
$('#new-folder-button').click(function () {
	const rawName = $('#folder-name').val();
	const name = rawName === '' ? 'Unnamed Folder' : rawName;
	filesystem.push({name: name, elements: [], isFolder: true});
	rerenderFilesystem();
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

interface SearchResult {
	element: JQuery
	7
}

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
	if(image.filename.indexOf(query) !== -1) return true;
	for(const keyword of image.keywords) {
		if(keyword.indexOf(query) !== -1) return true;
	}
	return false;
}
function matchesFilter(image: Image, filter: Filter): boolean {
	return image[filter.key].indexOf(filter.value) !== -1;
}

function rerenderFilesystem() {
	$('#filesystem-viewer').empty();
	for (const node of filesystem) {
		if (node.isFolder) {
			console.log('folder');
			$('#filesystem-viewer').append(makeFolder(node.name));
		} else {
			$('#filesystem-viewer').append($('<img/>', {
				src: node,
			}));
		}
	}
}

function updateSearchResults() {
	$('#search-results').empty();
	const query = $('#search-query').val();
	for (const image of images) {
		if (matchesQuery(image, query.toString()) &&
			Array.from(activeFilters.values()).every((filter) =>
				matchesFilter(image, filter))) {
			const $img = $('<img/>', {
				src: image.filename,
			});
			$img.click(() => {
				const $imgFocus = $('<div/>', {
					'class': 'image-focus',
				});
				$imgFocus.append($img.clone());
				const $imgAddButton = $('<button/>', {
					'class': 'btn',
				});
				$imgAddButton.text('add');
				$imgAddButton.click(() => {
					filesystem.push(image.filename);
					rerenderFilesystem();
				});
				$imgFocus.append($imgAddButton);
				$img.replaceWith($imgFocus);
			});
			$('#search-results').append($img);
		}
	}
}

$('#search-query').keyup(updateSearchResults);

function makeFilter(key: string, name: string) {
	if(activeFilters.has(name)) {
		const item = activeFilters.get(name)
		item.element.addClass('attention');
		item.element.on('animationend', function (e) {
			if(e.originalEvent.animationName === 'attention') {
				item.element.removeClass('attention');
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
		const index = Math.floor(Math.random() * images.length);
		addImage(images[index].filename, images[index].keywords[0]);
	});
});
