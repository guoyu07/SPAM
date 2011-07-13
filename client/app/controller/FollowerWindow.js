// @file 	FollowerWindow.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of FollowerWindow view

Ext.define ('SC.controller.FollowerWindow' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['FollowerWindow'] ,
	
	// Models
	models: ['regions.west.Followers' , 'regions.center.Articles'] ,
	
	// Stores
	stores: ['regions.west.Followers' , 'regions.center.Articles'] ,
	
	// Configuration
	init: function () {
		var storeArticles;
		var storeFollowers;
		var winFollower;
		
		this.control ({
			// Init vars
			'followerwindow' : {
				afterrender : this.initVar
			} ,
			'#btnProfileUnfollow' : {
				click : this.setUnfollow
			} ,
			'#btnProfileSearch' : {
				click : this.startAuthorSearch
			}
		});
		
		console.log ('Controller FollowerWindow started');
	} ,
	
	// @brief Initialize variables
	initVar: function (win) {
		winFollower = win;
		storeArticles = this.getRegionsCenterArticlesStore ();
		storeFollowers = this.getRegionsWestFollowersStore ();
	} ,
	
	// @brief Unfollow the user
	setUnfollow: function (button) {
		winFollower.hide ();
		
		// Ajax request
		Ext.Ajax.request ({
			url: urlServerLtw + 'setfollow' ,
			// Sending server and user ID of this article
			params: { 
				serverID: document.getElementById('followerUserServer').innerHTML ,
				userID: document.getElementById('followerUserName').innerHTML ,
				value: 0
			} ,
			success: function (response) {
				// Reload followers store to refresh user panel
				storeFollowers.load (function (record, option, success) {
					if (! success) {
						var err = option.getError ();
						// If 404 is returned, ignore it because or user isn't logged in or hasn't followers
						if (err.status != 404) {
							Ext.Msg.show ({
								title: 'Error ' + err.status,
								msg: 'Something bad happened during retrieve the followers list!' ,
								buttons: Ext.Msg.OK,
								icon: Ext.Msg.ERROR
							});
						
							// If there aren't followers, remove all previous (old) followers from the store
							storeFollowers.removeAll ();
						}
					}
					else {
						// Ascendent sort for followers
						storeFollowers.sort ('follower' , 'ASC');
						
						var winFocus = Ext.getCmp ('winFocusArticle');
				
						// On unfollow refresh Focus Article if it is present to refresh the setfollow button
						if (winFocus != null) {
							winFocus.setVisible (false);
							winFocus.setVisible (true);
						}
					}
				});
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
	} ,
	
	// @brief Starts an author search (the author of the profile)
	startAuthorSearch: function (button) {
		// Hide the profile window
		winFollower.hide ();
		
		// Set appropriate URL
		storeArticles.getProxy().url = urlServerLtw + 'search/10/author/' + document.getElementById('followerUserServer').innerHTML + '/' + document.getElementById('followerUserName').innerHTML;
		
		// Retrieve articles
		requestSearchArticles (storeArticles, null, 0);
	} ,
});
