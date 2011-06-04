// @file 	SendResource.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of send resource view

var MAXCHARS = 140;

var 	artHeader = '<article xmlns:sioc="http://rdfs.org/sioc/ns#" xmlns:ctag="http://commontag.org/ns#" xmlns:skos="http://www.w3.org/2004/02/skos/core#" typeof="sioc:Post">' ,
	artFooter = '</article>';

var 	winRes, txtResUrl, txtResDes, lblResCount , chkBoxGeoLoc;

var geoLocSpan;

// Type of resource
var btnGhost;

Ext.define ('SC.controller.SendResource' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['SendResource'] ,
	
	// Configuration
	init: function () {
		this.control ({
			// Reset field when it's showed
			'sendresource': {
				show: this.initFields
			} ,
			// Controlling txtArea of window for sending new posts
			'#txtResourceDescription': {
				// On every keypress do something
				keypress: this.checkChars
			} , 
			// Send button
			'#btnResSend': {
				click: this.sendPost
			} ,
			// Reset button
			'#btnResReset': {
				click: this.resetFields
			}
		});
	
		console.log ('Controller SendResource started.');
	} ,
	
	// @brief Check if text area lenght is positive or negative (140 chars)
	//	  and update label with the right color
	checkChars : function (txtarea, e) {
			// Get the lenght
		var	numChar = txtarea.getValue().length ,
			// And the difference
			diffCount = MAXCHARS - numChar;
		
		// If it's negative, color it with red, otherwise with black
		if (diffCount < 0)
			lblResCount.setText ('<span style="color:red;">' + diffCount + '</span>' , false);
		else
			lblResCount.setText ('<span style="color:black;">' + diffCount + '</span>' , false);
	} ,
	
	// @brief
	sendPost : function () {
		// TODO: parsing text to finding hashtag
		// TODO: hashtag autocomplete
		// Check if text area is filled and if it has at most 140 chars
		if (txtResUrl.isValid () && (txtResDes.getValue().length <= MAXCHARS)) {
		
			var 	artBody = txtResDes.getValue () ,
				artResource = '<span resource="' + btnGhost.getText () + '" src="' + txtResUrl.getValue () + '" />' ,
				// XML Injection
				article = artHeader + '\n' + artBody + '\n' + artResource + '\n';
			
			// Check geolocation
			if (chkBoxGeoLoc.getValue () && browserGeoSupportFlag) {
				try {
					navigator.geolocation.getCurrentPosition (function (position) {
						// If geolocation was retrieved successfully, setup geolocation span
						geoLocSpan = '<span id="geolocationspan" lat="' + position.coords.latitude + '" long="' + position.coords.latitude + '" />';
					} , function () {
						// TODO: better error message
						// otherwise, setup with 0,0 position
						geoLocSpan = '<span id="geolocationspan" long="0" lat="0" />';
					});
				
					article += geoLocSpan + '\n';
				}
				catch (err) {
					Ext.Msg.alert ('Error' , 'An error occurred during setup geolocation: the article will be sent without geolocation.');
				}
			}
			
			// Complete article building
			article += artFooter;
		
			// AJAX Request
			Ext.Ajax.request ({
				url: 'post' ,
				params: { article: article } ,
				success: function (response) {
					winRes.close ();
				} ,
				failure: function (error) {
					Ext.Msg.alert ('Error ' + error.status , error.responseText);
				}
			});
		}
		else {
			Ext.Msg.alert ('Error' , 'New post is blank or it has got to many chars (140 max).');
		}
	} ,
	
	// @brief initialize fields and local variables
	initFields: function (win) {
		winRes = win;
		txtResUrl = winRes.down ('#txtResourceUrl');
		txtResDes = winRes.down ('#txtResourceDescription');
		lblResCount = winRes.down ('#lblResCounter');
		chkBoxGeoLoc = winRes.down ('#chkResGeoLoc');
		
		btnGhost = Ext.getCmp ('resBtnGhost');
		
		this.resetFields ();
	} ,
	
	// @brief Reset fields
	resetFields: function () {
		txtResUrl.reset ();
		txtResDes.reset ();
		chkBoxGeoLoc.reset ();
		lblResCount.setText ('<span style="color:black;">' + MAXCHARS + '</span>' , false);
	}
});
