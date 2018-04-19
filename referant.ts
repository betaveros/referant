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
