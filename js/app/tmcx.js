mui.init({
	beforeback:function(){
		var bcid = document.getElementById('bcid').style.display;
		if (bcid == 'block') {
			document.getElementById('rq').style.display = 'block';
			document.getElementById("bcid").style.display = 'none';
			document.getElementById("bcid1").style.display = 'none';
			scan.cancel();
			scan.close();
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
mui.plusReady(function(){
	//日期
	var now = new Date();
	var day,month;
	var mxdata = [];
	//格式化日，如果小于9，前面补0
	if (now.getDate() <= 9) {
		day = ("0" + now.getDate()).slice(-2);
	}else {
		day = now.getDate()
	}
	//格式化月，如果小于9，前面补0
	if (now.getMonth() <=9) {
		month = ("0" + (now.getMonth() + 1)).slice(-2);
	}else {
		month = now.getMonth()
	}
	//拼装完整日期格式
	var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
	//完成赋值
	document.getElementById("as_ksrq").value = today;
	document.getElementById("as_jsrq").value = today;
	//查询事件
	var tmcxButton = document.getElementById("tmcx");
	tmcxButton.addEventListener('tap',function(e){
		
		var ksrq, jsrq;
		var as_ksrq,as_jsrq;
		as_ksrq = document.getElementById("as_ksrq").value;
		as_jsrq = document.getElementById("as_jsrq").value;
		ksrq = as_ksrq.split("-");
    	ksrq = ksrq[0] + ksrq[1] + ksrq[2];
    	jsrq = as_jsrq.split("-");
    	jsrq = jsrq[0] + jsrq[1] + jsrq[2];
    	
    	if (parseInt(ksrq) > parseInt(jsrq)) {
    		alert('开始日期大于结束日期,请修改日期范围!');
    	} else{
    		url = plus.storage.getItem("url") + "/Handler/query.ashx";
	    	mui.ajax(url,{
	    		data:{
	    			'action':'tmcx',
					'as_ksrq':ksrq,
					'as_jsrq':jsrq,
	    		},
	    		type:'post',//HTTP请求类型
	    		timeout:10000,//超时时间设置为10秒；
	    		success:function(data){
	    			data = JSON.parse(data);
	    			if (data.tmcx.length == 0) {
	    				document.getElementById('list').innerHTML = '';
	    				alert('未查询到相关信息!')
	    			} else{
	    				returnData(data.tmcx);	
	    			}
	    		},
	    		error:function(xhr,type,errorThrown){
	    			mui.alert(errorThrown,type);
	    		}
	    	});
    	}
	});
	//处理返回数据前台显示
	function returnData(data){
		var str='' ;
		mxdata = data;
		document.getElementById('list').innerHTML = '';
		for (var i=0;i<data.length;i++) {
			str += '<li class="mui-table-view-cell mui-media" id="'+data[i].F_TMH+'">'+
		            '<a href="#" class="mui-navigate-right">'+
		                '<div class="mui-media-body">'+
		                   '条码号：'+ data[i].F_TMH +
		                    '<p class="mui-ellipsis">规格型号：'+ data[i].F_GGXH+'</p>'+
		                    '<p class="mui-ellipsis">生成数量：'+ data[i].F_SL +'&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp单价：'+data[i].F_DJ+'元</p>'+
		                '</div>'+
		            '</a>'+
		        '</li>'
		}
		document.getElementById('list').innerHTML = str; 
	};
	//点击显示明细
	(function($){
		$('#list').on('tap','.mui-table-view-cell',function(event){
			console.log(this.id);
			for (var i=0;i<mxdata.length;i++) {
				if (mxdata[i].F_TMH == this.id) {
					mxdata = mxdata[i];
					console.log('ok');
					break;
				}
			}
			mui.openWindow({
				url:'tmmx.html',
				id:'id',
				extras:{
					'tmh':this.id,
					'mxdata':mxdata
				}
			});
		})
	})(mui);
	//扫描条码获取详细信息
	document.getElementById('sweep').addEventListener('tap',function(){
		//调用扫描
		document.getElementById('rq').style.display = 'none';
		document.getElementById("bcid").style.display = 'block';
		document.getElementById("bcid1").style.display = 'block';
		startRecognize();
	});
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
        switch(type){
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
            case plus.barcode.CODE93:
            	text = 'CODE93';
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
        		document.getElementById('rq').style.display = 'block';
        		scan.cancel();//结束条码识别
				scan.close();//关闭条码识别控件
        		mui.openWindow({
					url:'tmmx.html',
					id:'id',
					extras:{
						'tmh':result
						}
					}
				);
        	} else{
        		scan.cancel()//结束条码识别
				scan.close()//关闭条码识别控件
        		startRecognize();
        	}
        });
	};
	//取消扫描
	document.getElementById('qxsm').addEventListener('tap',function(){
		document.getElementById('rq').style.display = 'block';
		document.getElementById("bcid").style.display = 'none';
		document.getElementById("bcid1").style.display = 'none';
		scan.cancel();
		scan.close();
	});
});