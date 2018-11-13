mui.init({});
mui.plusReady(function () {
    //获取物料类别
    var url = plus.storage.getItem('url') + '/Handler/QueryHandler.ashx';
    var czybh = plus.storage.getItem('l_CZYBH');
    var createdata;
    var tree = [];
    var mask=mui.createMask();//遮罩层
    mui.ajax(url,{
    	data:{
    		'action':'querylball',
    		'czybh':czybh
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
    		if (JSON.parse(data).length == 0 ) {
    			alert('未查询到相关数据')
    		} else{
    			createdata = data;
    			createdata = JSON.parse(createdata);
    		}
    		createTree(createdata);
    	},
    	error:function(xhr,type,errorThrown){
    		mui.alert(errorThrown,type);
    	}
    });

	function createTree(data){
		var childrendata = [];
		tree.splice(0,tree.length);
		for (var i=0;i<data.length;i++) {
			var str;
			if (data[i].parent == '#') {
				str = {
					name: data[i].wlmc,
					id: data[i].wllb
				}
				tree.push(str);
			}
		}
		for (var i=0;i<tree.length;i++) {
			tree[i].id;
			var str = '';
			childrendata = [];
			for (var j=0;j<data.length;j++) {
				if (tree[i].id == data[j].parent) {
					str = {
						name: data[j].wlmc,
						id: data[j].wllb
					}
					childrendata.push(str);
				}
			}
			tree[i].children = childrendata;
		}
		
		//过滤数据为最底层时的处理
		if (tree.length == 0) {
			str = {
				name: data[0].wlmc,
				id: data[0].wllb
			}
			tree.push(str);
		}
		console.log(JSON.stringify(tree));
	}
	//过滤实现
	document.getElementById('search').addEventListener('input',function(){
		var filter = document.getElementById('search').value;
		var m_data = [];
		console.log(JSON.stringify(createdata));
		if (filter == "") {
			location.reload();
		} else{
			for (var i=0;i<createdata.length;i++) {
				if (createdata[i].wllb.indexOf(filter)>-1 || createdata[i].wlmc.indexOf(filter)>-1) {
					m_data.push(createdata[i]);
				}
			}
			createTree(m_data);
			document.getElementById('lblist').innerHTML = "";
			layui.tree({
			    elem: '#lblist' //指定元素
			    ,target: '_blank' //是否新选项卡打开（比如节点返回href才有效
			    ,click: function(item){ //点击节点回调
			      if (item.children == undefined || item.children == '') {
			      	mui.openWindow({
						url:'kccxmx.html',
						id:'id',
						extras:{
							'name':item.name,
							'wllb':item.id
						}
					});
			      }
			    }
			    ,nodes: tree
			});
		}
	});
	//layui的tree实现
	layui.use(['tree', 'layer'],function(){
		var layer = layui.layer
		,$ = layui.jquery;
		 layui.tree({
		    elem: '#lblist' //指定元素
		    ,target: '_blank' //是否新选项卡打开（比如节点返回href才有效
		    ,click: function(item){ //点击节点回调
		      if (item.children == undefined || item.children == '') {
		      	mui.openWindow({
					url:'kccxmx.html',
					id:'id',
					extras:{
						'name':item.name,
						'wllb':item.id
					}
				});
		      }
		    }
		    ,nodes: tree
		  });
	});
});