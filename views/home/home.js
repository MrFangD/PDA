mui.init()
mui.plusReady(function(){
	//获取往来单位
	var url = plus.storage.getItem('url') + '/Handler/QueryHandler.ashx';
	mui.ajax(url,{
		data:{
			'action':'getdwxx'
		},
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:function(data){
			plus.storage.setItem('wldw',data)
		},
		error:function(xhr,type,errorThrown){
			mui.alert(errorThrown,type);
		}
	});
	//获取仓库
	url = plus.storage.getItem('url') + '/Handler/QueryHandler.ashx';
	mui.ajax(url,{
		data:{
			'action':'queryckzd'
		},
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:function(data){
			plus.storage.setItem('ckdata',data);
		},
		error:function(xhr,type,errorThrown){
			mui.alert(errorThrown,type);
		}
	});
	//通过用户进行权限判断
	
	
	//获取仓库的基本信息
	url = plus.storage.getItem('url') + '/Handler/QueryHandler.ashx';
	mui.ajax(url,{
		data:{
			'action':'lsconf',
			'vkey':'KC%'
		},
		crossDomain:true,
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:function(data){
			data = JSON.parse(data);
			for ( var i =0; i <data.length;i++ ) {
				if (data[i].F_VKEY == 'KC_SLDECN') {
					plus.storage.setItem('KC_SLDECN',data[i].F_VAL)
				}
				if (data[i].F_VKEY == 'KC_DJDECN') {
					plus.storage.setItem('KC_DJDECN',data[i].F_VAL)
				}
				if (data[i].F_VKEY == 'KC_JEDECN') {
					plus.storage.setItem('KC_JEDECN',data[i].F_VAL)
				}
				if (data[i].F_VKEY == 'KC_SFSYHW') {
					plus.storage.setItem('KC_SFSYHW',data[i].F_VAL)
				}
				if (data[i].F_VKEY == 'KC_KJND') {
					plus.storage.setItem('KC_KJND',data[i].F_VAL)
				}
			}
		},
		error:function(xhr,type,errorThrown){
			mui.alert(errorThrown,type);
		}
	});
	
	//获取功能权限
	var czybh = plus.storage.getItem('l_CZYBH');
	var rk ="";
	var ck ="";
	var cx ="";
	var pd ="";
	url = plus.storage.getItem('url') + '/Handler/QueryHandler.ashx';
	mui.ajax(url,{
		data:{
			'action':'queryGNQX',
			'czybh':czybh
		},
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:function(data){
			gnqx(data);
		},
		error:function(xhr,type,errorThrown){
			mui.alert(errorThrown,type);
		}
	});
	//根据获取的功能权限处理页面显示
	function gnqx(data){
		data = JSON.parse(data);
		for (var i=0;i<data.length; i++) {
			var gnbh = data[i].cacheKey;
			switch (gnbh){
				//采购入库
				case 'PDACGRK':
					document.getElementById('cgrk').style.display="inline-block";
					rk = 'rk';
					break;
				//'PDASCRK','生产入库'
				case 'PDASCRK':
					document.getElementById('scrk').style.display="inline-block";
					rk = 'rk';
					break;
				//'PDAQTRK','其他入库'
				case 'PDAQTRK':
					document.getElementById('qtrk').style.display="inline-block";
					rk = 'rk';
					break;
				//'PDAXSCK','销售出库'
				case 'PDAXSCK':
					document.getElementById('xsck').style.display="inline-block";
					ck = 'ck';
					break;
				//'PDASCLL','生产领料'
				case 'PDASCLL':
					document.getElementById('scll').style.display="inline-block";
					ck = 'ck';
					break;
				//'PDAQTCK','其他出库'
				case 'PDAQTCK':
					document.getElementById('qtck').style.display="inline-block";
					ck = 'ck';
					break;
				//'PDAKCPD','库存盘点'
				case 'PDAKCPD':
					document.getElementById('kcpd').style.display="inline-block";
					pd = 'pd';
					break;
				//'PDADBYK','调拨移库'
				case 'PDADBYK':
					document.getElementById('dbyk').style.display="inline-block";
					pd = 'pd';
					break;
				//'PDATMCX','条码查询'
				case 'PDATMCX':
					document.getElementById('tmcx').style.display="inline-block";
					cx = 'cx';
					break;
				//'PDACXKC','库存查询'
				case 'PDACXKC':
					document.getElementById('kccx').style.display="inline-block";
					cx = 'cx';
					break;
				//'PDATMZS','条码追溯'
				case 'PDATMZS':
					document.getElementById('tmzs').style.display="inline-block";
					cx = 'cx';
					break;
			}
		}
		//如果一个模块下没有功能，隐藏该模块名
		if (rk == "") {
			document.getElementById('rk').style.display = "none"
		} else{
			document.getElementById('rk').style.display = "block"
		}
		if (ck == "") {
			document.getElementById('ck').style.display = "none"
		} else{
			document.getElementById('ck').style.display = "block"
		}
		if (cx == "") {
			document.getElementById('cx').style.display = "none"
		} else{
			document.getElementById('cx').style.display = "block"
		}
		if (pd == "") {
			document.getElementById('pd').style.display = "none"
		} else{
			document.getElementById('pd').style.display = "block"
		}
		
	};
	
});