﻿
/**
 * The ISunland Custom Patch for jQuery EasyUI 1.4
 */
 
 


/**
 * 相同的列合并 使用方法：$('#grid).datagrid("autoMergeCells", ['field1', 'field2','field3',……]);
   
    后面的数组 即 你想要合并的显示的  列   如果你只有一个列需要合并   那么数组中指定一个列的field
 */
$.extend($.fn.datagrid.methods, {
    autoMergeCells: function (jq, fields) {
        return jq.each(function () {
            var target = $(this);
            if (!fields) {
                fields = target.datagrid("getColumnFields");
            }
            var rows = target.datagrid("getRows");
            var i = 0,j = 0,temp = {};
            for (i; i < rows.length; i++) {
                var row = rows[i];
                j = 0;
                for (j; j < fields.length; j++) {
                    var field = fields[j];
                    var tf = temp[field];
                    if (!tf) {
                        tf = temp[field] = {};
                        tf[row[field]] = [i];
                    } else {
                        var tfv = tf[row[field]];
                        if (tfv) {
                            tfv.push(i);
                        } else {
                            tfv = tf[row[field]] = [i];
                        }
                    }
                }
            }
            $.each(temp, function (field, colunm) {
                $.each(colunm, function () {
                    var group = this;
                    if (group.length > 1) {
                        var before,after,megerIndex = group[0];
                        for (var i = 0; i < group.length; i++) {
                            before = group[i];
                            after = group[i + 1];
                            if (after && (after - before) == 1) {
                                continue;
                            }
                            var rowspan = before - megerIndex + 1;
                            if (rowspan > 1) {
                                target.datagrid('mergeCells', {
                                    index: megerIndex,
                                    field: field,
                                    rowspan: rowspan
                                });
                            }
                            if (after && (after - before) != 1) {
                                megerIndex = after;
                            }
                        }
                    }
                });
            });
        });
    }
}); 

/**
 * 扩展自定义服务器验证规则 param 第一个参数为url 第二个参数为后台接收的参数名称 第三个参数为验证提示
 */
$.extend($.fn.validatebox.defaults.rules, {
	custom_remote: {
	 validator: function(value, param) {
		 var postdata = {};
		 postdata[param[1]] = value;
		 var m_result =$.ajax({ type: "POST",//http请求方式
			 url: param[0],    //服务器段url地址
			 data:postdata,      //发送给服务器段的数据
			 dataType: "text", //告诉JQuery返回的数据格式
			 async: false
		 }).responseText;
		 if (m_result == "true") {
			 $.fn.validatebox.defaults.rules.custom_remote.message = param[2];
			 return false;
		 }
		 else {
			 return true;
		 }
	},
	 message: ''
	}
});
/**
 * 扩展验证表格中列字段的唯一性 param 第一个参数为表格id 第二个参数为字段名 第三个参数为验证提示
 */
$.extend($.fn.validatebox.defaults.rules, {
	client_repeat: {
		validator: function(value, param) {
		 var res=false;
		 var gridId="#"+param[0];
		 var dg=$(gridId);
		 var colName=param[1];
		 var rows=dg.datagrid('getRows');
		 //有主子表的情况下，rowEditIndex会根据当前操作Gird的编辑行而改变，使用该方法验证唯一性会有问题。
		 //只有一个表的情况下，可用该方法。
		 var rowEditIndex=dg.datagridPlugin('getEditIndex'); 
		 //获取新增 更新以及删除的项
		 //var rowIns=$(gridId).datagrid('getChanges','inserted');
		 //var rowUp=$(gridId).datagrid('getChanges','updated');
		 //var rowDel=$(gridId).datagrid('getChanges','deleted');
		 if(rows&&rows.length>0){
			//验证数组中是否包含指定项的值
			for(var i=0;i<rows.length;i++){
				var row=rows[i];
				var col=row[colName];
				if(col==value&&i!=rowEditIndex){
					res=true;
					break;
				}
			}
		 }
		 if (res) {
			 $.fn.validatebox.defaults.rules.client_repeat.message = param[2];
			 return false;
		 }
		 else {
			 return true;
		 }
		},
		message: ''
	}
});

$.extend($.fn.validatebox.defaults.rules, {
	check_orgcode: {
	 validator: function(value, param) {
		var oldValue=$(param[0]).attr('oldValue');
		if(oldValue){
			
			if(oldValue==value){
				return true;
			}else if(value.length!=oldValue.length){
				return false;
			}else{
				var subMem=value.substring(0,6);
				var oldsubMem=oldValue.substring(0,6);
				if(oldsubMem!=subMem){
					return false;
				}else{
					return true;
				}
			}
		}else{
			return true;
		}
		
	},
	 message: '部门编码不符合规则！'
	}
});

//验证只能输入字幕和数字
$.extend($.fn.validatebox.defaults.rules, {
	check_letternum: {
	 validator: function(value, param) {
		 var reg=/^[0-9a-zA-Z]*$/g;
		 return reg.test(value);
	},
	 message: '只能输入字母和数字！'
	}
});

/**
 * 验证控件验证手机号码
 */
$.extend($.fn.validatebox.defaults.rules, {  
    mobile: {  
        validator: function(value, param){
        	var regex=/^((\+?86)|(\(\+86\)))?1\d{10}$/;
        	if(value&&value!=""){
        		return regex.test(value);
        	}
            return true; 
        },  
        message: '手机号码不符合规则！'  
    }  
}); 
/**
 * 验证控件验证电话号码 010-11111 或者 0376-111111
 */
$.extend($.fn.validatebox.defaults.rules, {  
    phone: {  
    	validator: function(value, param){
        	var regex=/^((\+?86)|(\(\+86\)))?\d{3,4}-\d{7,8}(-\d{3,4})?$/;
        	if(value&&value!=""){
        		return regex.test(value);
        	}
            return true; 
        },  
        message: '电话号码不符合规则！'   
    }  
}); 


/**
 * 验证控件验证电话号码 010-11111 或者 0376-111111  或者是手机
var regex1=/^((\+?86)|(\(\+86\)))?\d{3,4}-\d{7,8}(-\d{3,4})?$/;
var regex2=/^((\+?86)|(\(\+86\)))?1\d{10}$/;
if(value && value!=""){
	return (regex1.test(value) || regex2.test(value)) ;
}else{
	return false; 
}
 */
$.extend($.fn.validatebox.defaults.rules, {  
    contactPhone: {  
    	validator: function(value, param){
        	return true;	
        },  
        message: '手机或座机号码不符合规则！'   
    }  
}); 

