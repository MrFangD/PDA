mui.init({});
mui.plusReady(function () {
    var self = plus.webview.currentWebview();
	var name = self.name;
	var wllb = self.wllb;
	
	var kjnd = plus.storage.getItem('KC_KJND');
	var kjqj = '';
	var filterdata = [];
	document.getElementById('title').innerHTML = name;
	var url = plus.storage.getItem('url') + '/Handler/QueryHandler.ashx';
	mui.ajax(url,{
		data:{
			'action': "queryckye",
			'wllb': wllb,
			'kjnd': '2002',
			'kjqj': '10'
		},
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:function(data){
			if (JSON.parse(data).length == 0) {
				alert('未查询到相关数据')
			} else{
				filterdata = data;
				returndata(data);
			}
		},
		error:function(xhr,type,errorThrown){
			mui.alert(errorThrown,type);
		}
	});
	//形成表格
	function returndata(data){
		document.getElementById("tdmain").innerHTML = '';
		var tbody = document.getElementById("tdmain");
		data = JSON.parse(data);
		for (var i =0; i< data.length; i++) {
			var trow = getdatarow(data[i],i);
			tbody.appendChild(trow);
		}
	};
	function getdatarow(data,i){
		var row = document.createElement('tr'); //创建行
		
		var idCell = document.createElement('td'); //创建列
		idCell.innerHTML = data.WLBH; //填充数据
		row.appendChild(idCell); //加入行  ，下面类似
		
		var nameCell = document.createElement('td');
		nameCell.innerHTML = data.WLMC;
		row.appendChild(nameCell);
		
		var ckmcCell = document.createElement('td');
		ckmcCell.innerHTML = data.CKMC;
		row.appendChild(ckmcCell);
		
		var slyeCell = document.createElement('td');
		slyeCell.innerHTML = data.SLYE;
		row.appendChild(slyeCell);
		
		var ggxhCell = document.createElement('td');
		ggxhCell.innerHTML = data.GGXH;
		row.appendChild(ggxhCell);

		return row;
	};
	
	//过滤实现
	document.getElementById('search').addEventListener('input',function(){
		var filter = document.getElementById('search').value;
		var s_data  = JSON.parse(filterdata);
		var m_data = [];
		if (filter == "") {
			returndata(filterdata);
		} else{
			for (var i=0;i<s_data.length;i++) {
				if (s_data[i].WLBH.indexOf(filter)>-1 || s_data[i].WLMC.indexOf(filter)>-1) {
					m_data.push(s_data[i]);
				}
			}
			m_data = JSON.stringify(m_data);
			returndata(m_data);
		}
	});
})