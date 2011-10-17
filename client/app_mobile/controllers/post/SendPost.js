Ext.regController('sendpost',{

	init:function(){
	
		var lat, lng;
	
	},

//method to show the new post view
	showNewPost:function(options){
	
	//save previous view to go back using back button
		this.prevView=options.view;
	
	//check if this method was called to write a replay to a post and save the original post's information	
		if(options.serverID){
		
			this.serverID=options.serverID;
			this.userID=options.userID;
			this.postID=options.postID;		
		}
	
		this.newpost=this.render({xtype:'sendpost'});
		this.application.viewport.setActiveItem(this.newpost);
	
	//get the location coordinate
		this.getGeoLocation();
	
	},
	
//method to parse the text area and add medias,links and hashtags tags
	getTextAreaContent:function(){

		var post=this.newpost.down('fieldset').getComponent('newpost').getValue();
		
		if(post.length==0){
			
			Ext.Msg.alert('New post',"You haven't type anything");
		}
		else{
		
		//call a method to scan and add hashtags elements
			post=this.addHashtagElement(post);
		//call a method to scan and add media elements
			post=this.addMediaElement(post);
		//if location coordinate was successfully retrived add the geolocation tag	
			if(lat){
			
			post+='<span id="geolocationspan" long="'+lng+'" lat="'+lat+'"/>';
			
			}
		}
		
		//call a method to send this new post to the server
			this.sendPost(post);
	
	},
	
//scan a string to find hashtags
	addHashtagElement:function(post){
	
		var preabout='<span rel="sioc:topic">#<span typeof="skos:Concept" about="';
		var postabout='" rel="skos:inScheme" resource="';
		var postinscheme='">';
		var closespans='</span></span>';
		
		var pregentag='<span rel="sioc:topic">#<span typeof="ctag:Tag" property="ctag:label">';
		
		//find all hashtags	
			var hashtags=post.match(/#[a-zA-Z0-9]+/gim);
		
			if(hashtags!=null){
		
				var controllerThesaurus=Ext.ControllerManager.get('thesaurus');
		
				for(i=0;i<hashtags.length;i++){
			
				//search this hashtag in the thesaurus	
					var resource=controllerThesaurus.getResource(hashtags[i]);
				
					if(resource!=null){
					
					//get namespace	
						var inscheme=resource[0];
					
						var indexofabout=inscheme.length;
					//from hashtag url get tag's name
						var about=resource[1].substr(indexofabout);
					
						var replace=preabout+about+postabout+inscheme+postinscheme+hashtags[i].substr(1)+closespans;
						var indexoftag=post.indexOf(hashtags[i]);
						var first=post.substring(0,indexoftag);
						var next=post.substring(indexoftag+hashtags[i].length);
						post=first+replace+next;
						
					}
					else{
						
						var replace=pregentag+hashtags[i].substr(1)+closespans;
						var indexoftag=post.indexOf(hashtags[i]);
						var first=post.substring(0,indexoftag);
						var next=post.substring(indexoftag+hashtags[i].length);
						post=first+replace+next;
					
					}			
				}
		
			}
		
		return post;
	
	},
	
//scan a string to serach media element
	addMediaElement:function(post){
	
		var openSpan='<span resource="';
		var closeSpan='/>';

		//search for url
			var links=post.match(/\(?\bhttp:\/\/[-A-Za-z0-9+&@#/%?=~_()|!:,.;]*[-A-Za-z0-9+&@#/%=~_()|]/gim);
			
			if(links!=null){
			
				for(i=0;i<links.length;i++){
				
					var indexOfMedia=post.indexOf(links[i]);
					var first=post.substring(0,indexOfMedia);
					var next=post.substring(indexOfMedia+links[i].length);
				
				//call a method to retrive resurce mime type	
					var mime=this.getMediaMimeType(links[i]);
					var type=mime.substring(0,mime.indexOf('/'));
				
				//add media tag
					if(type.search("image|video|audio")!=-1){
						
						post=first+openSpan+type+'" src="'+links[i]+'"'+closeSpan+next;
						
					}				
				}
				
			}
		
		return post;
	
	},

//method to get mime type of a url	
	getMediaMimeType:function(url){
	
		var mime=null;
	
		$.ajax({
		
			url:'proxy',
			type:'post',
			data:{url:url},
			async:false,
			scope:this,
			
			success:function(res){mime=res;},
			
			failure:function(res){
				Ext.Msg.alert(res.statusText,res.responseText);
			}
		
		});
		
		return mime;
	
	},

//method to get location coordinates	
	getGeoLocation:function(){

		var geo=new Ext.util.GeoLocation({
		
			autoUpdate:false,
		
			listeners:{
				locationupdate:function(geo){
				
					lat=geo.latitude;
					lng=geo.longitude;

				},
				locationerror:function(geo, timeout, permissionDenied, locationUnavailable, message){
				
					alert('geo:'+geo+'---timeout:'+timeout+'---permission:'+permissionDenied+'---locationUnavailable:'+locationUnavailable+'---message:'+message);
					}
				
				}
			});
			geo.updateLocation();
	},
		
//send the parsed post to the server
	sendPost:function(post){

	//if this post is a replay, add original post's information
		if(this.serverID){
		
			Ext.Ajax.request({
			
				url:'replyto',
				method:'post',
				params:{
						serverID:this.serverID,
						userID:this.userID,
						postID:this.postID,
						article:'<article>'+post+'</article>'
						},
			
				success:function(){
					Ext.dispatch({
						controller:'Home',
						action:'renderHome'
					});
				},
			
				failure:function(response){
					Ext.Msg.alert(response.statusText,response.responseText);
				}
			
			});
			
		}
		
	//this is a new post and not a replay
		else{
		
			Ext.Ajax.request({
			
				url:'post',
				method:'post',
				params:{article:'<article>'+post+'</article>'},
			
				success:function(){
					Ext.dispatch({
						controller:'Home',
						action:'renderHome'
					});
				},
			
				failure:function(response){
					Ext.Msg.alert(response.statusText,response.responseText);
				}
			
			});
		
		}
	
		
	
	},

//go back to the previous view usign back button	
	previousView:function(){
	
	//if before to render this view i'm not in the home, render that view else render the home view
		if(this.prevView){
			this.application.viewport.setActiveItem(this.prevView);
		}
		else
		Ext.dispatch({
			controller:'Home',
			action:'renderHome'
		});
	
	}

});