/**
 * 验证控件验证邮编
 */
$.extend($.fn.validatebox.defaults.rules, {  
    postcode: {  
    	validator: function(value, param){
        	//var regex=/^[1-9][0-9]{5}$/;
			var regex=/^\d{6}$/;
        	if(value&&value!=""){
        		return regex.test(value);
        	}
            return true; 
        },  
        message: '邮编不符合规则！'    
    }  
});


/**
 * 验证控件验证三位固定数字
 */
$.extend($.fn.validatebox.defaults.rules, {  
    fixNum: {  
    	validator: function(value, param){
        	var regex=/^\d{3}$/;
        	if(value&&value!=""){
        		return regex.test(value);
        	}
            return true; 
        },  
        message: '只能输入三位数字！'   
    }  
}); 
/**
 * 扩展验证控件，验证两个文本框或其他两次输入是否一致 第一个参数为文本框的id用于获取值，第二个参数为提示信息---zsd
 */
$.extend($.fn.validatebox.defaults.rules, {  
    equals: {  
        validator: function(value,param){  
        	var msg=param[1];
        	var $target=$('#'+param[0]);
             if(value == $target.val()){
            	 return true;
             }else{
            	 if(msg){
            		 $.fn.validatebox.defaults.rules.equals.message =msg; 
            	 }
            	 return false;
             }
        },  
        message: '两次输入不一致！'  
    }  
});  

/**
 * 验证身份证
 */
$.extend($.fn.validatebox.defaults.rules, {  
    idCard: {  
        validator: function(value, param){
        	var regex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
        	if(value&&value!=""){
        		return regex.test(value);
        	}
            return true; 
        },  
        message: '身份证不符合规则！'  
    }  
}); 

/**
 * 邮箱地址
 */
$.extend($.fn.validatebox.defaults.rules, {  
    email: {  
        validator: function(value, param){
        	var regex = /^[a-z0-9A-Z]+([._\\-]*[a-z0-9A-Z])*@([a-z0-9A-Z]+[-a-z0-9A-Z]*[a-z0-9A-Z]+.){1,63}[a-z0-9A-Z]+$/;  
        	if(value&&value!=""){
        		return regex.test(value);
        	}
            return true; 
        },  
        message: '邮箱不符合规则！'  
    }  
}); 

/**
 * 验证正整数
 */
$.extend($.fn.validatebox.defaults.rules, {  
	positiveInteger: {  
    	validator: function(value, param){
			var regex=/(^\d+$)|(^\+?\d+$)/;
        	if(value && value!=""){
        		return (regex.test(value)) ;
        	}else{
				return false; 
			}
        },  
        message: '请输入正整数！'   
    }  
});
/**
 * 验证19位纯数字银行卡号
 */
$.extend($.fn.validatebox.defaults.rules, {  
	validateBank: {  
    	validator: function(value, param){
			var num = /^\d*$/; //全数字
		    if(!num.exec(value)) {
		      $.fn.validatebox.defaults.rules.validateBank.message ="银行卡号必须全为数字";
		      return false;
		    }
    		if(value.length != 19) {
		    	$.fn.validatebox.defaults.rules.validateBank.message ="银行卡号长度必须为19位！";
		        return false;
		    }else{
		    	return true;
		    }
        },  
        message: '请输入19位数字！'   
    }  
});

/**
 * 验证控件验证岗位名称中不能存在-
 */
$.extend($.fn.validatebox.defaults.rules, {  
    posname: {  
    	validator: function(value, param){
        	var regex=new RegExp(".*-.*");
        	if(value&&value!=""){
        		return !regex.test(value);
        	}
            return true; 
        },  
        message: '岗位名称中不能存在-'   
    }  
}); 
/**
 * 验证员工序列号
 */
$.extend($.fn.validatebox.defaults.rules, {  
	validateSerial: {  
    	validator: function(value, param){
			var num = /^\d*$/; //全数字
		    if(!num.exec(value)) {
		      $.fn.validatebox.defaults.rules.validateSerial.message ="员工序列号必须全为数字";
		      return false;
		    }
    		if(value.length > 18) {
		    	$.fn.validatebox.defaults.rules.validateSerial.message ="员工序列号最多18位！";
		        return false;
		    }else{
		    	return true;
		    }
        },  
        message: '请输入18位及以下数字！'   
    }  
});
/**
 * 验证非负数 zanshulai@126.com 
 */
$.extend($.fn.validatebox.defaults.rules, {  
	nonnegativeNumber: {  
    	validator: function(value, param){
			var regex=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
        	if(value && value!=""){
        		return (regex.test(value)) ;
        	}else{
				return false; 
			}
        },  
        message: '请输入不小于0的数！'   
    }  
});

/**
 * 验证数字是否大于某个值,需要读取某隐藏域中存储值  zanshulai@126.com 
 */
$.extend($.fn.numberbox.defaults.rules, {    
    gatherThan: {    
        validator: function(value,param){
			var hdId=param[0];
			var paramValue=$("#"+hdId).val();
			if (eval(value)*1<eval(paramValue)*1){
				return false;
			}else{
				autoSettingNumberValuePrice(value,0);
				return true;	
			}  
        },    
        message: '输入的数值应该大于最小要求值.'   
    }    
});

/**
 * 日期时间
 */
$.extend($.fn.validatebox.defaults.rules, {
	datetime: {
		validator: function(value){
			var regex=/^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-)) (20|21|22|23|[0-1]?\d):[0-5]?\d:[0-5]?\d$/;
			
			if (regex.test(value)){
				return true;
			}else{
				return false;
			}
		},
		message: '日期时间格式有误.'
	}
});

/**
 * 验证字符串长度,需要读取某隐藏域中存储长度值  zanshulai@126.com 
 */
$.extend($.fn.numberbox.defaults.rules, {    
    equalsLength: {    
        validator: function(value,param){
			var paramValue=$(param[0]).val();
			if (value.length==paramValue){
				return true;
			}else{
				return false;	
			}  
        },    
        message: '长度格式有误,格式如: 201402 .'   
    }    
});

$.extend($.fn.validatebox.defaults.rules, {    
    minLength: {    
        validator: function(value, param){    
            return value.length >= param[0];    
        },    
        message: '请至少输入{0}个字。'   
    }    
}); 

$.extend($.fn.validatebox.defaults.rules, {    
    maxLength: {    
        validator: function(value, param){    
            return value.length <= param[0];    
        },    
        message: '最多输入{0}个字。'   
    }    
}); 

