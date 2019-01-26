var myPlayer,
	playlistIds = ["4868197176001","4868197203001","4868197200001","4890340678001","4868197201001"],
	playlistIdsLength = playlistIds.length,
	tabs = document.getElementsByClassName("chn-vidhub-button"),
	currentTab,
	currentTabName,
	currentvideo,
	playlistNames = [];

//Once the player is ready, it will load the first (latest) playlist	
videojs("chn-videohub-player").ready(function(){
	myPlayer = this;
	processTab(0);
	loadplaylistentries();
	//View the current video object
	myPlayer.on('loadstart',function(){				
		//console.log('current video info', myPlayer.mediainfo);
		//console.log('playlist info', myPlayer.playlist());
	});		
});
//This loads the selected playlist on the page
function processTab (index) {
	//Checks if player is paused; will only load new playlist 
	if(myPlayer.paused()) {
		resetTabs();			
		document.getElementById("tab" + index).setAttribute("style","background:#00AFDB;color: #fff;border-radius: 10px;padding: .5em 1em;border: none;font-family: Arial,Helvetica,sans-serif;font-size: 18px;font-weight: normal;letter-spaing: -1px;line-height: 23.4px; text-align: left; zoom: 1;");
		loadPlaylist(playlistIds[index]);
		//console.log('loading playlist while player paused');
	} else {
		resetTabs();
		document.getElementById("tab" + index).setAttribute("style","background:#00AFDB;color: #fff;border-radius: 10px;padding: .5em 1em;border: none;font-family: Arial,Helvetica,sans-serif;font-size: 18px;font-weight: normal;letter-spaing: -1px;line-height: 23.4px; text-align: left; zoom: 1;");
		loadPlaylistply(playlistIds[index]);
		//console.log('loading playlist while player plays');	
	};
			
};
//This loads the playlist on the page; while the player is !playing
function loadPlaylist (currentId) {
	myPlayer.catalog.getPlaylist(currentId, function(error, playlist){
		myPlayer.catalog.load(playlist);				
	});
	//video metadata populates
	loadmetadata();	
};
//This will load playlist while video plays
function loadPlaylistply (currentId) {
	myPlayer.catalog.getPlaylist(currentId, function(error, playlist){
		myPlayer.catalog.load(playlist);
	});
};
//Loads next video in playlist
function nextVideo() {
	var nextVidObject = myPlayer.playlist.next();
	$('#chn-next-title').html(myPlayer.playlist()[myPlayer.playlist.currentItem()+1].name);
	$('#chn-previous-title').html(myPlayer.playlist()[myPlayer.playlist.currentItem()-1].name);
	console.log("next video loading");	
};
//Loads previous video in playlist
function previousVideo() {
	var previousVidObject = myPlayer.playlist.previous();
	console.log("previous video loading");
	$('#chn-previous-title').html(myPlayer.playlist()[myPlayer.playlist.currentItem()-1].name);
	$('#chn-next-title').html(myPlayer.playlist()[myPlayer.playlist.currentItem()+1].name);
};
//This reloads the tabs
function resetTabs () {
	var i,
		iMax = tabs.length;
	for (i = 0; i < iMax; i++) {
		tabs[i].setAttribute("style", "background: #fff;color: #000;border-radius: 10px;padding: .5em 1em;border: none;font-family: Arial,Helvetica,sans-serif;font-size: 18px;font-weight: normal;letter-spaing: -1px;line-height: 23.4px; text-align: left; zoom: 1;")
	}
	$('#loadMore').show();
};
//This loads all metadata
function loadmetadata() {
	var playerdata = videojs('chn-videohub-player').ready(function(){
		myPlayer = this;
		myPlayer.on('loadstart',function(){
			//video category populates
			$('#chn-vidhub-vidcat').html(myPlayer.mediainfo.custom_fields.category);
			//next video title in playlist
			if(myPlayer.playlist.currentItem() != myPlayer.playlist().length-1){
				$('#chn-next-span').show();
				$('#chn-next-title').html(myPlayer.playlist()[myPlayer.playlist.currentItem()+1].name);
				$('#chn-next-category').html(myPlayer.mediainfo.custom_fields.category);
			}else{
				$('#chn-next-span').hide();
				//$('#chn-next-title,#chn-next-category').html(" ");
			};
			//previous video title in playlist
			if(myPlayer.playlist.currentItem() > 0){
				$('#chn-prev-span').show();
				$('#chn-previous-title').html(myPlayer.playlist()[myPlayer.playlist.currentItem()-1].name);
				$('#chn-previous-category').html(myPlayer.mediainfo.custom_fields.category);
			}else{
				$('#chn-prev-span').hide();
				//$('#chn-previous-title,#chn-previous-category').html(" ");				
			};
			//video title populates
			$('#chn-vidhub-meta-title').html(myPlayer.mediainfo.name);
			//video duration populates
			$('#chn-vidhub-meta-time').html(fmtMSS(Math.round(myPlayer.mediainfo.duration)));
			//video description populates
			$('#chn-vidhub-meta-desc').html(myPlayer.mediainfo.long_description);
			//converting date to MMM DD, YYYY
			var month = new Array();
			month[0] = "January";
			month[01] = "February";
			month[02] = "March";
			month[03] = "April";
			month[04] = "May";
			month[05] = "June";
			month[06] = "July";
			month[07] = "August";
			month[08] = "September";
			month[09] = "October";
			month[10] = "November";
			month[11] = "December";
			var d1 = myPlayer.mediainfo.created_at.slice(6,7),
			    d2 = myPlayer.mediainfo.created_at.slice(5,6),
				m = month[d2+d1-1],
				d = myPlayer.mediainfo.created_at.slice(8,10),
				y = myPlayer.mediainfo.created_at.slice(0,4);
			//video date populates
			$('#chn-vidhub-meta-date').html('Published on '+m +' '+ d+', ' + y);
			//video sharing link
			if(myPlayer.mediainfo.link == null){
				$('#chn-vidhub-sharing').html("");
			}else{$('#chn-vidhub-sharing').html("<br><a target='_blank' //href="+myPlayer.mediainfo.link.url+">"+myPlayer.mediainfo.link.text+"</a>");};
		});
		//convert the duration seconds into mins/secs
		function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}
		//convert numerical date to MMM DD, YYYY
	});
	//scroll to top after thumbnail is clicked
	$('#vjs-playlist').click(function() {
		$('html, body').animate({
			scrollTop: $('#chn-vidhub-top').offset().top
		 }, 600);
	});
};
//Loads more playlist entries onto screen
function loadplaylistentries() {
	var limit_vids = 6,
	load_more_vids = 3;
	//reset the limit_vids
	$('.chn-vidhub-button').click(function() {
		limit_vids = 6;	
	});	
	$('#loadMore').bind('click', function(){
		limit_vids += load_more_vids;
		$('#vjs-playlist li:lt('+(limit_vids)+')').show(600);
		if ($('#vjs-playlist li').length <= limit_vids) {
			$(this).hide();
		}
	});
};
//Video description show/hide
//$(".chn-vidhub-arrow-down").hide();
//$(".chn-vidhub-opthead").click(function(){
	//$(".chn-vidhub-meta-desc").slideToggle(500);
	//$(this).find(".chn-vidhub-arrow-down, .chn-vidhub-arrow-up").toggle();
//});
$(".chn-vidhub-opthead").click(function() {
	var $A1 = $(".chn-vidhub-show");
    $(".chn-vidhub-meta-desc").slideToggle(500);
	$('.chn-vidhub-show').text(function(_, text) {
        return text === 'SHOW LESS' ? 'SHOW MORE' : 'SHOW LESS';
    })
});
//Styling
$(".chn-next-video").hover(function(){
	$(".chn-next-video, button#chn-next-button, .chn-next-title, span#chn-next-title").toggleClass("chn-blue-hoverstate");
});
$(".chn-previous-video").hover(function(){
	$(".chn-previous-video, #chn-previous-button, span#chn-previous-title, .chn-previous-title").toggleClass("chn-blue-hoverstate");
});