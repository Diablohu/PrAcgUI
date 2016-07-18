$(document).ready(function(){
	var ajax_url = login_domain + 'api/member/logout?sid=' + sid;
	$("#logout").click(function(){
		$.ajax({
			type:"get",
			url: ajax_url,
			dataType:"jsonp",
			jsonp:'callback',
			success:function(data, textStatus) {
	                	window.location.reload();
			}
		});
	});
});

$("#search").keyup(function(event){
    if(event.keyCode ==13){
       searchit();
    }
});
function searchit() {
	$search = $("#search").val();
	window.location.href = "http://anime.prpracg.com/search.html?search="+$search;
}