$.extend($.fn.validatebox.defaults.rules, {    
    ip:{    
        validator: function(value, param){    
    		return /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(value);     
        },    
        message: 'IP地址格式不对!'   
    }    
}); 

/**
 * 格式化CheckBox，应用于CheckBox的formatter属性
 * @param {String} value  单元格中的数据 
 * @param {Object} row  单元行中的数据 
 */
function checkboxFormatter(value, row) {
    if (value == 'T') {
        return "<input type=\"checkbox\" checked=\"checked\" onclick=\"return false\" onkeydown=\"return false\"/>";
    } else {
        return "<input type=\"checkbox\" onclick=\"return false\" onkeydown=\"return false\"/>";
    }
}
/**
 * grid中格式化下拉框数据
 * @param {String} value  单元格中的数据 
 * @param {Object} rowData  单元行中的数据 
 * @param {String} rowIndex  index
 * @param {Object} data  转义数据
 */
function comboboxFormatter(value, rowData, rowIndex,data,fieldJson) {
	var index = -1;
	var idField = 'id';
	var textField = 'text';
	if(fieldJson){
		idField=fieldJson.key;
		textField=fieldJson.value;
	}
	else{
		// zangshulai@126.com注释
		//if(data.length>0&&data[0].ID){
		//	idField = 'ID';
		//	textField = 'TEXT';
		//}
	}
	if (data && data.length>0){
		for (var i = 0; i < data.length; i++) {
			if (data[i][idField] == value) {
				index = i;
				break;
			}
		}
	}
	if (index > -1) {
		return data[index][textField];
	} else {
		return value;
	}
}

/**
 * grid大文本编辑器
 */
$.extend($.fn.datagrid.defaults.editors, {
    blobedit: {
        init: function (container, options) {
			var valueMaxLength=0;
			if (options && options.maxlength){
				valueMaxLength=options.maxlength;
			}
			//alert(valueMaxLength);
			
            var height = $(container.prevObject.prevObject).height();
            var input = $('<textarea readonly=true class="datagrid-editable-input" style="height:'+(height-11)+'px;resize:none;overflow:hidden;" onclick="blobeditClick(this,'+height+','+valueMaxLength+');"></textarea>').appendTo(container);
            input.validatebox(options);
            return input;
        },
        getValue: function (target) {
            return $(target).val();
        },
        setValue: function (target, value) {
            $(target).val(value);
        },
        resize: function (target, width) {
            var input = $(target);
            if ($.boxModel == true) {
                input.width(width - (input.outerWidth() - input.width()));
            } else {
                input.width(width);
            }
        },
        destroy:function(target){
        	$(target).remove();
        }
    }
});
/**
 * blobedit的点击事件
 */
function blobeditClick(obj,rowHeight,valueMaxLength) {
    /// <summary>blobedit点击时，新建textarea</summary>
    var container = $(obj);
    var width = container.width();
    var allWidth = $(window).width();
    var leftWidth = container.offset().left;
    if ((leftWidth + width) > allWidth) {
        width = allWidth - leftWidth - 10;
    }
    var left = container.offset().left + "px";
    var top = container.offset().top + "px";
    var valueStr = container.val();
	
	var hasMaxLength=false;
	if (valueMaxLength && eval(valueMaxLength)*1>0){
		hasMaxLength=true;
	}

    var input = $('<textarea class="datagrid-editable-input blobeditPop" style="width:' + width + 'px; height:80px; z-index:999999;position:absolute;left:' + left + ';top:' + top + '" '+(hasMaxLength==true?'maxlength="'+valueMaxLength+'" onblur="this.value=this.value.checkMaxLength('+valueMaxLength+');"':'')+' ></textarea>').appendTo(document.body);
    $(input)[0].focus();
    $(input).val(valueStr);
    $(input).blur(function () {//textarea失去焦点，移除
        container.val($(input).val());
        $(input).remove();
        container.validatebox('validate');
    });
}
String.prototype.len=function(){                 
	return this.replace(/[^\x00-\xff]/g,"rr").length;          
}
String.prototype.checkMaxLength = function(lenTemp){    
 	var r = /[^\x00-\xff]/g;    
 	if(this.replace(r, "mm").length <= lenTemp) return this;   
	var m = Math.floor(lenTemp);    
	for(var i=m; i<this.length; i++) {    
		if(this.substr(0, i).replace(r, "mm").length>=lenTemp) {  
		showAlertMsg('注意：文字长度不能超过'+lenTemp+',系统自动将超出文字去掉!');
		return this.substr(0, i) ; 
		}    
	} 
	return this;   
};


/**
 * 表格中搜索框
 */
$.extend($.fn.datagrid.defaults.editors, {
    searchbox: {
        init: function (container, options) {
            var input = $('<input class="easyui-searchbox"  type="text"/>').appendTo(container);
            input.searchbox(options);
            $(".searchbox-text").attr('readonly',true);
    		$(".searchbox-text").addClass("input_text_readOnly");
            return input;
        },
        getValue: function (target) {
            return $(target).searchbox('getValue');
        },
        setValue: function (target, value) {
        	 return $(target).searchbox('setValue',value);
        },
        resize: function (target, width) {
            $(target).searchbox('resize', width);
        }
    }
});

$.extend($.fn.datagrid.defaults.editors, {
    searchCombox: {
        init: function (container, options) {
            var input = $('<input  type="text"/>').appendTo(container);
            input.searchCombox(options);
            return input;
        },
        getValue: function (target) {
            return $(target).searchCombox('getText');
        },
        setValue: function (target, value) {
        	 return $(target).searchCombox('setText',value);
        },
        resize: function (target, width) {
            $(target).searchCombox('resize', width);
        }
    }
});
/**
 * 表格中a标签点击弹出对话框
 */
$.extend($.fn.datagrid.defaults.editors, {
    linkOpenDiaolg: {
        init: function (container, options) {
            var input = $('<a value="" style="width:100%;height:100%;text-align:center;" href="#" '+"onclick='showLinkOpenDiaolg(this)'"+'>'+(options.text?options.text:"链接")+'</a>').appendTo(container);
            input.data('options',options);
            return input;
        },
        getValue: function (target) {
            return $(target).attr('value');
        },
        setValue: function (target, value) {
        	 return $(target).attr('value',value);
        },
        resize: function (target, width) {
            $(target).css('width', width);
        }
    }
});

/*options中的参数:
 * text A标签内用于点击的文子
 * 
 * title 弹出框的标题
 * url 弹出框的url
 * param  向弹出框传递的参数
 * onClose 关闭弹窗后的回调函数
 * */
