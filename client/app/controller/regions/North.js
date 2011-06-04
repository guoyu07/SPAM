// @file 	North.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of view of north region of Viewport

Ext.define ('SC.controller.regions.North' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.North' ,
		 'regions.west.User'
		] ,
	// Configuration
	init: function () {
		// Local vars declaration
		var fieldUser , pUser , bNewPost, btnLogin;
		this.control ({
			// Init login with cookie
			'northregion' : {
				afterrender : this.initLogin
			} ,
			// Login text field
			'#userField' : {
				// Login at enter key press
				keypress : function (field , event) {
					if (event.getKey () == event.ENTER)
						this.userLogin ();
				}
			} ,
			// Login button
			'#loginButton' : {
				click : this.userLogin
			} ,
			// New post button
			'#newPostButton' : {
				click : this.sendNewPost
			} ,
			'#btnClientOption' : {
				click : this.showOptions
			}
		});

		console.log ('Controller North started.');
	} ,
	
	// New post handler
	sendNewPost : function () {
		var selectPostWindow = Ext.getCmp ('windowSelectPost');
		selectPostWindow.show ();
	} ,
	
	// @brief Initialize variables and login
	initLogin : function (northPanel) {
		// Variables initialization
		fieldUser = northPanel.down ('textfield');
		pUser = Ext.getCmp ('userPanel');
		bNewPost = northPanel.down ('#newPostButton');
		btnLogin = northPanel.down ('#loginButton');
		
		// If there is server cookie
		if (Ext.util.Cookies.get ('PHPSESSID') != null)
		{
			// And if there is client cookie
			var userCookie = Ext.util.Cookies.get ('SPAMlogin');
		
			if (userCookie != null) {
				// Set login
				this.setLoginField (userCookie);
			}
		}
	} ,
	
	// @brief Login and logout user
	userLogin : function () {
		// Check if user wants to login
		if (fieldUser.isVisible ()) {
			
			// Check if the form is filled or not
			if (fieldUser.isValid ()) {
		
				var txtUser = fieldUser.getValue ();
		
				// AJAX request to login
				Ext.Ajax.request ({
					url: 'login' ,
					params: { username: txtUser } ,
					success: function (response) {
						// If server sets his cookies
						var userCookie = Ext.util.Cookies.get ('PHPSESSID');

						if (userCookie != null)					
							// Client sets its
							Ext.util.Cookies.set ('SPAMlogin' , txtUser);
						
						// Setup login fields
						btnLogin.setText ('Logout');
						
						fieldUser.setVisible (false);
						
						pUser.setTitle ('User :: ' + txtUser);
						pUser.setVisible (true);
	
						bNewPost.setVisible (true);
					} ,
					failure: function (error) {
						Ext.Msg.alert ('Error ' + error.status , error.responseText);
					}
				});
			}
			else {
				Ext.Msg.alert ('Error' , 'To login: fill the box with your username.');
			}
		}
		// Check if user wants to logout
		else {
			// AJAX request to logout
			Ext.Ajax.request ({
				method: 'POST' ,
				url: 'logout' ,
				success: function () {
					btnLogin.setText ('Login');
					fieldUser.reset ();
					fieldUser.setVisible (true);
	
					pUser.setVisible (false);
		
					bNewPost.setVisible (false);
				} ,
				failure: function (error) {
					Ext.Msg.alert ('Error ' + error.status , error.responseText);
				}
			});
		}
	} ,
	
	// @brief Setup login field
	// @param user : username
	setLoginField: function (user) {
		btnLogin.setText ('Logout');

		fieldUser.setVisible (false);
	
		pUser.setTitle ('User :: ' + user);
		pUser.setVisible (true);
	
		bNewPost.setVisible (true);
	} ,
	
	showOptions: function () {
		Ext.getCmp('windowOptions').show ();
	}
});
