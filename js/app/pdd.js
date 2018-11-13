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
						document.getElementById('title').innerHTML = '盘点单';
						document.getElementById('search_mx').style.display = 'none';
						document.getElementById('header1').style.display = 'block';
	//					document.getElementById('header2').style.display = 'block';
					}
				})
			} else{
				document.getElementById('form').style.display = 'block';
				document.getElementById('title').innerHTML = '盘点单';
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
	release:false
	}
});

mui.plusReady(function(){
	var arrdata = [];//保存数据
	var arrMxdata =[];//用来存储扫描数据
	//单据类型
	var Djlx;
	var ckbh;
	var canz;
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
		day = now.getDate();
	}
	//格式化月，如果小于9，前面补0
	if (now.getMonth() <=9) {
		month = ("0" + (now.getMonth() + 1)).slice(-2);
	}else {
		month = now.getMonth()
	}
	//拼装完整日期格式
	var today = now.getFullYear()+"-"+(month)+"-"+(day);
	//完成赋值
	document.getElementById("ywdate").value = today;
	//列表信息宽度适应屏幕宽度
	document.getElementById('tablelist').style.width = window.innerWidth + 'px';

	//获取仓库信息
	document.getElementById('showCkPicker').addEventListener('tap', function(){
		var ckdata = plus.storage.getItem('ckdata');
		ckdata = JSON.parse(ckdata);
		var str='' ;
		document.getElementById('cklist').innerHTML = '';
		for (var i=0;i<ckdata.length;i++) {
			str += '<li class="mui-table-view-cell"  id="'+ckdata[i].CKBH+'">'+
			ckdata[i].CKBH +'：'+ ckdata[i].CKMC+
			'</li>'
		}
		document.getElementById('cklist').innerHTML = str; 
		mui('#popover1').popover('toggle',document.getElementById("showCkPicker"));
		mui('.mui-scroll-wrapper').scroll()
	});
	var cklist = document.getElementById('cklist');
	cklist.addEventListener("tap", function(e) {
		var tagClass = e.target.getAttribute("class");
		if (tagClass && tagClass.indexOf("mui-table-view-cell") != -1) {
			var select = e.target.innerText;
			document.getElementById("showCkPicker").value = select;
			plus.storage.setItem('scrk_ckbh', e.target.id);
			mui('#popover1').popover('toggle',document.getElementById("showCkPicker"));
		}
	});
	//获取部门信息
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
				ListCreatBm(data);
			},
			error:function(xhr,type,errorThrown){
				mui.alert(errorThrown,type);
			}
		});
	});
	function ListCreatBm(data){
		data = JSON.parse(data);
		var str='' ;
		document.getElementById('infolist').innerHTML = '';
		for (var i=0;i<data.length;i++) {
			str += '<li class="mui-table-view-cell" id="'+data[i].BMBH+'">'+
               data[i].BMBH +'：'+ data[i].BMMC+
        	'</li>'
		}
		document.getElementById('infolist').innerHTML = str; 
		mui('#popover').popover('toggle',document.getElementById("showdwPicker"));
		mui('.mui-scroll-wrapper').scroll()
	};
	//点击列表选择
	var ul_city = document.getElementById('infolist');
	ul_city.addEventListener("tap", function(e) {
		var tagClass = e.target.getAttribute("class");
		if (tagClass && tagClass.indexOf("mui-table-view-cell") != -1) {
			var select = e.target.innerText;
			document.getElementById("showdwPicker").value = select;
			plus.storage.setItem('jkbu_bh', e.target.id);
			mui('#popover').popover('toggle',document.getElementById("showdwPicker"));
		}
	});
	//###############
	//根据盘点单号获取盘点信息
	document.getElementById('sjdh').addEventListener('keydown',function(event){
		if (event.keyCode == 13) {
			//回车获取盘点信息
			var sjdh = document.getElementById('sjdh').value;
			var url = plus.storage.getItem('url') + '/Handler/QueryHandler.ashx';
			mui.ajax(url,{
				data:{
					'action':'getpdd',
					'sjdh':sjdh
				},
				async:true,
				crossDomain:true,
				type:'post',//HTTP请求类型
				timeout:10000,//超时时间设置为10秒；
				success:function(data){
					if (JSON.parse(data).length == 0) {
						alert('未查询到相关数据!');
					} else{
						//调用方法对页面赋值
						pdxx(data);
					}
				},
				error:function(xhr,type,errorThrown){
					mui.alert(errorThrown,type);
				}
			});
		}
	});
	//根据获取的盘点信息对页面赋值
	function pdxx(data){
		data = JSON.parse(data);
		var tbody = document.getElementById("tdmain");
		for (var i=0;i<data.length;i++) {
			//修改单据日期格式，用来正确显示
			var year = data[i].F_YWRQ.substr(0,4);
			var mouth =  data[i].F_YWRQ.substr(4,2);
			var day =  data[i].F_YWRQ.substr(6,2);
			var f_djrq = year+'-'+mouth+'-'+day;
			document.getElementById('ywdate').value = f_djrq;
			document.getElementById('showCkPicker').value = data[i].F_CKMC;
			document.getElementById('showdwPicker').value = data[i].F_BMMC;
			
			var trow = getdatarow(data[i],i);
			tbody.appendChild(trow);
		}
		arrMxdata = data;
	};
	//扫描
	document.getElementById('search').addEventListener('tap',function(){
		//判断基本信息是否填写
		var ckCheck = document.getElementById('showCkPicker').value;
		var dwCheck = document.getElementById('showdwPicker').value;
		
			if (arrMxdata.length == 0) {
				alert('请先通过单据号参照盘点单!');
			} else if(dwCheck == '') {
				alert('请先维护部门信息！');
			} else if(ckCheck == '') {
				alert('请先维护仓库信息！');
			} else {
				//显示扫描界面
				document.getElementById('form').style.display = 'none';
				document.getElementById('header1').style.display = 'none';
				var height = window.innerHeight + 'px';//获取页面实际高度
	    		var width = window.innerWidth + 'px';  
	    		document.getElementById("bcid").style.height= height;  
	    		document.getElementById("bcid").style.width= width;
	    		//调用扫描
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
	document.getElementById('cgsmtm').addEventListener('keydown',function(event){
		//调用扫描
		var tmh = document.getElementById('cgsmtm').value;
		if (event.keyCode == 13) {
			tmxx(tmh);
		}
	});
	document.getElementById('cgsmtm').addEventListener('change',function(){
		//调用扫描
		var tmh = document.getElementById('cgsmtm').value;
		if (tmh != "") {
			tmxx(tmh);
		}
	});
	document.getElementById('smtm').addEventListener('tap',function(){
		document.getElementById('search_mx').style.display = 'none';
		document.getElementById("bcid").style.display = 'block';
		document.getElementById("bcid1").style.display = 'block';
		startRecognize();
	});
	//调用摄像头扫描条码
	scan = null;
	function startRecognize(){
		try{
			var filter;
			var style = {frameColor: "#29E52C",scanbarColor: "#29E52C",background: ""};
			//扫描空间构造
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
        		tmxx(result);
        		document.getElementById("bcid").style.display = 'none';
        		document.getElementById("bcid1").style.display = 'none';
        		document.getElementById('title').innerHTML = '扫描明细';
        		document.getElementById('search_mx').style.display = 'block';
        		document.getElementById('cgsmtm').focus();
        		scan.cancel()//结束条码识别
				scan.close()//关闭条码识别控件
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
				data = JSON.parse(data)
				if (data.length == 0) {
					alert('未查询到相关数据!');
				} else{
					
					plus.storage.setItem('jldwbh',data[0].LSWLZD_JLDW)
					
					document.getElementById('cgtm').value = tmh;
					document.getElementById('wlbh').value = data[0].TMBASE_WLBH;
					document.getElementById('wlmc').value = data[0].Lswlzd_wlmc;
					document.getElementById('ggxh').value = data[0].Lswlzd_ggxh;
					document.getElementById('pch').value = data[0].TMBASE_PCH;
					document.getElementById('hw').value = data[0].TMBASE_HW;
					document.getElementById('pdsl').value = data[0].TMBASE_ZSL;//应该不是这样的
					document.getElementById('jldw').value = data[0].JSJLDW_DWMC;
//					document.getElementById('xm').value = data[0].TMBASE_XH;
					
					plus.storage.setItem('sfdj',data[0].LSWLZD_SFDJ);
					plus.storage.setItem('ckfs',data[0].LSWLZD_CKFS);
					
					if (data[0].LSWLZD_SFDJ == '1') {
						//数量不允许输入,只能通过扫描获取
						document.getElementById('pdsl').readOnly = true;
					} else{
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
//	document.getElementById('pch').addEventListener('tap', function(){
//		url = plus.storage.getItem('url') + '/Handler/QueryHandler.ashx';
//		var djrq = document.getElementById("ywdate").value;
//		djrq = djrq.replace(/-/g,'');
//		var wldw_bh = '';
//		if (plus.storage.getItem('wldw_bh') == null) {
//			wldw_bh = "";
//		}else{
//			wldw_bh = plus.storage.getItem('wldw_bh');
//		}
//		mui.ajax(url,{
//			data:{
//				'action':'getpcxx',
//				'wlbh':document.getElementById('wlbh').value,
//				'dwbh':wldw_bh,
//				'djrq':djrq
//			},
//			type:'post',//HTTP请求类型
//			timeout:10000,//超时时间设置为10秒；
//			success:function(data){
//				if (JSON.parse(data).length == 0) {
//					alert('没有帮助信息!')
//				} else{
//					pcselect(data);
//				}
//			},
//			error:function(xhr,type,errorThrown){
//				mui.alert(errorThrown,type);
//			}
//		});
//	});
//	//形成批次选择框
//	function pcselect(data){
//		data = JSON.parse(data);
//		var str='';
//		document.getElementById('pchlist').innerHTML = '';
//		for (var i=0;i<data.length;i++) {
//			str += '<li class="mui-table-view-cell"  id="'+data[i].PCH+'">'+
//	                   data[i].PCH+
//	            '</li>'
//		}
//		document.getElementById('pchlist').innerHTML = str; 
//		mui('#popover3').popover('toggle',document.getElementById("pch"));
//		mui('.mui-scroll-wrapper').scroll();
//	};
//	//点击列表选择
//	var ul_city = document.getElementById('pchlist');
//	ul_city.addEventListener("tap", function(e) {
//		var tagClass = e.target.getAttribute("class");
//		if (tagClass && tagClass.indexOf("mui-table-view-cell") != -1) {
//			var select = e.target.innerText;
//			document.getElementById("pch").value = select;
//			plus.storage.setItem('pc_bh',e.target.id);
//			mui('#popover3').popover('toggle',document.getElementById("pch"));
//		}
//	});
	//获取货位
//	document.getElementById('hw').addEventListener('tap',function(){
//	url = plus.storage.getItem('url') + '/Handler/QueryHandler.ashx';
//	mui.ajax(url,{
//		data:{
//			'action' :'queryhw',
//			'ckbh' : plus.storage.getItem('scrk_ckbh')
//		},
//		type:'post',//HTTP请求类型
//		timeout:10000,//超时时间设置为10秒；
//		success:function(data){
//			data1 = JSON.parse(data);
//			if (data1.length == 0) {
//				alert('没有帮助数据');
//			} else{
//				ListCreatHw(data);	
//			}
//		},
//		error:function(xhr,type,errorThrown){
//			mui.alert(errorThrown,type);
//		}
//	});
//});
//function ListCreatHw(data){
//	data = JSON.parse(data);
//	var str='' ;
//	document.getElementById('hwlist').innerHTML = '';
//	for (var i=0;i<data.length;i++) {
//		str += '<li class="mui-table-view-cell" id="'+data[i].F_HWBH+'">'+
//         data[i].F_HWBH +'：'+ data[i].F_HWMC+
//  	'</li>'
//	}
//	document.getElementById('hwlist').innerHTML += str; 
//	mui('#popover4').popover('toggle',document.getElementById("hw"));
//	mui('.mui-scroll-wrapper').scroll()
//};
////点击列表选择
//var ul_city = document.getElementById('hwlist');
//ul_city.addEventListener("tap", function(e) {
//	var tagClass = e.target.getAttribute("class");
//	if (tagClass && tagClass.indexOf("mui-table-view-cell") != -1) {
//		var select = e.target.innerText;
//		
//		document.getElementById("hw").value = e.target.id;
//		plus.storage.setItem('hw_bh',e.target.id);
//		mui('#popover4').popover('toggle',document.getElementById("hw"));
//	}
//});
	
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
				arrMxdata.splice(0,arrMxdata.length);
				arrdata.splice(0,arrdata.length);
				document.getElementById("ywdate").value = today;
			}
		})	
	});
		
	//扫描界面保存
	var save_mxButton = document.getElementById("save_mx");
	save_mxButton.addEventListener('tap',savemx);
	function savemx(){
		//归集扫描数据
		var wlbh = document.getElementById('wlbh').value;
		var ggxh = document.getElementById('ggxh').value;
		var pch = document.getElementById('pch').value;
		var hw_bh ='';
		if (plus.storage.getItem('hw_bh') == null) {
			hw_bh ='';
		} else{
			hw_bh =plus.storage.getItem('hw_bh');
		}
		if (arrMxdata.length == 0) {
			alert('盘点表明细中不存在盘点数据!');
			mui('.sm input').each(function () {
				this.value = "";
			});
		} else{
			for (var i=0;i<arrMxdata.length;i++) {
				var str = {};
				if (wlbh == arrMxdata[i].F_WLBH && ggxh == arrMxdata[i].F_GGXH && pch == arrMxdata[i].F_PCH) {
					str = {
						'KCYXZ2_RKSL':document.getElementById('pdsl').value,
						'KCYXZ2_SLCY':'0',
						'KCYXZ1_LSBH':arrMxdata[i].F_LSBH,
						'KCYXZ2_FLBH':arrMxdata[i].F_FLH,
						'KCYXZ2_HWBH':hw_bh
					}
					arrMxdata[i].F_PDSL = document.getElementById('pdsl').value;
					arrdata.push(str);
				} else{
					alert('盘点表明细中不存在该物料!')
				}
				mui('.sm input').each(function () {
					this.value = "";
				});
				document.getElementById("tdmain").innerHTML = '';
				returndata();
			}
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
					document.getElementById('title').innerHTML = '盘点单';
					document.getElementById('search_mx').style.display = 'none';
					document.getElementById('header1').style.display = 'block';
//					document.getElementById('header2').style.display = 'block';
				}
			})
		} else{
			document.getElementById('form').style.display = 'block';
			document.getElementById('title').innerHTML = '盘点单';
			document.getElementById('search_mx').style.display = 'none';
			document.getElementById('header1').style.display = 'block';
		}
	});
	function returndata(){
		var tbody = document.getElementById("tdmain");
		for (var i =0; i< arrMxdata.length; i++) {
			var trow = getdatarow(arrMxdata[i],i);
			tbody.appendChild(trow);
		}
	};
	function getdatarow(data,i){
		var row = document.createElement('tr'); //创建行
		//行号
		i = parseFloat(i) + 1;
		var numberCell = document.createElement('td');
		numberCell.innerHTML = i;
		row.appendChild(numberCell);
		//物料编号
		var wlbhCell = document.createElement('td');
		wlbhCell.innerHTML = data.F_WLBH;
		row.appendChild(wlbhCell);
		//物料名称
		var wlmcCell = document.createElement('td');
		wlmcCell.innerHTML = data.F_WLMC;
		row.appendChild(wlmcCell);
		//账面数量
		var zmslCell = document.createElement('td');
		zmslCell.innerHTML = data.F_SL;
		row.appendChild(zmslCell);
		//盘点数量
		var zmslCell = document.createElement('td');
		zmslCell.innerHTML = data.F_PDSL;
		row.appendChild(zmslCell);
		//规格型号
		var ggxhCell = document.createElement('td');
		ggxhCell.innerHTML = data.F_GGXH;
		row.appendChild(ggxhCell);
		//批次号
		var pchCell = document.createElement('td');
		pchCell.innerHTML = data.F_PCH;
		row.appendChild(pchCell);
		//货位
		var hwCell = document.createElement('td');
		hwCell.innerHTML = data.F_HWBH;
		row.appendChild(hwCell);
		//特别项目
		
		return row;
	};
	//主页面保存
	var saveButton = document.getElementById('save');
	saveButton.addEventListener('tap', function(event){
		var arr = {
			"arrMain1":[{
				"ywrq":document.getElementById('ywdate').value
			}],
			'arrMain':arrMxdata,
			'arrMx':arrdata
		};
		console.log(JSON.stringify(arr));
		arr = JSON.stringify(arr);
		url = plus.storage.getItem("url") + '/Handler/KcpddsaveHandler.ashx';
		mui.ajax(url,{
			data:{
				'data':arr
			},
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				data1 = parseInt(data);
				console.log(data);
				if (data1 >= 1) {
					alert("保存成功");
					mui('.xs input').each(function () {
						this.value="";
					});
					document.getElementById("tdmain").innerHTML = '';
					arrMxdata.splice(0,arrMxdata.length);
					arrdata.splice(0,arrdata.length);
					document.getElementById("ywdate").value = today;
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
				mui.alert(errorThrown,type);
			}
		});
	});
});