function showLinkOpenDiaolg(_self){
	var options = $(_self).data("options");
	var mainWin = getMainWindow();	
	if(mainWin){
		var param={
				title:options.title?options.title:"",
				href:__ctx+options.url,
				param:options.param
			};
		if(options.onClose){
			param["onClose"]=options.onClose;
		}
		mainWin.easyuiDialog.init(param);
	}
}

function linkOpenDiaolgFormatter(value, row){
	return value;
}


/*
 * 复选框编辑器
 * */
$.extend($.fn.datagrid.defaults.editors, {
    checkboxEditor: {
        init: function (container, options) {
           if(options){
           		if(options.data){//{year:'年',month:'月',day:'日'}这种格式
           			var str="";
           			for(var v in options.data){
           				str+="<label style='margin-left:5px;'><input name='"+options.name?options.name:'default'+"' type='checkbox' value='"+v+"'>"+options.data[v]+"</label>  ";
           			}
           		}	
           }
           return $("<div style='width:100%;height:100%;'>"+str+"</div>").appendTo(container);
        },
        getValue: function (target) {
        	var val=[];
        	$(target).find("input:checkbox:checked").each(function (index, domEle) {
				   val.push($(domEle).attr("value"));		
        	});
        	
            return val.join(",");
        },
        setValue: function (target, value) {
        	if(value&&value!=""){
        		var a = value.split(",");
        		if(a.length>0){
        			for(var i=0;i<a.length;i++){
        				$(target).find("input:checkbox[value='"+a[i]+"']").attr("checked","checked");
        			}
        		}
        		
        	}
        	return $(target);
        },
        resize: function (target, width) {
            $(target).css('width', width);
        }
    }
});



/*
 * 人员部门选择编辑器
 * */
$.extend($.fn.datagrid.defaults.editors, {
    personDeptEditor: {
        init: function (container, options) {
           if(options){
           		//把options绑定到body上
           		var singlePerson="<input id='values' name='values' type='hidden'/><input id='singlePerson' onclick='personDeptEditorOpenDialog(this)' style='width:125px;' name='singlePerson'  readonly='readonly' class='selectuser'></input>";
           		var multiPerson="<input id='values' name='values'  type='hidden'/><input id='multiPerson' onclick='personDeptEditorOpenDialog(this)' style='width:125px;' name='multiPerson'  readonly='readonly' class='selectusers'></input>";
           		var dept="<input id='values' name='values'  type='hidden'/><input id='dept' style='width:125px;' onclick='personDeptEditorOpenDialog(this)' name='dept'  readonly='readonly' class='selectdept'></input>";
           		
           		if(options.showStaff){
           			if(options.showCheckBox){
           				return	$(multiPerson).appendTo(container).data("personDeptEditor",options);
           			}else{
           				return	$(singlePerson).appendTo(container).data("personDeptEditor",options);
           			}
           		}else{
           			return	$(dept).appendTo(container).data("personDeptEditor",options);
           		}
           }
           return	$(singlePerson).appendTo(container); 
        },
        getValue: function (target) {
        	return $(target).val();
        },
        setValue: function (target, value) {
        	 $(target).val(value);
        	 return $(target);
        },
        resize: function (target, width) {
            $(target).css('width', width);
        }
    }
});

function personDeptEditorOpenDialog(){
	//console.log($("body").data("personDeptEditor"));
}


/**
 * 表格中搜索框
 */
$.extend($.fn.datagrid.defaults.editors, {
    readonlyText: {
        init: function (container, options) {
            var input = $('<input  type="text" class="input_text_readOnly" readonly=true/> ').appendTo(container);
            return input;
        },
        getValue: function (target) {
            return $(target).val();
        },
        setValue: function (target, value) {
        	 return $(target).val(value);
        },resize: function (target, width) {
            $(target).css('width', width);
        }
    }
});

/**
 * 只读表格中搜索框
 */
$.extend($.fn.datagrid.defaults.editors, {
    searchboxReadOnly: {
        init: function (container, options) {
            var input = $('<input class="easyui-searchbox" readonly=true  type="text"/>').appendTo(container);
            input.searchbox(options);
            $(".searchbox-text").attr('readonly',true);
    		$(".searchbox-text").addClass("input_text_readOnly");
            return input;
        },
        getValue: function (target) {
            return $(target).searchbox('getValue');
        },
        setValue: function (target, value) {
        	 return $(target).searchbox('setValue',value);
        },
        resize: function (target, width) {
            $(target).searchbox('resize', width);
        }
    }
});
/**

 * 表格中可编辑日期时间 zangshulai@126.com
 */
$.extend($.fn.datagrid.defaults.editors, { 
	datetimebox: {
		init: function (container, options) {
            var width = container.width();
            var newOptions = $.extend({ width: width }, options);
            var input = $('<input class="easyui-datetimebox" type="text"/>').appendTo(container);
            return input.datetimebox(newOptions);
        },
        destroy: function (target) {
            $(target).datetimebox('destroy');
        },
        getValue: function (target) {
            return $(target).datetimebox('getValue');
        },
        setValue: function (target, value) {
            $(target).datetimebox('setValue', value);
        },
        resize: function (target, width) {
            $(target).datetimebox('resize', width);
        }	
	} 
}); 

/**
 * 时间微调 zhs
 */
$.extend($.fn.datagrid.defaults.editors, {
	timeSpinner: {
        init: function (container, options) {
            var width = container.width();
            var newOptions = $.extend({ width: width }, options);
            var input = $('<input class="easyui-timespinner"/>').appendTo(container);
            return input.timespinner(newOptions);
        },
        destroy: function (target) {
            $(target).timespinner('destroy');
        },
        getValue: function (target) {
            return $(target).timespinner('getValue');
        },
        setValue: function (target, value) {
            $(target).timespinner('setValue', value);
        },
        resize: function (target, width) {
            $(target).timespinner('resize', width);
        }
    }
});
/**
 * 辅助表格中可编辑日期时间格式化  zangshulai@126.com
 */
Date.prototype.format = function(format){ 
     /* 
      * eg:format="yyyy-MM-dd hh:mm:ss"; 
      */ 
     if(!format){ 
         format = "yyyy-MM-dd hh:mm:ss"; 
     } 
     var o = { 
		"M+": this.getMonth() + 1, // month 
		"d+": this.getDate(), // day 
		"h+": this.getHours(), // hour 
		"m+": this.getMinutes(), // minute 
		"s+": this.getSeconds(), // second 
		"q+": Math.floor((this.getMonth() + 3) / 3), // quarter 
		"S": this.getMilliseconds() 
    }; 

    if (/(y+)/.test(format)) { 
         format = format.replace(RegExp.$1, (this.getFullYear() +"").substr(4 - RegExp.$1.length)); 
    } 

	for (var k in o) { 
		if (new RegExp("(" + k + ")").test(format)) { 
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" +o[k]).length)); 
		} 
	} 
    return format; 
 }; 



