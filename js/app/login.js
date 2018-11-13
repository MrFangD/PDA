mui.init();
mui.plusReady(function(){
	
	var username = plus.storage.getItem('username');
	var password = plus.storage.getItem('password');
	
	if (username == null) {
	} else{
		document.getElementById('username').value = username;
		document.getElementById('password').value = password;
	}
	var zddlActive = plus.storage.getItem('zddlActive');
	if (zddlActive == 'true') {
		document.getElementById('zddl').checked = true;
		var btn = document.getElementById('confirm');
		mui.trigger(btn,'tap');	
	}
});
	//登录
	var confirmButton = document.getElementById('confirm');
	confirmButton.addEventListener('tap', function(e){
		var check = true;
		var username = document.getElementById('username').value;
		var password = document.getElementById('password').value;
		mui('.mui-input-group input').each(function (index,element) {
			if (this.value.trim() == "") {
				var label = this.previousElementSibling;
				alert(label.innerText + '不允许为空' );
				check = false;
				return false;
			}
		});
		//判断是否已经选择账套
		if (check == true) {
			var database = plus.storage.getItem('url');
			console.log(database)
			if (database == null || database == "") {
				alert('请先选择账套信息！');
				console.log('123')
				check = false;
			}
		}
		//判断是否记住密码
		var pwdActive = document.getElementById("pwd").checked;
		if (pwdActive) {
			//打开状态时将用户名、密码保存到本地缓存中
			console.log('记住密码')
			plus.storage.setItem('username', username);
			plus.storage.setItem('password', password);
		} else{
			console.log("不保存密码");
		}
		//判断是否自动登录
		var zddlActive = document.getElementById("zddl").checked;
		if (zddlActive) {
			//打开状态时将用户名、密码保存到本地缓存中，同时保存自动登录状态
			console.log("自动登录");
			plus.storage.setItem('username', username);
			plus.storage.setItem('password', password);
			plus.storage.setItem('zddlActive', 'true');
		} else{
			plus.storage.setItem('zddlActive', 'false');
			console.log("不自动登录");
		}
		if (check) {
			url = plus.storage.getItem("url") + '/Handler/Handler.ashx';
			console.log(url);
			console.log(username);
			console.log(password);
			mui.ajax(url,{
				data:{
					'kind':'checkLogin',
					'phone':username,
					'pwd':password,
				},
				type:'post',//HTTP请求类型
				timeout:100000,//超时时间设置为10秒；
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
		} else{
		}
	});
	//取消
//	var cancelButton = document.getElementById('cancel');
//	cancelButton.addEventListener('tap', function(e){
//		var btnArray = ["确定","取消"];
//		mui.confirm('确认关闭吗？','',btnArray,function(e){
//			if (e.index == 0) {
//				mui.currentWebview.close();
//			}
//		});
//	});
	