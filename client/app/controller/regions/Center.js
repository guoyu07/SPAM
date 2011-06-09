// @file 	Center.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of view of center region of Viewport

Ext.define ('SC.controller.regions.Center' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.Center'] ,
	stores: ['regions.center.Articles'] ,
	models: ['regions.center.Articles'] ,
	
	// Configuration
	init: function () {
		this.control ({
			'centerregion' : {
//				afterrender : this.setArtDisp
				enable : this.setArtDisp
			}
		});
		console.log ('Controller Center started.');
	} ,
	
	setArtDisp : function (region) {
		disposeArticles (this.getRegionsCenterArticlesStore ());
	}
});