/**
 * 初始化分页,初始化后请把页码的全局变量设置为1 查询时候会用
 * @param $grid 表格id或表格juqery对象
 */
function initPager($grid) {
    if (typeof $grid == 'string') {
        $grid = $('#' + $grid);
    }
    var dg = $grid;
    var options = dg.datagrid('options');
    if (options.pagination) {
        dg.datagrid({ pageNumber: 1 });
    }
 
}

//待编辑按钮的文本框
$.extend($.fn.datagrid.defaults.editors, {
    buttoneditcc: {
        init: function (container, options) {
            var input = $('<span class="buttonedit" ><input type="hidden" class="buttonedit-val"  ><input type="text" readonly=true class="buttonedit-text"  ><span><span onclick="editEvent()" class="buttonedit-button"></span></span></span>').appendTo(container);
            return input;
        },
        getValue: function (target) {
            return $(target).find("input.buttonedit-val").val();
        },
        setValue: function (target, value) {
            $(target).find("input.buttonedit-val").val(value);
            //var fieldTD = target[0].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
            var fieldName = 'orgCode';//$(fieldTD).attr('field');
            //var tgParentElement = fieldTD.parentElement.parentElement.parentElement.parentElement.parentElement;
            var tableId = 'orgTable';//tgParentElement.nextSibling.id;
            var options = $.data($('#' + tableId)[0],'datagrid').options;
            var columns = options.columns;
            for(var i=0;i<columns[0].length;i++){
            	var col = columns[0][i];
            	if(col.field == fieldName){
            		var colformatter = col.formatter;
            		var text = colformatter.call(colformatter,value);
            		$(target).find("input.buttonedit-text").val(text);
            		break;
            	}            	
            }
        },
        resize: function (target, width) {
            var input = $(target);
            if ($.boxModel == true) {
                input.width(width - (input.outerWidth() - input.width()));
            } else {
                input.find("input.buttonedit-text").width(width - 16);
            }
        }
    }
});
/**
 * 可上下调数字大小的数字输入框
 */
$.extend($.fn.datagrid.defaults.editors, {
    numberspinner: {
        init: function (container, options) {
            var width = container.width();
            var newOptions = $.extend({ width: width }, options);
            var input = $('<input type="text">').appendTo(container);
            return input.numberspinner(newOptions);
        },
        destroy: function (target) {
            $(target).numberspinner('destroy');
        },
        getValue: function (target) {
            return $(target).numberspinner('getValue');
        },
        setValue: function (target, value) {
            $(target).numberspinner('setValue', value);
        },
        resize: function (target, width) {
            $(target).numberspinner('resize', width);
        }
    }
});

/**
 * 带小时日期框
 */
$.extend($.fn.datagrid.defaults.editors, {
	datetimeboxSim: {
        init: function (container, options) {
            var width = container.width();
            var newOptions = $.extend({ width: width }, options);
            var input = $('<input class="easyui-datetimebox" type="text"/>').appendTo(container);
            return input.datetimebox(newOptions);
        },
        destroy: function (target) {
            $(target).datetimebox('destroy');
        },
        getValue: function (target) {
            return $(target).datetimebox('getValue');
        },
        setValue: function (target, value) {
            $(target).datetimebox('setValue', value);
        },
        resize: function (target, width) {
            $(target).datetimebox('resize', width);
        }
    }
});

/**
 * 表格中可编辑弹出按钮
 */
$.extend($.fn.datagrid.defaults.editors, {
    buttonEdit: {
        init: function (container, options) {
            var input = $('<span class="buttonedit" ><input type="text" readonly=true class="buttonedit-text"  ><span><span onclick="editEvent()" class="buttonedit-button"></span></span></span>').appendTo(container);
            return input;
        },
        getValue: function (target) {
            return $(target).find("input.buttonedit-text").val();
        },
        setValue: function (target, value) {
            $(target).find("input.buttonedit-text").val(value);
        },
        resize: function (target, width) {
            var input = $(target);
            if ($.boxModel == true) {
                input.width(width - (input.outerWidth() - input.width()));
            } else {
                input.find("input.buttonedit-text").width(width - 16);
            }
        }
    }
});


/**
 * 表格中密码输入框
 */
$.extend($.fn.datagrid.defaults.editors, {
    passwordEdit: {
        init: function (container, options) {
            var input = $('<input id="passwordEdit" type="password" style="border: 0px solid #D3D3D3;height:100%;"/> ').appendTo(container);
            return $('#passwordEdit').validatebox({    
					    required: true 
					});
        },
        getValue: function (target) {
            return $(target).val();
        },
        setValue: function (target, value) {
        	 return $(target).val(value);
        },resize: function (target, width) {
            $(target).css('width', width);
        }
    }
});

/**  
 * layout方法扩展    增加layout的方法，支持动态隐藏显示块[暂不支持调整内嵌]  zanshulai@126.com 
 * @param {Object} jq  
 * @param {Object} region  
 */  
