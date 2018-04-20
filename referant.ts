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
		filename: 'labrador.jpg',
		keywords: ['dog', 'labrador'],
		colors: ['yellow'],
	},
	{
		filename: 'red-daisy.jpg',
		keywords: ['daisy', 'flower'],
		colors: ['red'],
	},
	{
		filename: 'purple-flowers.jpg',
		keywords: ['flower'],
		colors: ['purple'],
	},
	{
		filename: 'cardinal.jpg',
		keywords: ['cardinal', 'bird'],
		colors: ['red'],
	},
	{
		filename: 'ducklings.jpg',
		keywords: ['duck', 'bird'],
		colors: ['yellow'],
	},
	{
		filename: 'shark.jpg',
		keywords: ['shark'],
		colors: ['blue'],
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
	{
		filename: 'sunset.jpg',
		keywords: ['sunset', 'view'],
		colors: ['purple']
	},
	{
		filename: 'wheat-hills.jpg',
		keywords: ['wheat', 'hill'],
		colors: ['yellow', 'blue']
	},
	{
		filename: 'moon.jpg',
		keywords: ['moon', 'night', 'sky', 'astronomy'],
		colors: ['gray']
	}
];

interface FileNode {
	type: "image"|"folder";
	name: string;
	filename?: string;
	contents?: FileNode[];
}

let filesystem: FileNode[] = [];
let filesystemPath: string[] = [];

function getCurrentNodes(): FileNode[] {
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

function makeFolder(name: string) : JQuery {
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
	const rawName = '' + $('#folder-name').val();
	$('#folder-name').val('');
	const name = (rawName === '' ? 'New Folder' : rawName);
	filesystem.push({
		type: 'folder',
		name: name,
		contents: [] as FileNode[],
	});
	rerenderFilesystem();
	console.log("nothing");
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

function rerenderFilesystem(): void {
	renderFiles(filesystem, $('#filesystem-viewer'));
}
function renderFiles(files: FileNode[], $target: JQuery, emptyMsg?: string, callback?: (FileNode) => void): void {
	$target.empty();
	if (files.length) {
		for (const node of files) {
			if (node.type === 'folder') {
				$target.append(makeFolder(node.name));
			} else {
				const $img = $('<img/>', {
					src: node.filename,
				});
				if (callback) {
					$img.click(() => callback(node));
				}
				$target.append($img);
			}
		}
	} else {
		$target.text(emptyMsg);
	}
}

let focusedSearchImage: Image = undefined;

function updateSearchResults() {
	$('#search-results').empty();
	const query = $('#search-query').val();
	if(query !== '' || activeFilters.size !== 0) for (const image of images) {
		if (matchesQuery(image, query.toString()) &&
			Array.from(activeFilters.values()).every((filter) =>
				matchesFilter(image, filter))) {
			const $img = $('<img/>', {
				src: image.filename,
			});
			$img.click(() => {
				focusedSearchImage = image;
				$('#search-modal img').attr('src', image.filename);
				$('#search-modal .filename').text(image.filename);
				$('#search-modal .description').text(`${image.keywords.join(', ')}`);
				$('#search-modal').show();
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
	$('.modal-outer').click(function () {
		$(this).hide();
	});
	$('#add-to-folders').click(() => {
		if (focusedSearchImage) {
			filesystem.push({
				type: "image",
				name: focusedSearchImage.filename,
				filename: focusedSearchImage.filename,
				// contents: undefined,
			});
		};
		rerenderFilesystem();
		$('#search-modal').hide();
	});
	$('#new-image-button').click(() => {
		const $addViewer = $('#add-to-layout-viewer');
		renderFiles(filesystem, $addViewer, "You don't have any images in your folders you can add yet!", (node) => {
			if (node.type === 'image') {
				addImage(node.filename, node.name);
			}
			$addViewer.hide();
		});
		$addViewer.css('display', 'grid');
	});
});
