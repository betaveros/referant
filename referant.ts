/// <reference path ="jquery/jquery.d.ts"/>
/// <reference path ="jquery/jquery-ui.d.ts"/>

interface Image {
	filename: string;
	keywords: string[];
	colors: string[];
	view?: string[],
	license?: string[],
}

const images: Image[] = [
	{
		filename: 'dog1.jpg',
		keywords: ['dog'],
		colors: ['white', 'black'],
		view: ['side'],
		license: ['reuse', 'public domain'],
	},
	{
		filename: 'dog2.jpg',
		keywords: ['dog'],
		colors: ['orange'],
		view: ['front'],
		license: ['reuse'],
	},
	{
		filename: 'dog3.jpg',
		keywords: ['dog'],
		colors: ['orange'],
		view: ['front'],
		license: ['reuse', 'public domain'],
	},
	{
		filename: 'dog4.jpg',
		keywords: ['dog'],
		colors: ['black'],
		view: ['back'],
		license: ['reuse'],
	},
	{
		filename: 'dog5.jpg',
		keywords: ['dog'],
		colors: ['orange', 'white'],
		view: ['front'],
	},
	{
		filename: 'dog6.jpg',
		keywords: ['dog'],
		colors: ['orange', 'white'],
		view: ['side'],
	},
	{
		filename: 'labrador.jpg',
		keywords: ['dog', 'labrador'],
		colors: ['yellow'],
		view: ['front'],
	},
	{
		filename: 'red-daisy.jpg',
		keywords: ['daisy', 'flower'],
		colors: ['red'],
		license: ['reuse'],
	},
	{
		filename: 'purple-flowers.jpg',
		keywords: ['flower'],
		colors: ['purple'],
		license: ['reuse'],
	},
	{
		filename: 'cardinal.jpg',
		keywords: ['cardinal', 'bird'],
		colors: ['red'],
		view: ['side'],
	},
	{
		filename: 'ducklings.jpg',
		keywords: ['duck', 'bird'],
		colors: ['yellow'],
		view: ['side'],
	},
	{
		filename: 'shark.jpg',
		keywords: ['shark'],
		colors: ['blue'],
		view: ['side'],
		license: ['reuse'],
	},
	{
		filename: 'iguana.jpg',
		keywords: ['lizard', 'iguana'],
		colors: ['green'],
		view: ['side'],
	},
	{
		filename: 'cat.jpg',
		keywords: ['cat'],
		colors: ['gray', 'blue'],
		view: ['front'],
	},
	{
		filename: 'pond1.jpg',
		keywords: ['pond', 'water'],
		colors: ['blue', 'green'],
	},
	{
		filename: 'lava.jpeg',
		keywords: ['lava'],
		colors: ['red', 'gray'],
		license: ['reuse'],
	},
	{
		filename: 'forest.jpg',
		keywords: ['forest'],
		colors: ['green'],
		license: ['reuse', 'public domain'],
	},
	{
		filename: 'jelly.jpg',
		keywords: ['jellyfish', 'jelly'],
		colors: ['blue', 'orange'],
		view: ['side'],
	},
	{
		filename: 'cave-barbados.jpg',
		keywords: ['cave', 'barbados'],
		colors: ['orange'],
		license: ['reuse', 'public domain'],
	},
	{
		filename: 'limestone-cave.jpg',
		keywords: ['cave', 'limestone'],
		colors: ['blue', 'orange', 'green', 'white', 'gray']
	},
	{
		filename: 'punkva-cave.jpg',
		keywords: ['cave'],
		colors: ['white', 'orange'],
		license: ['reuse', 'public domain'],
	},
	{
		filename: 'sea-cave.jpg',
		keywords: ['sea', 'cave'],
		colors: ['black', 'orange']
	},
	{
		filename: 'stone-cave.jpg',
		keywords: ['stone', 'cave', 'vines'],
		colors: ['green', 'gray'],
		license: ['reuse', 'public domain'],
	},
	{
		filename: 'sunset-cave.jpg',
		keywords: ['sunset', 'cave'],
		colors: ['orange', 'black']
	},
	{
		filename: 'sunset.jpg',
		keywords: ['sunset', 'view'],
		colors: ['purple'],
		license: ['reuse'],
	},
	{
		filename: 'wheat-hills.jpg',
		keywords: ['wheat', 'hill'],
		colors: ['yellow', 'blue']
	},
	{
		filename: 'moon.jpg',
		keywords: ['moon', 'night', 'sky', 'astronomy'],
		colors: ['gray'],
		license: ['reuse'],
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
let addViewerPath: string[] = []

function getCurrentNodes(path: string[]): FileNode[] {
	let cur = filesystem;
	for (const pathComponent of path) {
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

function makeFolder(name: string, callback: () => void) : JQuery {
	let $div = $(document.createElement('div'));
	$div.addClass('folder');
	let $img = $(document.createElement('img'));
	$img.attr('src', 'folders.png');
	let label = $(document.createElement('span'));
	label.text(name);
	$div.append($img);
	$div.append(label);
	$div.click(callback);
	return $div;
}
$('#new-folder-button').click(function () {
	const rawName = '' + $('#folder-name').val();
	const nodesRef = getCurrentNodes(filesystemPath);
	$('#folder-name').val('');
	const nameBase = (rawName === '' ? 'New Folder' : rawName);
	let curName = nameBase;
	let i = 1;
	while (nodesRef.some((e) => e.name === curName)) {
		i += 1;
		curName = nameBase + ' ' + i;
	}
	nodesRef.push({
		type: 'folder',
		name: curName,
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
$('#color-activate').click(() => $('#color-select').toggle());
$('#view-activate').click(() => $('#view-select').toggle());
$('#license-activate').click(() => $('#license-select').toggle());

interface SearchResult {
	element: JQuery;
	filename: string;
}

interface Filter {
	key: string;
	value: string;
	element?: JQuery;
}

const colorFilterNames : string[] = ["red", "yellow", "blue", "green", "purple", "orange", "white", "gray", "black"];
const viewFilterNames : string[] = ["front", "side", "back"];
const licenseFilterNames : string[] = ["reuse", "public domain"];

let activeFilters = new Map();

function makeColorCheck(color?: string): JQuery {
	const ret = $('<span>', {
		'class': 'oi color-check',
		'data-glyph': 'check',
	});
	if (color) ret.css('color', color);
	return ret;
}
function makeRadioButton(name: string, label: string, callback: () => void, checked?: boolean): JQuery {
	const id = name + '-' + label;
	const $ret = $('<span>');
	const $button = $('<input>', {
		'type': 'radio',
		'name': name,
		'id': id,
		'value': label,
	});
	if (checked) {
		$button.prop('checked', true);
	}
	$button.change(callback);
	const $label = $('<label>', {
		'for': id,
	});
	$label.text(label);
	$ret.append($button);
	$ret.append($label);
	return $ret;
}

const darkColors = ['black', 'blue', 'purple'];
$(document).ready(function () {
	const colorSelect = $('#color-select');
	const anyColorButton = $(document.createElement('button'));
	anyColorButton.addClass('any-color');
	anyColorButton.addClass('color-selected');
	anyColorButton.append(makeColorCheck());
	anyColorButton.append('Any');
	anyColorButton.click(function () {
		$('#color-select button').removeClass('color-selected');
		anyColorButton.addClass('color-selected');
		setColorFilter(undefined);
	});
	colorSelect.append(anyColorButton);
	for(const filter of colorFilterNames) {
		const button = $(document.createElement('button'));
		button.append(makeColorCheck(darkColors.indexOf(filter) !== -1 ? 'white' : undefined));
		button.css('background-color', filter);
		button.click(function () {
			$('#color-select button').removeClass('color-selected');
			button.addClass('color-selected');
			setColorFilter(filter);
		});
		colorSelect.append(button);
	}
	const updateViewCallback = () => {
		const val = $('#view-select input:checked').val().toString();
		setViewFilter(val === 'any' ? undefined : val);
	};
	const viewSelect = $('#view-select');
	viewSelect.append(makeRadioButton('view', 'any', updateViewCallback, true));
	for (const view of viewFilterNames) {
		viewSelect.append(makeRadioButton('view', view, updateViewCallback));
	}

	const licenseViewCallback = () => {
		const val = $('#license-select input:checked').val().toString();
		setLicenseFilter(val === 'any' ? undefined : val);
	};
	const licenseSelect = $('#license-select');
	licenseSelect.append(makeRadioButton('license', 'any', licenseViewCallback, true));
	for (const license of licenseFilterNames) {
		licenseSelect.append(makeRadioButton('license', license, licenseViewCallback));
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
	let values: string[]|undefined = image[filter.key];
	return values !== undefined && values.indexOf(filter.value) !== -1;
}

function rerenderFilesystem(): void {
	rerenderFilesystemViewer(filesystemPath,
		$('#filesystem-path'),
		$('#filesystem-viewer'));
	rerenderFilesystemViewer(addViewerPath,
		$('#add-viewer-path'),
		$('#add-viewer'),
		"You don't have any images in this folder you can add!",
		(node) => {
			if (node.type === 'image') {
				addImage(node.filename, node.name);
			}
			$('#add-viewer-outer').hide();
		});
}
function rerenderFilesystemViewer(path: string[], $path: JQuery, $viewer: JQuery,
	emptyMsg?: string,
	nodeCallback?: (node: FileNode) => void): void {

	renderPath(path, $path);
	renderFiles(path, $viewer, emptyMsg, nodeCallback);
}
function renderPath(path, $path): void {
	$path.empty();
	['Home'].concat(path).forEach((e, i) => {
		if (i === path.length) {
			$path.append(e);
		} else {
			const $button = $('<button>', {
				'class': 'btn btn-path',
			});
			$button.text(e);
			$button.click(() => {
				path.splice(i, path.length - i);
				rerenderFilesystem();
			});
			$path.append($button);
			$path.append(' &raquo; ');
		}
	});
}
function renderFiles(path: FileNode[], $target: JQuery, emptyMsg?: string, callback?: (FileNode) => void): void {
	const files = getCurrentNodes(path);
	$target.empty();
	if (files.length) {
		for (const node of files) {
			if (node.type === 'folder') {
				$target.append(makeFolder(node.name, () => {
					path.push(node.name);
					rerenderFilesystem();
				}));
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
		if (emptyMsg) {
			const $msgDiv = $('<div>', {
				'class': 'folder-full-msg',
			});
			$msgDiv.text(emptyMsg);
			$target.append($msgDiv);
		}
	}
}

let focusedSearchImage: Image|undefined = undefined;

function getAllActiveFilters(): Filter[] {
	const filters = Array.from(activeFilters.values());
	if (colorFilter !== undefined) {
		filters.push({
			key: 'colors',
			value: colorFilter,
		});
	}
	if (viewFilter !== undefined) {
		filters.push({
			key: 'view',
			value: viewFilter,
		});
	}
	if (licenseFilter !== undefined) {
		filters.push({
			key: 'license',
			value: licenseFilter,
		});
	}
	return filters;
}

function updateSearchResults() {
	$('#search-results').empty();
	const query = $('#search-query').val();
	const allActiveFilters = getAllActiveFilters();
	if(query !== '' || allActiveFilters.length !== 0) for (const image of images) {
		if (matchesQuery(image, query.toString()) &&
			allActiveFilters.every((filter) =>
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

let colorFilter: string|undefined = undefined;
let viewFilter: string|undefined = undefined;
let licenseFilter: string|undefined = undefined;
function setColorFilter(filter: string|undefined) {
	colorFilter = filter;
	$('#color-activate').text('Color: ' + (colorFilter || 'any'));
	updateSearchResults();
}
function setViewFilter(filter: string|undefined) {
	viewFilter = filter;
	$('#view-activate').text('View: ' + (viewFilter || 'any'));
	updateSearchResults();
}
function setLicenseFilter(filter: string|undefined) {
	licenseFilter = filter;
	$('#license-activate').text('License: ' + (licenseFilter || 'any'));
	updateSearchResults();
}

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
		x.html('&times;');
		const writing = $(document.createElement('span'));
		writing.addClass('filter-label');
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
	const $closeButton = $('<button>', {
		'class': 'close btn',
	});
	const $closeIcon = $('<span>', {
		'class': 'oi',
		'data-glyph': 'x',
	});
	$closeButton.append($closeIcon);
	$closeButton.click(() => $img.remove());
	$img.append(`
		<img src="${filename}" alt="${alt}">
		<div class="ui-resizable-handle ui-resizable-nw" id="nwgrip"></div>
		<div class="ui-resizable-handle ui-resizable-ne" id="negrip"></div>
		<div class="ui-resizable-handle ui-resizable-sw" id="swgrip"></div>
		<div class="ui-resizable-handle ui-resizable-se" id="segrip"></div>
	`);
	$img.append($closeButton);
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
			// wow such haxx
			getCurrentNodes(filesystemPath).push({
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
		rerenderFilesystem();
		$('#add-viewer-outer').show();
	});
	rerenderFilesystem();
});