$.extend($.fn.layout.methods, {   
	/**  
	 * 面板是否存在和可见  
	 * @param {Object} jq  
	 * @param {Object} params  
	 */  
	isVisible: function(jq, params) {   
		var panels = $.data(jq[0], 'layout').panels;   
		var pp = panels[params];   
		if(!pp) {   
			return false;   
		}   
		if(pp.length) {   
			return pp.panel('panel').is(':visible');   
		} else {   
			return false;   
		}   
	},   
	/**  
	 * 隐藏除某个region，center除外。  
	 * @param {Object} jq  
	 * @param {Object} params  
	 */  
	hidden: function(jq, params) {   
		return jq.each(function() {   
			var opts = $.data(this, 'layout').options;   
			var panels = $.data(this, 'layout').panels;   
			if(!opts.regionState){   
				opts.regionState = {};   
			}   
			var region = params;   
			function hide(dom,region,doResize){   
				var first = region.substring(0,1);   
				var others = region.substring(1);   
				var expand = 'expand' + first.toUpperCase() + others;   
				if(panels[expand]) {   
					if($(dom).layout('isVisible', expand)) {   
						opts.regionState[region] = 1;   
						panels[expand].panel('close');   
					} else if($(dom).layout('isVisible', region)) {   
						opts.regionState[region] = 0;   
						panels[region].panel('close');   
					}   
				} else {   
					panels[region].panel('close');   
				}   
				if(doResize){   
					$(dom).layout('resize');   
				}   
			};   
			if(region.toLowerCase() == 'all'){   
				hide(this,'east',false);   
				hide(this,'north',false);   
				hide(this,'west',false);   
				hide(this,'south',true);   
			}else{   
				hide(this,region,true);   
			}   
		});   
	},   
	/**  
	 * 显示某个region，center除外。  
	 * @param {Object} jq  
	 * @param {Object} params  
	 */  
	show: function(jq, params) {   
		return jq.each(function() {   
			var opts = $.data(this, 'layout').options;   
			var panels = $.data(this, 'layout').panels;   
			var region = params;   
  
			function show(dom,region,doResize){   
				var first = region.substring(0,1);   
				var others = region.substring(1);   
				var expand = 'expand' + first.toUpperCase() + others;   
				if(panels[expand]) {   
					if(!$(dom).layout('isVisible', expand)) {   
						if(!$(dom).layout('isVisible', region)) {   
							if(opts.regionState[region] == 1) {   
								panels[expand].panel('open');   
							} else {   
								panels[region].panel('open');   
							}   
						}   
					}   
				} else {   
					panels[region].panel('open');   
				}   
				if(doResize){   
					$(dom).layout('resize');   
				}   
			};   
			if(region.toLowerCase() == 'all'){   
				show(this,'east',false);   
				show(this,'north',false);   
				show(this,'west',false);   
				show(this,'south',true);   
			}else{   
				show(this,region,true);   
			}   
		});   
	}   
});  

/**
 * 带小时日期框结合My97DatePicker  zangshulai@126.com
 */
 
$.extend($.fn.datagrid.defaults.editors, {
	databoxMy97:{
		init : function(container, options) {
			var width = container.width();
            var newOptions = $.extend({ width: width }, options.validatebox);
			//box.addClass('validatebox-invalid');
			//alert(options.dateFmt);   easyui-validatebox  datagrid-editable-input
            var dClass = "Wdate";
            /*if(options.required && options.required== true){
            	dClass = "Wdate1";
            }*/
            var html="<input class='"+dClass+" datagrid-editable-input' type='text' onclick=\"WdatePicker({";
			html+='       realFullFmt:\'%Date %Time\',';
			html+='       minDate:\'1900-01-01 00:00:00\',';
			html+='       maxDate:\'2099-12-31 23:59:59\',';
			if (options.dateFmt){
				html+='       dateFmt:\''+options.dateFmt+'\',';
			}else{
				html+='       dateFmt:\'yyyy-MM-dd HH:mm:ss\',';
			}
			if (options.skin){
				html+='       skin:\''+options.skin+'\',';
			}else{
				html+='       skin:\'whyGreen\',';
			}
			if (options.realDateFmt){
				html+='       realDateFmt:\''+options.realDateFmt+'\',';
			}else{
				html+='       realDateFmt:\'yyyy-MM-dd\',';
			}
			if (options.realTimeFmt){
				html+='       realTimeFmt:\''+options.realTimeFmt+'\',';
			}else{
				html+='       realTimeFmt:\'HH:mm:ss\',';
			}
			if (options.startDate){
				html+='       startDate:\''+options.startDate+'\',';
			}else{
				html+='       startDate:\'\',';
			}
			if (options.firstDayOfWeek){
				html+='       firstDayOfWeek:'+options.firstDayOfWeek+',';
			}else{
				html+='       firstDayOfWeek:0,';
			}
			if (options.errDealMode){
				html+='       errDealMode:\''+options.errDealMode+'\',';
			}else{
				html+='       errDealMode:\'0\',';
			}
			if (options.readOnly){
				html+='       readOnly:'+options.readOnly+',';
			}else{
				html+='       readOnly:true,';
			}
			if (options.isShowWeek){
				html+='       isShowWeek:'+options.isShowWeek+',';
			}else{
				html+='       isShowWeek:false,';
			}
			if (options.highLineWeekDay){
				html+='       highLineWeekDay:'+options.highLineWeekDay+',';
			}else{
				html+='       highLineWeekDay:true,';
			}
			if (!options.isShowClear){
				html+='       isShowClear:'+options.isShowClear+',';
			}else{
				html+='       isShowClear:true,';
			}
			if (options.isShowOthers){
				html+='       isShowOthers:'+options.isShowOthers+',';
			}else{
				html+='       isShowOthers:true,';
			}
			if (options.qsEnabled){
				html+='       qsEnabled:'+options.qsEnabled+',';
			}else{
				html+='       qsEnabled:true,';
			}
			if (options.autoShowQS){
				html+='       autoShowQS:'+options.autoShowQS+',';
			}else{
				html+='       autoShowQS:false,';
			}
			if (options.opposite){
				html+='       opposite:'+options.opposite+',';
			}else{
				html+='       opposite:false,';
			}
			if (options.onpicking){
				html+='       onpicking:'+options.onpicking+',';
			}else{
				html+='       onpicking:function (dp) {},';
			}
			if (options.onpicked){
				html+='       onpicked:'+options.onpicked+',';
			}else{
				html+='       onpicked:function (dp) {},';
			}
			if (options.onclearing){
				html+='       onclearing:'+options.onclearing+',';
			}else{
				html+='       onclearing:function (dp) {},';
			}
			if (options.oncleared){
				html+='       oncleared:'+options.oncleared+',';
			}else{
				html+='       oncleared:function (dp) {}';
			}
			html+='})"  />';
			//alert(html);
			var input = $(html).appendTo(container);
            input.validatebox(newOptions);
            return input;
		},
		getValue : function(target) {
			return $(target).val();
		},
		setValue : function(target, value) {
			$(target).val(value);
		},
		resize : function(target, width) {
			var input = $(target);
			if ($.boxModel == true) {
				input.width(width - (input.outerWidth() - input.width()));
			} else {
				input.width(width);
			}
		}
	}
});

//验证值 固定长度
$.extend($.fn.validatebox.defaults.rules, {
	equalLength: {  
		validator: function(value, param){ 
				return value.length == param[0]; 
		},message: '请输入{0}位数字！'}
});

//设置点击列排序小图标
function setSortImg(e){
	
	var order='asc';
	var c = 'datagrid-sort-asc';
	var $e=$(e).parent().parent();
	//清除所有图标
	$('.datagrid-header .datagrid-cell').not($e[0]).removeClass('datagrid-sort-asc');
	$('.datagrid-header .datagrid-cell').not($e[0]).removeClass('datagrid-sort-desc');
	if ($e.hasClass('datagrid-sort-asc')){
		c = 'datagrid-sort-desc';
		order='desc';
	}
	$e.removeClass('datagrid-sort-asc');
	$e.removeClass('datagrid-sort-desc');
	$e.addClass(c);
	return order;
}

