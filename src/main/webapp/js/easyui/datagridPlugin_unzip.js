/**
 *  datagridPlugin
 *  www.isunland.com
 */
(function($){
	$.fn.datagridPlugin = function(option,param){
		if (typeof option == 'string'){
			var method = $.fn.datagridPlugin.methods[option];
			if (method){
				return method(this, param);
			} else {
				return this;
			}
		}
		//用于自定义验证  zsd
		var rowEditIndex=-1;
		var newOptions = $.extend(true,{},$.fn.datagridPlugin.defaults,option);
		var target = this;
		if(newOptions.useDefaultToolbar){//默认工具栏
			newOptions.toolbar = getToolbar(target,newOptions);
		}
		if(newOptions.checkbox){//新增checkbox列
			if(!newOptions.frozenColumns){
				newOptions.frozenColumns = [[]];
			}
			newOptions.frozenColumns[0].unshift({checkbox:true,field:'ck'});
		}
		newOptions.editAbleBackup = newOptions.editAble;
		target.datagrid(newOptions);
		return target;
	};
	
	$.fn.datagridPlugin.methods = {
		save: function(target){ 
			return save(target);
		},
		cancel: function(target){ 
			return cancel(target);
		},
		allEndEdit:function(target){ 
			return allEndEdit(target);
		},
		isValidate:function($target){//数据是否合法
		    return validateAllRow($target);
		},
		getEditIndex:function(){//获取当前编辑行的index 扩展自定义验证控件时，切换行调用验证方法，获取不到当前正在编辑的行使用select不准确 ---zsd
			return rowEditIndex;
		},
		setRowStyle:function(target,obj){//{indexArray:要改变行样式的index数组,cssObj:{css对象}}
			var panel = $(target).datagrid("getPanel");
			if(obj&&obj.indexArray){
				for(var i=0;i<obj.indexArray.length;i++){
					$(panel).find(".datagrid-view2").find("tr[datagrid-row-index="+obj.indexArray[i]+"]").css(obj.cssObj);
				}
			}
		},
		moveToPage:function(target,pageNum){//跳转到指定页
			var pager = target.datagrid("getPager");
			if(pager){
				var pageOptions = pager.pagination('options');
				if(pageOptions){
					//算出总页数
					var pageCount = Math.ceil(pageOptions.total/pageOptions.pageSize) || 1;
					if (pageOptions.pageNumber < 1){pageOptions.pageNumber = 1;}
					if (pageOptions.pageNumber > pageCount){pageOptions.pageNumber = pageCount}
					if (pageOptions.total == 0){
						pageOptions.pageNumber = 0;
						pageCount = 0;
					}
					if(pageNum>pageCount){
						pageNum = pageCount;
					}
					pager.pagination('select', pageNum);
				}
			}
		}
	};
	
	$.fn.datagridPlugin.defaults={
		saveUrl:'save.ht',//提交新增数据的url
		useDefaultToolbar:true,//是否使用默认的toolBar，只有为真值时，默认添加等按钮及其函数才能其作用
		//appendDefaults toolbarAdd appendHandler配合使用
		appendDefaults:null, //添加新行默认值，可以为json或者返回json的函数
		toolbarAdd:true,//使用新增按钮，为true显示
		appendHandler:appendRow,//新增行函数
		
		//toolbarModify modifyHandler配合使用
		toolbarModify:true,//使用修改按钮，为true显示
		modifyHandler:modifyRow,//修改行函数
		
		toolbarDelete:true,//使用删除按钮，为true显示
		keyField:'id',//表格的主键字段
		deleteHandler:deleteRow,//删除行函数
		
		toolbarCancel:true,//使用取消按钮，为true显示
		cancelHandler:cancel,//取消按钮事件
		
		toolbarSave:true,//使用保存按钮，为true显示
		saveHandler:save,//保存按钮事件
		editAble:false,//是否可编辑，点击行进入编辑时使用
		saveText:'保存',//默认保存按钮名称提交--zsd
		customButtons:null,//自定义按钮
		nameArray:{'add':'添加','modify':'修改','delete':'删除','cancel':'取消','save':'保存'},//改默认按钮名称
		sortArray:[],//修改按钮显示顺序 sortArray:['add','modify','delete','cancel','save']
		defaultSelectFirstRow:true,//默认加载完数据显示时选中第一行
		showAllColumnWithNoData:false,//默认在无数据时也显示全部列名
		//添加行前事件，返回值为：函数需要返回值，{allowAppend:true继续新增|false不新增,newRowData:{}新增行数据}
		onBeforeAppend:function(rowIndex,rowData){
		    // 判断数据是否合法，合法才能新增
		    var $targetGrid = getTargetGrid(this);
		    var isValidate = validateAllRow($targetGrid);
			return {allowAppend:isValidate,newRowData:rowData};
		},
		onAfterAppend:function(rowIndex,rowData){},//添加行后事件
		
		//删除前事件，返回值为：{allowDelete:true继续删除|false不删除}
		onBeforeDelete:function(rowIndex,rowData){
			return {allowDelete:true};
		},
		onAfterDelete:function(rowIndex,rowData){},//删除后事件
		
		//编辑前事件，返回值为：{allowModify:true继续删除|false不能}
		onBeforeModify:function(rowIndex,rowData){
			return {allowModify:true};
		},
		
		//保存前单行验证数据是否可以保存 ,参数为:行索引,行数据,操作类型'inserted'
		canBeSavedSingle:function(saveData){
			return {allowSave:true};
		},
		
		//保存前事件，返回值为：{allowSave:true继续保存|false不保存}
		//参数说明：saveData,将要保存的数据，json格式{inserted:[],updated[],deleted:[]}
		onBeforeSave:function(saveData){
			return {allowSave:true};
		},
		
		//参数说明：responseData,服务端返回结果
		onAfterSave:function(responseData){},//保存后事件
		ifMoveToLastPageAfterSave:false,//保存后如果有添加的行是否自动跳转到最后一页
		ifMoveToFirstPageAfterSave:false,//保存后如果有添加的行是否自动跳转到第一页
		
		onAfterOnLoadSuccess:function(data){},
		onBeforeClickRow:function(rowIndex,rowData,editable){},
		onAfterClickRow:function(rowIndex,rowData,editable){},
		onAfterBeginEdit:function(rowIndex,rowData){},
		
		//以下是easyui datagrid 的属性
		onClickRow:onClickRow,//单击行事件
		url:'getList.ht',//获取数据的url
        fitColumns:false,//表格列宽度自适应
        autoRowHeight:false,//根据列的内容自动调整行高
        toolbar:null,//工具栏
        striped:true,//奇偶行颜色不同
        pagination:true,//显示分页工具栏
        rownumbers:true,
        height:410,
        pageSize:10,
        pageList:[5,10,15,20],
        singleSelect:true,//选择单行
        checkOnSelect:true,
        checkbox:true,
        selectOnCheck:false,
        onLoadSuccess:onLoadSuccess
	};
	/**
	 * 获取表格默认的toolbar
	 * @param {jQuery} jq 表格的jquery对象
	 * @param {Object} options $.fn.datagridPlugin.defaults与配置合并后对象
	 * @return {Array} 表格使用的工具栏
	 */
	function getToolbar(jq,options){
		var toolbar = [];
		if(options.toolbarAdd){
			toolbar.push(getToolItem("append",jq,options));
			//toolbar.push("-");
		}
		if(options.toolbarModify){
			toolbar.push(getToolItem("modify",jq,options));
			//toolbar.push("-");
		}
		if(options.toolbarDelete){
			toolbar.push(getToolItem("delete",jq,options));
			//toolbar.push("-");
		}
		if(options.toolbarCancel){
			toolbar.push(getToolItem("cancel",jq,options));
			//toolbar.push("-");
		}
		if(options.toolbarSave){
			toolbar.push(getToolItem("save",jq,options));
			//toolbar.push("-");
		}
		//处理自定义按钮
		var buttons=options.customButtons;
		if(buttons){
			for(var i=0;i<buttons.length;i++){
				var button=buttons[i];
				toolbar.push(button);
			}
		}
		//把配置的array转为map
		var dictSort={};
		if(options.sortArray&&options.sortArray.length>1){
			var prefix = jq.selector.replace(/#/,"");
			for(var i=0;i<options.sortArray.length;i++){
				switch(options.sortArray[i]){
					case 'add':
						dictSort[prefix+"Append"]=i;
						break;
					case "modify":
						dictSort[prefix+"Modify"]=i;
						break;
					case "delete":
						dictSort[prefix+"Delete"]=i;
						break;
					case "cancel":
						dictSort[prefix+"Cancel"]=i;
						break;
					case "save":
						dictSort[prefix+"Save"]=i;
						break;
					default:
						dictSort[options.sortArray[i]]=i;
				}
			}
		}
		if(toolbar.length>1&&options.sortArray&&options.sortArray.length>1){
			toolbar = bubbleSort(toolbar,dictSort);		
			/*	toolbar=toolbar.sort(function(a,b){
				if(dictSort[a.id]){//如果配置了
					if(dictSort[a.id]>dictSort[b.id]){
						return 1;
					}else{
						return -1;
					}	
				}else{
					return 0;
				}
			}
			);*/
		}
		
		return toolbar;
	}
		function  bubbleSort(array,dictSort){  
          var i = 0, len = array.length,  
              j, d;  
          for(; i<len; i++){  
              for(j=0; j<len; j++){  
                  if(dictSort[array[i].id] <dictSort[array[j].id]){  
                      d = array[j];  
                      array[j] = array[i];  
                      array[i] = d;  
                  }  
              }  
          }  
          return array;  
      }
	/**
	 * 默认新增行函数
	 */
	function appendRow(){
		var targetGrid = getTargetGrid(this);
		//删除按钮可用
		var deleteBtn = $(targetGrid.selector+"Delete");
		if(deleteBtn.length>0){
		    deleteBtn.linkbutton('enable');
		}
		
		//验证数据是否合法
		var isValidate = validateAllData(targetGrid);
		if(!isValidate){
		    return;
		}
		
		var options = targetGrid.datagrid('options');
		var newRow = {};
		var defaultRow = options.appendDefaults;
		if(defaultRow){
			if(typeof defaultRow == 'function'){
				newRow = defaultRow();
			}else if(typeof defaultRow == 'object'){
				newRow = defaultRow;
			}
		}
		var rowsLength = targetGrid.datagrid('getRows').length;

		//新增行前事件
		var result = options.onBeforeAppend.call(this,rowsLength-1,newRow);
		if(result.allowAppend){
			newRow = result.newRowData;
			btnCommon(this,false);//取消保存可用
		}else{
			return;
		}
		
		//结束编辑
		allEndEdit(targetGrid);
		
		targetGrid.datagrid('appendRow',newRow);
		rowEditIndex=rowsLength;
		targetGrid.datagrid('beginEdit',rowsLength);
		options.onAfterBeginEdit.call(this,rowsLength,newRow);
		//选中行
		targetGrid.datagrid('selectRow',rowsLength);
		
		//新增行后事件
		options.onAfterAppend.call(this,rowsLength,newRow);
		//去除其他选中项和勾选项
		targetGrid.datagrid('uncheckAll');
		targetGrid.datagrid('selectRow',rowEditIndex);
	}
	/**
	 * 默认修改行函数
	 */
	function modifyRow(){
		var targetGrid = getTargetGrid(this);
		//验证数据是否合法
		var isValidate = validateAllData(targetGrid);
		if(!isValidate){
			$.messager.alert('系统提示','请核查数据是否填写完整、正确！');
		    return;
		}
		var selectedRow="";
		var checkes=targetGrid.datagrid('getChecked');
		if(checkes&&checkes.length>0){
			selectedRow=checkes[0];			
		}else{
			 selectedRow = targetGrid.datagrid('getSelected');
		}
		if (selectedRow!=null){
			var selectedRowIndex = targetGrid.datagrid('getRowIndex',selectedRow);
			rowEditIndex=selectedRowIndex;
			//去除其他选中项和勾选项
			if(checkes&&checkes.length>0){
				targetGrid.datagrid('uncheckAll').datagrid('unselectAll').datagrid('selectRow',selectedRowIndex);
				
				
			}
			//编辑行前事件
			var options = targetGrid.datagrid('options');
			var result = options.onBeforeModify.call(this,selectedRowIndex,selectedRow);
			if(result.allowModify==false){
				return;
			}
			targetGrid.datagrid('beginEdit',selectedRowIndex);
			btnCommon(this,false);//取消保存可用
			var options = targetGrid.datagrid('options');
			options.onAfterBeginEdit.call(this,selectedRowIndex,selectedRow);
			
			//去除其他选中项和勾选项
			if(checkes&&checkes.length>1){
				for(var i=1;i<checkes.length;i++){					
					var check=checkes[i];
					var checkIndex=targetGrid.datagrid('getRowIndex',check);
					targetGrid.datagrid('uncheckRow',checkIndex).datagrid('unselectRow',checkIndex);
					
				}
				
			}
		}else{
			$.messager.alert('系统提示','请先选择要编辑的行!','info');
		}
	}
	/**
	 * 默认删除行函数
	 */
	function deleteRow(){
		var targetGrid = getTargetGrid(this);
		var options = targetGrid.datagrid('options');
		var checkedRows = targetGrid.datagrid('getChecked');
		var selectedRows= targetGrid.datagrid('getSelections');
		if(checkedRows.length==0 && (selectedRows!=null && selectedRows.length>0)){
			checkedRows=selectedRows;
		}
		if (checkedRows!=null && checkedRows.length>0){
			for(var deleteRowIndex = 0; deleteRowIndex < checkedRows.length;deleteRowIndex++){
				var deleteRow = checkedRows[deleteRowIndex];
				var checkedIndex = targetGrid.datagrid('getRowIndex',deleteRow);
				//删除行前事件
				var result = options.onBeforeDelete.call(this,checkedIndex,deleteRow);
				if(result.allowDelete==false){
					continue;
				}
				targetGrid.datagrid('deleteRow',checkedIndex);
				btnCommon(this,false);//删除后取消保存可用，如果删除行前事件为通过，提交删除按钮不可用
				//删除行后事件
				options.onAfterDelete.call(this,checkedIndex,deleteRow);
			}
		}else{
			$.messager.alert('系统提示','请先选择要删除的行!','info');
		}
	}
	/**
	 * 默认取消函数
	 */
	function cancel(target){
		var targetGrid = target;
		if(!targetGrid||!targetGrid.length){
			targetGrid = getTargetGrid(this);
			btnCommon(this,true);//取消保存不可用	
		}		
		targetGrid.datagrid('options').editAble=targetGrid.datagrid('options').editAbleBackup;
		//targetGrid.datagrid('reload');
		targetGrid.datagrid('rejectChanges');
		rowEditIndex=-1;
	}
	//验证是否所有的数据都有效
    function validateAllData(obj) {
        var rows = obj.datagrid('getRows');
        for (var i = 0; i < rows.length; i++) {
            if (!obj.datagrid('validateRow', i)) {
                return false;
            }
        }
        return true;
    }
	/**
	 * 默认保存函数
	 */
	function save(target){
		var targetGrid = target;
		var beRefreshed = true;//能否刷新
		if(!targetGrid||!targetGrid.length){
			targetGrid = getTargetGrid(this);
		}
		if (!validateAllData(targetGrid)) {
			$.messager.alert('系统提示','请核查数据是否填写完整、正确！');
            return;
        }
		var options = targetGrid.datagrid('options');
		allEndEdit(targetGrid);//结束编辑
		//zangshulai@126.com  传递保存前执行函数
		var targetSelectorStr = targetGrid.selector;
		
		var beSave = canBeSaved(targetGrid,options);//调用保存前事件，判断能否保存
		if(!beSave){
			if ($.fn.datagridPlugin.defaults.useDefaultToolbar==true){
				//取消、保存按钮可用
				$(targetSelectorStr+"Cancel").linkbutton('enable');
				$(targetSelectorStr+"Save").linkbutton('enable');
			}
			return;
		}
		
		
		//新增数据
		var insertedRows = targetGrid.datagrid('getChanges','inserted');
		//修改数据
        var updatedRows = targetGrid.datagrid('getChanges','updated');
        //删除数据
        var deletedRows = targetGrid.datagrid('getChanges','deleted');
        //保存前事件使用数据
        var beforSaveData={inserted:insertedRows,updated:updatedRows,deleted:deletedRows};
         var submitData = {};
	    submitData.url = options.saveUrl;
        submitData.data = {inserted:JSON2.stringify(insertedRows),updated:JSON2.stringify(updatedRows),deleted:JSON2.stringify(deletedRows)};
		var result = options.onBeforeSave.call(this,beforSaveData,submitData);//提交保存前可以在submitData中添加保存的数据
		if(result.allowSave){
            //保存后事件
			//接收保存前事件处理 的数据 lx20150511
			if(result.data){
				submitData.data = result.data;
			}
            submitData.success  = function(responseData){
            	//如果有新增，跳转到最后一页
            	var flag=false; 
            	if(insertedRows&&insertedRows.length>0){
					flag=true;         		
            	}
   
				if(flag && options.pagination==true){
					var pager = targetGrid.datagrid("getPager");
					if(pager){//只有使用分页的表格才能跳转
						var pageOptions = pager.pagination('options');
						//算出总页数
						var pageCount = Math.ceil(pageOptions.total/pageOptions.pageSize) || 1;
						if(options.ifMoveToLastPageAfterSave){//是否跳转到最后一页
							if (pageOptions.pageNumber < 1){pageOptions.pageNumber = 1;}
							if (pageOptions.pageNumber > pageCount){pageOptions.pageNumber = pageCount}
							if (pageOptions.total == 0){
								pageOptions.pageNumber = 0;
								pageCount = 0;
							}
							pager.pagination('select', pageCount); 
						}else if(options.ifMoveToFirstPageAfterSave){//是否跳转到第一页
							if (pageOptions.total == 0){
								pageOptions.pageNumber = 0;
								pageCount = 0;
							}else{
								pageOptions.pageNumber = 1;
								pageCount = 1;
							}
							pager.pagination('select', pageCount); 
						}						       
						//targetGrid.datagrid("acceptChanges");
					}
				}
				   options.onAfterSave(responseData);
            };
            
			//取消保存不可用,启用按钮状态
			var $btn = getToolBtn(targetSelectorStr);
			if($btn!=null && $btn.length>0){
				btnCommon($btn,true);//取消保存不可用
			}
			
            targetGrid.datagrid('options').editAble=targetGrid.datagrid('options').editAbleBackup;
			//提交数据到服务器
            $.fn.ajaxExt(submitData);
            rowEditIndex=-1;
		}
	}
	
	/**
	 * 调用保存前事件，判断是否能保存
	 * @param {object} targetGrid 表格jQuery对象
	 * @param {object} options 表格jQuery对象的配置
	 * @return {boolean} true可以保存|false不可以保存
	 */
	function canBeSaved(targetGrid,options){
		//新增数据
		var insertedRows = targetGrid.datagrid('getChanges','inserted');
		for(var insertedRowIndex=0;insertedRowIndex<insertedRows.length;insertedRowIndex++){
			var insertedRow = insertedRows[insertedRowIndex];
			var insertedIndex = targetGrid.datagrid('getRowIndex',insertedRow);
			//保存前事件
			var result = options.canBeSavedSingle.call(this,insertedIndex,insertedRow,'inserted');
			if(!result.allowSave){
				return false;
			}
		}
		//修改数据
		var updatedRows = targetGrid.datagrid('getChanges','updated');
		for(var updatedRowIndex=0;updatedRowIndex<updatedRows.length;updatedRowIndex++){
			var updatedRow = updatedRows[updatedRowIndex];
			var updatedIndex = targetGrid.datagrid('getRowIndex',updatedRow);
			//保存前事件
			var result = options.canBeSavedSingle.call(this,updatedIndex,updatedRow,'updated');
			if(!result.allowSave){
				return false;
			}
		}

		//删除数据
		var deletedRows = targetGrid.datagrid('getChanges','deleted');
		for(var deletedRowIndex=0;deletedRowIndex<deletedRows.length;deletedRowIndex++){
			var deletedRow = deletedRows[deletedRowIndex];
			var deletedIndex = targetGrid.datagrid('getRowIndex',deletedRow);
			//保存前事件
			var result = options.canBeSavedSingle.call(this,deletedIndex,deletedRow,'deleted');
			if(!result.allowSave){
				return false;
			}
		}
		return true;
	}
	
	/**
	 * 表格所有行都结束编辑
	 * @param {jQuery} datagrid easui datagrid对象
	 */
	function allEndEdit(datagrid){
		var rowLength = datagrid.datagrid('getRows').length;
		for(var rowIndex=0;rowIndex<rowLength;rowIndex++){
			datagrid.datagrid('endEdit',rowIndex);
		}
	}
	/**
	 * 按钮的公共函数：取消按钮可否使用、表格的编辑状态
	 * @param {object} 工具栏按钮对象
	 * @isSave {Boolean} isSave 取消、保存按钮为true，其他为false
	 */
	function btnCommon(jq,isSave){
		if(isSave){
			saveDisable(jq);//取消保存不可用
			editAble(jq,false);//表格为不可编辑状态
		}else{
			saveEnable(jq);//取消保存可用
			editAble(jq,true);//表格为可编辑状态
		}
	}
	/**
	 * 根据工具栏按钮，取得其对应的datagrid,需要在构造按钮时加上targetTo属性
	 * @param {Object} btn 工具栏按钮对象
	 * @return {jQuery} 工具栏所属的datagrid对象
	 */
	function getTargetGrid(btn){
		var targetGrid = $(btn).linkbutton('options').targetTo;
		targetGrid = $(targetGrid);
		return targetGrid;
	}
	/**
	 * 保存及取消按钮可用
	 * @param {Object} btn 工具栏按钮对象
	 */
	function saveEnable(btn){
		var targetGrid = $(btn).linkbutton('options').targetTo;
		$(targetGrid+"Cancel").linkbutton('enable');
		$(targetGrid+"Save").linkbutton('enable');
	}
	/**
	 * 保存及取消按钮不可用
	 * @param {Object} btn 工具栏按钮对象
	 */
	function saveDisable(btn){
		var targetGrid = $(btn).linkbutton('options').targetTo;
		$(targetGrid+"Cancel").linkbutton('disable');
		$(targetGrid+"Save").linkbutton('disable');
	}
	/**
	 * 表格的编辑状态，按钮操作时设置此状态,$.fn.datagridPlugin.defaults.editAble属性
	 * @param {Object} btn 工具栏按钮对象
	 * @param {Boolean} editAble 编辑状态
	 */
	function editAble(btn,editAble){
		var targetGrid = $(btn).linkbutton('options').targetTo;
		$(targetGrid).datagrid('options').editAble=editAble;
	}
	/**
	 * 表格可否编辑，根据此状态判断点击行时是否进入编辑状态，$.fn.datagridPlugin.defaults.editAble属性
	 * @param {Object} btn 工具栏按钮对象
	 * @return {Boolean} 表格是否可编辑
	 */
	function isEditable(btn){
		var targetGrid = $(btn).linkbutton('options').targetTo;
		return $(targetGrid).datagrid('options').editAble;
	}
	
	/**
	 * 获取工具栏按钮中的一个按钮，在某个按钮隐藏后，执行按钮对应的btnCommon方法参数从此方法获取
	 * @param {string} targetGridSelector
	 * @return {object} 按钮的jquery对象
	 */
	function getToolBtn(targetGridSelector){
	    var btns = ['Append','Modify','Delete','Cancel','Save'];
	    var result;
	    for(var btnIndex=0,btnCount=btns.length;btnIndex<btnCount;btnIndex++){
	       var $btn = $(targetGridSelector+btns[btnIndex]);
	       if($btn.length>0){
	           result = $btn;
	           break;
	       }
	    }
	    return result;
	}
	
	/**
	 * 获取表格工具栏项，比如“添加”按钮
	 * @param {string} itemType 操作类型"append,modify,delete,cancel,save"中的一项
	 * @param {jQuery} jq datagrid的jQuery对象
	 * @param {objec} options $.fn.datagridPlugin.defaults与配置合并后对象
	 * @return {object} datagrid使用的toolbar中的一项
	 */
	function getToolItem(itemType,jq,options){
		//工具栏标签前缀，datagrid的id,按钮Id规则为：perfix+itemType
		var prefix = jq.selector.replace(/#/,"");
		var id='',disabled=false,text='',iconCls='',handler=function(){};
		var type = itemType.toLowerCase();
		if(type == "append"){//增加按钮
			id=prefix+'Append';
			text=options.nameArray['add']?options.nameArray['add']:"添加";
			iconCls='icon-add';
			handler=options.appendHandler;
		}else if(type=="modify"){//修改
			id=prefix+'Modify';
			text=options.nameArray['modify']?options.nameArray['modify']:"修改";
			iconCls='icon-edit';
			handler=options.modifyHandler;
		}else if(type == "delete"){//删除
			id=prefix+'Delete';
			text=options.nameArray['delete']?options.nameArray['delete']:"删除";
			iconCls='icon-cancel';
			handler=options.deleteHandler;
		}else if(type == "cancel"){//取消
			id=prefix+'Cancel';
			text=options.nameArray['cancel']?options.nameArray['cancel']:"取消";
			iconCls='icon-undo';
			handler=options.cancelHandler;
			disabled=true;
		}else if(type == "save"){//提交
			id=prefix+'Save';
			text=options.nameArray['save']?options.nameArray['save']:options.saveText;//修改提交按钮名称---zsd
			iconCls='icon-save';
			handler=options.saveHandler;
			disabled=true;
		}else{
			return;
		}
		return {
			id:id,
			targetTo:jq.selector,
			disabled:disabled,
			text:text,
			iconCls: iconCls,
			plain:true,
			handler: handler};
	}
	/**
	 * 表格单击行事件，如果表格处于可编辑状态，则单击行时，点击的行进入编辑状态
	 */
	function onClickRow(rowIndex, rowData){
	    var $targetGrid = $(this);
		var options = $targetGrid.datagrid('options');
		var editAble = options.editAble;
		//去除其他选中项和勾选项
		$targetGrid.datagrid('uncheckAll');
		$targetGrid.datagrid('selectRow',rowIndex);
		//点击行前事件
        var onBeforeClickRow = options.onBeforeClickRow;
    	onBeforeClickRow.call(this,rowIndex, rowData, editAble);
		if(editAble){
		    var isValidate = validateAllRow($targetGrid);//验证数据是否合法
		    if(isValidate){
    		    
    		    //结束编辑行
    		    allEndEdit($targetGrid);
    		    rowEditIndex=rowIndex;
    			$targetGrid.datagrid('beginEdit',rowIndex);
    			options.onAfterBeginEdit.call(this,rowIndex, rowData);
    			
            }
		}
		//点击行后事件
    	var onAfterClickRow = options.onAfterClickRow;
        onAfterClickRow.call(this,rowIndex, rowData, editAble);
	}
	/**
	 * 加载数据事件 
	 * @return  
	 */
	function onLoadSuccess(responseData){
		var id = $(this)[0].id;
		var options = $(this).datagrid('options');
		if(responseData.rows.length>0){//选中首行
			if(options.defaultSelectFirstRow){
				$(this).datagrid('selectRow',0);
				if($('#'+id+'Delete').length > 0){
					$('#'+id+'Delete').linkbutton('enable');
				}
			}
			/*if($('#'+id+'Modify').length > 0){
				$('#'+id+'Modify').linkbutton('enable');
			}*/
		}else{//删除按钮不可用
			if($('#'+id+'Delete').length > 0){
				$('#'+id+'Delete').linkbutton('disable');
			}
			/*if($('#'+id+'Modify').length > 0){
				$('#'+id+'Modify').linkbutton('disable');
			}*/
			//如果请求后表格没有数据，easyui默认不会显示所有列。这里showAllColumnWithNoData默认未true,
			//默认即使在无数据的情况下也显示全部列名
			if(options.showAllColumnWithNoData){
			/*	var fields = $(this).datagrid("getColumnFields");
				var total=0;//列总宽度
				var col='';
				for(var i=0;i<fields.length;i++){
					col = $(this).datagrid('getColumnOption',fields[i]);
					if(col.width){
						total+=col.width;
					}
				}
				$(this).datagrid({width:total});
				*/
					var fields = $('#checkPlan').datagrid("getColumnFields");
					var total=0;//列总宽度
					var col='';
					for(var i=0;i<fields.length;i++){
						col = $(this).datagrid('getColumnOption',fields[i]);
						if(col.width){
							total+=col.width;
							}
						}
						var dv2 = $(".datagrid-view2");
		dv2.children(".datagrid-body").html("<div style='width:"+total+"px;border:solid 0px;height:1px;'></div>");	
					//$(this).datagrid({width:total});
			}
		}
		var options = $(this).datagrid('options');
		options.onAfterOnLoadSuccess.call(this,responseData);
	}
	
	 /**
	  * 验证datagrid的数据合法性，循环调用datagrid的validateRow方法，如果存在不合法的数据，跳出循环，返回结果
	  * @param {jQuery} $target datagrid的jquery对象
      * @reteun 数据是否合法
	  */
	 function validateAllRow($target){
	     var isValidate = true;
	     var rows = $target.datagrid('getRows');
	     for(var rowIndex=0,rowCount=rows.length;rowIndex<rowCount;rowIndex++){
	         var rowValidate = $target.datagrid('validateRow',rowIndex);
	         if(!rowValidate){
	             isValidate = rowValidate;
	             break;
	         }
	     }
	     return isValidate;
	 }
	 
})(jQuery);