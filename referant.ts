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
const emptyRoot : FolderNode = {
	name: 'root',
	images: [],
	folders: [],
};
const exampleRoot : FolderNode = {"name":"root","images":[],"folders":[{"name":"Example Folder","images":[{"name":"red-daisy.jpg","filename":"red-daisy.jpg"},{"name":"shark.jpg","filename":"shark.jpg"}],"folders":[{"name":"Example Subfolder","images":[{"name":"moon.jpg","filename":"moon.jpg"}],"folders":[]}]}]}
let filesystemRoot = exampleRoot;
let filesystemPath: string[] = [];
let addViewerPath: string[] = [];
let searchAddPath: string[] = [];

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

$('.nav-link').click(function () {
	$('.nav-tab').removeClass('nav-selected');
	let $link = $(this);
	let tabName = $link.data('tab');
	let $tab = $(`.nav-tab[data-tab="${tabName}"]`);
	$tab.addClass('nav-selected');
	$('.main-tab').hide();
	$('.' + tabName).show();
});

let shown : boolean = false;
$('#search-dialog').hide();
$('#header-button').click(function() {
	shown = !shown;
	if(shown) {
		$('#search-dialog').show();
		$('#triangle').html('&#x25B2;');
	} else {
		$('#search-dialog').hide();
		$('#triangle').html('&#x25BC;');
	}
})

$('#search-button').click(function () {
	$('#search-dialog').toggle();
});

function dtOf(event: JQuery.Event<HTMLElement, null>): any {
	return (event as any).dataTransfer || (event as any).originalEvent.dataTransfer;
}

interface DraggedNodePathInfo {
	path: string[];
	isFolder: boolean;
	index: number;
}

let draggedNodePathInfo: DraggedNodePathInfo|undefined = undefined;

function dropDraggedNode(targetFolder: FolderNode) {
	if (draggedNodePathInfo) {
		console.log('drop!');
		let {path, isFolder, index} = draggedNodePathInfo;
		console.log(path, isFolder, index);
		let sourceFolder = getCurrentFolder(path);
		if (isFolder) {
			let movingFolder = sourceFolder.folders[index];
			sourceFolder.folders.splice(index, 1);
			targetFolder.folders.push(movingFolder);
		} else {
			let image = sourceFolder.images[index];
			sourceFolder.images.splice(index, 1);
			targetFolder.images.push(image);
		}
		rerenderFilesystem();
	}
}

function makeFolderElement(folderPath: string[], i: number, folder: FolderNode, callback: () => void,
		closeCallback: (e?: any) => void) : JQuery {
	let $div = $(document.createElement('div'));
	$div.addClass('folder');
	$div.addClass('folder-draggable-node');
	let $img = $(document.createElement('img'));
	$img.attr('src', 'folders.png');
	let label = $(document.createElement('span'));
	label.text(folder.name);
	$div.append($img);
	$div.append(label);
	$div.append(makeCloseButton(closeCallback));
	$div.click(callback);
	const myDraggedNodePathInfo: DraggedNodePathInfo = {
		path: folderPath.slice(0),
		isFolder: true,
		index: i,
	};
	$div.draggable({
		revert: 'invalid',
		classes: {
			"ui-draggable-dragging": "dragging",
		},
		stack: '.folder-draggable-node',
		start: () => {
			draggedNodePathInfo = myDraggedNodePathInfo;
		},
	} as any);
	$div.droppable({
		accept: '.folder-draggable-node',
		classes: {
			"ui-droppable-active": "drop-target",
			"ui-droppable-hover": "drop-target-hover",
		},
		drop: function(event, ui) {
			dropDraggedNode(folder);
		}
	} as any);
	return $div;
}

const folderErrorText = $('#folder-name-error-text');
attend(folderErrorText);