/**
 * 验证版本号格式，和在当前页的唯一性
 */
 $.extend($.fn.validatebox.defaults.rules, {
 	verFormat_Repeat: {
 		validator: function(value, param){
 			//验证格式
 			/*
 			var arr=value.split('.');
 			
 			if(arr!=null && arr.length!=3){
 				$.fn.validatebox.defaults.rules.verFormat_Repeat.message='版本号格式为：主版本号.次版本号.修订次数';
 				return false;
 			}
 			var regex=/^[0-9]*$/;
 			if(regex.test(arr[2])){
 				
 			}else{
 				$.fn.validatebox.defaults.rules.verFormat_Repeat.message='版本号格式为：主版本号.次版本号.修订次数';
 				return false;
 			}*/
 			//验证唯一性
 			var res=false;
			var gridId="#"+param[0];
			var dg=$(gridId);
			var colName=param[1];
			var rows=dg.datagrid('getRows');
			//有主子表的情况下，rowEditIndex会根据当前操作Gird的编辑行而改变，使用该方法验证唯一性会有问题。
			//只有一个表的情况下，可用该方法。
			var rowEditIndex=dg.datagridPlugin('getEditIndex'); 
			if(rows&&rows.length>0){
				//验证数组中是否包含指定项的值
				for(var i=0;i<rows.length;i++){
					var row=rows[i];
					var col=row[colName];
					if(col==value&&i!=rowEditIndex){
						res=true;
						break;
					}
				}
			}
			if (res) {
				$.fn.validatebox.defaults.rules.verFormat_Repeat.message='版本号不满足唯一性！';
				return false;
			}		
			return true;
 		},
 		message: ''
 	}
 }); 
 
 $.extend($.fn.validatebox.defaults.rules,{  
    dateValid : {  
        validator : function(value,param) { //参数value为当前文本框的值，也就是endDate  
            startTime = $(param[0]).datetimebox('getValue');//获取起始时间的值  
            var start = $.fn.datebox.defaults.parser(startTime);  
            var end = $.fn.datebox.defaults.parser(value);  
            varify = end > start;  
            return varify;  
        },  
        message : '结束时间要大于开始时间!'  
    }  
});
 
 /**
 * 格式化regDate，应用于系统自动产生的登记日期的formatter属性
 * @param {String} value  单元格中的数据 
 * @param {Object} row  单元行中的数据 
 */
function regDateFormatter(value, row) {
    var result="";
	if (value){
		result=value.replace("00:00:00","");
		if(value && value.indexOf("00:00:00")<0){
			result=Date.parse(value).toString("yyyy-MM-dd");
		}
	}
	return result;
}

 /**
 * 格式化 日期根据日期的格式
 * @param {String} value  单元格中的数据 
 * @param {Object} row  单元行中的数据 
 */
function formatDate(value, row,format) {
    var result="";
	if (value){
		result=value.replace("00:00:00","");
		if(value && value.indexOf("00:00:00")<0){
			result=Date.parse(value).toString(format);
		}
	}
	return result;
}
function formatDateValue(value, row,format) {
    var result="";
	if (value){
		result=Date.parse(value).toString(format);
	}
	return result;
}

/**  
 * layout方法扩展  
 * @param {Object} jq  
 * @param {Object} region  
 */  
$.extend($.fn.layout.methods, {   
    /**  
     * 面板是否存在和可见  
     * @param {Object} jq  
     * @param {Object} params  
     */  
    isVisible: function(jq, params) {   
        var panels = $.data(jq[0], 'layout').panels;   
        var pp = panels[params];   
        if(!pp) {   
            return false;   
        }   
        if(pp.length) {   
            return pp.panel('panel').is(':visible');   
        } else {   
            return false;   
        }   
    },   
    /**  
     * 隐藏除某个region，center除外。  
     * @param {Object} jq  
     * @param {Object} params  
     */  
    hidden: function(jq, params) {   
        return jq.each(function() {   
            var opts = $.data(this, 'layout').options;   
            var panels = $.data(this, 'layout').panels;   
            if(!opts.regionState){   
                opts.regionState = {};   
            }   
            var region = params;   
            function hide(dom,region,doResize){   
                var first = region.substring(0,1);   
                var others = region.substring(1);   
                var expand = 'expand' + first.toUpperCase() + others;   
                if(panels[expand]) {   
                    if($(dom).layout('isVisible', expand)) {   
                        opts.regionState[region] = 1;   
                        panels[expand].panel('close');   
                    } else if($(dom).layout('isVisible', region)) {   
                        opts.regionState[region] = 0;   
                        panels[region].panel('close');   
                    }   
                } else {   
                    panels[region].panel('close');   
                }   
                if(doResize){   
                    $(dom).layout('resize');   
                }   
            };   
            if(region.toLowerCase() == 'all'){   
                hide(this,'east',false);   
                hide(this,'north',false);   
                hide(this,'west',false);   
                hide(this,'south',true);   
            }else{   
                hide(this,region,true);   
            }   
        });   
    },   
    /**  
     * 显示某个region，center除外。  
     * @param {Object} jq  
     * @param {Object} params  
     */  
    show: function(jq, params) {   
        return jq.each(function() {   
            var opts = $.data(this, 'layout').options;   
            var panels = $.data(this, 'layout').panels;   
            var region = params;   
  
            function show(dom,region,doResize){   
                var first = region.substring(0,1);   
                var others = region.substring(1);   
                var expand = 'expand' + first.toUpperCase() + others;   
                if(panels[expand]) {   
                    if(!$(dom).layout('isVisible', expand)) {   
                        if(!$(dom).layout('isVisible', region)) {   
                            if(opts.regionState[region] == 1) {   
                                panels[expand].panel('open');   
                            } else {   
                                panels[region].panel('open');   
                            }   
                        }   
                    }   
                } else {   
                    panels[region].panel('open');   
                }   
                if(doResize){   
                    $(dom).layout('resize');   
                }   
            };   
            if(region.toLowerCase() == 'all'){   
                show(this,'east',false);   
                show(this,'north',false);   
                show(this,'west',false);   
                show(this,'south',true);   
            }else{   
                show(this,region,true);   
            }   
        });   
    }   
}); 


