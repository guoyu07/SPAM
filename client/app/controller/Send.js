// @file 	Send.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of view of sending new posts

var MAXCHARS = 140;

var 	artHeader = '<article>' ,
	artFooter = '</article>';

var txtSendArea , lblSendCount , chkSendBoxGeoLoc;

var sendGeoLocSpan;

Ext.define ('SC.controller.Send' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['Send'] ,
	
	models: ['regions.center.Articles' , 'ComboThesaurus'] ,
	stores: ['regions.center.Articles' , 'ComboThesaurus'] ,
	
	// Configuration
	init: function () {
		var hashtagArray = new Array ();
		
		this.control ({
			// Reset field when it's showed
			'send': {
				afterrender: this.initFields ,
				show: this.resetFields
			} ,
			// Controlling txtArea of window for sending new posts
			'#txtAreaSend': {
				// On every keypress do something
				//initialize: this.initHtmlEditor ,
				keypress: this.checkChars
			} , 
			// Send button
			'#buttonSend': {
				click: this.sendPost
			} ,
			// Reset button
			'#buttonReset': {
				click: this.resetFields
			}
		});
		
		console.log ('Controller Send started.');
	} ,
	
	// @brief Check if text area lenght is positive or negative (140 chars)
	//	  and update label with the right color
	// TODO: pasted text!!!
	// TODO: cancel/delete keys aren't captured by chrome
	checkChars : function (ta, event) {
		var 	// Get the lenght
			//numChar = txtarea.getValue().length ,
			numChar = ta.getValue().length ,
			// And the difference
			diffCount = MAXCHARS - numChar;
		
		// If it's negative, color it with red, otherwise with black
		if (diffCount < 0)
			lblSendCount.setText ('<span style="color:red;">' + diffCount + '</span>' , false);
		else
			lblSendCount.setText ('<span style="color:black;">' + diffCount + '</span>' , false);

		// TODO: '#' handler
//		if (event.getKey () == '35') {
//			Ext.getCmp('sendComboHashtag').setVisible (true);
//			//Ext.getCmp('sendComboHashtag').setValue ('#');
//		}
	} ,
	
	// @brief
	sendPost : function (button) {
		// TODO: parsing text to finding hashtag
		// TODO: hashtag autocomplete
		
		// Articles store
		var store = this.getRegionsCenterArticlesStore ();
		
		// Check if text area is filled and if it has at most 140 chars
		if (txtSendArea.isValid () && (txtSendArea.getValue().length <= MAXCHARS)) {
		
			var 	artBody = txtSendArea.getValue () ,
				win = Ext.getCmp ('windowNewPost');
			
			// XML Injection for hashtag
			artBody = htInjection (artBody , this.getComboThesaurusStore ());
			
			// XML Injection
			var article = artHeader + '\n' + artBody + '\n';
		
			// Check geolocation
			if (chkSendBoxGeoLoc.getValue () && browserGeoSupportFlag) {
				try {
					navigator.geolocation.getCurrentPosition (function (position) {
						// If geolocation was retrieved successfully, setup geolocation span
						sendGeoLocSpan = '<span id="geolocationspan" lat="' + position.coords.latitude + '" long="' + position.coords.latitude + '" />';
					} , function () {
						// TODO: better error message
						// otherwise, setup with 0,0 position
						sendGeoLocSpan = '<span id="geolocationspan" long="0" lat="0" />';
					});
				
					article += sendGeoLocSpan + '\n';
				}
				catch (err) {
					Ext.Msg.show ({
						title: 'Error' ,
						msg: 'An error occurred during setup geolocation: article will be sent without geolocation.' ,
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.ERROR
					});
				}
			}
			
			// Complete article building
			article += artFooter;
			
			// AJAX Request
			Ext.Ajax.request ({
				url: urlServerLtw + 'post' ,
				params: { article: article } ,
				success: function (response) {
					// On success, close window and display last 5 posts of the user
					win.close ();
					
					// Get appropriate serverID of the user logged in
					var sendServerID = Ext.getCmp('tfServerUrl').getValue ();
					
					// If it is null, set default value ('Spammers')
					if (sendServerID == null) {
						sendServerID = 'Spammers';
					}
					
					// Set appropriate URL with username of the user already logged-in
					store.getProxy().url = urlServerLtw + 'search/5/author/' + sendServerID + '/' + Ext.util.Cookies.get ('SPAMlogin');
					
					// Retrieve articles
					requestSearchArticles (store, null, 0);
				} ,
				failure: function (error) {
					Ext.Msg.show ({
						title: 'Error ' + error.status ,
						msg: error.responseText ,
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.ERROR
					});
				}
			});
		}
		else {
			Ext.Msg.show ({
				title: 'Error' ,
				msg: 'Fill the post fields with almost 140 chars.' ,
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.ERROR
			});
		}
	} ,
	
	// @brief initialize fields and local variables
	initFields: function (win) {
		txtSendArea = win.down ('#txtAreaSend');
		lblSendCount = win.down ('#sendCharCounter');
		chkSendBoxGeoLoc = win.down ('#chkSendGeoLoc');
		
		// If browser do not support geolocation, hide the checkbox
		if ((browserGeoSupportFlag))
			chkSendBoxGeoLoc.setVisible (false);
		
		// Saving all hashtags
		
//		var hashtagModels = this.getThesaurusStore().getNewRecords ();
//		
//		// Populate hashtag array
//		for (var m in hashtagModels)
//		{
//			try {
//				hashtagArray[m].text = hashtagModels[m].get ('text');
//				hashtagArray[m].ns = hashtagModels[m].get ('ns');
//			}
//			catch (err) {
//				break;
//			}
//		}

		// Autocomplete
//		$('#taSend').autocomplete({
//			wordCount:1,
//			mode: "outter",
//			on: {
//				query: function(text,cb){
//					var words = [];
//					for( var i=0; i<hashtagArray.length; i++ ) {
//						if( hashtagArray[i].toLowerCase().indexOf(text.toLowerCase()) == 0 ) 
//							words.push(hashtagArray[i]);
//					}
//					cb(words);								
//				}
//			}
//		});
	} ,
	
	// @brief Reset text area of the new post
	resetFields: function (win) {
		txtSendArea.reset ();
		chkSendBoxGeoLoc.reset ();
		
		lblSendCount.setText ('<span style="color:black;">' + MAXCHARS + '</span>' , false);
		
//		var a = Ext.toArray (Ext.StoreManager.lookup('Thesaurus'));
//		var store = Ext.StoreManager.lookup ('Thesaurus');
//		var a = store.getNewRecords ();
//		
//		for (var i in a) {
//			alert (a[i].get ('text'));
//		}
		
		//var tss = Ext.getCmp('treePanelThesaurus').cloneConfig ({maxWidth: 150, id: 'cloneTPThesaurus'});
		//var tss = Ext.create ('SC.view.SendThesaurus');
		//win.add (tss);
	}
});
