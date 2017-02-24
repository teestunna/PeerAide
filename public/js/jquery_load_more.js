$(function () {
	$("#commenting-div #commentz").slice(0, 3).show();
    $("#loadMore").on('click', function (e) {
        e.preventDefault();
      	$("#commenting-div #commentz:hidden").slice(0, 3).slideDown();
      	if ($("#commenting-div #commentz:hidden").length == 0) {
        	$("#loadMore").fadeOut('slow');
        }
    });  
});