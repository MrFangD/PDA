mui.init({
	beforeback:function(){
		var bcid = document.getElementById('bcid').style.display;
		var search_mx = document.getElementById('search_mx').style.display;
		if (bcid == 'block') {
			document.getElementById('title').innerHTML = '扫描明细';
			document.getElementById('search_mx').style.display = 'block';
			document.getElementById("bcid").style.display = 'none';
			document.getElementById("bcid1").style.display = 'none';
			scan.cancel()//结束条码识别
			scan.close()//关闭条码识别控件
			return false;
		} else if (search_mx == 'block') {
			var btnArray = ['确认', '取消'];
			var deletecheck;
			mui('.sm input').each(function () {
				if (this.value.trim() == "") {
					deletecheck = false;
					return false;
				} else{
					deletecheck = true;
					return false;
				}
			});
			if (deletecheck == true) {
				mui.confirm("当前数据未保存，是否继续？","",btnArray,function(event){
					if (event.index == 0) {
						mui('.sm input').each(function () {
							this.value = "";
						});
						document.getElementById('form').style.display = 'block';
						document.getElementById('title').innerHTML = '调拨单';
						document.getElementById('search_mx').style.display = 'none';
						document.getElementById('header1').style.display = 'block';
					}
				})
			} else{
				document.getElementById('form').style.display = 'block';
				document.getElementById('title').innerHTML = '调拨单';
				document.getElementById('search_mx').style.display = 'none';
				document.getElementById('header1').style.display = 'block';
			}
			return false;
		}else{
			plus.storage.setItem('list_arrMxdata',"");
			plus.storage.setItem('list_smdata',"");
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
	release:false,
	}
});

mui.plusReady(function(){
	var smdata = [];//用来展示扫描汇总数据
	var arrMxdata =[];//用来存储扫描数据
	//单据类型
	var Djlx;
	var ckbh;
	var canz;
	//初始判断仓库、业务部门是否有
	if (plus.storage.getItem('ycrk_setting') == null) {
	} else{
		document.getElementById("ycck").value = plus.storage.getItem('ycck_setting');
		document.getElementById("yrck").value = plus.storage.getItem('ycrk_setting');
		document.getElementById("showdwPicker").value = plus.storage.getItem('ykdywbm_setting');
	}
	//删除分录信息
	mui('table').on('doubletap','td',function(){
	var btnArray = ['确认', '取消'];
	var tr = $(this).parent('tr');
	var td = tr.children('td').eq(0).text();//eq(0)是获取第一行的第一项
	var td_wlbh = tr.children('td').eq(1).text();
	mui.confirm('确认删除第'+td+'行记录吗？', '信息删除', btnArray, function(e) {
		if(e.index == 0){
			tr.remove();
			arrMxdata.splice(parseInt(td)-1,1);
			smdata.splice(parseInt(td)-1,1);
		};
	});
});
	//标题栏返回
	mui('header').on('tap', 'a', function() {
		var href = this.getAttribute('href');
		document.location.href = this.href;
	});
	//获取当前日期作为业务日期
	var now = new Date();
	var day,month
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
	document.getElementById("yrdate").value = today;
	document.getElementById("ycdate").value = today;
	document.getElementById("djrq").value = today;
	//列表信息宽度适应屏幕宽度
	document.getElementById('tablelist').style.width = window.innerWidth + 'px';

	//获取移出仓库信息
	var ycdata = [];
	var yc_pop = "";
	document.getElementById('ycck').addEventListener('tap', function(){
		var ckdata = plus.storage.getItem('ckdata');
		document.getElementById('s_pop1').value = "";
		ckdata = JSON.parse(ckdata);
		ycdata = ckdata;
		ListCreatYc(ckdata);
		
	});
	//移出仓库过滤
	document.getElementById('s_pop1').addEventListener('input',function(){
		var filter = document.getElementById('s_pop1').value;
		var filter_data = [];
		if (filter == "") {
			yc_pop = 'true';
			ListCreatYc(ycdata);
		} else{
			for (var i=0;i<ycdata.length;i++) {
				if (ycdata[i].CKBH.indexOf(filter) > -1 || ycdata[i].CKMC.indexOf(filter) > -1) {
					filter_data.push(ycdata[i]);
				}
			}
			yc_pop = 'true';
			ListCreatYc(filter_data);
			
		}
	});
	function ListCreatYc(data){
		var str='' ;
		document.getElementById('cklist').innerHTML = '';
		for (var i=0;i<data.length;i++) {
			str += '<li class="mui-table-view-cell"  id="'+data[i].CKBH+'">'+
			data[i].CKBH +'：'+ data[i].CKMC+
			'</li>'
		}
		document.getElementById('cklist').innerHTML += str;
		if (yc_pop == "") {
			mui('#popover1').popover('toggle',document.getElementById("ycck"));	
		}
		yc_pop = '';
		mui('.mui-scroll-wrapper').scroll()
	};
	var cklist = document.getElementById('cklist');
	cklist.addEventListener("tap", function(e) {
		var tagClass = e.target.getAttribute("class");
		if (tagClass && tagClass.indexOf("mui-table-view-cell") != -1) {
			var select = e.target.innerText;
			document.getElementById("ycck").value = select;
			plus.storage.setItem('ycck_bh', e.target.id);
			plus.storage.setItem('ycck_setting',select);
			mui('#popover1').popover('toggle',document.getElementById("ycck"));
		}
	});
	//获取移入仓库信息
	var yrdata = [];
	var yr_pop = "";
	document.getElementById('yrck').addEventListener('tap', function(){
		var ckdata = plus.storage.getItem('ckdata');
		document.getElementById('s_pop2').value = "";
		ckdata = JSON.parse(ckdata);
		yrdata = ckdata;
		ListCreatYr(ckdata);
	});
	//移入仓库过滤
	document.getElementById('s_pop2').addEventListener('input',function(){
		var filter = document.getElementById('s_pop2').value;
		var filter_data = [];
		if (filter == "") {
			yr_pop = 'true';
			var data = plus.storage.getItem('ckdata');
			ListCreatYr(data);
		} else{
			for (var i=0;i<yrdata.length;i++) {
				if (yrdata[i].CKBH.indexOf(filter) > -1 || yrdata[i].CKMC.indexOf(filter) > -1) {
					filter_data.push(yrdata[i]);
				}
			}
			yr_pop = 'true';
			ListCreatYr(filter_data);
		}
	});
	function ListCreatYr(data){
		var str='' ;
		document.getElementById('yccklist').innerHTML = '';
		for (var i=0;i<data.length;i++) {
			str += '<li class="mui-table-view-cell"  id="'+data[i].CKBH+'">'+
			data[i].CKBH +'：'+ data[i].CKMC+
			'</li>'
		}
		document.getElementById('yccklist').innerHTML += str;
		if (yc_pop == "") {
			mui('#popover2').popover('toggle',document.getElementById("yrck"));	
		}
		yc_pop = '';
		mui('.mui-scroll-wrapper').scroll()
	};
	
	var cklist = document.getElementById('yccklist');
	cklist.addEventListener("tap", function(e) {
		var tagClass = e.target.getAttribute("class");
		if (tagClass && tagClass.indexOf("mui-table-view-cell") != -1) {
			var select = e.target.innerText;
			document.getElementById("yrck").value = select;
			plus.storage.setItem('ycrk_bh', e.target.id);
			plus.storage.setItem('ycrk_setting',select);
			mui('#popover2').popover('toggle',document.getElementById("yrck"));
		}
	});
	//获取部门信息
	var bmdata = [];
	var bm_pop = "";
	document.getElementById('showdwPicker').addEventListener('tap', function(){
		var jkbu;
		url = plus.storage.getItem('url') + '/Handler/QueryHandler.ashx';
		mui.ajax(url,{
			data:{
				'action':'getbmxx',
			},
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				data = JSON.parse(data);
				bmdata = data;
				ListCreatBm(data);
			},
			error:function(xhr,type,errorThrown){
				mui.alert(errorThrown,type);
			}
		});
	});
	//部门过滤
	document.getElementById('s_pop').addEventListener('input',function(){
		var filter = document.getElementById('s_pop').value;
		var filter_data = [];
		if (filter == "") {
			bm_pop = 'true';
			ListCreatBm(bmdata);
		} else{
			for (var i=0;i<bmdata.length;i++) {
				if (bmdata[i].BMBH.indexOf(filter) > -1 || bmdata[i].BMMC.indexOf(filter) > -1) {
					filter_data.push(bmdata[i]);
				}
			}
			bm_pop = 'true';
			ListCreatBm(filter_data);
			
		}
	});
	function ListCreatBm(data){
		var str='' ;
		document.getElementById('infolist').innerHTML = '';
		for (var i=0;i<data.length;i++) {
			str += '<li class="mui-table-view-cell" id="'+data[i].BMBH+'">'+
               data[i].BMBH +'：'+ data[i].BMMC+
        	'</li>'
		}
		document.getElementById('infolist').innerHTML = str;
		if (bm_pop == "") {
			mui('#popover').popover('toggle',document.getElementById("showdwPicker"));
		}
		bm_pop = '';
		mui('.mui-scroll-wrapper').scroll()
	};
	//点击列表选择
	var ul_city = document.getElementById('infolist');
	ul_city.addEventListener("tap", function(e) {
		var tagClass = e.target.getAttribute("class");
		if (tagClass && tagClass.indexOf("mui-table-view-cell") != -1) {
			var select = e.target.innerText;
			document.getElementById("showdwPicker").value = select;
			plus.storage.setItem('ykdywbm_setting',select);
			plus.storage.setItem('ywbm_bh',e.target.id);
			mui('#popover').popover('toggle',document.getElementById("showdwPicker"));
		}
	});
	//获取移出仓库货位信息
	var ychwdata = [];
	var ychw_pop = "";
	document.getElementById('ychw').addEventListener('tap',function(){
		url = plus.storage.getItem('url') + '/Handler/QueryHandler.ashx';
		mui.ajax(url,{
			data:{
				'action' :'queryhw',
				'ckbh' :plus.storage.getItem('ycck_bh')
			},
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				data1 = JSON.parse(data);
				if (data1.length == 0) {
					alert('没有帮助数据');
				} else{
					data = JSON.parse(data);
					ychwdata = data;
					ListCreatYcHw(data);	
				}
			},
			error:function(xhr,type,errorThrown){
				mui.alert(errorThrown,type);
			}
		});
	});
	//移出货位过滤
	document.getElementById('s_pop4').addEventListener('input',function(){
		var filter = document.getElementById('s_pop4').value;
		var filter_data = [];
		if (filter == "") {
			ychw_pop = 'true';
			ListCreatYcHw(ychwdata);
		} else{
			for (var i=0;i<ychwdata.length;i++) {
				if (ychwdata[i].F_HWBH.indexOf(filter) > -1 || ychwdata[i].F_HWMC.indexOf(filter) > -1) {
					filter_data.push(ychwdata[i]);
				}
			}
			ychw_pop = 'true';
			ListCreatYcHw(filter_data);
		}
	});
	function ListCreatYcHw(data){
		var str='' ;
		document.getElementById("ychw").value = '';
		document.getElementById('ychwlist').innerHTML = '';
		for (var i=0;i<data.length;i++) {
			str += '<li class="mui-table-view-cell" id="'+data[i].F_HWBH+'">'+
               data[i].F_HWBH +'：'+ data[i].F_HWMC+
        	'</li>'
		}
		document.getElementById('ychwlist').innerHTML = str;
		if (ychw_pop == "") {
			mui('#popover4').popover('toggle',document.getElementById("ychw"));	
		}
		ychw_pop = '';
		mui('.mui-scroll-wrapper').scroll()
	};
	//点击列表选择
	var ul_city = document.getElementById('ychwlist');
	ul_city.addEventListener("tap", function(e) {
		var tagClass = e.target.getAttribute("class");
		if (tagClass && tagClass.indexOf("mui-table-view-cell") != -1) {
			var select = e.target.innerText;
			//仓库相同时货位不能一样
			if (document.getElementById('yrhw').value == select && plus.storage.getItem('ycck_bh') == plus.storage.getItem('ycrk_bh')) {
				mui.toast('移入移出货位相同！');
				document.getElementById("ychw").value = '';
				plus.storage.setItem('ychw_setting','');
				plus.storage.setItem('ychw_bh','');
			} else{
				document.getElementById("ychw").value = select;
				plus.storage.setItem('ychw_setting',select);
				plus.storage.setItem('ychw_bh',e.target.id);
			}
			mui('#popover4').popover('toggle',document.getElementById("ychw"));
		}
	});
	//获取移入仓库货位信息
	var yrhwdata = [];
	var yrhw_pop = "";
	document.getElementById('yrhw').addEventListener('tap',function(){
		url = plus.storage.getItem('url') + '/Handler/QueryHandler.ashx';
		mui.ajax(url,{
			data:{
				'action' :'queryhw',
				'ckbh' :plus.storage.getItem('ycrk_bh')
			},
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				data1 = JSON.parse(data);
				if (data1.length == 0) {
					alert('没有帮助数据');
				} else{
					data = JSON.parse(data);
					yrhwdata =data;
					ListCreatYrHw(data);	
				}
			},
			error:function(xhr,type,errorThrown){
				mui.alert(errorThrown,type);
			}
		});
	});
	
	//移出货位过滤
	document.getElementById('s_pop5').addEventListener('input',function(){
		var filter = document.getElementById('s_pop5').value;
		var filter_data = [];
		if (filter == "") {
			yrhw_pop = 'true';
			ListCreatYrHw(yrhwdata);
		} else{
			for (var i=0;i<yrhwdata.length;i++) {
				if (yrhwdata[i].F_HWBH.indexOf(filter) > -1 || yrhwdata[i].F_HWMC.indexOf(filter) > -1) {
					filter_data.push(yrhwdata[i]);
				}
			}
			yrhw_pop = 'true';
			ListCreatYrHw(filter_data);
		}
	});
	
	function ListCreatYrHw(data){
		var str='' ;
		document.getElementById('yrhwlist').innerHTML = '';
		for (var i=0;i<data.length;i++) {
			str += '<li class="mui-table-view-cell" id="'+data[i].F_HWBH+'">'+
               data[i].F_HWBH +'：'+ data[i].F_HWMC+
        	'</li>'
		}
		document.getElementById('yrhwlist').innerHTML = str;
		if (yrhw_pop == "") {
			mui('#popover5').popover('toggle',document.getElementById("yrhw"));
		}
		yrhw_pop = "";
		mui('.mui-scroll-wrapper').scroll()
	};
	//点击列表选择
	var ul_city = document.getElementById('yrhwlist');
	ul_city.addEventListener("tap", function(e) {
		var tagClass = e.target.getAttribute("class");
		if (tagClass && tagClass.indexOf("mui-table-view-cell") != -1) {
			var select = e.target.innerText;
			if (document.getElementById('ychw').value == select && plus.storage.getItem('ycck_bh') == plus.storage.getItem('ycrk_bh')) {
				mui.toast('移入移出货位相同！')
				document.getElementById("yrhw").value = '';
				plus.storage.setItem('yrhw_setting','');
				plus.storage.setItem('yrhw_bh','');
			} else{
				document.getElementById("yrhw").value = select;
				plus.storage.setItem('yrhw_setting',select);
				plus.storage.setItem('yrhw_bh',e.target.id);
			}
			mui('#popover5').popover('toggle',document.getElementById("yrhw"));
		}
	});
	
	//扫描
	document.getElementById('search').addEventListener('tap',function(){
		//判断基本信息是否填写
		var ycckCheck = document.getElementById('ycck').value;
		var dwCheck = document.getElementById('showdwPicker').value;
		var yrckCheck = document.getElementById("yrck").value;
			if (ycckCheck == '') {
				alert('请先维护移出仓库信息！');
			} else if(dwCheck == '') {
				alert('请先维护部门信息！');
			} else if(yrckCheck == '') {
				alert('请先维护移入仓库信息！');
			} else {
				//根据基本信息生成单据编号
				url = plus.storage.getItem('url') + '/Handler/QueryHandler.ashx';
				mui.ajax(url,{
					data:{
						'action':'getsjdh',
						'ljbm':'KCYKD'
					},
					type:'post',//HTTP请求类型
					timeout:10000,//超时时间设置为10秒；
					success:function(data){
						data = data.replace(/"/g,'');
						document.getElementById('sjdh').value = data;
					},
					error:function(xhr,type,errorThrown){
						mui.alert(errorThrown,type);
					}
				});
				
				//显示扫描界面
				document.getElementById('form').style.display = 'none';
				document.getElementById('header1').style.display = 'none';
//				document.getElementById('header2').style.display = 'none';
				var height = window.innerHeight + 'px';//获取页面实际高度  
	    		var width = window.innerWidth + 'px';  
	    		document.getElementById("bcid").style.height= height;
	    		document.getElementById("bcid").style.width= width;
	    		//调用扫描
	//			document.getElementById("bcid").style.display = 'block';
	//			startRecognize();
				document.getElementById('title').innerHTML = '扫描明细';
				document.getElementById('search_mx').style.display = 'block';
				document.getElementById('cgsmtm').focus();
			}
	});
	//取消扫描
	document.getElementById('qxsm').addEventListener('tap',function(){
		document.getElementById('title').innerHTML = '扫描明细';
		document.getElementById('search_mx').style.display = 'block';
		document.getElementById("bcid").style.display = 'none';
		document.getElementById("bcid1").style.display = 'none';
		scan.cancel()//结束条码识别
		scan.close()//关闭条码识别控件
	});
	//调用摄像头扫描条码
	document.getElementById('smtm').addEventListener('tap',function(){
		//调用扫描
		document.getElementById('search_mx').style.display = 'none';
		document.getElementById("bcid").style.display = 'block';
		document.getElementById("bcid1").style.display = 'block';
		startRecognize();
	});
	//手工输入条码，回车扫描
	document.getElementById('cgsmtm').addEventListener('keydown',function(e){
		var tmh = document.getElementById('cgsmtm').value;
		if (e.keyCode == 13) {
			tmxx(tmh);	
		}
	});
	document.getElementById('cgsmtm').addEventListener('blur',function(e){
		var tmh = document.getElementById('cgsmtm').value;
		if (tmh != "") {
			tmxx(tmh);
		}
	});
	//调用摄像头扫描条码
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
        switch(type){//QR,EAN13,EAN8都是编码格式,result是返回的结果
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
//	            case plus.barcode.CODE93:
//	            	text = 'CODE93';
//	            	break;
                case plus.barcode.CODE128:
                	text = 'CODE128';
                	break;
                case plus.barcode.DATAMATRIX:
                	text = 'DATAMATRIX';
                	break;
//              case plus.barcode.AZTEC:
//              	text = 'AZTEC';
//              	break;
//              case plus.barcode.UPCA:
//              	text = 'UPCA';
//              	break;
//              case plus.barcode.UPCE:
//              	text = 'UPCE';
//              	break;
//              case plus.barcode.CODABAR:
//              	text = 'CODABAR';
//              	break;
//              case plus.barcode.ITF:
//              	text = 'ITF';
//              	break;
//              case plus.barcode.MAXICODE:
//              	text = 'MAXICODE';
//              	break;
//              case plus.barcode.PDF417:
//              	text = 'PDF417';
//              	break;
//              case plus.barcode.RSS14:
//              	text = 'RSS14';
//              	break;
//              case plus.barcode.RSSEXPANDED:
//              	text = 'RSSEXPANDED';
//              	break;
        }
        btnArry = ['确认','取消']
        mui.confirm(result,'扫描信息',btnArry,function(e){
        	if (e.index == 0) {
        		document.getElementById("bcid").style.display = 'none';
        		document.getElementById("bcid1").style.display = 'none';
        		
        		document.getElementById('title').innerHTML = '扫描明细';
        		document.getElementById('search_mx').style.display = 'block';
        		document.getElementById('cgsmtm').focus();
        		scan.cancel()//结束条码识别
				scan.close()//关闭条码识别控件
				tmxx(result);
        	} else{
        		scan.cancel()//结束条码识别
				scan.close()//关闭条码识别控件
        		startRecognize();
        	}
        });
	};
	//通过条码号获取相关信息
	function tmxx(tmh){
		url = plus.storage.getItem('url') +'/Handler/QueryHandler.ashx';
		mui.ajax(url,{
			data:{
				'action':'querytmbase',
				'tmh':tmh
			},
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				data = JSON.parse(data);
				if (data.length == 0) {
					alert('未找到该条码号');
					document.getElementById('cgsmtm').value = "";
					document.getElementById('cgsmtm').focus();
				} else{
					document.getElementById('cgtm').value = tmh;
					document.getElementById('wlbh').value = data[0].TMBASE_WLBH;
					document.getElementById('wlmc').value = data[0].Lswlzd_wlmc;
					document.getElementById('ggxh').value = data[0].Lswlzd_ggxh;
					document.getElementById('pch').value = data[0].TMBASE_PCH;
					document.getElementById('zmsl').value = data[0].TMBASE_ZSL;
					document.getElementById('pdsl').value = data[0].TMBASE_ZSL;
					document.getElementById('jldw').value = data[0].JSJLDW_DWMC;
					document.getElementById('xm').value = data[0].TMBASE_XH;
					
					plus.storage.setItem('dj',data[0].TMBASE_DJ);
					plus.storage.setItem('jldw',data[0].LSWLZD_JLDW);
					plus.storage.setItem('sfdj',data[0].LSWLZD_SFDJ);
					plus.storage.setItem('ckfs',data[0].LSWLZD_CKFS);
					
					if (data[0].LSWLZD_SFDJ == '1') {
						//数量不允许输入,只能通过扫描获取
						document.getElementById('zmsl').readOnly = true;
						document.getElementById('pdsl').readOnly = true;
					} else{
						document.getElementById('zmsl').readOnly = false;
						document.getElementById('pdsl').readOnly = false;
					}
					if (data[0].LSWLZD_CKFS == '0') {
						//批次号不允许修改,通过条码号获取
						document.getElementById('pch').disabled = true;
					} else{
						document.getElementById('pch').disabled = false;
					}
				}
			},
			error:function(xhr,type,errorThrown){
				mui.alert(errorThrown,type);
			}
		});
	};
	//获取批次号信息
	document.getElementById('pch').addEventListener('tap', function(){
		url = plus.storage.getItem('url') + '/Handler/QueryHandler.ashx';
		var djrq = document.getElementById("djrq").value;
		djrq = djrq.replace(/-/g,'');
		mui.ajax(url,{
			data:{
				'action':'getpcxx',
				'wlbh':document.getElementById('wlbh').value,
				'dwbh':plus.storage.getItem('wldw_bh'),
				'djrq':djrq
			},
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				pcselect(data);
			},
			error:function(xhr,type,errorThrown){
				mui.alert(errorThrown,type);
			}
		});
	});
	//形成批次选择框
	function pcselect(data){
		data = JSON.parse(data);
		var str='';
		document.getElementById('pchlist').innerHTML = '';
		for (var i=0;i<data.length;i++) {
			str += '<li class="mui-table-view-cell"  id="'+data[i].WLBH+'">'+
	                   data[i].WLMC +':' + data[i].PCH+
	            '</li>'
		}
		document.getElementById('pchlist').innerHTML += str; 
		mui('#popover3').popover('toggle',document.getElementById("pch"));
		mui('.mui-scroll-wrapper').scroll();
	};
	//点击列表选择
	var ul_city = document.getElementById('pchlist');
	ul_city.addEventListener("tap", function(e) {
		var tagClass = e.target.getAttribute("class");
		if (tagClass && tagClass.indexOf("mui-table-view-cell") != -1) {
			var select = e.target.innerText;
			document.getElementById("pch").value = select;
			mui('#popover3').popover('toggle',document.getElementById("pch"));
		}
	});
	
	//主界面删除
	var deleteButton = document.getElementById('delete');
	deleteButton.addEventListener('tap', function(event){
		var btnArray = ['确认', '取消'];
		mui.confirm("数据未保存，是否继续？","数据删除",btnArray,function(e){
			if (e.index == 0) {
				mui('.xs input').each(function () {
					this.value="";
				});
				document.getElementById("tdmain").innerHTML = '';
				smdata.splice(0,smdata.length);
				arrMxdata.splice(0,arrMxdata.length);
				document.getElementById("yrdate").value = today;
				document.getElementById("ycdate").value = today;
				document.getElementById("djrq").value = today;
				Djlx = 'SGLR'
			}
		})	
	});
		
	//扫描界面保存
	var save_mxButton = document.getElementById("save_mx");
	save_mxButton.addEventListener('tap',savemx);
	function savemx(){
		var zmsl = parseFloat(document.getElementById("zmsl").value);
		var pdsl = parseFloat(document.getElementById("pdsl").value);
		zmsl = zmsl.toFixed(parseInt(plus.storage.getItem('KC_SLDECN')));
		pdsl = pdsl.toFixed(parseInt(plus.storage.getItem('KC_SLDECN')));
		var dj =parseFloat(plus.storage.getItem('dj'));
		dj = dj.toFixed(parseInt(plus.storage.getItem('KC_DJDECN')));
		var je = zmsl * dj;
		je = je.toFixed(parseInt(plus.storage.getItem('KC_JEDECN')));
		
		var jldw;
		if (plus.storage.getItem('jldw') == null) {
			jldw = '';
		} else{
			jldw = plus.storage.getItem('jldw');
		}
		var ychw_bh;
		if (plus.storage.getItem('ychw_bh') == null) {
			ychw_bh = '';
		} else{
			ychw_bh = plus.storage.getItem('ychw_bh');
		}
		var yrhw_bh;
		if (plus.storage.getItem('yrhw_bh') == null) {
			yrhw_bh = '';
		} else{
			yrhw_bh = plus.storage.getItem('yrhw_bh');
		}
		
		
		var obj = {
			"F_smtm" : document.getElementById("cgsmtm").value,
			"F_tmh" : document.getElementById("cgtm").value,
			"F_wlbh" : document.getElementById("wlbh").value,
			"F_wlmc" : document.getElementById("wlmc").value,
			"F_ggxh" : document.getElementById("ggxh").value,
			"F_jldw" : jldw,
			"F_pch" : document.getElementById("pch").value,
			"F_hwbh" : ychw_bh,
			"F_yrhw" : yrhw_bh,
			"F_sl" : zmsl,
			"F_smsl" : pdsl,
			"F_dj":dj,
			"F_je":je,
			"F_xm" : document.getElementById("xm").value,
			"F_tbx1" : document.getElementById("tbxm1").value,
			"F_tbx2" : document.getElementById("tbxm2").value,
			"F_tbx3" : document.getElementById("tbxm3").value,
			"F_tbx4" : document.getElementById("tbxm4").value,
			"F_tbx5" : document.getElementById("tbxm5").value,
			"F_lsbh":"",
		    "F_flh":"",
		    "F_bz":""
		};
		var newCheck = true;
		var czCheck = true;
		if (document.getElementById("wlbh").value == '') {
			alert('空数据,不允许保存');
		} else{
			//判断是参照还是新增
			if (canz == 1) {
				for (var i=0; i<smdata.length;i++) {
					if (document.getElementById("wlbh").value == smdata[i].F_wlbh && smdata[i].F_pch == document.getElementById('pch').value && smdata[i].F_ggxh == document.getElementById('ggxh').value  ) {
						smdata[i].F_smsl = document.getElementById('pdsl').value;
						arrMxdata[i].F_smsl = document.getElementById('pdsl').value;
						newCheck = false;
						czCheck = false;
						break;
					} 
				}
				if (newCheck) {
					alert('参照分录中不存在该扫描物料,请确认!');
					czCheck = false;
				}
			} else{
				for (var i=0; i<smdata.length;i++) {
					if (document.getElementById("wlbh").value == smdata[i].F_wlbh && smdata[i].F_pch == document.getElementById('pch').value && smdata[i].F_ggxh == document.getElementById('ggxh').value && document.getElementById("cgsmtm").value ==  smdata[i].F_smtm ) {
						smdata[i].F_sl = parseFloat(smdata[i].F_sl) + parseFloat(document.getElementById("pdsl").value);
						smdata[i].F_smsl = smdata[i].F_sl;
						newCheck = false;
						break;
					}
				}
			}
			if (czCheck) {
				arrMxdata.push(obj);
			}
			if (newCheck) {
				smdata.push(obj);
			}
			mui('.sm input').each(function () {
				this.value = "";
			});
			document.getElementById("tdmain").innerHTML = '';
			returndata();
		}
	};
	//扫描界面删除
	var delete_mxButton = document.getElementById("delete_mx");
	delete_mxButton.addEventListener('tap',deletemx);
	function deletemx(){
		var btnArray = ['确认', '取消'];
		var deletecheck;
		mui('.sm input').each(function () {
			if (this.value.trim() == "") {
				deletecheck = false;
				return false;
			} else{
				deletecheck = true;
				return false;
			}
		});
		if (deletecheck == true) {
			mui.confirm("当前数据未保存，是否继续？","",btnArray,function(event){
				if (event.index == 0) {
					mui('.sm input').each(function () {
						this.value = "";
					});
				}
			})
		} else{
		}
	};
	//扫描界面返回
	var searchReturnButton = document.getElementById('search_return');
	searchReturnButton.addEventListener('tap', function(event){
		var btnArray = ['确认', '取消'];
		var deletecheck;
		mui('.sm input').each(function () {
			if (this.value.trim() == "") {
				deletecheck = false;
				return false;
			} else{
				deletecheck = true;
				return false;
			}
		});
		if (deletecheck == true) {
			mui.confirm("当前数据未保存，是否继续？","",btnArray,function(event){
				if (event.index == 0) {
					mui('.sm input').each(function () {
						this.value = "";
					});
					document.getElementById('form').style.display = 'block';
					document.getElementById('title').innerHTML = '调拨单';
					document.getElementById('search_mx').style.display = 'none';
					document.getElementById('header1').style.display = 'block';
//					document.getElementById('header2').style.display = 'block';
				}
			})
		} else{
			document.getElementById('form').style.display = 'block';
			document.getElementById('title').innerHTML = '调拨单';
			document.getElementById('search_mx').style.display = 'none';
			document.getElementById('header1').style.display = 'block';
//			document.getElementById('header2').style.display = 'block';
		}
	});
	function returndata(){
		var tbody = document.getElementById("tdmain");
		for (var i =0; i< smdata.length; i++) {
			var trow = getdatarow(smdata[i],i);
			tbody.appendChild(trow);
		}
	};
	function getdatarow(data,i){
		var row = document.createElement('tr'); //创建行
		
		i = parseFloat(i) + 1;
		var numberCell = document.createElement('td');
		numberCell.innerHTML = i;
		row.appendChild(numberCell);
		
		var idCell = document.createElement('td'); //创建列
		idCell.innerHTML = data.F_wlbh; //填充数据
		row.appendChild(idCell); //加入行  ，下面类似
		
		var nameCell = document.createElement('td');
		nameCell.innerHTML = data.F_wlmc;
		row.appendChild(nameCell);
		
		var ggxhCell = document.createElement('td');
		ggxhCell.innerHTML = data.F_ggxh;
		row.appendChild(ggxhCell);
		
		var pchCell = document.createElement('td');
		pchCell.innerHTML = data.F_pch;
		row.appendChild(pchCell);
		
		var ychwCell = document.createElement('td');
		ychwCell.innerHTML = data.F_hwbh;
		row.appendChild(ychwCell);
		
		var yrhwCell = document.createElement('td');
		yrhwCell.innerHTML = data.F_yrhw;
		row.appendChild(yrhwCell);
					            			
		var slCell = document.createElement('td');
		slCell.innerHTML = data.F_sl;
		row.appendChild(slCell);
		
		var slCell = document.createElement('td');
		slCell.innerHTML = data.F_smsl;
		row.appendChild(slCell);
		
//		var djCell = document.createElement('td');
//		djCell.innerHTML = data.F_dj;
//		row.appendChild(djCell);
//		
//		var jeCell = document.createElement('td');
//		jeCell.innerHTML = data.F_je;
//		row.appendChild(jeCell);
		
		return row;
	};
	//主页面保存
	var saveButton = document.getElementById('save');
	saveButton.addEventListener('tap', function(event){
		var a = document.getElementById("tdmain").innerHTML;
		if (a == '') {
			mui.toast('列表信息为空');
		} else{
			var arr = {
				'arrMain':[{
					'KCYXZ1_LSBH': '',
					'KCYXZ1_DJRQ': document.getElementById('djrq').value,
					'KCYXZ1_CKYWRQ' : document.getElementById('ycdate').value,
					'KCYXZ1_RKYWRQ' : document.getElementById('yrdate').value,
					'KCYXZ1_TDBH': '',
					'KCYXZ1_QCBZ': '',
					'KCYXZ1_PJLX': 'Y',
					'KCYXZ1_SJDH': document.getElementById('sjdh').value,
					'KCYXZ1_TDLS': '',
					'KCYXZ1_CXBH': '',
					'KCYXZ1_DWBH': '',
					'KCYXZ1_YWBS': '',
					'KCYXZ1_BMBH': plus.storage.getItem('ywbm_bh'),
					'KCYXZ1_YRCK': plus.storage.getItem('ycrk_bh'),
					'KCYXZ1_YCCK': plus.storage.getItem('ycck_bh'),
					'KCYXZ1_RKLBBH': '',
					'KCYXZ1_CKLBBH': '',
					'KCYXZ1_YKY': '',
					'KCYXZ1_YRY': '',
					'KCYXZ1_DHDD':'',
					'KCYXZ1_GXTD':'0',
					'KCYXZ1_YRBM':'',
					'KCYXZ1_PZR':'',
					'KCYXZ1_LRXM':plus.storage.getItem('l_ZGBH'),
					'KCYXZ1_CKXM':'',
					'KCYXZ1_RKXM':'',
					'KCYXZ1_PZRQ':'',
					'KCYXZ1_PZNM':'',
					'KCYXZ1_PZND':'',
					'KCYXZ1_PZBH':'',
					'KCYXZ1_BZ':'',
				}],
				'arrMx':arrMxdata,
				'smdata':smdata
			};
			url = plus.storage.getItem("url") + '/Handler/KcykdsaveHandler.ashx';
			arr = JSON.stringify(arr);
			console.log(arr)
			mui.ajax(url,{
				data:{
					'data':arr
				},
				type:'post',//HTTP请求类型
				timeout:10000,//超时时间设置为10秒；
				async:true,
				crossDomain:true,
				success:function(data){
					data1 = parseInt(data);
					console.log(data);
					if (data1 >= 1) {
						alert("保存成功");
						mui('.xs input').each(function () {
							this.value="";
						});
						document.getElementById("tdmain").innerHTML = '';
						smdata.splice(0,smdata.length);
						arrMxdata.splice(0,arrMxdata.length);
						document.getElementById("yrdate").value = today;
						document.getElementById("ycdate").value = today;
						document.getElementById("djrq").value = today;
						Djlx = 'SGLR';
					} else{
						var code = data.slice(1);
						if (code.length == 16) {
							var vsMinRQ = code.slice(0,8);
							var vsMaxRQ = code.slice(8);
							var erro = "业务日期应该在["+vsMinRQ+"]到["+vsMaxRQ+"]之间"
							alert(erro);
						}else{
							alert("保存失败");
						}
					}
				},
				error:function(xhr,type,errorThrown){
					if (type == 'abort') {
						alert('网络问题,请稍后重试!');
					} else{
						alert('服务器内部错误!');
					}
				}
			});
		}
		
	});
	//参照
	var djbhEnter = document.getElementById('sjdh');
	djbhEnter.addEventListener('keydown', function(e){
		if (e.keyCode == 13) {
			var sjdh = document.getElementById('sjdh').value;
			if (Djlx.trim() == "") {
				alert('请输入单据类型');
			} else if(sjdh.trim() == ""){
				alert('请输入单据单据编号');
			} else{
				url = plus.storage.getItem("url") + '/Handler/QueryHandler.ashx'
				mui.ajax(url, {
					data:{
						'action':'queryczdj',
						'ljbm': Djlx,
						'djbh': sjdh
					},
					type:'post',//HTTP请求类型
					timeout:10000,//超时时间设置为10秒；
					success:function(data){
						data =JSON.parse(data)
						if (data[0].F_wlbh == "") {
							alert("未查询到相关数据");
						} else{
							smdata = data;
							arrMxdata = data;
							canz = 1;
							var tbody = document.getElementById("tdmain");
							for (var i =0; i<data.length; i++) {
								
								document.getElementById("showdwPicker").value = data[i].F_dwbh;
								
								var trow = getdatarow(data[i],i);
								tbody.appendChild(trow);
							}
						}
					},
					error:function(xhr,type,errorThrown){
						mui.alert(errorThrown,type);
					}
				});
			}
		}
	});	
});