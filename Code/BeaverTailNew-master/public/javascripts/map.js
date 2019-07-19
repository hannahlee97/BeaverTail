
   function initMap() {
		/****** Change latitude and longitude here ******/
		var myLatlng = new google.maps.LatLng(49.2827, -123.1207);
		
		/****** Map Options *******/
		var mapOptions = {
			zoom: 11,
			center: myLatlng
		};

		var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		
		/****** Info Window Contents *******/
		// var contentString = '<div id="content">'+
		// 	'<div id="siteNotice">'+
		// 	'</div>'+
		// 	'<div id="showarticles"><strong>articles</strong>'+
        // '<ul>'+
        //         '<% for(var i=0; i < article.length; i++) { %>'+
        //           '<li>'+
        //               '<a href="viewarticle/<%= article[i].Title %>">'+'<%= article[i].body %>'+'</a>'+
        //            '</li>'+
        //         '<% } %>'+
        // '</ul>'+
		// 	'</div>'+
		// 	'</div>';

		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});
		
		/****** Map Marker Options *******/
		var marker = new google.maps.Marker({
			position: myLatlng,
			map: map,
			title: 'Googleplex (CodexWorld)'
		});

		/****** Info Window With Click *******/
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map,marker);
		});

	
	}

window.onload = initMap;
    

	
