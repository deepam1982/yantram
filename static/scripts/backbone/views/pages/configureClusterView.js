ConfigureClusterView = BaseView.extend({
	templateSelector:"#configureClusterTemplate",
	name : 'ConfigureClusterView',
	events : {
		"change #ipOctet" : 'ipOctetChange',
		"tap #addCluster" : 'onAddNewCluster',
		"tap .clstrStng .remove" : 'onDeleteCluster',
		"change .clstrStng input" : 'onClusterIpChange'
	},
	_getJsonToRenderTemplate : function () {
		return {"ipArr":localIpArr};
	},
	ipOctetChange : function(){
		var valStr = this.$el.find("#ipOctet").val(), ipOctet = parseInt(valStr);
		if(valStr != ipOctet || ipOctet<2 || ipOctet > 254)
			return this.$el.find("#ipOctet").val(this.$el.find("#ipOctet").attr('orig-value'))
		this.options.socket.emit("updateIpOctet", {"ipOctet":ipOctet}, _.bind(function (status) {
			console.log(status);
		}, this));
	},
	onAddNewCluster : function(event) {
		this.$el.find("#addCluster").hide();
		this.$el.find("#dummyClstrStng").show();
	},
	onDeleteCluster : function(event) {
		var $clusterSettings = $(event.target).closest('.clstrStng'), $inpt = $clusterSettings.find('input');
		if(!$inpt.attr('orig-value'))
			return this.repaint();
		$clusterSettings.remove();
		this.onClusterIpChange();
	},
	onClusterIpChange : function () {
		this.$el.find('#addClusterError').hide();
		var ipArr = [], err=false;
		var $inpts = this.$el.find('.clstrStng input');
		for (var i=0; i<$inpts.length; i++) {
			var val = $($inpts[i]).val();
			if(i+1 == $inpts.length && !val) continue; 
			ipArr[i]=val;
			var octates = ipArr[i].split('.');
			if(octates.length != 4) {err=true; break;}
			for (var j=0; j<octates.length;j++) {
				octates[j] = parseInt(octates[j]);
				if(octates[j]<0 || octates[j]>255){err=true; break;}
			}
			if(err || octates.join('.') != ipArr[i]) {err=true; break;}
		}
		if(err) {
			this.$el.find('#addClusterError .errorMsg').html("Invalid IP Address!");
			this.$el.find('#addClusterError').show();
			this.$el.find("#addCluster").hide();
			return;
		}
		this.options.socket.emit("updateClusterIps", {"ipArr":ipArr}, _.bind(function (status) {
			console.log(status);
			if(!status || !status.success) {
				this.$el.find('#addClusterError .errorMsg').html(status.msg);
				this.$el.find('#addClusterError').show();
				this.$el.find("#addCluster").hide();
				return;
			}
			location.reload();
		}, this));
	}
})
