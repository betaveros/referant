/// <reference path ="jquery/jquery.d.ts"/>

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
