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

interface FolderNode {
	name: string;
	images: ImageNode[];
	folders: FolderNode[];
}
interface ImageNode {
	filename: string;
	name: string;
}

let layout_counter = 0;
let filesystemRoot: FolderNode = {
	name: 'root',
	images: [],
	folders: [],
};
let filesystemPath: string[] = [];
let addViewerPath: string[] = []

function getCurrentFolder(path: string[]): FolderNode {
	let cur = filesystemRoot;
	for (const pathComponent of path) {
		let success = false;
		for (const node of cur.folders) {
			if (pathComponent === node.name) {
				cur = node;
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
// function getNodeDictionary(node: FileNode): { [name: string]: FileNode } {
// 	let ret: { [name: string]: FileNode } = {};
// 	for (const child of node.contents) {
// 		ret[child.name] = child;
// 	}
// 	return ret;
// }

$('.nav-tab').click(function () {
	$('.nav-tab').removeClass('nav-selected');
	let $tab = $(this);
	$tab.addClass('nav-selected');
	$('.main-tab').hide();
	$('.' + $tab.data('tab')).show();
});
$('#about').click(() => {
	$('#about-modal').show();
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

function makeFolderElement(folder: FolderNode, callback: () => void,
		closeCallback: () => void) : JQuery {
	let $div = $(document.createElement('div'));
	$div.addClass('folder');
	let $img = $(document.createElement('img'));
	$img.attr('src', 'folders.png');
	let label = $(document.createElement('span'));
	label.text(folder.name);
	$div.append($img);
	$div.append(label);
	$div.append(makeCloseButton(closeCallback));
	$div.click(callback);
	$div.on('dragover', (event) => {
		event.preventDefault();
		(event.dataTransfer || event.originalEvent.dataTransfer).dropEffect = "move";
		console.log('dragover');
		return false;
	});
	$div.on('drop', (event) => {
		event.stopPropagation();
		// event.preventDefault();
		console.log('drop');
		const dt = event.dataTransfer || event.originalEvent.dataTransfer;
		let [path, i] = JSON.parse(dt.getData("text/plain"));
		console.log(path, i);
		let sourceFolder = getCurrentFolder(path);
		let image = sourceFolder.images[i];
		sourceFolder.images.splice(i, 1);
		folder.images.push(image);
		rerenderFilesystem();
		return false;
	});
	return $div;
}
$('#new-folder-button').click(function () {
	const rawName = '' + $('#folder-name').val();
	const folder = getCurrentFolder(filesystemPath);
	$('#folder-name').val('');
	const nameBase = (rawName === '' ? 'New Folder' : rawName);
	let curName = nameBase;
	let i = 1;
	while (folder.folders.some((e) => e.name === curName)) {
		i += 1;
		curName = nameBase + ' ' + i;
	}
	folder.folders.push({
		name: curName,
		images: [],
		folders: [],
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

let colorActivated : boolean = true;
let viewActivated : boolean = true;
let licenseActivated : boolean = true;

$('#color-activate').click(() => {
	$('#color-select-middle').toggleClass('filter-item');
	$('#color-select').toggle();
});
$('#view-activate').click(() => {
	$('#view-select-middle').toggleClass('filter-item');
	$('#view-select').toggle();
});
$('#license-activate').click(() => {
	$('#license-select-middle').toggleClass('filter-item');
	$('#license-select').toggle();
});

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

let addViewerShown : boolean = true;
function rerenderFilesystem(): void {
	rerenderFilesystemViewer(filesystemPath,
		$('#filesystem-path'),
		$('#filesystem-viewer'));
	rerenderFilesystemViewer(addViewerPath,
		$('#add-viewer-path'),
		$('#add-viewer'),
		"You don't have any images in this folder you can add! Go to Folders to find and add an image first.",
		(image) => {
			addImage(image);
			addViewerShown = false;
			$('#add-viewer-outer').hide();
			$('#new-image-triangle').html('&#x25BC;');
		});
}
function rerenderFilesystemViewer(path: string[], $path: JQuery, $viewer: JQuery,
	emptyMsg?: string,
	imageCallback?: (image: ImageNode) => void): void {

	renderPath(path, $path);
	renderFiles(path, $viewer, emptyMsg, imageCallback);
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
			$path.append(' / ');
		}
	});
}
function renderFiles(path: string[], $target: JQuery, emptyMsg?: string, callback?: (image: ImageNode) => void): void {
	const folder = getCurrentFolder(path);
	$target.empty();
	let folderEmpty = false;
	folder.images.forEach((image, i) => {
		folderEmpty = false;
		const $div = $(document.createElement('div'));
		$div.attr('draggable', 'true');
		// $div.prop('draggable', 'true');
		// $div.prop('draggable', true);
		const dragdata = JSON.stringify([path, i]);
		console.log(dragdata);
		$div.on('dragstart', (event) => {
			console.log('dragstart');
			(event.dataTransfer || event.originalEvent.dataTransfer).effectAllowed = "move";
			(event.dataTransfer || event.originalEvent.dataTransfer).setData("text/plain", dragdata);
			console.log('end dragstart');
		});
		$div.addClass('folder-image');
		const $img = $('<img/>', {
			src: image.filename,
		});
		$div.append($img);
		$div.append(makeCloseButton(() => {
			folder.images.splice(i, 1);
			rerenderFilesystem();
		}));
		if (callback) {
			$img.click(() => callback(image));
		}
		$target.append($div);
	});
	folder.folders.forEach((subfolder, i) => {
		folderEmpty = false;
		$target.append(makeFolderElement(subfolder, () => {
			path.push(subfolder.name);
			rerenderFilesystem();
		}, () => {
			folder.folders.splice(i, 1);
			rerenderFilesystem();
		}));
	});
	if (folderEmpty && emptyMsg) {
		const $msgDiv = $('<div>', {
			'class': 'folder-full-msg',
		});
		$msgDiv.text(emptyMsg);
		$target.append($msgDiv);
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

function makeCloseButton(callback: () => void): JQuery {
	const $closeButton = $('<button>', {
		'class': 'close btn',
	});
	const $closeIcon = $('<span>', {
		'class': 'oi',
		'data-glyph': 'x',
	});
	$closeButton.append($closeIcon);
	$closeButton.click(callback);
	return $closeButton;
}

function addImage(image: ImageNode): void {
	const $img = $('<div>');
	$img.addClass('layout-image');
	const $closeButton = makeCloseButton(() => $img.remove());
	$img.append(`
		<img src="${image.filename}" alt="${image.name}">
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
		layout_counter+=1;
		$img.css('z-index',layout_counter);

	});
	$('.layout-area').append($img);
}

$(document).ready(() => {
	$('.modal-outer').click(function (event) {
		$(this).hide();
		event.stopPropagation();
	});
	$('#add-to-folders').click(() => {
		if (focusedSearchImage) {
			// wow such haxx
			getCurrentFolder(filesystemPath).images.push({
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
		addViewerShown = !addViewerShown;
		if(addViewerShown) {
			$('#add-viewer-outer').show();
			$('#new-image-triangle').html('&#x25B2;');
		} else {
			$('#add-viewer-outer').hide();
			$('#new-image-triangle').html('&#x25BC;');
		}
	});
	rerenderFilesystem();
});
