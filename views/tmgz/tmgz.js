mui.init({
	beforeback:function(){
		var bcid = document.getElementById('bcid').style.display;
		if (bcid == 'block') {
			document.getElementById("bcid").style.display = 'none';
			document.getElementById("bcid1").style.display = 'none';
			document.getElementById("header").style.display = 'block';
			document.getElementById("content").style.display = 'block';
			scan.cancel()//结束条码识别
			scan.close()//关闭条码识别控件
			return false;
		} else{
			return true;
		}
	},
	gestureConfig:{
		tap: true, 
		doubletap: true, 
		longtap: true, 
		swipe: true, 
		drag: true, 
		hold:false,
		release:false
	}
});
mui.plusReady(function () {
	var mask=mui.createMask();//遮罩层
	//获取条码类别
	var url = plus.storage.getItem('url') + '/Handler/QueryHandler.ashx'; 
	mui.ajax(url,{
		data:{
			'action': 'gettmlb'
		},
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		beforeSend: function() { 
 			plus.nativeUI.showWaiting("加载中..."); 
 			mask.show();//显示遮罩层 
 		}, 
 		complete: function() { 
 			plus.nativeUI.closeWaiting();
  			mask.close();//关闭遮罩层 
 		},
		success:function(data){
			var tmlb = JSON.parse(data);
			document.getElementById("tmlb").value =tmlb[0].TMDYZD_DYBH +'：'+ tmlb[0].TMDYZD_DYMC;
			plus.storage.setItem('tmlb_bh', tmlb[0].TMDYZD_DYBH );
			tmgz("");
			plus.storage.setItem('tmlb',data);
		},
		error:function(xhr,type,errorThrown){
			mui.alert(errorThrown,type);
		}
	});
	document.getElementById('tmlb').addEventListener('tap', function(){
		var data;
		data = plus.storage.getItem('tmlb');
		ListCreatBm(data);
	});
	function ListCreatBm(data){
		data = JSON.parse(data);
		var str='' ;
		document.getElementById('tmlblist').innerHTML = '';
		for (var i=0;i<data.length;i++) {
			str += '<li class="mui-table-view-cell" id="'+data[i].TMDYZD_DYBH+'">'+
               data[i].TMDYZD_DYBH +'：'+ data[i].TMDYZD_DYMC+
        	'</li>'
		}
		document.getElementById('tmlblist').innerHTML = str; 
		mui('#popover1').popover('toggle',document.getElementById("tmlb"));
		mui('.mui-scroll-wrapper').scroll()
	};
	//点击列表选择
	var ul_city = document.getElementById('tmlblist');
	ul_city.addEventListener("tap", function(e) {
		var tagClass = e.target.getAttribute("class");
		if (tagClass && tagClass.indexOf("mui-table-view-cell") != -1) {
			var select = e.target.innerText;
			document.getElementById("tmlb").value = select;
			plus.storage.setItem('tmlb_bh', e.target.id);
			mui('#popover1').popover('toggle',document.getElementById("tmlb"));
			tmgz("");
		}
	});
    //取消扫描
    document.getElementById('qxsm').addEventListener('tap',function(){
    	document.getElementById("bcid").style.display = 'none';
		document.getElementById("bcid1").style.display = 'none';
		document.getElementById("header").style.display = 'block';
		document.getElementById("content").style.display = 'block';
	
		scan.cancel()//结束条码识别
		scan.close()//关闭条码识别控件
    });
    //吊用摄像头扫描
    document.getElementById('sweep').addEventListener('tap',function(){
		document.getElementById("bcid").style.display = 'block';
		document.getElementById("bcid1").style.display = 'block';
		document.getElementById("header").style.display = 'none';
		document.getElementById("content").style.display = 'none';
		
		startRecognize();
    });
    //扫描控件 start---------------------------------------------------------
    scan = null;
	function startRecognize(){
		try{
			var filter;
			var style = {frameColor: "#29E52C",scanbarColor: "#29E52C",background: ""};
			//扫描空间构造
			filter = [plus.barcode.QR, plus.barcode.CODE128, plus.barcode.EAN13, plus.barcode.EAN8,plus.barcode.CODE39];
			scan = new plus.barcode.Barcode('bcid',filter,style);
			scan.onmarked = onmarked;
			scan.onerror = onerror;
			scan.start();
		}catch(e){
			alert("出现错误啦:\n"+e);
		}
	};
	function onerror(e){
		alert(e);
	};
	function onmarked(type,result ){
		var text = '';  
	    switch(type){//QR,EAN13,EAN8都是二维码的一种编码格式,result是返回的结果
	        case plus.barcode.QR:
	        	text = 'QR: ';
	        	break;
	        case plus.barcode.EAN13:
	        	text = 'EAN13:';
	        	break;
	        case plus.barcode.EAN8:  
	        	text = 'EAN8:';  
	        	break;
	        case plus.barcode.CODE39:
	        	text = 'CODE39';
	        	break;
	        case plus.barcode.CODE128:
	        	text = 'CODE128';
	        	break;
	        case plus.barcode.DATAMATRIX:
	        	text = 'DATAMATRIX';
	        	break;
	    }
	    btnArry = ['确认','取消']
	    mui.confirm(result,'扫描信息',btnArry,function(e){
	    	if (e.index == 0) {
	    		document.getElementById("bcid").style.display = 'none';
	    		document.getElementById("bcid1").style.display = 'none';
	    		document.getElementById("header").style.display = 'block';
				document.getElementById("content").style.display = 'block';
	    		scan.cancel()//结束条码识别
				scan.close()//关闭条码识别控件
				tmgz(result);
	    	} else{
	    		scan.cancel()//结束条码识别
				scan.close()//关闭条码识别控件
	    		startRecognize();
	    	}
	    });
	};
	//扫描控件 end---------------------------------------------------------
	//手工录入条码时回车检索
	document.getElementById('TMH').addEventListener('keydown',function(event){
		var tmh = document.getElementById('TMH').value;
		if (event.keyCode ==13) {
			//调用条码检索方法
			tmgz(tmh);
		}
	});
	//根据条码号检索
	function tmgz(tmh){
		
		console.log(tmh)
		var url = plus.storage.getItem('url') + '/Handler/query.ashx';
		mui.ajax(url,{
			data:{
				'action': 'tmzs',
				'TMH': tmh,
				'tmlb':plus.storage.getItem('tmlb_bh')
			},
			type:'post',
			timeout:10000,
			success:function(data){
				data1 = JSON.parse(data);
				//处理空数据
				if (data1.tmzs == "") {
					document.getElementById("tdmain").innerHTML = '';
					alert("没有取到该条码的相关信息");
				} else{
					returndata(data);
				}
			},
			error:function(xhr,type,errorThrown){
				mui.alert(errorThrown,type);
			}
		});
	};
	function returndata(data){
		document.getElementById("tdmain").innerHTML = '';
		var tbody = document.getElementById("tdmain");
		data = JSON.parse(data).tmzs;
		console.log(JSON.stringify(data))
		for (var i =0; i< data.length; i++) {
			var trow = getdatarow(data[i],i);
			tbody.appendChild(trow);
		}
	};
	function getdatarow(data,i){
		
		document.getElementById("tmlb").value =data.F_TMLB +'：'+ data.F_TMLBMC;
		
		document.getElementById("TMH").value = "";
		var row = document.createElement('tr'); //创建行
	
		var tmlbCell = document.createElement('td');
		tmlbCell.innerHTML = data.F_TMLB;
		row.appendChild(tmlbCell);
		
		var TMLBMCCell = document.createElement('td');
		TMLBMCCell.innerHTML = data.F_TMLBMC;
		row.appendChild(TMLBMCCell);
		
		var TMHCell = document.createElement('td');
		TMHCell.innerHTML = data.F_TMH;
		row.appendChild(TMHCell);
		
		var RKLSCell = document.createElement('td');
		RKLSCell.innerHTML = data.F_RKLS;
		row.appendChild(RKLSCell);
		
		var RKZSLCell = document.createElement('td');
		RKZSLCell.innerHTML = data.F_RKZSL;
		row.appendChild(RKZSLCell);
		
		var RKRQCell = document.createElement('td');
		RKRQCell.innerHTML = data.F_RKRQ;
		row.appendChild(RKRQCell);
		
		var RKCKBHCell = document.createElement('td');
		RKCKBHCell.innerHTML = data.F_RKCKBH;
		row.appendChild(RKCKBHCell);
		
		var RKCKMCCell = document.createElement('td');
		RKCKMCCell.innerHTML = data.F_RKCKMC;
		row.appendChild(RKCKMCCell);
		
		var GYDWBHCell = document.createElement('td');
		GYDWBHCell.innerHTML = data.F_GYDWBH;
		row.appendChild(GYDWBHCell);
		
		var GYDWMCCell = document.createElement('td');
		GYDWMCCell.innerHTML = data.F_GYDWMC;
		row.appendChild(GYDWMCCell);
		
		var CKLSCell = document.createElement('td');
		CKLSCell.innerHTML = data.F_CKLS;
		row.appendChild(CKLSCell);
		
		var CKZSLCell = document.createElement('td');
		CKZSLCell.innerHTML = data.F_CKZSL;
		row.appendChild(CKZSLCell);
		
		var CKRQCell = document.createElement('td');
		CKRQCell.innerHTML = data.F_CKRQ;
		row.appendChild(CKRQCell);
		
		var CKCKBHCell = document.createElement('td');
		CKCKBHCell.innerHTML = data.F_CKCKBH;
		row.appendChild(CKCKBHCell);
		
		var CKCKMCCell = document.createElement('td');
		CKCKMCCell.innerHTML = data.F_CKCKMC;
		row.appendChild(CKCKMCCell);
		
		var KHDWBHCell = document.createElement('td');
		KHDWBHCell.innerHTML = data.F_KHDWBH;
		row.appendChild(KHDWBHCell);
		
		var KHDWMCCell = document.createElement('td');
		KHDWMCCell.innerHTML = data.F_KHDWMC;
		row.appendChild(KHDWMCCell);
		
		var WLBHCell = document.createElement('td');
		WLBHCell.innerHTML = data.F_WLBH;
		row.appendChild(WLBHCell);
		
		var WLMCCell = document.createElement('td');
		WLMCCell.innerHTML = data.F_WLMC;
		row.appendChild(WLMCCell);
		
		var PJLXCell = document.createElement('td');
		PJLXCell.innerHTML = data.F_PJLX;
		row.appendChild(PJLXCell);
		
		var DJBHCell = document.createElement('td');
		DJBHCell.innerHTML = data.F_DJBH;
		row.appendChild(DJBHCell);
		//日期
//		var dateCell = document.createElement('td');
//		if (data.F_DATE == null) {
//			dateCell.innerHTML = data.F_DJRQ;
//			row.appendChild(dateCell);
//			var tmztCell = document.createElement('td');
//			if (data.F_RKRQ == null) {
//				tmztCell.innerHTML = "出库";
//			} else{
//				tmztCell.innerHTML = "入库";
//			}
//			row.appendChild(tmztCell);
//		} else{
//			dateCell.innerHTML = data.F_DATE;
//			row.appendChild(dateCell);
//			
//			//条码状态
//			var tmztCell = document.createElement('td');
//			tmztCell.innerHTML = "生成";
//			row.appendChild(tmztCell);
//			document.getElementById("tmhxx").innerHTML = "";
//			var tmhxx = '条码号:'+ data.F_TMH + '&nbsp&nbsp&nbsp&nbsp&nbsp条码类别:' + data.F_TMLBMC;
//			document.getElementById("tmhxx").innerHTML = tmhxx;
//		}
//		
//		//仓库名称
//		var ckmcCell = document.createElement('td');
//		ckmcCell.innerHTML = data.F_CKMC;
//		row.appendChild(ckmcCell);
//		//数量
//		var slCell = document.createElement('td');
//		if (data.F_RKRQ == null) {
//			slCell.innerHTML = data.F_CKZSL;
//		} else{
//			slCell.innerHTML = data.F_RKZSL;
//		}
//		row.appendChild(slCell);
//		//单位
//		var dwmcCell = document.createElement('td');
//		dwmcCell.innerHTML = data.F_DWMC;
//		row.appendChild(dwmcCell);
//		//物料名称
//		var wlmcCell = document.createElement('td');
//		wlmcCell.innerHTML = data.F_WLMC;
//		row.appendChild(wlmcCell);
//		//流水号
//		var lshCell = document.createElement('td');
//		if (data.F_RKRQ == null) {
//			lshCell.innerHTML = data.F_CKLS;
//		} else{
//			lshCell.innerHTML = data.F_RKLS;
//		}
//		row.appendChild(lshCell);

		return row;
	};
});