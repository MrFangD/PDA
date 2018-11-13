
mui.init();

mui.plusReady(function () {
	var page = true;
	var edit = "";
	var str_id = "";
	var ztxx = new Array();
	ztxxlist();
	if (ztxx.length == 0) {
		plus.storage.setItem('ztid','')
	}
	
	if (plus.storage.getItem('ztid') == '') {
	} else{
		str_id = plus.storage.getItem('ztid');
		var str_id1 = 'div'+str_id;
		document.getElementById(str_id).classList.add("active");
		document.getElementById(str_id1).classList.add("divactive");
		document.getElementById(str_id1).style.backgroundColor = '#0062CC'
	}
	
	mui('header').on('tap','#addzt',function(){
    	document.getElementById('ztlist').style.display = "none";
    	document.getElementById('ztmx').style.display = "block";
    	document.getElementById('ysztbtn').style.display = "none";
    	document.getElementById('addzt').style.display= 'none';
    	page = false;
    });
    mui('header').on('tap','#return',function(){
    	if (page) {
    		document.location.href = 'login.html';
    	} else{
    		document.getElementById('ztlist').style.display = "block";
	    	document.getElementById('ztmx').style.display = "none";
	    	document.getElementById('ysztbtn').style.display = "block";
	    	document.getElementById('addzt').style.display= 'block';
	    	edit = '';
	    	document.getElementById('databasename').value ="";
    		document.getElementById('ipaddress').value = "";
	    	page = true;
    	}
    });
    document.getElementById('confirm').addEventListener('tap',function(){
    	var databasename = document.getElementById('databasename').value;
    	var ipaddress = document.getElementById('ipaddress').value;
    	//储存到本地缓存
		if (databasename.trim()== "") {
			alert('账套名称不允许为空' );
		} else if(ipaddress.trim()== "") {
			alert('服务器地址不允许为空' );
		}else {
			if (edit == "") {
				var data = {};
				data = {
					'databasename':databasename,
					'ipaddress': ipaddress
				}
				ztxx.push(data);
			} else{
				ztxx[edit].databasename = databasename;
				ztxx[edit].ipaddress = ipaddress;
				edit = '';
			}
			
			plus.storage.setItem('ztxx',JSON.stringify(ztxx));
			
			ztxxlist();
			document.getElementById('ztlist').style.display = "block";
	    	document.getElementById('ztmx').style.display = "none";
	    	document.getElementById('ysztbtn').style.display = "block";
	    	document.getElementById('addzt').style.display= 'block';
	    	document.getElementById('databasename').value ="";
    		document.getElementById('ipaddress').value = "";
	    	page = true;
		}
    });
    function ztxxlist(){
    	if (plus.storage.getItem('ztxx') == null) {
    		
    	} else{
    		ztxx = JSON.parse(plus.storage.getItem('ztxx'));
    	}
		
		if (ztxx.length == 0) {
		} else{
			var str ="";
			document.getElementById("OA_task_1").innerHTML = "";
			for (var i=0; i<ztxx.length;i++) {
				str += '<li class="mui-table-view-cell" id = "'+i+'">'+
							'<div class="mui-slider-right mui-disabled">'+
								'<a class="mui-btn mui-btn-blue " id="edit">编辑</a>'+
								'<a class="mui-btn mui-btn-red" id="delete">删除</a>'+
							'</div>'+
							'<div class="mui-slider-handle" id= "div'+i+'">'+
								ztxx[i].databasename+
							'</div>'+
						'</li>'
				document.getElementById("OA_task_1").innerHTML = str;
				}	
			}	
		};
		(function($) {
			//删除账套信息，并同时删除该条信息的本地缓存
			$('#OA_task_1').on('tap', '#delete', function(event) {
				var elem = this;
				var li = elem.parentNode.parentNode;
				
				var btnArray = ['确认', '取消'];
				mui.confirm('确认删除该条记录？', btnArray, function(e) {
					if (e.index == 0) {
						li.parentNode.removeChild(li);
						//删除该条的本地缓存
						ztxx.splice(li.id,1);
						plus.storage.setItem('ztxx',JSON.stringify(ztxx));
						
						plus.storage.setItem('zddlActive', 'false');
						plus.storage.setItem('ztid',"");
						plus.storage.setItem('url',"");
						ztxxlist()
					} else {
						setTimeout(function() {
							$.swipeoutClose(li);
						}, 0);
					}
				});
			});
			//编辑账套信息
			$('#OA_task_1').on('tap','#edit',function(event){
				var elem = this;
				var li = elem.parentNode.parentNode;
				ztxx = JSON.parse(plus.storage.getItem('ztxx'));
		    	document.getElementById('databasename').value = ztxx[li.id].databasename;
				document.getElementById('ipaddress').value = ztxx[li.id].ipaddress;
				document.getElementById('ztlist').style.display = "none";
		    	document.getElementById('ztmx').style.display = "block";
		    	document.getElementById('ysztbtn').style.display = "none";
		    	document.getElementById('addzt').style.display= 'none';
		    	page = false;
		    	edit = li.id;
			});
			//选择账套,选中背景色变化
			$('#OA_task_1').on('tap','.mui-table-view-cell',function(event){
				//背景色
				var str ;
				if (plus.storage.getItem('ztid') == '') {
					str = this.id;
				} else{
					str = plus.storage.getItem('ztid');
				}
				var divid_old = 'div'+str;
				var divid_new = 'div'+this.id;
				document.getElementById(str).classList.remove("active");
				document.getElementById(divid_old).classList.remove("divactive");
				document.getElementById(divid_old).style.backgroundColor = '#FFFFFF'
				
				
				
				document.getElementById(this.id).classList.add("active");
				document.getElementById(divid_new).classList.add("divactive");
				document.getElementById(divid_new).style.backgroundColor = '#0062CC'
				//服务器地址存储，同时记录选中id用来下次展示
				plus.storage.setItem('ztid',this.id);
				var url = 'http://'+ztxx[this.id].ipaddress;
				plus.storage.setItem('url',url);
			});
		})(mui);
});
//演示账套登录
var testButton = document.getElementById('yszt');
testButton.addEventListener('tap', function(e){
	
//	plus.storage.setItem("url",'http://115.28.63.151:8066');
	plus.storage.setItem("url",'http://115.28.63.151:666');
	url = 'http://115.28.63.151:666/Handler/Handler.ashx';
	mui.ajax(url,{
		data:{
			'kind':'checkLogin',
			'phone':'18654561293',//18654561293
			'pwd':'cwpass12!',
		},
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:function(data){
			var d = eval("("+data+")");
			if (d.status == '1') {
				plus.storage.setItem('l_ZGBH',d.ZGBH);
				plus.storage.setItem('l_CZYBH',d.CZYBH);
				mui.openWindow({
					url: '../home/home.html',
					id: 'info'
				});
			} else{
				alert(d.error);
			}
		},
		error:function(xhr,type,errorThrown){
			mui.alert(errorThrown,type);
		}
	});
});