$('#new-folder-form').on('submit', function (e) {
	e.preventDefault();
	const name = '' + $('#folder-name').val();
	const folder = getCurrentFolder(filesystemPath);
	$('#folder-name').val('');
	if(name === '') {
		folderErrorText.text('Please enter a name for the new folder.');
		folderErrorText.addClass('attention');
		return;
	}
	if (folder.folders.some((e) => e.name === name)) {
		folderErrorText.text('That name is already taken; please enter a different name.');
		folderErrorText.addClass('attention');
		return;
	}
	folderErrorText.text('');
	folder.folders.push({
		name: name,
		images: [],
		folders: [],
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

let activated : string = "none";
const filters : string[] = ['color', 'view', 'license'];

function activate(filter: string) {
	$('#' + filter + '-select').show();
	$('#' + filter + '-select-middle').addClass('filter-item');
}
function deactivate(filter : string) {
	$('#' + filter + '-select').hide();
	$('#' + filter + '-select-middle').removeClass('filter-item');
}

$(document.documentElement).on('click', function() {
	if(filters.includes(activated)){
		deactivate(activated);
		activated = "none";
	}
})

for(const filter of filters) {
	$('#' + filter + '-select').hide();
	$('#' + filter + '-activate').click(function(e) {
		e.stopPropagation();
		if(filters.includes(activated)) {
			deactivate(activated);
		}
		if(activated === filter) {
			activated = "none";
		} else {
			activated = filter;
			activate(filter);
		}
	})
	$('#' + filter + '-select-middle').click(function(e) {
		e.stopPropagation();
	})
}

interface SearchResult {
	element: JQuery;
	filename: string;
}

interface Filter {
	key: string;
	value: string|Set<string>;
	valueIsSet: boolean;
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
function makeCheckbox(name: string, label: string, callback: (e?: any) => void, checked?: boolean, disabled?: boolean): JQuery {
	const id = name + '-' + label;
	const $ret = $('<span>');
	const $button = $('<input>', {
		'type': 'checkbox',
		'name': name,
		'id': id,
		'value': label,
	});
	if (checked) {
		$button.prop('checked', true);
	}
	if (disabled) {
		$button.prop('disabled', true);
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
	anyColorButton.attr('id', 'any-color');
	anyColorButton.addClass('any-color');
	anyColorButton.addClass('color-selected');
	anyColorButton.append(makeColorCheck());
	anyColorButton.append('Any');
	anyColorButton.click(function () {
		$('#color-select button').removeClass('color-selected');
		anyColorButton.addClass('color-selected');
		clearColorFilter();
	});
	colorSelect.append(anyColorButton);
	for(const filter of colorFilterNames) {
		const button = $(document.createElement('button'));
		button.append(makeColorCheck(darkColors.indexOf(filter) !== -1 ? 'white' : undefined));
		button.css('background-color', filter);
		button.click(function () {
			$('#any-color').removeClass('color-selected');
			button.toggleClass('color-selected');
			toggleColorFilter(filter);
		});
		colorSelect.append(button);
	}
	/*const updateViewCallback = () => {
		const val = $('#view-select input:checked').val().toString();
		console.log(val);
		setViewFilter(val === 'any' ? undefined : val);
	};*/
	const viewSelect = $('#view-select');
	viewSelect.append(makeCheckbox('view', 'none', function(e) {
		if($('#view-none').prop('checked')) for(const view of viewFilterNames) {
			$('#view-' + view).prop('disabled', true);
		} else for(const view of viewFilterNames) {
			$('#view-' + view).prop('disabled', false);
		}
		toggleViewFilterOn();
	}, true))
	for (const view of viewFilterNames) {
		viewSelect.append(makeCheckbox('view', view, function () {
			toggleViewFilter(view);
		}, true, true));
	}

	const licenseViewCallback = () => {
		const $val = $('#license-select input:checked').val();
		if (!$val) {
			console.error('empty license??');
			return;
		}
		const val = $val.toString();
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
	console.log(filter);
	let values: string[]|undefined = image[filter.key];
	if(values === undefined) return false;
	if(filter.valueIsSet) {
		return values.some(e => (filter.value as Set<string>).has(e));
	} else {
		return values.indexOf(filter.value as string) !== -1;
	}
}

let addViewerShown : boolean = true;
const DEFAULT_RATIO = 0.1;
function rerenderFilesystem(): void {
	rerenderFilesystemViewer(filesystemPath,
		$('#filesystem-path'),
		$('#filesystem-viewer'));
	rerenderFilesystemViewer(addViewerPath,
		$('#add-viewer-path'),
		$('#add-viewer'),
		"You don't have any images in this folder you can add! Go to Folders to find and add an image first.",
		(image) => {
			addImage({
				x: 0,
				y: 0,
				ratio: DEFAULT_RATIO,
				filename: image.filename,
			});
			addViewerShown = false;
			$('#add-viewer-outer').hide();
			$('#new-image-triangle').html('&#x25BC;');
		});
	rerenderFilesystemViewer(searchAddPath,
		$('#search-add-filesystem-path'),
		$('#search-add-filesystem-viewer'));
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
			const $span = $('<span>', {
				'class': 'path-working-folder',
			});
			$span.text(e);
			$path.append($span);
		} else {
			const $button = $('<button>', {
				'class': 'btn btn-path',
			});
			$button.text(e);
			$button.click(() => {
				path.splice(i, path.length - i);
				rerenderFilesystem();
			});
			let targetFolderNode = getCurrentFolder(path.slice(0, i));
			$button.droppable({
				accept: '.folder-image',
				classes: {
					"ui-droppable-active": "drop-target",
					"ui-droppable-hover": "drop-target-hover",
				},
				drop: function(event, ui) {
					dropDraggedNode(targetFolderNode);
				},
			} as any);
			$path.append($button);
			$path.append(' / ');
		}
	});
}

function fillErrorModal(folderName: string) {
	$('#error-modal-contents').text(folderName);
	$('#error-modal-contents-1').text(folderName);
	$('#error-modal-contents-2').text(folderName);
}

function attachToErrorModal(callback: (e?: any) => void) {
	$('#error-modal-delete').click(function(e) {
		callback(e);
		$('.modal-outer').hide();
	});
	$('#error-modal').click(function() {
		$('#error-modal-delete').off('click');
	});
}

function renderFiles(path: string[], $target: JQuery, emptyMsg?: string, callback?: (image: ImageNode) => void): void {
	const folder = getCurrentFolder(path);
	$target.empty();
	let folderEmpty = false;
	folder.images.forEach((image, i) => {
		folderEmpty = false;
		const $div = $(document.createElement('div'));
		// $div.attr('draggable', 'true');
		// $div.prop('draggable', 'true');
		// $div.prop('draggable', true);
		const myDraggedNodePathInfo: DraggedNodePathInfo = {
			path: path.slice(0),
			isFolder: false,
			index: i,
		};
		$div.addClass('folder-image');
		$div.addClass('folder-draggable-node');
		$div.draggable({
			revert: 'invalid',
			classes: {
				"ui-draggable-dragging": "dragging",
			},
			stack: '.folder-draggable-node',
			start: () => {
				draggedNodePathInfo = myDraggedNodePathInfo;
			},
		} as any);
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
		folderEmpty = subfolder.images.length === 0 && subfolder.folders.length === 0;
		$target.append(makeFolderElement(path, i, subfolder, () => {
			path.push(subfolder.name);
			rerenderFilesystem();
		}, (e) => {
			if(folderEmpty) {
				folder.folders.splice(i, 1);
				rerenderFilesystem();
			} else {
				e.stopPropagation();
				fillErrorModal(subfolder.name);
				$('#error-modal').show();
				attachToErrorModal(function() {
					folder.folders.splice(i, 1);
					rerenderFilesystem();
				})
			}
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
	if (colorFilter.size !== 0) {
		filters.push({
			key: 'colors',
			value: colorFilter,
			valueIsSet: true
		});
	}
	if (viewFilter !== undefined && viewFilterOn) {
		filters.push({
			key: 'view',
			value: viewFilter,
			valueIsSet: true
		});
	}
	if (licenseFilter !== undefined) {
		filters.push({
			key: 'license',
			value: licenseFilter,
			valueIsSet: false
		});
	}
	return filters;
}

function updateSearchResults() {
	$('#search-results').empty();
	const query = $('#search-query').val() || '';
	const allActiveFilters = getAllActiveFilters();
	/*if(query !== '' || allActiveFilters.length !== 0)*/ for (const image of images) {
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
				$('#search-modal .description').text('Tags: '+ image.keywords.join(', '));
				$('#search-modal').show();
			});
			$('#search-results').append($img);
		}
	}
}

$(document).ready(updateSearchResults)

$('#search-query').keyup(updateSearchResults);

let colorFilter : Set<string> = new Set();
let viewFilterOn : boolean = false;
let viewFilter: Set<string> = new Set(viewFilterNames);
let licenseFilter: string|undefined = undefined;
function clearColorFilter() {
	colorFilter.clear();
	$('#color-activate').text('Color: any');
	updateSearchResults();
}
function toggleColorFilter(filter: string) {
	if(colorFilter.has(filter)) colorFilter.delete(filter);
	else colorFilter.add(filter);
	if(colorFilter.size == 0) {
		$('#any-color').addClass('color-selected');
		$('#color-activate').text('Color: any');
	}
	else if(colorFilter.size == 1) {
		let name : string = "error";
		for(const thing of colorFilter) name = thing;
		$('#color-activate').text('Color: ' + name);
	}
	else {
		$('#color-activate').text('Color: multiple');
	}
	updateSearchResults();
}
function updateViewFilterText() {
	let filter:string = '';
	if(!viewFilterOn) filter = 'no filter';
	else if(viewFilter.size === 3) {
		filter = 'any';
	} else if(viewFilter.size > 0) {
		for(const f of viewFilter) {
			filter += f + ' or ';
		}
		filter = filter.substring(0, filter.length - ' or '.length);
	} else {
		filter = 'none';
	}
	$('#view-activate').text('View: ' + filter);
}
function toggleViewFilterOn() {
	viewFilterOn = !viewFilterOn;
	updateViewFilterText();
	updateSearchResults();
}
function toggleViewFilter(filter: string) {
	if(viewFilter.has(filter)) viewFilter.delete(filter);
	else viewFilter.add(filter);
	updateViewFilterText();
	updateSearchResults();
}
function setLicenseFilter(filter: string|undefined) {
	licenseFilter = filter;
	$('#license-activate').text('License: ' + (licenseFilter || 'any'));
	updateSearchResults();
}

function attend(element: JQuery) {
	element.on('animationend', (e: JQuery.Event<HTMLElement, null>) => {
		if (e.originalEvent.animationName === 'attention') {
			element.removeClass('attention');
			console.log('removed');
		}
	});
}

function makeFilter(key: string, name: string) {
	if(activeFilters.has(name)) {
		const item = activeFilters.get(name)
		item.element.addClass('attention');
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
			valueIsSet: false,
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

interface LayoutInfo {
	x: number;
	y: number;
	ratio: number; // from naturalWidth, naturalHeight
	filename: string;
	element: JQuery;
}
interface SerializedLayoutInfo {
	x: number;
	y: number;
	ratio: number;
	filename: string;
}
function serializedCopy(layoutInfo: LayoutInfo): SerializedLayoutInfo {
	let {x, y, ratio, filename, element} = layoutInfo;
	return {x, y, ratio, filename};
}
interface DragStatus {
	type: 'move'|'nw'|'ne'|'sw'|'se';
	x: number;
	y: number;
	key: number;
}
let layoutInfos: { [key: number]: LayoutInfo } = {};
let nextLayoutInfoKey = 0;
let dragging: DragStatus|undefined = undefined;

function addImage(info: SerializedLayoutInfo): void {
	const {x, y, ratio, filename} = info;
	const key = nextLayoutInfoKey++;
	const $img = $('<div>');
	$img.addClass('layout-image');
	const $closeButton = makeCloseButton(() => {
		$img.remove();
		delete layoutInfos[key];
	});
	// TODO I guess we don't have time to architect around sensible alt
	// text...
	$img.append(`
		<img src="${info.filename}" alt="${info.filename}">
		<div class="ui-resizable-handle ui-resizable-nw" id="nwgrip"></div>
		<div class="ui-resizable-handle ui-resizable-ne" id="negrip"></div>
		<div class="ui-resizable-handle ui-resizable-sw" id="swgrip"></div>
		<div class="ui-resizable-handle ui-resizable-se" id="segrip"></div>
	`);
	const rawImg = $img.find('img')[0] as HTMLImageElement;
	$img.css('width',  ratio * rawImg.naturalWidth  + 'px');
	$img.css('height', ratio * rawImg.naturalHeight + 'px');
	$img.css('transform', `translate(${x}px, ${y}px)`);
	$img.append($closeButton);
	$img.mousedown((event) => {
		if (dragging) return;
		dragging = {
			type: 'move',
			x: event.clientX as number,
			y: event.clientY as number,
			key: key,
		};
		$('.layout-image').removeClass('layout-area-selected');
		$img.addClass('layout-area-selected');
		layout_counter+=1;
		$img.css('z-index',layout_counter);
		event.preventDefault();
		event.stopPropagation();
	});
	$img.find('.ui-resizable-handle').mousedown((event) => {
		let type: 'nw'|'ne'|'sw'|'se'|undefined = undefined;
		if ($(event.target).hasClass('ui-resizable-nw')) {
			type = 'nw';
		} else if ($(event.target).hasClass('ui-resizable-ne')) {
			type = 'ne';
		} else if ($(event.target).hasClass('ui-resizable-sw')) {
			type = 'sw';
		} else if ($(event.target).hasClass('ui-resizable-se')) {
			type = 'se';
		}
		if (type === undefined) {
			console.error('bad handle resizing');
			return;
		}
		dragging = {
			type: type,
			x: event.clientX as number,
			y: event.clientY as number,
			key: key,
		};
		$('.layout-image').removeClass('layout-area-selected');
		$img.addClass('layout-area-selected');
		layout_counter+=1;
		$img.css('z-index',layout_counter);
		event.preventDefault();
		event.stopPropagation();
	});
	$('.layout-area').append($img);
	layoutInfos[key] = {
		x: x,
		y: y,
		ratio: ratio,
		filename: filename,
		element: $img,
	};
}
interface DragComputation {
	x: number;
	y: number;
	ratio: number;
	width: number;
	height: number;
}
const MIN_LAYOUT_DIMENSION = 60;
function dragCompute(info: LayoutInfo, event: JQuery.Event<HTMLElement, null>): DragComputation {
	if (!dragging) {
		console.error("Can't dragcompute when not dragging!");
		return {} as DragComputation;
	}
	// x, y, w, h: original top-left corner and dimensions
	let x: number = info.x;
	let y: number = info.y;
	let rawImg = info.element.find('img')[0] as HTMLImageElement;
	let ratio: number = info.ratio;
	let nw = rawImg.naturalWidth;
	let nh = rawImg.naturalHeight;
	let w = nw * ratio;
	let h = nh * ratio;

	// dragged displacement
	let dx = event.clientX as number - dragging.x;
	let dy = event.clientY as number - dragging.y;
	let negX: boolean; // are we dragging one of the west corners?
	let negY: boolean; // are we dragging one of the north corners?
	if (dragging.type === 'nw') {
		[negX, negY] = [true, true];
	} else if (dragging.type === 'ne') {
		[negX, negY] = [false, true];
	} else if (dragging.type === 'sw') {
		[negX, negY] = [true, false];
	} else if (dragging.type === 'se') {
		[negX, negY] = [false, false];
	} else {
		throw 'bad dragging';
	}
	// what the new width and height would be if we ignored aspect ratio
	// constraints
	let badW = negX ? w - dx : w + dx;
	let badH = negY ? h - dy : h + dy;
	// to get the right ratio, we average the two ratios computed from badW
	// and badH
	let avgRatio = ((badW / nw) + (badH / nh)) / 2;
	// make sure the image doesn't get dragged past (0, 0)
	if (negX) avgRatio = Math.min(avgRatio, (x + w) / nw);
	if (negY) avgRatio = Math.min(avgRatio, (y + h) / nh);
	// make sure the image doesn't get resized to arbitrarily small
	avgRatio = Math.max(avgRatio, MIN_LAYOUT_DIMENSION / nw);
	avgRatio = Math.max(avgRatio, MIN_LAYOUT_DIMENSION / nh);
	// finally compute the new top-left corner
	let newX = negX ? (x + w) - (avgRatio * nw) : x;
	let newY = negY ? (y + h) - (avgRatio * nh) : y;
	return {x: newX, y: newY, ratio: avgRatio, width: avgRatio * nw, height: avgRatio * nh};
}
$(document).mousemove((event) => {
	if (!dragging) return;
	let info = layoutInfos[dragging.key];
	if (!info) {
		console.error('Mouse-move on missing object!')
		return;
	}
	if (dragging.type === 'move') {
		info.element.css('transform', `translate(${Math.max(0, info.x + (event.clientX as number) - dragging.x)}px, ${Math.max(0, info.y + (event.clientY as number) - dragging.y)}px)`);
	} else {
		console.log('old', info.x, info.y, info.ratio);
		let {x, y, ratio, width, height} = dragCompute(info, event);
		info.element.css('transform', `translate(${x}px, ${y}px)`);
		info.element.css('width',  width  + 'px');
		info.element.css('height', height + 'px');
	}
});
$(document).mouseup((event: JQuery.Event<HTMLElement, null>) => {
	if (!dragging) return;
	const key = dragging.key;
	let info = layoutInfos[key];
	if (!info) {
		console.error('Mouse-up on missing object!')
		return;
	}
	if (dragging.type === 'move') {
		info.x += event.clientX as number - dragging.x;
		info.y += event.clientY as number - dragging.y;
		info.x = Math.max(info.x, 0);
		info.y = Math.max(info.y, 0);
	} else {
		let {x, y, ratio, width, height} = dragCompute(info, event);
		info.x = x;
		info.y = y;
		info.ratio = ratio;
	}
	dragging = undefined;
	event.preventDefault();
});

$(document).ready(() => {
	$('.modal-outer').click((e) => {
		e.stopPropagation();
	});
	$('.close-modal').click((e) => {
		$('.modal-outer').hide();
	});
	$('#add-to-folders').click(() => {
		if (focusedSearchImage) {
			$('#search-add-modal img.focused').attr('src',
				focusedSearchImage.filename);
			$('#search-add-modal .filename').text(
				focusedSearchImage.filename);
			$('#search-add-modal').show();
		}
		$('#search-modal').hide();
	});
	$('#search-add-button').click(() => {
		if (focusedSearchImage) {
			getCurrentFolder(searchAddPath).images.push({
				name: focusedSearchImage.filename,
				filename: focusedSearchImage.filename,
			});
			rerenderFilesystem();
		}
		$('#search-add-modal').hide();
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
	let savedLayout: SerializedLayoutInfo[]|undefined;
	$('#save-layout-button').click(() => {
		savedLayout = Object.keys(layoutInfos).map((k) => serializedCopy(layoutInfos[k]));
	});
	$('#load-layout-button').click(() => {
		if (savedLayout) {
			for (let k in layoutInfos) {
				layoutInfos[k].element.remove();
				delete layoutInfos[k];
			}
			for (let info of savedLayout) {
				addImage(info);
			}
		}
	});
	$(document).mousedown(function (e) {
		$('.layout-image').removeClass('layout-area-selected');
	});
	rerenderFilesystem();
});
