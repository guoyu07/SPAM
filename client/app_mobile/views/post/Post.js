mspam.views.Post=Ext.extend(Ext.Panel,{

	styleHtmlContent:true,
	layout:'card',
	
	dockedItems:[{

		itemId:'toolbarTitle',
		xtype:'toolbar',
		dock:'top',
		ui:'light',
		items:[
		{
			text:'Back',
			ui:'back',
			handler:function(){
				Ext.dispatch({
					controller:'Post',
					action:'destroyView',
					view:this.up('post')
					
				});
			}
		},
		{
			xtype:'spacer'
		},
		{
		
			iconCls:'info',
			iconMask:true,
			ui:'plain',
			handler:function(){
			
				Ext.dispatch({
					
					controller:'Post',
					action:'showPostGenerality'
					
				});
			
			}
		},
		{
		
			iconCls:'locate',
			iconMask:'true',
			ui:'plain',
			hidden:'true',
			itemId:'locate',
			handler:function(){
			
				Ext.dispatch({
				
					controller:'Post',
					action:'showOnMap',
					view:this.up('post')				
				});			
			}
		
		},
		{
			iconCls:'settings',
			iconMask:true,
			ui:'plain',
			handler:function(){
				Ext.dispatch({
					controller:'menu',
					action:'showSettingsSheet',
					view:this.up('post')
				})
			}
		},
		{
			iconCls:'search',
			iconMask:true,
			ui:'plain',
			handler:function(){
				Ext.dispatch({
					controller:'search',
					action:'showSearchForm',
					view:this.up('post'),
					term:serverId+'/'+userId+'/'+postId,
					type:'affinity'
				})
			}
		}]
	},{
	
		itemId:'postAction',
		xtype:'toolbar',
		dock:'bottom',
		height:'35',
		layout:{type:'vbox',align:'stretch'},

		items:[{

			text:'actions',
			ui:'confirm',
			handler:function(){
				Ext.dispatch({
					controller:'Post',
					action:'showActionSheet'
				});
			}
		}]
	
	}]

});
Ext.reg('post',mspam.views.Post);
