/**
 * treegridPlugin
 * www.isunland.com
 */
(function($){
	$.fn.treegridPlugin = function(option,param){
		if (typeof option == 'string'){
			var method = $.fn.treegridPlugin.methods[option];
			if (method){
				return method(this, param);
			} else {
				return this.treegrid(option, param);
			}
		}
		var newOptions = $.extend(true,{},$.fn.treegridPlugin.defaults,option);
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
		target.treegrid(newOptions);
		return target;
	};
	
	$.fn.treegridPlugin.methods = {
		save: function(target){ 
			return save(target);
		},
		cancel: function(target){ 
			return cancel(target);
		},
		allEndEdit: function(target){ 
			return allEndEdit(target);
		},
		endEditRowAndChildren: function(target){ 
			return endEditRowAndChildren(target[0],id);
		},
		getInsertedRows: function(target){ 
			return getInsertedRows(target);
		},
		getUpdatedRows: function(target){ 
			return getUpdatedRows(target);
		},
		getDeletedRows: function(target){ 
			return getDeletedRows(target);
		},
		getTreeGridRowById: function(target,idValue){ 
			return getTreeGridRowById(target,idValue);
		},
		rejectChangesFunc: function(target){ 
			return rejectChangesFunc(target);
		},
		acceptChangesFunc: function(target){ 
			return acceptChangesFunc(target);
		},
		getChangesFunc: function(target){ 
			return getChangesFunc(target);
		},
		saveOriginalData: function(target,data){
			return saveOriginalData(target,data);
		},
		isValidate: function($target){//数据是否合法
		    return validateAllRow($target);
		},
		
		getSelected:function(target){
			return getSelected(target);
		},
		getChecked:function(target){
			return getChecked(target);
		}
		
		
		
	};
	
	$.fn.treegridPlugin.defaults={
		saveUrl:'save.ht',//提交新增数据的url
		useDefaultToolbar:true,//是否使用默认的toolBar，只有为真值时，默认添加等按钮及其函数才能其作用
		//appendDefaults toolbarAdd appendHandler配合使用
		appendDefaults:null, //添加新行默认值，可以为json或者返回json的函数
		toolbarAddBrother:true,//使用新增按钮，为true显示
		appendBrotherHandler:appendBrotherRow,//新增行函数
		
		toolbarAddChild:true,//使用新增按钮，为true显示
		appendChildHandler:appendChildRow,//新增行函数
		
		//toolbarModify modifyHandler配合使用
		toolbarModify:true,//使用修改按钮，为true显示
		modifyHandler:modifyRow,//修改行函数
		
		toolbarDelete:true,//使用删除按钮，为true显示
		deleteHandler:deleteRow,//删除行函数
		
		toolbarCancel:true,//使用取消按钮，为true显示
		cancelHandler:cancel,//取消按钮事件
		toolbarSave:true,//使用保存按钮，为true显示
		saveHandler:save,//保存按钮事件
		editAble:false,//是否可编辑，点击行进入编辑时使用
		nameArray:{'addBrother':'添加同级','addChild':'添加下级','modify':'修改','delete':'删除','cancel':'取消','save':'保存'},//改默认按钮名称
		sortArray:[],//修改按钮显示顺序 sortArray:['add','modify','delete','cancel','save']
		customButtons:null,//自定义按钮
		
		//添加行前事件，返回值为：函数需要返回值，{allowAppend:true继续新增|false不新增,newRowData:{}新增行数据}
		onBeforeAppend:function(rowIndex,rowData,style){
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
		//编辑前事件，返回值为：{allowModify:true继续|false不能}
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
        rownumbers:true,
        singleSelect:true,//选择单行
        checkOnSelect:true,
        checkbox:true,
        selectOnCheck:false,
        onLoadSuccess:onLoadSuccess,
        width: "auto",
        height: 'auto',
        fit: true,
        border: false,
		animate: true,
		collapsible: true,
		idField: 'id',
		pidField: 'pid',   //只能是pid，在页面赋值其他字段无效，需增加pid字段
		treeField: 'orderNo'
	};
	/**
	 * 获取表格默认的toolbar
	 * @param {jQuery} jq 表格的jquery对象
	 * @param {Object} options $.fn.datagridPlugin.defaults与配置合并后对象
	 * @return {Array} 表格使用的工具栏
	 */
	function getToolbar(jq,options){
		var toolbar = [];
		if(options.toolbarAddBrother){
			toolbar.push(getToolItem("appendBrother",jq,options));
		}
		if(options.toolbarAddChild){
			toolbar.push(getToolItem("appendChild",jq,options));
		}
		if(options.toolbarModify){
			toolbar.push(getToolItem("modify",jq,options));
		}
		if(options.toolbarDelete){
			toolbar.push(getToolItem("delete",jq,options));
		}
		if(options.toolbarCancel){
			toolbar.push(getToolItem("cancel",jq,options));
		}
		if(options.toolbarSave){
			toolbar.push(getToolItem("save",jq,options));
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
					case 'addBrother':
						dictSort[prefix+"AppendBrother"]=i;
						break;
					case 'addChild':
						dictSort[prefix+"AppendChild"]=i;
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
/*				toolbar=toolbar.sort(function(a,b){
				if(dictSort[a.id]){//如果配置了
					if(Number(dictSort[a.id])>Number(dictSort[b.id])){
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
	 * 默认新增同级行函数
	 */
	function appendBrotherRow(){
		btnCommon(this,false);//取消保存可用
		var targetGrid = getTargetGrid(this);
		//删除按钮可用
		var deleteBtn = $(targetGrid.selector+"Delete");
		if(deleteBtn.length>0){
		    deleteBtn.linkbutton('enable');
		}
		
		//验证数据是否合法
		/*var isValidate = validateAllData(targetGrid);
		if(!isValidate){
		    return;
		}*/
		
		var options = targetGrid.treegrid('options');
		var newRow = {};
		var defaultRow = options.appendDefaults;
		if(defaultRow){
			if(typeof defaultRow == 'function'){
				newRow = defaultRow();
			}else if(typeof defaultRow == 'object'){
				newRow = defaultRow;
			}
		}
		var node =getSelected(targetGrid);  //targetGrid.treegrid('getSelected');
		var idParam = null;
		if(node){
			idParam = node[options.idField];
		}
		//新增行前事件
		var result = options.onBeforeAppend.call(this,idParam,newRow,"Brother");
		if(result.allowAppend){
			newRow = result.newRowData;
		}else{
			return;
		}
		
		var pid = null;
		if (node) {
			targetGrid.treegrid('endEdit', node[options.idField]);
			targetGrid.treegrid('unselect', node[options.idField]);
			try{
				pid = node[options.pidField];
			}catch(e){
			
			}
        }
		
		var param = {};
		param.parent = pid;
		param.data = [];
		param.data.push(newRow);
		targetGrid.treegrid('append', param);
		targetGrid.treegrid('beginEdit', newRow[options.idField]);
		
		options.onAfterBeginEdit.call(this,newRow[options.idField],newRow);
		//选中行
		targetGrid.treegrid('select', newRow[options.idField]);
		var $data = $.data(targetGrid[0],'datagrid');
		$data.insertedRows.push(newRow);
		//新增行后事件
		options.onAfterAppend.call(this,newRow[options.idField],newRow);
	}
	/**
	 * 默认新增下级行函数
	 */
	function appendChildRow(){
		btnCommon(this,false);//取消保存可用
		var targetGrid = getTargetGrid(this);
		//删除按钮可用
		var deleteBtn = $(targetGrid.selector+"Delete");
		if(deleteBtn.length>0){
		    deleteBtn.linkbutton('enable');
		}
		
		//验证数据是否合法
		/*var isValidate = validateAllData(targetGrid);
		if(!isValidate){
		    return;
		}*/
		
		var options = targetGrid.treegrid('options');
		var newRow = {};
		var defaultRow = options.appendDefaults;
		if(defaultRow){
			if(typeof defaultRow == 'function'){
				newRow = defaultRow();
			}else if(typeof defaultRow == 'object'){
				newRow = defaultRow;
			}
		}
		var node =getSelected(targetGrid);  //targetGrid.treegrid('getSelected');
		var idParam = null;
		if(node){
			idParam = node[options.idField];
		}
		//新增行前事件
		var result = options.onBeforeAppend.call(this,idParam,newRow,"Child");
		if(result.allowAppend){
			newRow = result.newRowData;
		}else{
			return;
		}
		
		var pid = null;
		if (node) {
			targetGrid.treegrid('endEdit', node[options.idField]);
			targetGrid.treegrid('unselect', node[options.idField]);
			pid = node[options.idField];
        }
		
		var param = {};
		param.parent = pid;
		param.data = [];
		param.data.push(newRow);
		targetGrid.treegrid('append', param);
		targetGrid.treegrid('beginEdit', newRow[options.idField]);
		
		options.onAfterBeginEdit.call(this,newRow[options.idField],newRow);
		//选中行
		targetGrid.treegrid('select', newRow[options.idField]);
		targetGrid.treegrid('expand', pid);
		var $data = $.data(targetGrid[0],'datagrid');
		$data.insertedRows.push(newRow);
		//新增行后事件
		options.onAfterAppend.call(this,newRow[options.idField],newRow);
	}	
	/**
	 * 默认修改行函数
	 */
	function modifyRow(){
		btnCommon(this,false);//取消保存可用
		var targetGrid = getTargetGrid(this);
		var options = targetGrid.treegrid('options');
		var selectedRow =getSelected(targetGrid);// targetGrid.treegrid('getSelected');
		if (selectedRow!=null){
			var selectedRowIndex=targetGrid.treegrid('getRowIndex',selectedRow);
			var result = options.onBeforeModify.call(this,selectedRowIndex,selectedRow);
			if(result.allowModify==false){
				$(targetGrid).treegrid('options').editAble=false;
				btnCommon(this,true);//取消保存不可用	
				return; 
			}
			var editId = selectedRow[options.idField];
			targetGrid.treegrid('beginEdit', editId);	
			options.onAfterBeginEdit.call(this,editId,selectedRow);
		}else{
			$(targetGrid).treegrid('options').editAble=false;
			btnCommon(this,true);//取消保存不可用	
			$.messager.alert('系统提示','请先选择要编辑的行!','info');
		}
	}
		/**
		 * 克隆对象。
		 */
		function cloneObject(obj){
			var o;
			if(obj){
				o=(obj.length ? [] : {});
				for(var i in obj){
			        if(obj.hasOwnProperty(i)){
			            o[i] = typeof obj[i] === "object" ? cloneObject(obj[i]) : obj[i];
			        }
		  	 	}
			}else{
				o=obj;
			}
			return o;
		}
	
	/**
	 * 默认删除行函数
	 */
	function deleteRow(){
		btnCommon(this,false);//取消保存可用
		var targetGrid = getTargetGrid(this);
		var options = targetGrid.treegrid('options');
		$(targetGrid).treegrid('options').editAble=false; //zangshulai@126.com  点击删除后，不开启编辑状态
		
		var selectedRow =getSelected(targetGrid);//targetGrid.treegrid('getSelected');
		if (selectedRow!=null){
			var editId = selectedRow[options.idField];
			targetGrid.treegrid('endEdit', editId);	
			//targetGrid.treegrid('unselect', editId);
		}
				
		//start 复选框选中的记录批量删除，如果没有开启复选框模式，读取选中行 zangshulai@126.com  
		var selections =null;
		var checkedRows =getChecked(targetGrid);// targetGrid.treegrid('getChecked');
		if(checkedRows.length==0){
			selections = targetGrid.treegrid('getSelections');
		}else{
			selections=targetGrid.treegrid('getSelections');
			if (selections.length<checkedRows.length){
				selections= cloneObject(checkedRows);//深度clone，修正	targetGrid.treegrid('remove', node[options.idField]);执行后导致selections中也删除引起删除不完全问题 zhs
			}
		}
		//end
		
		if (selections!=null && selections.length>0){
			var $data = $.data(targetGrid[0],'datagrid');
			for (var s = 0; s < selections.length; s++) {
				var node = selections[s];
				var result = itemExistInArray($data.insertedRows,node[options.idField],options.idField);
				if(result > -1){
					$data.insertedRows.splice(result, 1);
					var tempArray = targetGrid.treegrid('getChildren', node[options.idField]);
					if (tempArray!=null && tempArray.length>0){
						for(var x = 0; x < tempArray.length; x++){
							var childNode = tempArray[x];
							var cResult = itemExistInArray($data.insertedRows,childNode[options.idField],options.idField);
							if(cResult > -1){
								$data.insertedRows.splice(cResult, 1);
							}else{
								$data.insertedRows.push(childNode);
							}
						}
					}
				}else{
					//删除行前事件
					var canDelete = options.onBeforeDelete.call(this,node[options.idField],node);
					if(!canDelete.allowDelete){
						continue;
					}
					var result = itemExistInArray($data.deletedRows,node[options.idField],options.idField);
					if(result > -1){
						continue;
					}else{
						$data.deletedRows.push(node);
						var tempArray = targetGrid.treegrid('getChildren', node[options.idField]);
						if (tempArray!=null && tempArray.length>0){
							for(var x = 0; x < tempArray.length; x++){
								var childNode = tempArray[x];
								var cResult = itemExistInArray($data.deletedRows,childNode[options.idField],options.idField);
								if(cResult > -1){
									$data.deletedRows.splice(cResult, 1);
								}else{
									$data.deletedRows.push(childNode);
								}
							}
						}
						targetGrid.treegrid('remove', node[options.idField]);
						//删除行后事件
						options.onAfterDelete.call(this,node[options.idField],node);
					}
				}
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
		//targetGrid.datagrid('reload');
		rejectChangesFunc(targetGrid);
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
		//var beRefreshed = true;//能否刷新
		if(!targetGrid||!targetGrid.length){
			targetGrid = getTargetGrid(this);
				
		}
		/*if (!validateAllData(targetGrid)) {
			$.messager.alert('系统提示','请核查数据是否填写完整、正确！');
            return;
        }*/
		var options = targetGrid.treegrid('options');
		allEndEdit(targetGrid);//结束编辑
		var targetSelectorStr = targetGrid.selector;
	
		var beSave = canBeSaved(targetGrid,options);//调用保存前事件，判断能否保存
		if(!beSave){
			//取消、保存按钮可用
			$(targetSelectorStr+"Cancel").linkbutton('enable');
			$(targetSelectorStr+"Save").linkbutton('enable');
			return;
		}

		//新增数据
		var insertedRows = getInsertedRows(targetGrid);
		//修改数据
        var updatedRows = getUpdatedRows(targetGrid);
        //删除数据
        var deletedRows = getDeletedRows(targetGrid);
        //保存前事件使用数据
        var beforSaveData={inserted:insertedRows,updated:updatedRows,deleted:deletedRows};
        
		var result = options.onBeforeSave.call(this,beforSaveData);
		if(result.allowSave){
		    var submitData = {};
		    submitData.url = options.saveUrl;
            submitData.data = {inserted:JSON2.stringify(beforSaveData.inserted),updated:JSON2.stringify(beforSaveData.updated),deleted:JSON2.stringify(beforSaveData.deleted)};
            //保存后事件
            submitData.success  = options.onAfterSave;
            
            //取消保存不可用
            var $btn = getToolBtn(targetSelectorStr);
            if($btn.length>0){
                btnCommon($btn,true);//取消保存不可用
            }
            
			//提交数据到服务器
            $.fn.ajaxExt(submitData);
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
		var insertedRows = getInsertedRows(targetGrid);
		for(var insertedRowIndex=0;insertedRowIndex<insertedRows.length;insertedRowIndex++){
			var insertedRow = insertedRows[insertedRowIndex];
			//保存前事件
			var result = options.canBeSavedSingle.call(this,insertedRow[options.idField],insertedRow,'inserted');
			if(!result.allowSave){
				return false;
			}
		}
		//修改数据
		var updatedRows = getUpdatedRows(targetGrid);
		for(var updatedRowIndex=0;updatedRowIndex<updatedRows.length;updatedRowIndex++){
			var updatedRow = updatedRows[updatedRowIndex];
			//保存前事件
			var result = options.canBeSavedSingle.call(this,updatedRow[options.idField],updatedRow,'updated');
			if(!result.allowSave){
				return false;
			}
		}

		//删除数据
		var deletedRows = getDeletedRows(targetGrid);
		for(var deletedRowIndex=0;deletedRowIndex<deletedRows.length;deletedRowIndex++){
			var deletedRow = deletedRows[deletedRowIndex];
			//保存前事件
			var result = options.canBeSavedSingle.call(this,deletedRow[options.idField],deletedRow,'deleted');
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
		var options = datagrid.treegrid('options');
		var row = datagrid.treegrid('getRoots');
		if(row){
			var rowLength = row.length;
			for(var rowIndex=0;rowIndex<rowLength;rowIndex++){
				var id = row[rowIndex][options.idField];
				endEditRowAndChildren(datagrid[0],id);
			}
		}
	}
	
	function endEditRowAndChildren(target,id){
		$(target).treegrid('endEdit',id);
		$(target).treegrid('unselect',id);
		var row = $(target).treegrid('getChildren',id);
		var options = $(target).treegrid('options');
		if(row){
			for(var i=0;i<row.length;i++){
				var rowid = row[i][options.idField];
				$(target).treegrid('endEdit',rowid);
				$(target).treegrid('unselect',rowid);
			}
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
		$(targetGrid).treegrid('options').editAble=editAble;
	}
	/**
	 * 表格可否编辑，根据此状态判断点击行时是否进入编辑状态，$.fn.datagridPlugin.defaults.editAble属性
	 * @param {Object} btn 工具栏按钮对象
	 * @return {Boolean} 表格是否可编辑
	 */
	function isEditable(btn){
		var targetGrid = $(btn).linkbutton('options').targetTo;
		return $(targetGrid).treegrid('options').editAble;
	}
	
	/**
	 * 获取工具栏按钮中的一个按钮，在某个按钮隐藏后，执行按钮对应的btnCommon方法参数从此方法获取
	 * @param {string} targetGridSelector
	 * @return {object} 按钮的jquery对象
	 */
	function getToolBtn(targetGridSelector){
	    var btns = ['AppendBrother','AppendChild','Modify','Delete','Cancel','Save'];
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
		if(type == "appendbrother"){//增加按钮
			id=prefix+'AppendBrother';
			text=options.nameArray['addBrother']?options.nameArray['addBrother']:"添加同级";
			iconCls='icon-add';
			handler=options.appendBrotherHandler;
		}else if(type == "appendchild"){//增加按钮
			id=prefix+'AppendChild';
			text=options.nameArray['addChild']?options.nameArray['addChild']:"添加下级";
			iconCls='icon-add';
			handler=options.appendChildHandler;
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
		}else if(type == "save"){//保存
			id=prefix+'Save';
			text=options.nameArray['save']?options.nameArray['save']:"保存";
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
	function onClickRow(rowData){
	    var $targetGrid = $(this);
		var options = $targetGrid.treegrid('options');
		if (rowData!=null){
			//点击行前事件
			var onBeforeClickRow = options.onBeforeClickRow;
			onBeforeClickRow.call(this,rowData[options.idField], rowData, editAble);
			//结束编辑行
			allEndEdit($targetGrid);
			var editAble = options.editAble;
			$targetGrid.treegrid('select', rowData[options.idField]);
			if(editAble){
				$targetGrid.datagrid('beginEdit',rowData[options.idField]);
			}
			options.onAfterBeginEdit.call(this,rowData[options.idField], rowData);
				//点击行后事件
			var onAfterClickRow = options.onAfterClickRow;
			onAfterClickRow.call(this,rowData[options.idField], rowData, editAble);
		}
	}
	/**
	 * 加载数据事件 
	 * @return  
	 */
	function onLoadSuccess(row,responseData){
		var id = $(this)[0].id;
		var options = $(this).treegrid('options');
		if(responseData.length>0 || (responseData.rows && responseData.rows.length>0)){//选中首行			
			if($('#'+id+'Delete').length > 0){
				$('#'+id+'Delete').linkbutton('enable');
			}
		}else{//删除按钮不可用
			if($('#'+id+'Delete').length > 0){
				$('#'+id+'Delete').linkbutton('disable');
			}
		}
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
	/**
	 * 判断数组中属否存在指定数据
	 * 
	 * */ 
	function itemExistInArray(arr,idValue,idField){
		var result = -1;
		for(var i = 0; i < arr.length; i++){
			var item = arr[i];
			if(item[idField] == idValue){
				result = i;
				break;
			}
		}
		return result;
	}
	/**
	 * 获取新增数据
	 * */
	function getInsertedRows(target){
		var $data = $.data(target[0],'datagrid');
		var insertes = $data.insertedRows;
		var insertedRows = insertes;
		return insertedRows;
	}
	/**
	 * 获取修改数据
	 * */
	function getUpdatedRows(target){
		return target.treegrid('getChanges', 'updated');
	}
	/**
	 * 获取删除数据
	 * */
	function getDeletedRows(target){
		var $data = $.data(target[0],'datagrid');
		var deletes = $data.deletedRows;
		var deletedRows = deletes;
		return deletedRows;		
	}
	
	//通过ID获取Treegrid中row
    function getTreeGridRowById(target,idValue){
		var body = target.datagrid('getPanel').find('div.datagrid-body');
		var tr = body.find('tr[node-id=' + idValue + ']');
		var row = $.data(tr[0], 'treegrid-node');
		return row;
    }
    //取消事件
    function rejectChangesFunc(target){
    	var originalData = $.data(target[0],'datagrid').originalData;
		if (originalData!=null){
			var data = $.extend(true,{},originalData);
			if (data!=null){
				target.treegrid('loadData',data);
				var $data = $.data(target[0],'datagrid');
				$data.insertedRows = [];
				$data.updatedRows = [];
				$data.deletedRows = [];
			}
		}else{
			target.treegrid('rejectChanges');
			target.treegrid('reload');
			var $data = $.data(target[0],'datagrid');
			$data.insertedRows = [];
			$data.updatedRows = [];
			$data.deletedRows = [];
		}
    }
    //清空改变
    function acceptChangesFunc(target){
    	var $data = $.data(target[0],'datagrid');
    	$data.insertedRows = [];
    	$data.updatedRows = [];
    	$data.deletedRows = [];
    	var data = target.treegrid('getRoots');
    	var originalData = changeTreeDataToGridData(data);
    	var gridData = {};
    	gridData.rows = originalData;
    	gridData.total = originalData.length;
    	saveOriginalData(target,gridData);   	
    }
    //得到改变
    function getChangesFunc(target){
    	var $data = $.data(target[0],'datagrid');
    	var insertedRows = $data.insertedRows;
    	var updatedRows = $data.updatedRows;
    	var deletedRows = $data.deletedRows;
    	var rows = [];
        rows = rows.concat(insertedRows);
        rows = rows.concat(updatedRows);
        rows = rows.concat(deletedRows);
        return rows;
    }
    //保存原始数据
    function saveOriginalData(target,data){
    	var $data = $.data(target[0],'datagrid');
    	var originalData = $.extend(true,{},data);
    	$data.originalData = originalData;
    }
    //把树形数据转换成平级数据（去掉children属性和state属性）
    function changeTreeDataToGridData(originalData){
    	var gridData = [];
    	var data =  $.extend([], originalData);
    	for (var i = 0; i < data.length; i++) {
    		var row = data[i];
    		if(row.children){
    			gridData = gridData.concat(changeTreeDataToGridData(row.children));
    		}
    		var rowCopy = $.extend({}, row);
    		rowCopy.children = undefined;
    		rowCopy.state = undefined;
    		gridData.push(rowCopy);
    	}
        return gridData;
    }
    
    //重写获取选中项方法
    function getSelected(target){
    	var state = $.data(target[0], 'datagrid');
		var opts = state.options;
		var data = state.data;
		
		var rows = [];
		opts.finder.getTr(target[0], '', 'selected', 2).each(function(){
			rows.push(opts.finder.getRow(target[0], $(this)));
		});
		return rows.length>0 ? rows[0] : null;
    }
    
    //重写getChecked方法
    function getChecked(target){
    	var state = $.data(target[0], 'datagrid');
		var opts = state.options;
		var rows = [];
		opts.finder.getTr(target[0], '', 'checked', 2).each(function(){
			rows.push(opts.finder.getRow(target[0], $(this)));
		});
		return rows;
    }
    
})(jQuery);