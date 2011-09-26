Ext.regController('Home',{
	
	init:function(){
	
		this.store=new Ext.data.Store({model:'Post',storeId:'poststore'});
	
	},
	
	renderHome:function(){
		
		this.home=this.render({
			xtype:'home',
			items:[{
				xtype:'list',
				styleHtmlContent:true,
				fullscreen:true,
				itemTpl:'{html}',
				store:this.store,
	//			listener:{
	//				afterrender:
	//				Ext.dispatch({
	//					controller:'Home',
	//					action:'getSearchResponse',
	//					store:this.store
	//				})
	////				Ext.ControllerManager.get('Home').getSearchResponse(this.store)
	//			},
				onItemDisclosure:function(rec, node, index, e){
					Ext.dispatch({
						controller:'Post',
						action:'showPost',
						post:rec.data.html,
						article:rec.data.article,
						user:rec.data.user,
						index:index,
						view:this.up('Home')
					});
	//				Ext.ControllerManager.get('Home').showPost(rec.data.html, rec.data.article)
				}
			}]
		});
//		console.log(this.home);
		
		var loginstore=Ext.StoreMgr.get('loginstore');
//		console.log(loginstore);

		if(loginstore.getCount()!=0){

//		this.home.down('#loginToolbar').hide();
		
			this.home.down('#titleToolbar').setTitle(loginstore.getAt(0).get('username'));
		
//			this.home.remove('loginToolbar',true);	
//		this.home.doComponentLayout();
		
//		console.log(loginstore.getAt(0).get('username'));
		
		}
		
		this.application.viewport.setActiveItem(this.home);
		
		this.getSearchResponse(Ext.StoreMgr.get('poststore'));
		
		Ext.StoreMgr.get('poststore').fireEvent('load');
	},
	
	getSearchResponse:function(store){
	
	var home=this.home;
	
	home.setLoading(true);
	
	var store=Ext.StoreMgr.get('poststore');
				// Clean the store
		store.removeAll ();

		// Make an AJAX request with JQuery to read XML structure (ExtJS can't read XML with mixed content model)
		$.ajax({
			type: 'GET',
			// Uses url of the store
			url: store.getProxy().url,
			dataType: "xml",
			success: function (xml) {
				// Check every posts
				$(xml).find('post').each (function () {
					var numLike, numDislike, html='';
					var ifLikeDislike = 0;
				
					// Find like and dislike counter plus setlike of the user
					$(this).find('article').find('span').each (function () {
						// Find like counter
						if ($(this).attr ('property') == 'tweb:countLike') {
							numLike = parseInt ($(this).attr ('content'));
						}
					
						// Find dislike counter
						if ($(this).attr ('property') == 'tweb:countDislike') {
							numDislike = parseInt ($(this).attr ('content'));
						}
					
						// Find setlike/setdislike of the user
						if ($(this).attr ('rev') == 'tweb:like') {
							ifLikeDislike = 1;
						}
						else if ($(this).attr ('rev') == 'tweb:dislike') {
							ifLikeDislike = -1;
						}	
					});

					$(this).find('article').contents().each(function(){

					//	$(this).each(function(){
		
							if($(this).is('span')){
		
								if($(this).attr('resource')=='audio'){
									html+='<video src="'+$(this).attr('src')+'"'+'poster="lib_mobile/play.png"'+'controls="controls"'+'preload="none" onclick="this.play();"'+'/>';
								}
			
								if($(this).attr('resource')=='video'){
			
									html+='<a href="'+$(this).attr('src')+'"'+'>'+'<img src="lib_mobile/video.png"/>'+'</a>';
			
								}
			
								if($(this).attr('resource')=='image'){
			
									html+='<img src="'+$(this).attr('src')+'"'+'height="20%" width:"20%"'+'/>';
			
								}
			
								html+=$(this).text();
		
							}
		
							if(this.nodeType == 3){
		
								var tmp=$(this).text();
			
								var links=$(this).text().match(/\(?\bhttp:\/\/[-A-Za-z0-9+&@#/%?=~_()|!:,.;]*[-A-Za-z0-9+&@#/%=~_()|]/gim);
			
								if(links!=null){
			
									for(i=0;i<links.length;i++){
			
										var indexOfLink=tmp.indexOf(links[i]);
										var first=tmp.substring(0,indexOfLink);
										var next=tmp.substring(indexOfLink+links[i].length);
					
										tmp=first+'<a href="'+links[i]+'">'+links[i]+'</a>';
			
									}
			
								}
			
								html+=tmp;
		
							}
		
					//	});

					});				
				
				
					// Add article to the store
					store.add ({
						affinity: parseInt ($(this).find('affinity').text ()) ,
						article: $(this).find('article') ,
						resource: $(this).find('article').attr ('resource') ,
						about: $(this).find('article').attr ('about') ,
						date: $(this).find('article').attr('content'),
						like: numLike ,
						dislike: numDislike ,
						setlike: ifLikeDislike ,
						user: $(this).find('article').attr('resource').split("/")[2],
						html:'<p>'+html+'<p>'
					});
					
//					console.log($(this).find('article').attr ('resource'));
					
				});
				
				home.setLoading(false);
			},	
			error: function (xhr, type, text) {
			
				home.setLoading(false);
				
				Ext.Msg.show ({
					title: type,
					msg: text ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
			}
		});
	}

});
