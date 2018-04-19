/// <reference path ="jquery/jquery.d.ts"/>

$('.nav-tab').click(function () {
	$('.nav-tab').removeClass('nav-selected');
	$(this).addClass('nav-selected');
});