//输入的内容必须是数字
$.extend($.fn.validatebox.defaults.rules, {
	validNumber: {
	 validator: function(value, param) {
		var pattern = new RegExp("^\d$") ;
		return !pattern.test(value);
	 },
	 message: '输入的内容必须是数字！'
	}
});

//datagrid 获得选中行的行号  targetGrid.datagrid("getRowNum");
$.extend($.fn.datagrid.methods, { 
    getRowNum:function(jq){ 
        var opts=$.data(jq[0],"datagrid").options; 
        var array = new Array(); 
        opts.finder.getTr(jq[0],"","checked",1).each(function(){ //selected  checked
            array.push($(this).find("td.datagrid-td-rownumber").text()); 
        }); 
        return array.join(","); 
    } 
});

//获得treegrid选中行的索引
$.extend($.fn.datagrid.methods, { 
	getTreeGridRowNum:function(jq){ 
		var opts=$.data(jq[0],"datagrid").options; 
		var array = new Array(); 
		opts.finder.getTr(jq[0],"","checked",1).each(function(){ 
			//选择行号
			var recRowNumber=$(this).find("td.datagrid-td-rownumber").text();
			//标记选中的行
			//alert($(this).html()); //当前选定元素
			//alert($(this).parent().html()); //当前元素有同级
			var recId="";
			var arrRows=$(this).parent().find("tr.datagrid-row-checked"); //datagrid-row-checked //datagrid-row
			if (arrRows && arrRows.length>0){
				for(var i=0;i<arrRows.length;i++){
					var tNumber=$(arrRows[i]).find("td.datagrid-td-rownumber").text();
					if (tNumber==recRowNumber){
						recId=arrRows[i].id;
						//从右侧截取字符串  datagrid-row-r1-1-40B1636DAABF553CE0530701A8C023E2_84214
						recId=recId.slice(-38);
						break;
					}
				}
			}
			//alert(recId);
			var row={
				id:recId,
				numberIndex:recRowNumber
			}
			array.push(row); 
		}); 
		return array; 
	} 
});
// targetGrid.treegrid("getTreeGridRowNum"); 获取选中的行，然后根据记录ID，判断操作的具体行号
function getTreeGridRownumber(arrTreeGridCheckedList,rowId){
	var result=-1;
	if (arrTreeGridCheckedList && arrTreeGridCheckedList.length>0){
		for(var i=0;i<arrTreeGridCheckedList.length;i++){
			var rowData=arrTreeGridCheckedList[i];
			if (rowData && rowData.id==rowId){
				result=rowData.numberIndex;
				break;
			}
		}
	}
	return result;
}


//验证值 固定长度
$.extend($.fn.validatebox.defaults.rules, {
	equalMac: {  
		validator: function(value, param){
        	var regex=/^[A-F0-9]{2}(-[A-F0-9]{2}){5}$/;
        	if(value&&value!=""){
        		return regex.test(value);
        	}
            return true; 
        },  
        message: 'MAC地址不符合规则！' 
	}
});

$.extend($.fn.layout.methods, {   
    /**  
     * 面板是否存在和可见  
     * @param {Object} jq  
     * @param {Object} params  
     */  
    isVisible: function(jq, params) {   
        var panels = $.data(jq[0], 'layout').panels;   
        var pp = panels[params];   
        if(!pp) {   
            return false;   
        }   
        if(pp.length) {   
            return pp.panel('panel').is(':visible');   
        } else {   
            return false;   
        }   
    },   
    /**  
     * 隐藏除某个region，center除外。  
     * @param {Object} jq  
     * @param {Object} params  
     */  
    hidden: function(jq, params) {   
        return jq.each(function() {   
            var opts = $.data(this, 'layout').options;   
            var panels = $.data(this, 'layout').panels;   
            if(!opts.regionState){   
                opts.regionState = {};   
            }   
            var region = params;   
            function hide(dom,region,doResize){   
                var first = region.substring(0,1);   
                var others = region.substring(1);   
                var expand = 'expand' + first.toUpperCase() + others;   
                if(panels[expand]) {   
                    if($(dom).layout('isVisible', expand)) {   
                        opts.regionState[region] = 1;   
                        panels[expand].panel('close');   
                    } else if($(dom).layout('isVisible', region)) {   
                        opts.regionState[region] = 0;   
                        panels[region].panel('close');   
                    }   
                } else {   
                    panels[region].panel('close');   
                }   
                if(doResize){   
                    $(dom).layout('resize');   
                }   
            };   
            if(region.toLowerCase() == 'all'){   
                hide(this,'east',false);   
                hide(this,'north',false);   
                hide(this,'west',false);   
                hide(this,'south',true);   
            }else{   
                hide(this,region,true);   
            }   
        });   
    },   
    /**  
     * 显示某个region，center除外。  
     * @param {Object} jq  
     * @param {Object} params  
     */  
    show: function(jq, params) {   
        return jq.each(function() {   
            var opts = $.data(this, 'layout').options;   
            var panels = $.data(this, 'layout').panels;   
            var region = params;   
  
            function show(dom,region,doResize){   
                var first = region.substring(0,1);   
                var others = region.substring(1);   
                var expand = 'expand' + first.toUpperCase() + others;   
                if(panels[expand]) {   
                    if(!$(dom).layout('isVisible', expand)) {   
                        if(!$(dom).layout('isVisible', region)) {   
                            if(opts.regionState[region] == 1) {   
                                panels[expand].panel('open');   
                            } else {   
                                panels[region].panel('open');   
                            }   
                        }   
                    }   
                } else {   
                    panels[region].panel('open');   
                }   
                if(doResize){   
                    $(dom).layout('resize');   
                }   
            };   
            if(region.toLowerCase() == 'all'){   
                show(this,'east',false);   
                show(this,'north',false);   
                show(this,'west',false);   
                show(this,'south',true);   
            }else{   
                show(this,region,true);   
            }   
        });   
    }   
});

/**
 * 加班单加班工时使用
 */
$.extend($.fn.datagrid.defaults.editors, { 
	numberBlur: {
		init: function (container, options) {

			var funBlurName = options.setBlur;
			//delete options.setBlur;
            var width = container.width();
            width = width-3;          
            var input = $('<input onblur="'+funBlurName+'()" class="datagrid-editable-input" type="text" style="width:'+width+'px"/>').appendTo(container);
           	return input;            
        },
        
        getValue: function (target) {
            //return $(target).numberbox('getValue');
        	return $(target).val();
        },
        setValue: function (target, value) {
           // $(target).numberbox('setValue', value);
        	$(target).val(value);
        }
        
	} 
}); 
