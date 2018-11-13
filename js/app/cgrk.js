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
							document.getElementById('title').innerHTML = '采购入库单';
							document.getElementById('search_mx').style.display = 'none';
							document.getElementById('header1').style.display = 'block';
							document.getElementById('header2').style.display = 'block';
						}
					})
				} else{
					document.getElementById('form').style.display = 'block';
					document.getElementById('title').innerHTML = '采购入库单';
					document.getElementById('search_mx').style.display = 'none';
					document.getElementById('header1').style.display = 'block';
					document.getElementById('header2').style.display = 'block';
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
mui.plusReady(function () {
    var smdata = [];//用来展示扫描汇总数据
	var arrMxdata =[];//用来存储扫描数据
	var Djlx;//单据类型
	var ckbh;//仓库编号
	var canz;//是=是否参照
	//返回主界面处理列表缓存数据
	document.getElementById('header1').addEventListener('tap',function(){
		plus.storage.setItem('list_arrMxdata','');
		plus.storage.setItem('list_smdata','');
	});
	//设置界面返回列表信息处理
	if (plus.storage.getItem('list_arrMxdata') == "") {
		
	}else if (plus.storage.getItem('list_arrMxdata') == null) {
		
	}else{
		arrMxdata = JSON.parse(plus.storage.getItem('list_arrMxdata'));
		smdata = JSON.parse(plus.storage.getItem('list_smdata'));
		returndata();
	}
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
	mui('header').on('tap', 'a', function() {
		var href = this.getAttribute('href');
		document.location.href = this.href;
	});
	Djlx = 'SGLR'
		document.getElementById('showDjlxPicker').value = '手工录入';
		document.getElementById('djbh').style.display = 'none';
		document.getElementById('showDjlxPicker').addEventListener('tap', function(){
		mui('#popover2').popover('toggle', document.getElementById('showDjlxPicker'));
		mui('.mui-scroll-wrapper').scroll();
		});
		//点击列表选择
		var lblist = document.getElementById('lblist');
		lblist.addEventListener("tap", function(e) {
			document.getElementById('tdmain').innerHTML = '';
			var tagClass = e.target.getAttribute("class");
			if (tagClass && tagClass.indexOf("mui-table-view-cell") != -1) {
				var select = e.target.innerText;
				document.getElementById("showDjlxPicker").value = select;
				Djlx = e.target.id;
				if (Djlx == 'SGLR') {
					document.getElementById('djbh').style.display = 'none';
				}else {
					document.getElementById('djbh').style.display = 'block';
				}
				mui('#popover2').popover('toggle',document.getElementById("showDjlxPicker"));
				}
		});
//		}, false);
		//日期
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
		document.getElementById("ywdate").value = today;
		document.getElementById('tablelist').style.width = window.innerWidth + 'px';
		//红单
		var redListsButton = document.getElementById('redLists');
		redListsButton.addEventListener('tap', function(event) {
			//暂时不显示冲销单号，做红单时只是显示手工录入
			document.getElementById('yd').style.display = 'block';
			document.getElementById('cxd').style.display = 'none';
		});
		//蓝单
		var bluListsButton = document.getElementById('bluLists');
		bluListsButton.addEventListener('tap', function(event){
			document.getElementById('yd').style.display = 'block';
			document.getElementById('cxd').style.display = 'none';
		});
		//扫描按钮
		//扫描时根据扫描数据动态生成扫描界面
		var searchButton = document.getElementById('search');
		searchButton.addEventListener('tap', function(event){
			//判断基本信息是否填写
			var ckCheck = document.getElementById('showCkPicker').value;
			var dwCheck = document.getElementById('showdwPicker').value;
			
			if (ckCheck == '') {
				alert('请先维护仓库信息！');
			} else if(dwCheck == '') {
				alert('请先维护供应商信息！');
			} else if (plus.storage.getItem('ywlb_bh') == null || plus.storage.getItem('ywlb_bh') == "") {
				alert('请先维护业务类别信息！');
			} else if (plus.storage.getItem('cgbm_bh') == null || plus.storage.getItem('cgbm_bh') == "") {
				alert('请先维护采购部门信息！');
			} else if (plus.storage.getItem('cgry_bh') == null || plus.storage.getItem('cgry_bh') == "") {
				alert('请先维护采购员信息！');
			} else {
				//根据基本信息生成单据编号
				url = plus.storage.getItem('url') + '/Handler/QueryHandler.ashx';
				mui.ajax(url,{
					data:{
						'action':'getsjdh',
						'ljbm':'CGRKD'
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
				document.getElementById('header2').style.display = 'none';
				var height = window.innerHeight + 'px';//获取页面实际高度  
	    		var width = window.innerWidth + 'px';  
	    		document.getElementById("bcid").style.height= height;
	    		document.getElementById("bcid").style.width= width;
	    		document.getElementById('cgsmtm').focus();
				document.getElementById('title').innerHTML = '扫描明细';
				document.getElementById('search_mx').style.display = 'block';
				
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
					data = JSON.parse(data)
					if (data.length == 0) {
						alert('未找到该条码号');
						document.getElementById('cgsmtm').value = "";
						document.getElementById('cgsmtm').focus();
					} else{
						var dj = parseFloat(data[0].TMBASE_DJ);
						var sl = parseFloat(data[0].TMBASE_ZSL);
						var je = parseFloat(data[0].TMBASE_JE);
						dj = dj.toFixed(parseInt(plus.storage.getItem('KC_DJDECN')));
						sl = sl.toFixed(parseInt(plus.storage.getItem('KC_SLDECN')));
						je = je.toFixed(parseInt(plus.storage.getItem('KC_JEDECN')));
						
						plus.storage.setItem('jldwbh',data[0].LSWLZD_JLDW)
						
						console.log(data[0].LSWLZD_JLDW);
						console.log(data[0].JSJLDW_DWMC);
						
						document.getElementById('cgtm').value = tmh;
						document.getElementById('wlbh').value = data[0].TMBASE_WLBH;
						document.getElementById('wlmc').value = data[0].Lswlzd_wlmc;
						document.getElementById('ggxh').value = data[0].Lswlzd_ggxh;
						document.getElementById('pch').value = data[0].TMBASE_PCH;
						document.getElementById('hw').value = data[0].TMBASE_HW;
						document.getElementById('sl').value = sl;//应该不是这样的
						document.getElementById('dj').value = dj;
						document.getElementById('jldw').value = data[0].JSJLDW_DWMC;
						document.getElementById('je').value = je;
						document.getElementById('xm').value = data[0].TMBASE_XH;
						plus.storage.setItem('sfdj',data[0].LSWLZD_SFDJ);
						plus.storage.setItem('ckfs',data[0].LSWLZD_CKFS);
						
						if (data[0].LSWLZD_SFDJ == '1') {
							//数量不允许输入,只能通过扫描获取
							document.getElementById('sl').disabled = true;
						} else{
							document.getElementById('sl').readOnly = false;
							
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
			var djrq = document.getElementById("ywdate").value;
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
					data1 = JSON.parse(data);
					if (data1.length == 0) {
						alert('没有帮助数据');
					} else{
						pcselect(data);	
					}
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
				str += '<li class="mui-table-view-cell"  id="'+data[i].PCH+'">'+
		                   data[i].PCH+
		            '</li>'
			}
			document.getElementById('pchlist').innerHTML += str; 
			mui('#popover4').popover('toggle',document.getElementById("pch"));
			mui('.mui-scroll-wrapper').scroll();
		};
		//点击列表选择
		var ul_city = document.getElementById('pchlist');
		ul_city.addEventListener("tap", function(e) {
			var tagClass = e.target.getAttribute("class");
			if (tagClass && tagClass.indexOf("mui-table-view-cell") != -1) {
				var select = e.target.innerText;
				document.getElementById("pch").value = select;
				plus.storage.setItem('pch_bh', e.target.id);
				mui('#popover4').popover('toggle',document.getElementById("pch"));
			}
		});
		document.getElementById('sl').addEventListener('input',function(){
			sumJe();
		});
		document.getElementById('dj').addEventListener('input',function(){
			sumJe();
		});
		//计算金额
		function sumJe(){
			//单价、数量、金额计算
			var dj = document.getElementById('dj').value;
			var sl = document.getElementById('sl').value;
			var je = 0;
			if (dj == '') {
				dj = 0;
			};
			if (sl == '') {
				sl = 0;
			}
			je = parseFloat(dj) * parseFloat(sl);
			je = je.toFixed(parseInt(plus.storage.getItem('KC_JEDECN')));
			document.getElementById('je').value = String(je);
		};
		//回车参照
		var djbhEnter = document.getElementById('djbh');
		djbhEnter.addEventListener('keydown', function(e){
			if (e.keyCode == 13) {
				var djbh = document.getElementById('djbh').value;
				if (Djlx.trim() == "") {
					alert('请输入单据类型');
				} else if(djbh.trim() == ""){
					alert('请输入单据单据编号');
				} else{
					url = plus.storage.getItem("url") + '/Handler/QueryHandler.ashx'
					mui.ajax(url, {
						data:{
							'action':'queryczdj',
							'ljbm': Djlx,
							'djbh': djbh
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
								document.getElementById("tdmain").innerHTML = '';
								var tbody = document.getElementById("tdmain");
								for (var i =0; i<data.length; i++) {
									if (data[i].F_ckbh == undefined) {
										document.getElementById('showCkPicker').value = '';	
									} else{
										document.getElementById('showCkPicker').value = data[i].F_ckbh;
										plus.storage.setItem('ck_bh',data[i].F_ckbh);
									}
									plus.storage.setItem('cgry_setting',"");
									plus.storage.setItem('cgry_bh', data[i].F_zgbh);
									plus.storage.setItem('cgbm_setting',"");
									plus.storage.setItem('cgbm_bh',data[i].F_bmbh);
									//修改单据日期格式，用来正确显示
									var year = data[i].F_djrq.substr(0,4);
									var mouth =  data[i].F_djrq.substr(4,2);
									var day =  data[i].F_djrq.substr(6,2);
									var f_djrq = year+'-'+mouth+'-'+day;
									
									document.getElementById("ywdate").value = f_djrq;
									document.getElementById("showdwPicker").value = data[i].F_dwbh +'：'+ data[i].F_dwmc;
									
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
		//主界面保存按钮
		var saveButton = document.getElementById('save');
		saveButton.addEventListener('tap', function(event){
			//保存前判断
			var a = document.getElementById("tdmain").innerHTML;
			var arr;
			if (a == '') {
				alert('列表信息没有数据!');
			} else{
				//判断红蓝单
				var bluLists = document.getElementById('bluLists');
				if (bluLists.checked == true) {
					arr = {
						'arrMain':[{
							"KCRKD1_PJLX":"G",
							"KCRKD1_LSBH":"",
							"KCRKD1_DJRQ": today,
							"KCRKD1_YWRQ": document.getElementById("ywdate").value,
							"KCRKD1_SJDH": document.getElementById("sjdh").value,
							"KCRKD1_CKBH": plus.storage.getItem('ck_bh'),
							"KCRKD1_DWBH": plus.storage.getItem('wldw_bh'),
							"KCRKD1_BMBH": plus.storage.getItem('cgbm_bh'),
							"KCRKD1_ZGBH": plus.storage.getItem('cgry_bh'),
							"KCRKD1_YWBS": Djlx,
							"KCRKD1_LYBH": document.getElementById("djbh").value,
							"KCRKD1_LRXM": plus.storage.getItem('l_ZGBH'),
							"KCRKD1_BZ":"",
							"KCRKD1_HDBZ":"0"
						}],
						'arrMx':arrMxdata,
						'arrTMMx':smdata
					};
				} else{
					arr = {
						'arrMain':[{
							"KCRKD1_PJLX":"G",
							"KCRKD1_LSBH":"",
							"KCRKD1_DJRQ": document.getElementById("ywdate").value,
							"KCRKD1_YWRQ": today,
							"KCRKD1_SJDH": document.getElementById("sjdh").value,
							"KCRKD1_CKBH": plus.storage.getItem('ck_bh'),
							"KCRKD1_DWBH": plus.storage.getItem('wldw_bh'),
							"KCRKD1_BMBH": plus.storage.getItem('cgbm_bh'),
							"KCRKD1_ZGBH": plus.storage.getItem('cgry_bh'),
							"KCRKD1_YWBS": Djlx,
							"KCRKD1_LYBH": document.getElementById("djbh").value,
							"KCRKD1_LRXM": plus.storage.getItem('l_ZGBH'),
							"KCRKD1_BZ":"",
							"KCRKD1_HDBZ":"1"
						}],
						'arrMx':arrMxdata,
						'arrTMMx':smdata
					};
				}
				var url1 = plus.storage.getItem("url") + '/Handler/KcrkdsaveHandler.ashx';
				arr = JSON.stringify(arr);
				console.log(arr);
				mui.ajax(url1,{
					data:{
						'data':arr
					},
					type:'POST',//HTTP请求类型
					timeout:10000,//超时时间设置为10秒；
					async:true,
					crossDomain:true,
					success:function(data){
						data1 = parseInt(data);
						if (data1 >= 1) {
							alert("保存成功");
							mui('.xs input').each(function () {
								this.value="";
							});
							document.getElementById("tdmain").innerHTML = '';
							smdata.splice(0,smdata.length);
							arrMxdata.splice(0,arrMxdata.length);
							document.getElementById("ywdate").value = today;
							Djlx = 'SGLR';
							document.getElementById('showDjlxPicker').value = '手工录入';
							document.getElementById('djbh').style.display = 'none';
							//列表信息
							plus.storage.setItem('list_arrMxdata',"");
							plus.storage.setItem('list_smdata',"");
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
			}
			
		});
		//主界面删除事件
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
					document.getElementById("ywdate").value = today;
					Djlx = 'SGLR';
					document.getElementById('showDjlxPicker').value = '手工录入';
					document.getElementById('djbh').style.display = 'none';
					//处理设置界面返回时列表信息丢失
					plus.storage.setItem('list_arrMxdata',"");
					plus.storage.setItem('list_smdata',"");
				}
			})	
		});
		
		//扫描界面保存
		var save_mxButton = document.getElementById("save_mx");
		save_mxButton.addEventListener('tap',savemx);
		function savemx(){
			var dj = parseFloat(document.getElementById("dj").value);
			var sl = parseFloat(document.getElementById("sl").value);
			var je = parseFloat(document.getElementById("je").value);
			dj = dj.toFixed(parseInt(plus.storage.getItem('KC_DJDECN')));
			sl = sl.toFixed(parseInt(plus.storage.getItem('KC_SLDECN')));
			je = je.toFixed(parseInt(plus.storage.getItem('KC_JEDECN')));
			
			var pch_bh = document.getElementById("pch").value;
			var hwbh = document.getElementById("hw").value;
			var jldwbh;
			if (plus.storage.getItem('jldwbh') == null) {
				jldwbh = '';
			} else{
				jldwbh = plus.storage.getItem('jldwbh');
			}

			var obj = {
				"F_smtm" : document.getElementById("cgsmtm").value,
				"F_tmh" : document.getElementById("cgtm").value,
				"F_wlbh" : document.getElementById("wlbh").value,
				"F_wlmc" : document.getElementById("wlmc").value,
				"F_ggxh" : document.getElementById("ggxh").value,
				"F_jldw" : jldwbh,
				"F_pch" : pch_bh,
				"F_hwbh" : hwbh,
				"F_sl" : sl,
				"F_smsl" : sl,
				"F_dj": dj,
				"F_je": je,
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
			if (document.getElementById("wlbh").value == '') {
				alert('空数据,不允许保存');
			} else{
				var sfdjcheck = plus.storage.getItem('sfdj');
				var ckfscheck = plus.storage.getItem('ckfs');
				var newCheck = true;
				var czCheck = true;
				//判断是参照还是新增
				if (canz == 1) {
					for (var i=0; i<smdata.length;i++) {
						if (document.getElementById("wlbh").value == smdata[i].F_wlbh && smdata[i].F_ggxh == document.getElementById('ggxh').value && smdata[i].F_pch == document.getElementById('pch').value) {
							smdata[i].F_smsl = sl;
							arrMxdata[i].F_smsl = sl;
							smdata[i]['F_pch'] = document.getElementById("pch").value;
							smdata[i]['F_hwbh'] = document.getElementById("hw").value;
							smdata[i]['F_tmh'] = document.getElementById("cgtm").value;
							arrMxdata[i]['F_pch'] = document.getElementById("pch").value;
							arrMxdata[i]['F_hwbh'] = document.getElementById("hw").value;
							arrMxdata[i]['F_tmh'] = document.getElementById("cgtm").value;
							newCheck = false;
							czCheck = false;
							break;
						} 
					}
					if (newCheck) {
						alert('参照分录中不存在该扫描物料,请确认!');
						czCheck = false;
						newCheck = false;
					}
				} else{
					for (var i=0; i<smdata.length;i++) {
						//需要区分单件还是非单件，
						if (document.getElementById("wlbh").value == smdata[i].F_wlbh && smdata[i].F_pch == document.getElementById('pch').value && smdata[i].F_ggxh == document.getElementById('ggxh').value && document.getElementById("cgtm").value ==  smdata[i].F_tmh && sfdjcheck == '1'  ) {
							smdata[i].F_sl = parseFloat(smdata[i].F_sl) + parseFloat(document.getElementById("sl").value);
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
				//列表信息处理
				plus.storage.setItem('list_arrMxdata',JSON.stringify(arrMxdata));
				plus.storage.setItem('list_smdata',JSON.stringify(smdata));
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
							document.getElementById('title').innerHTML = '采购入库单';
							document.getElementById('search_mx').style.display = 'none';
							document.getElementById('header1').style.display = 'block';
							document.getElementById('header2').style.display = 'block';
						}
					})
				} else{
					document.getElementById('form').style.display = 'block';
					document.getElementById('title').innerHTML = '采购入库单';
					document.getElementById('search_mx').style.display = 'none';
					document.getElementById('header1').style.display = 'block';
					document.getElementById('header2').style.display = 'block';
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
			
			var slCell = document.createElement('td');
			slCell.innerHTML = data.F_sl;
			row.appendChild(slCell);
			
			var slCell = document.createElement('td');
			slCell.innerHTML = data.F_smsl;
			row.appendChild(slCell);
			
			var pchCell = document.createElement('td');
			if (data.F_pch == undefined) {
				pchCell.innerHTML = '';
			} else{
				pchCell.innerHTML = data.F_pch;
			}
			row.appendChild(pchCell);
			
			var hwCell = document.createElement('td');
			if (data.F_hwbh == undefined) {
				hwCell.innerHTML = '';
			} else{
				hwCell.innerHTML = data.F_hwbh;
			}
			row.appendChild(hwCell);
						            			
			var djCell = document.createElement('td');
			djCell.innerHTML = data.F_dj;
			row.appendChild(djCell);
			
			var jeCell = document.createElement('td');
			jeCell.innerHTML = data.F_je;
			row.appendChild(jeCell);
			
			return row;
		};
		//往来单位
		var wldwdata = [];
		var wldw_pop = "";
		document.getElementById('showdwPicker').addEventListener('tap', function(){
			document.getElementById('s_pop').value = "";
			var wldw = plus.storage.getItem('wldw');
			wldw = JSON.parse(wldw);
			wldwdata = wldw;
			ListCreatWldw(wldw);
		});
		//往来单位过滤
		document.getElementById('s_pop').addEventListener('input',function(){
			var filter = document.getElementById('s_pop').value;
			var filter_data = [];
			if (filter == "") {
				wldw_pop = 'true';
				ListCreatWldw(wldwdata);
			} else{
				for (var i=0;i<wldwdata.length;i++) {
					if (wldwdata[i].DWBH.indexOf(filter) > -1 || wldwdata[i].DWMC.indexOf(filter) > -1) {
						filter_data.push(wldwdata[i]);
					}
				}
				wldw_pop = 'true';
				ListCreatWldw(filter_data);
			}
		});
		function ListCreatWldw(data){
			var str='' ;
			document.getElementById('infolist').innerHTML = '';
			for (var i=0;i<data.length;i++) {
				str += '<li class="mui-table-view-cell"  id="'+data[i].DWBH+'">'+
	                   data[i].DWBH +'：'+ data[i].DWMC+
	            '</li>'
			}
			document.getElementById('infolist').innerHTML += str; 
			if (wldw_pop == '') {
				mui('#popover').popover('toggle',document.getElementById("showdwPicker"));
			}
			wldw_pop = '';
			mui('.mui-scroll-wrapper').scroll()
		}
		//点击列表选择
		var ul_city = document.getElementById('infolist');
		ul_city.addEventListener("tap", function(e) {
			var tagClass = e.target.getAttribute("class");
			if (tagClass && tagClass.indexOf("mui-table-view-cell") != -1) {
				var select = e.target.innerText;
				document.getElementById("showdwPicker").value = select;
				plus.storage.setItem('wldw_bh', e.target.id);
				mui('#popover').popover('toggle',document.getElementById("showdwPicker"));
			}
		});
			
			
		//仓库
		var ck_data = [];
		var ck_pop = "";
		document.getElementById('showCkPicker').addEventListener('tap', function(){
			document.getElementById('s_pop1').value = "";
			var ckdata = plus.storage.getItem('ckdata');
			ckdata = JSON.parse(ckdata);
			ck_data = ckdata;
			ListCreatCk(ckdata);
		});
		//仓库过滤
		document.getElementById('s_pop1').addEventListener('input',function(){
			var filter = document.getElementById('s_pop1').value;
			var filter_data = [];
			if (filter == "") {
				ck_pop = 'true';
				ListCreatCk(ck_data);
			} else{
				for (var i=0;i<ck_data.length;i++) {
					if (ck_data[i].CKBH.indexOf(filter) > -1 || ck_data[i].CKMC.indexOf(filter) > -1) {
						filter_data.push(ck_data[i]);
					}
				}
				ck_pop = 'true';
				ListCreatCk(filter_data);
			}
		});
		function ListCreatCk(data){
			var str='' ;
			document.getElementById('cklist').innerHTML = '';
			for (var i=0;i<data.length;i++) {
				str += '<li class="mui-table-view-cell"  id="'+data[i].CKBH+'">'+
	                   data[i].CKBH +'：'+ data[i].CKMC+
	            '</li>'
			}
			document.getElementById('cklist').innerHTML += str; 
			if (ck_pop == '') {
				mui('#popover1').popover('toggle',document.getElementById("showCkPicker"));
			}
			ck_pop = '';
			mui('.mui-scroll-wrapper').scroll()
		}
		//点击列表选择
		var ul_city = document.getElementById('cklist');
		ul_city.addEventListener("tap", function(e) {
			var tagClass = e.target.getAttribute("class");
			if (tagClass && tagClass.indexOf("mui-table-view-cell") != -1) {
				var select = e.target.innerText;
				document.getElementById("showCkPicker").value = select;
				plus.storage.setItem('ck_bh', e.target.id);
				mui('#popover1').popover('toggle',document.getElementById("showCkPicker"));
			}
		});
		//获取货位
		document.getElementById('hw').addEventListener('tap',function(){
		url = plus.storage.getItem('url') + '/Handler/QueryHandler.ashx';
		mui.ajax(url,{
			data:{
				'action' :'queryhw',
				'ckbh' : plus.storage.getItem('ck_bh')
			},
			type:'post',//HTTP请求类型
			timeout:10000,//超时时间设置为10秒；
			success:function(data){
				data1 = JSON.parse(data);
				if (data1.length == 0) {
					alert('没有帮助数据');
				} else{
					ListCreatHw(data);	
				}
			},
			error:function(xhr,type,errorThrown){
				mui.alert(errorThrown,type);
			}
		});
	});
	function ListCreatHw(data){
		data = JSON.parse(data);
		var str='' ;
		document.getElementById('hwlist').innerHTML = '';
		for (var i=0;i<data.length;i++) {
			str += '<li class="mui-table-view-cell" id="'+data[i].F_HWBH+'">'+
               data[i].F_HWBH +'：'+ data[i].F_HWMC+
        	'</li>'
		}
		document.getElementById('hwlist').innerHTML += str; 
		mui('#popover_hw').popover('toggle',document.getElementById("hw"));
		mui('.mui-scroll-wrapper').scroll()
	};
	//点击列表选择
	var ul_city = document.getElementById('hwlist');
	ul_city.addEventListener("tap", function(e) {
		var tagClass = e.target.getAttribute("class");
		if (tagClass && tagClass.indexOf("mui-table-view-cell") != -1) {
			var select = e.target.innerText;
			
			document.getElementById("hw").value = e.target.id;
			plus.storage.setItem('hw_bh',e.target.id);
			mui('#popover_hw').popover('toggle',document.getElementById("hw"));
		}
	});
});