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
	},
	{
		filename: 'cave-barbados.jpg',
		keywords: ['cave', 'barbados'],
		colors: ['orange']
	},
	{
		filename: 'limestone-cave.jpg',
		keywords: ['cave', 'limestone'],
		colors: ['blue', 'orange', 'green', 'white', 'gray']
	},
	{
		filename: 'punkva-cave.jpg',
		keywords: ['cave'],
		colors: ['white', 'orange']
	},
	{
		filename: 'sea-cave.jpg',
		keywords: ['sea', 'cave'],
		colors: ['black', 'orange']
	},
	{
		filename: 'stone-cave.jpg',
		keywords: ['stone', 'cave', 'vines'],
		colors: ['green', 'gray']
	},
	{
		filename: 'sunset-cave.jpg',
		keywords: ['sunset', 'cave'],
		colors: ['orange', 'black']
	},
];

interface FileNode {
	type: "image"|"folder";
	name: string;
	filename?: string;
	contents?: FileNode[];
}

let filesystem: FileNode[] = [];
let filesystemPath: string[] = [];

function getCurrentNode() {
	let cur = filesystem;
	for (const pathComponent of filesystemPath) {
		let success = false;
		for (const node of cur) {
			if (pathComponent === node.name) {
				if (node.type !== "folder") {
					console.error('suddenly image :(');
					break;
				}
				cur = node.contents;
				success = true;
				break;
			}
		}
		if (!success) {
			console.error('bad path!');
		}
	}
	return cur;
}
function getNodeDictionary(node: FileNode): { [name: string]: FileNode } {
	let ret: { [name: string]: FileNode } = {};
	for (const child of node.contents) {
		ret[child.name] = child;
	}
	return ret;
}

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
	filesystem.push({
		type: 'folder',
		name: 'New Folder',
		contents: [] as FileNode[],
	});
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
	element: JQuery;
	filename: string;
}

interface Folder {
	key: string;
	name: string;
	element: JQuery;
	textbox: JQuery;
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
		if (node.type === 'folder') {
			$('#filesystem-viewer').append(makeFolder());
		} else {
			$('#filesystem-viewer').append($('<img/>', {
				src: node.filename,
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
					filesystem.push({
						type: "image",
						name: image.filename,
						filename: image.filename,
						// contents: undefined,
					});
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
	console.log(activeFilters);
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
		addImage(images[Math.floor(Math.random() * images.length)].filename, "dog");
	});
});
