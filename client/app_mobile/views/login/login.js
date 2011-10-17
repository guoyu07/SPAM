mspam.views.LoginIndex=Ext.extend(Ext.form.FormPanel,{

//vertical box layout
	layout: 'vbox',
//component take all the container's' width
	align:'stretch',
//set components position
	pack:'center',
	styleHtmlContent:true,

//title toolbar	
	dockedItems:[{
			xtype:'toolbar',
			dock:'top',
			title:'Spam'			
		}],
		
	items:[
		
		{html:'Enter as'},
		
		{
		
			xtype:'button',
			ui:'round',
			text:'Anonimous',
			itemId:'anonimousButton',
			handler:function(){
				var view=this.up('loginindex');
				Ext.dispatch({
					controller:'Login',
					action:'anonimousUser'
				})
			}
		},
		
		{html:'Or'},
		
		{
		
			xtype:'textfield',
			required:true,
			name:'username',
			placeHolder:'username',
			itemId:'loginTextField'
			
		},{
		
			xtype:'button',
			ui:'round',
			text:'Login',
			margin:20,
			itemId:'loginButton',
			handler:function(){
				var view=this.up('loginindex');
				Ext.dispatch({
					controller:'Login',
					action:'loginUser',
					loginView:view
				})
			}
			
		}]
});
Ext.reg('loginindex',mspam.views.LoginIndex);
