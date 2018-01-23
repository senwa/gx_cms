/**
 * tips
 * datagridTip
 * www.isunland.com
 */
(function($){
	//datagrid列显示 tip
	var newOptions;
	$.fn.datagridTip = function(option,param){
		if (typeof option == 'string'){
			var method = $.fn.datagridTip.methods[option];
			if (method){
				return method(this, param);
			} else {
				return this;
			}
		}
		//fieldArray:[]//要显示的field列
	    newOptions = $.extend(true,{},$.fn.datagridTip.defaults,option);
		var target = $(this);

		ShowTip(target);
		return target;
	};
	
	$.fn.datagridTip.methods = {
		show:function(target){
			return ShowTip(target);
		},
		close:function(target){
			return CloseTip(target);
		}
	};
	
	$.fn.datagridTip.defaults={
			showOn:'hover',
			allowTipHover:true,
			className: 'tip-yellow',
			alignTo:'cursor',
			followCursor: true,
			slide:true,
			alignY: 'bottom',
			offsetX: 5,
			offsetY: 5,
			showTimeout:100,
			customContent:{type:'default',data:{},method:{}}//{type:text(设置为也可以展现html内容)/json/method,data:''/{}/method()}
			//liveEvents: true,//不要用，否则无法显示提示
	};
	//根据配置查找要显示的列
	function getTipColumns(target,colArray){
		var resArray = new Array();
		var dict;
		var temp;
		var temp1;
		for(var i=0;i<colArray.length;i++){
				/*target.siblings("div.datagrid-view2").find("td[field='"+colArray[i]+"']").each(function(index,elm){
				});*/
			//alert(target.siblings("div.datagrid-view2").children(".datagrid-body").find("td[field='"+colArray[i]+"']").text());
			temp = target.siblings("div.datagrid-view2").children(".datagrid-body").find("td[field='"+colArray[i]+"']").find("div");
			temp1 = target.siblings("div.datagrid-view1").children(".datagrid-body").find("td[field='"+colArray[i]+"']").find("div");
			if((!temp||temp.length<=0)&&(!temp1||temp1.length<=0)){
				return resArray;
			}
			if(temp.length>0){
				for(var j=0;j<temp.length;j++){
					dict=new Object();
					dict.key = $(temp[j]).parents("tr.datagrid-row").attr("id");
					dict.domElement = $(temp[j]);
					dict.value = $(temp[j]).html();
					resArray.push(dict);//查找出所有要显示的列对应的jquery对象
				}
			}
			if(temp1.length>0){
				for(var j=0;j<temp1.length;j++){
					dict=new Object();
					dict.key = $(temp1[j]).parents("tr.datagrid-row").attr("id");
					dict.domElement = $(temp1[j]);
					dict.value = $(temp1[j]).html();
					resArray.push(dict);//查找出所有要显示的列对应的jquery对象
				}
			}
			/*dict.key=target.siblings("div.datagrid-view2").children(".datagrid-body").find("td[field='"+colArray[i]+"']").find("div").parents("tr.datagrid-row").attr("id");
			dict.domElement=target.siblings("div.datagrid-view2").children(".datagrid-body").find("td[field='"+colArray[i]+"']").find("div");
			dict.value=target.siblings("div.datagrid-view2").children(".datagrid-body").find("td[field='"+colArray[i]+"']").find("div").text();*/
			
		  	
		  	/* var panel = target.datagrid('getPanel').panel('panel');  
			  var rows = $(panel).find(".datagrid-view2").find(".datagrid-row");//获取当前datagrid外层panel下的row
				resArray.push();*/
		}
		return resArray;
	}
	
	//开启当前table的tip显示
	function ShowTip(target){
		var $Array = getTipColumns(target,newOptions.fieldArray);
		var tempWidthStr;
		var td_width;//当前表格的宽度
		var str_width;
		var int_width;
		var lPadding;
		var rPadding;
		var str_font_size;
		var int_font_size;
		//循环每一个td对象，绑定poshytip事件
		$.each($Array,function(index,elm){
			tempWidthStr=elm.domElement.css('width');
			/*if(tempWidthStr){
				str_width = tempWidthStr.substring(0,tempWidthStr.indexOf("px"));
			}
			int_width =  parseInt(str_width);*/
			int_width = getPXNum(tempWidthStr);
			//加上左右padding距离
			lPadding = getPXNum(elm.domElement.css('padding-left'));
			rPadding = getPXNum(elm.domElement.css('padding-right'));
			int_width +=(lPadding+rPadding);
		
			if(!isNaN(int_width)&&elm.value){
				//if(int_width>elm.value.length){//如果td宽度大于当前字符长度，则按照字符长度乘以字符大小font-size显示提示
					str_font_size = elm.domElement.css('font-size');
					if(str_font_size){//如果存在font-size
						str_font_size = str_font_size.substring(0,str_font_size.indexOf("px"));
						int_font_size = parseInt(str_font_size);
						if(!isNaN(int_font_size)){
							if(int_width<(elm.value.length*int_font_size)){
								td_width = int_width+"px";
							}else{
								td_width = ((elm.value.length+1)*int_font_size) +"px";
							}
						}else{
							if(int_width<((elm.value.length+1)*12)){
								td_width = int_width+"px";
							}else{
								td_width = ((elm.value.length+1)*12) +"px";//默认按照12px字体大小
							}
						}
					}else{
						if(int_width<((elm.value.length+1)*12)){
							td_width = int_width+"px";
						}else{
							td_width = ((elm.value.length+1)*12) +"px";//默认按照12px字体大小
						}
					}
						
			/*	}else{
					td_width = int_width+"px";
				}*/
			}else{//如果int_width为非数字型，就默认150px
					td_width = '150px';		
			}
			
			//td_width = elm.domElement.css('width')?elm.domElement.css('width'):'200px';
			if(newOptions.customContent&&newOptions.customContent.type!='default'){//用户自定义显示内容
				newOptions.content=function(updateCallback) {
						//updateCallback('Tooltip content updated!');
						if(newOptions.customContent&&newOptions.customContent.type=='text'){//htmltext类型直接显示
							window.setTimeout(function() {
								updateCallback(newOptions.customContent.data);
							}, 1000);

							//updateCallback(newOptions.customContent.data);
							return newOptions.customContent.data;
						}else if(newOptions.customContent&&newOptions.customContent.type=='json'){
							var htmlStr='';
							//循环显示json数据中的键值对
							htmlStr+="<div style='padding:5px;word-wrap:break-word;height:auto;width:auto;'>"
							for(var key in newOptions.customContent.data){
								htmlStr+="<span style='color:#ff3211;'>"+key+"</span>:<span style='color:blue;'>"+newOptions.customContent.data[key]+"</span>,<br/>";
							}
							htmlStr = htmlStr.substr(0,htmlStr.length-6);//删除最后一个逗号
							htmlStr+="</div>"
							window.setTimeout(function() {
								updateCallback(htmlStr);
							}, 1000);
						//	updateCallback(htmlStr);
						}else if(newOptions.customContent&&newOptions.customContent.type=='method'){
							var currentIndex = elm.key.substring(elm.key.length-1);
						    newOptions.customContent.method(this,elm,currentIndex,updateCallback);//回调函数返回给调用者当前出现tip的行所在的index
						}
						
						return '正在加载...';
				}	
			}else{//用户未自定义则默认显示单元格内容
				newOptions.content="<div style='word-wrap:break-word;height:auto; width:"+td_width+"'>"+elm.value+"</div>";
			}
			
			if(newOptions.lengthLimit){//如果设置长度判断，只有当前单元格内容大于指定长度时才显示提示
				if(newOptions.lengthLimit<elm.value.length){
					elm.domElement.poshytip(newOptions);
				}
			}else{
				elm.domElement.poshytip(newOptions);
			}
			
		});
	}
	//关闭当前table的tip
	function CloseTip(target){
		var $Array = getTipColumns(target,newOptions.fieldArray);
		//循环每一个td对象，绑定poshytip事件
		$.each($Array,function(index,elm){
			elm.domElement.poshytip('disable');
		});
	}
	
	
	
	//根据传入的12px字符串返回对应数字12
	function getPXNum(numPx){
		if(numPx&&numPx.indexOf("px")!=-1){
			var str_num = numPx.substring(0,numPx.indexOf("px"));
			return parseInt(str_num);
		}else{
			return 0;
		}
	}
	 
})(jQuery);