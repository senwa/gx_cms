/**
 * The Patch for jQuery EasyUI 1.4
 */
(function($){
	var plugin = $.fn._size;
	$.fn._size = function(options, parent){
		if (typeof options != 'string'){
			return this.each(function(){
				parent = parent || $(this).parent();
				if (parent.length){
					plugin.call($(this), options, parent);
				}
			});
		} else if (options == 'unfit'){
			return this.each(function(){
				var p = $(this).parent();
				if (p.length){
					plugin.call($(this), options, parent);
				}
			});
		} else {
			return plugin.call(this, options, parent);
		}
	}
})(jQuery);

/**20141021，lwp修改屏蔽，由於在grid中自定义扩展控件，第一个areatext会获取焦点，导致触发输入框areatext的blur事件，在该事件中会把输入框remove掉
(function($){
	$.map(['textbox','filebox','searchbox',
			'combo','combobox','combogrid','combotree',
			'datebox','datetimebox','numberbox',
			'spinner','numberspinner','timespinner','datetimespinner'], function(plugin){
		if ($.fn[plugin]){
			if ($.fn[plugin].defaults.events){
				$.fn[plugin].defaults.events.click = function(e){
					if (!$(e.data.target).is(':focus')){
						$(e.data.target).trigger('focus');
					}
				};
			}
		}
	});
	$.fn.combogrid.defaults.height = 22;
	$(function(){
		$(document).bind('mousewheel', function(e){
			$(e.target).trigger('mousedown.combo');
		});
	});
})(jQuery);

***/

(function($){
	$.extend($.fn.form.methods, {
		clear: function(jq){
			return jq.each(function(){
				var target = this;
				$('input,select,textarea', target).each(function(){
					var t = this.type, tag = this.tagName.toLowerCase();
					if (t == 'text' || t == 'hidden' || t == 'password' || tag == 'textarea'){
						this.value = '';
					} else if (t == 'file'){
						var file = $(this);
						if (!file.hasClass('textbox-value')){
							var newfile = file.clone().val('');
							newfile.insertAfter(file);
							if (file.data('validatebox')){
								file.validatebox('destroy');
								newfile.validatebox();
							} else {
								file.remove();
							}
						}
					} else if (t == 'checkbox' || t == 'radio'){
						this.checked = false;
					} else if (tag == 'select'){
						this.selectedIndex = -1;
					}
				});
				
				var t = $(target);
				var plugins = ['textbox','combo','combobox','combotree','combogrid','slider'];
				for(var i=0; i<plugins.length; i++){
					var plugin = plugins[i];
					var r = t.find('.'+plugin+'-f');
					if (r.length && r[plugin]){
						r[plugin]('clear');
					}
				}
				$(target).form('validate');
			});
		}
	});
	$.extend($.fn.form.defaults, {
		onSubmit:function(){
			$(this).find('.textbox-text:focus').blur();
			return $(this).form('validate');
		}
	});
})(jQuery);

(function($){
	function setSize(target, param){
		var opts = $.data(target, 'linkbutton').options;
		if (param){
			$.extend(opts, param);
		}
		if (opts.width || opts.height || opts.fit){
			var btn = $(target);
			var parent = btn.parent();
			var isVisible = btn.is(':visible');
			if (!isVisible){
				var spacer = $('<div style="display:none"></div>').insertBefore(target);
				var style = {
					position: btn.css('position'),
					display: btn.css('display'),
					left: btn.css('left')
				};
				btn.appendTo('body');
				btn.css({
					position:'absolute',
					display:'inline-block',
					left:-20000
				});
			}
			btn._size(opts, parent);
			var left = btn.find('.l-btn-left');
			left.css('margin-top', 0);
			left.css('margin-top', parseInt((btn.height()-left.height())/2)+'px');
			if (!isVisible){
				btn.insertAfter(spacer);
				btn.css(style);
				spacer.remove();
			}
		}
	}

	var plugin = $.fn.linkbutton;
	$.fn.linkbutton = function(options, param){
		if (typeof options != 'string'){
			return this.each(function(){
				plugin.call($(this), options, param);
				setSize(this);
			});
		} else {
			return plugin.call(this, options, param);
		}
	};
	$.fn.linkbutton.methods = plugin.methods;
	$.fn.linkbutton.defaults = plugin.defaults;
	$.fn.linkbutton.parseOptions = plugin.parseOptions;
	$.extend($.fn.linkbutton.methods, {
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			})
		}
	})
})(jQuery);

(function($){
	var plugin = $.fn.dialog;
	$.fn.dialog = function(options, param){
		var result = plugin.call(this, options, param);
		if (typeof options != 'string'){
			this.each(function(){
				var opts = $(this).panel('options');
				if (isNaN(parseInt(opts.height))){
					$(this).css('height', '');
				}
				var onResize = opts.onResize;
				opts.onResize = function(w, h){
					onResize.call(this, w, h);
					if (isNaN(parseInt(opts.height))){
						$(this).css('height', '');
					}
					var shadow = $.data(this, 'window').shadow;
					if (shadow){
						var cc = $(this).panel('panel');
						shadow.css({
							width: cc._outerWidth(),
							height: cc._outerHeight()
						});
					}
				}
				if (opts.closed){
					var pp = $(this).panel('panel');
					pp.show();
					$(this).panel('resize');
					pp.hide();
				}
			});
		}
		return result;
	};
	$.fn.dialog.methods = plugin.methods;
	$.fn.dialog.parseOptions = plugin.parseOptions;
	$.fn.dialog.defaults = plugin.defaults;
})(jQuery);

(function($){
	function createTab(container, pp, options) {
		var state = $.data(container, 'tabs');
		options = options || {};
		
		// create panel
		pp.panel({
			border: false,
			noheader: true,
			closed: true,
			doSize: false,
			iconCls: (options.icon ? options.icon : undefined)
		});
		
		var opts = pp.panel('options');
		$.extend(opts, options, {
			onLoad: function(){
				if (options.onLoad){
					options.onLoad.call(this, arguments);
				}
				state.options.onLoad.call(container, $(this));
			}
		});
		
		var tabs = $(container).children('div.tabs-header').find('ul.tabs');
		
		opts.tab = $('<li></li>').appendTo(tabs);	// set the tab object in panel options
		opts.tab.append(
				'<a  class="tabs-inner">' +
				'<span class="tabs-title"></span>' +
				'<span class="tabs-icon"></span>' +
				'</a>'
		);
		
		$(container).tabs('update', {
			tab: pp,
			options: opts
		});
	}
	function addTab(container, options) {
		var opts = $.data(container, 'tabs').options;
		var tabs = $.data(container, 'tabs').tabs;
		if (options.selected == undefined) options.selected = true;
		
		var pp = $('<div></div>').appendTo($(container).children('div.tabs-panels'));
		tabs.push(pp);
		createTab(container, pp, options);
		
		opts.onAdd.call(container, options.title, tabs.length-1);
		
		$(container).tabs('resize');
		if (options.selected){
			$(container).tabs('select', tabs.length-1);
		}
	}
	$.extend($.fn.tabs.methods, {
		add: function(jq, options){
			return jq.each(function(){
				addTab(this, options);
			})
		}
	})
})(jQuery);

(function($){
	$.extend($.fn.menubutton.methods, {
		enable: function(jq){
			return jq.each(function(){
				$(this).data('menubutton').options.disabled = false;
				$(this).linkbutton('enable');
			});
		}
	});
})(jQuery);

(function($){
    var onAfterRender = $.fn.datagrid.defaults.view.onAfterRender;
    $.extend($.fn.datagrid.defaults.view, {
		updateRow: function(target, rowIndex, row){
			var opts = $.data(target, 'datagrid').options;
			var rows = $(target).datagrid('getRows');
			
			var oldStyle = _getRowStyle(rowIndex);
			$.extend(rows[rowIndex], row);
			var newStyle = _getRowStyle(rowIndex);
			var oldClassValue = oldStyle.c;
			var styleValue = newStyle.s;
			var classValue = 'datagrid-row ' + (rowIndex % 2 && opts.striped ? 'datagrid-row-alt ' : ' ') + newStyle.c;
			
			function _getRowStyle(rowIndex){
				var css = opts.rowStyler ? opts.rowStyler.call(target, rowIndex, rows[rowIndex]) : '';
				var classValue = '';
				var styleValue = '';
				if (typeof css == 'string'){
					styleValue = css;
				} else if (css){
					classValue = css['class'] || '';
					styleValue = css['style'] || '';
				}
				return {c:classValue, s:styleValue};
			}
			function _update(frozen){
				var fields = $(target).datagrid('getColumnFields', frozen);
				var tr = opts.finder.getTr(target, rowIndex, 'body', (frozen?1:2));
				var checked = tr.find('div.datagrid-cell-check input[type=checkbox]').is(':checked');
				tr.html(this.renderRow.call(this, target, fields, frozen, rowIndex, rows[rowIndex]));
				tr.attr('style', styleValue).removeClass(oldClassValue).addClass(classValue);
				if (checked){
					tr.find('div.datagrid-cell-check input[type=checkbox]')._propAttr('checked', true);
				}
			}
			
			_update.call(this, true);
			_update.call(this, false);
			$(target).datagrid('fixRowHeight', rowIndex);
		},
    	onAfterRender: function(target){
    		onAfterRender.call($.fn.datagrid.defaults.view, target);
    		setTimeout(function(){
    			var opts = $(target).datagrid('options');
    			opts.pageNumber = opts.pageNumber || 1;
    		},0);
    	}
    });
    
	$.fn.datagrid.defaults.loader = function(param, success, error){
		var opts = $(this).datagrid('options');
		if (!opts.url) return false;
		if (opts.pagination && opts.pageNumber == 0){
			opts.pageNumber = 1;
			param.page = 1;
		}
		if (param.page == 0){
			return false;
		}
		$.ajax({
			type: opts.method,
			url: opts.url,
			data: param,
			dataType: 'json',
			success: function(data){
				success(data);
			},
			error: function(){
				error.apply(this, arguments);
			}
		});
	};
})(jQuery);
(function($){
	function indexOfArray(a,o){
		for(var i=0,len=a.length; i<len; i++){
			if (a[i] == o) return i;
		}
		return -1;
	}
	function endEdit(target, index){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var updatedRows = state.updatedRows;
		var insertedRows = state.insertedRows;
		
		var tr = opts.finder.getTr(target, index);
		var row = opts.finder.getRow(target, index);
		if (!tr.hasClass('datagrid-row-editing')) {
			return;
		}
		
		if (!$(target).datagrid('validateRow', index)){return}
		
		var changed = false;
		var changes = {};
		tr.find('div.datagrid-editable').each(function(){
			var field = $(this).parent().attr('field');
			var ed = $.data(this, 'datagrid.editor');
			var t = $(ed.target);
			var input = t.data('textbox') ? t.textbox('textbox') : t;
			input.triggerHandler('blur');
			var value = ed.actions.getValue(ed.target);
			if (row[field] != value){
				row[field] = value;
				changed = true;
				changes[field] = value;
			}
		});
		if (changed){
			if (indexOfArray(insertedRows, row) == -1){
				if (indexOfArray(updatedRows, row) == -1){
					updatedRows.push(row);
				}
			}
		}
		opts.onEndEdit.call(target, index, row, changes);
		
		tr.removeClass('datagrid-row-editing');
		
		destroyEditor(target, index);
		$(target).datagrid('refreshRow', index);
		
		opts.onAfterEdit.call(target, index, row, changes);
	}
	function destroyEditor(target, index){
		var opts = $.data(target, 'datagrid').options;
		var tr = opts.finder.getTr(target, index);
		tr.children('td').each(function(){
			var cell = $(this).find('div.datagrid-editable');
			if (cell.length){
				var ed = $.data(cell[0], 'datagrid.editor');
				if (ed.actions.destroy) {
					ed.actions.destroy(ed.target);
				}
				cell.html(ed.oldHtml);
				$.removeData(cell[0], 'datagrid.editor');
				
				cell.removeClass('datagrid-editable');
				cell.css('width','');
			}
		});
	}
	
	$.extend($.fn.datagrid.methods, {
		endEdit: function(jq, index){
			return jq.each(function(){
				endEdit(this, index);
			})
		}
	})
})(jQuery);

(function($){
	function setGrid(target){
		var opts = $.data(target, 'propertygrid').options;
		$(target).datagrid('options').onBeforeEdit = function(index, row){
			if (opts.onBeforeEdit.call(target, index, row) == false){return false;}
			var dg = $(this);
			var col = dg.datagrid('getColumnOption', 'value');
			col.editor = row.editor;			
		}
	}

	var plugin = $.fn.propertygrid;
	$.fn.propertygrid = function(options, param){
		if (typeof options == 'string'){
			return plugin.call(this, options, param);
		} else {
			return this.each(function(){
				plugin.call($(this), options, param);
				setGrid(this);
			});
		}
	};
	$.fn.propertygrid.defaults = plugin.defaults;
	$.fn.propertygrid.methods = plugin.methods;
	$.fn.propertygrid.parseOptions = plugin.parseOptions;
})(jQuery);

(function($){
	$.fn.numberbox.defaults.filter = function(e){
		var opts = $(this).numberbox('options');
		var s = $(this).numberbox('getText');
		if (e.which == 45){	//-
			return (s.indexOf('-') == -1 ? true : false);
		}
		var c = String.fromCharCode(e.which);
		if (c == opts.decimalSeparator){
			return (s.indexOf(c) == -1 ? true : false);
		} else if (c == opts.groupSeparator){
			return true;
		} else if ((e.which >= 48 && e.which <= 57 && e.ctrlKey == false && e.shiftKey == false) || e.which == 0 || e.which == 8) {
			return true;
		} else if (e.ctrlKey == true && (e.which == 99 || e.which == 118)) {
			return true;
		} else {
			return false;
		}
	}
})(jQuery);


/**zhs修改propertygrid
 * 使用blobedit等弹出编辑器再写回editor中时,会出现在弹出的编辑框中修改后的内容无法改变到editor中,
 * 源码中发现作者针对combo都做了相对应的处理，以后再遇到类似情况,向下加就行
 * 	var p = $(e.target).closest('div.datagrid-view,div.combo-panel');
	var b=$(e.target).closest('blobeditPop');//是blobedit的弹出
 * */
/**
 * propertygrid - jQuery EasyUI
 * 
 * Dependencies:
 * 	 datagrid
 * 
 */
(function($){
	var currTarget;
	
	function buildGrid(target){
		var state = $.data(target, 'propertygrid');
		var opts = $.data(target, 'propertygrid').options;
		$(target).datagrid($.extend({}, opts, {
			cls:'propertygrid',
			view:(opts.showGroup ? opts.groupView : opts.view),
			onClickCell:function(index, field, value){
				if (currTarget != this){
					stopEditing(currTarget);
					currTarget = this;
				}
				var row = $(this).datagrid('getRows')[index];
				if (opts.editIndex != index && row.editor){
					var col = $(this).datagrid('getColumnOption', 'value');
					col.editor = row.editor;
					stopEditing(currTarget);
					$(this).datagrid('beginEdit', index);
					var ed = $(this).datagrid('getEditor', {index:index,field:field});
					if (!ed){
						ed = $(this).datagrid('getEditor', {index:index,field:'value'});
					}
					if (ed){
						getInputBox(ed.target).focus();
						opts.editIndex = index;
					}
				}
				opts.onClickCell.call(target, index, field, value);
			},
			loadFilter:function(data){
				stopEditing(this);
				return opts.loadFilter.call(this, data);
			}
		}));
		$(document).unbind('.propertygrid').bind('mousedown.propertygrid', function(e){
			var p = $(e.target).closest('div.datagrid-view,div.combo-panel');
			var b=$(e.target).closest('.blobeditPop');//是blobedit的弹出
			if (p.length||b.length){return;}
			
			$(e.target).focus();
			stopEditing(currTarget);
			currTarget = undefined;
		});
	}
	
	function getInputBox(t){
		return $(t).data('textbox') ? $(t).textbox('textbox') : $(t);
	}
	
	function stopEditing(target){
		var t = $(target);
		if (!t.length){return}
		var opts = $.data(target, 'propertygrid').options;
		var index = opts.editIndex;
		if (index == undefined){return;}
		var editors = t.datagrid('getEditors', index);
		if (editors.length){
			$.map(editors, function(ed){
				//getInputBox(ed.target).blur();
			});
			if (t.datagrid('validateRow', index)){
				t.datagrid('endEdit', index);
			} else {
				t.datagrid('cancelEdit', index);
			}
		}
		opts.editIndex = undefined;
	}
	
	$.fn.propertygrid = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.propertygrid.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.datagrid(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'propertygrid');
			if (state){
				$.extend(state.options, options);
			} else {
				var opts = $.extend({}, $.fn.propertygrid.defaults, $.fn.propertygrid.parseOptions(this), options);
				opts.frozenColumns = $.extend(true, [], opts.frozenColumns);
				opts.columns = $.extend(true, [], opts.columns);
				$.data(this, 'propertygrid', {
					options: opts
				});
			}
			buildGrid(this);
		});
	}
	
	$.fn.propertygrid.methods = {
		options: function(jq){
			return $.data(jq[0], 'propertygrid').options;
		}
	};
	
	$.fn.propertygrid.parseOptions = function(target){
		return $.extend({}, $.fn.datagrid.parseOptions(target), $.parser.parseOptions(target,[{showGroup:'boolean'}]));
	};
	
	// the group view definition
	var groupview = $.extend({}, $.fn.datagrid.defaults.view, {
		render: function(target, container, frozen){
			var table = [];
			var groups = this.groups;
			for(var i=0; i<groups.length; i++){
				table.push(this.renderGroup.call(this, target, i, groups[i], frozen));
			}
			$(container).html(table.join(''));
		},
		
		renderGroup: function(target, groupIndex, group, frozen){
			var state = $.data(target, 'datagrid');
			var opts = state.options;
			var fields = $(target).datagrid('getColumnFields', frozen);
			
			var table = [];
			table.push('<div class="datagrid-group" group-index=' + groupIndex + '>');
			table.push('<table cellspacing="0" cellpadding="0" border="0" style="height:100%"><tbody>');
			table.push('<tr>');
			if ((frozen && (opts.rownumbers || opts.frozenColumns.length)) ||
					(!frozen && !(opts.rownumbers || opts.frozenColumns.length))){
				table.push('<td style="border:0;text-align:center;width:25px"><span class="datagrid-row-expander datagrid-row-collapse" style="display:inline-block;width:16px;height:16px;cursor:pointer">&nbsp;</span></td>');
			}
			table.push('<td style="border:0;">');
			if (!frozen){
				table.push('<span class="datagrid-group-title">');
				table.push(opts.groupFormatter.call(target, group.value, group.rows));
				table.push('</span>');
			}
			table.push('</td>');
			table.push('</tr>');
			table.push('</tbody></table>');
			table.push('</div>');
			
			table.push('<table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0"><tbody>');
			var index = group.startIndex;
			for(var j=0; j<group.rows.length; j++) {
				var css = opts.rowStyler ? opts.rowStyler.call(target, index, group.rows[j]) : '';
				var classValue = '';
				var styleValue = '';
				if (typeof css == 'string'){
					styleValue = css;
				} else if (css){
					classValue = css['class'] || '';
					styleValue = css['style'] || '';
				}
				
				var cls = 'class="datagrid-row ' + (index % 2 && opts.striped ? 'datagrid-row-alt ' : ' ') + classValue + '"';
				var style = styleValue ? 'style="' + styleValue + '"' : '';
				var rowId = state.rowIdPrefix + '-' + (frozen?1:2) + '-' + index;
				table.push('<tr id="' + rowId + '" datagrid-row-index="' + index + '" ' + cls + ' ' + style + '>');
				table.push(this.renderRow.call(this, target, fields, frozen, index, group.rows[j]));
				table.push('</tr>');
				index++;
			}
			table.push('</tbody></table>');
			return table.join('');
		},
		
		bindEvents: function(target){
			var state = $.data(target, 'datagrid');
			var dc = state.dc;
			var body = dc.body1.add(dc.body2);
			var clickHandler = ($.data(body[0],'events')||$._data(body[0],'events')).click[0].handler;
			body.unbind('click').bind('click', function(e){
				var tt = $(e.target);
				var expander = tt.closest('span.datagrid-row-expander');
				if (expander.length){
					var gindex = expander.closest('div.datagrid-group').attr('group-index');
					if (expander.hasClass('datagrid-row-collapse')){
						$(target).datagrid('collapseGroup', gindex);
					} else {
						$(target).datagrid('expandGroup', gindex);
					}
				} else {
					clickHandler(e);
				}
				e.stopPropagation();
			});
		},
		
		onBeforeRender: function(target, rows){
			var state = $.data(target, 'datagrid');
			var opts = state.options;
			
			initCss();
			
			var groups = [];
			for(var i=0; i<rows.length; i++){
				var row = rows[i];
				var group = getGroup(row[opts.groupField]);
				if (!group){
					group = {
						value: row[opts.groupField],
						rows: [row]
					};
					groups.push(group);
				} else {
					group.rows.push(row);
				}
			}
			
			var index = 0;
			var newRows = [];
			for(var i=0; i<groups.length; i++){
				var group = groups[i];
				group.startIndex = index;
				index += group.rows.length;
				newRows = newRows.concat(group.rows);
			}
			
			state.data.rows = newRows;
			this.groups = groups;
			
			var that = this;
			setTimeout(function(){
				that.bindEvents(target);
			},0);
			
			function getGroup(value){
				for(var i=0; i<groups.length; i++){
					var group = groups[i];
					if (group.value == value){
						return group;
					}
				}
				return null;
			}
			function initCss(){
				if (!$('#datagrid-group-style').length){
					$('head').append(
						'<style id="datagrid-group-style">' +
						'.datagrid-group{height:25px;overflow:hidden;font-weight:bold;border-bottom:1px solid #ccc;}' +
						'</style>'
					);
				}
			}
		}
	});

	$.extend($.fn.datagrid.methods, {
	    expandGroup:function(jq, groupIndex){
	        return jq.each(function(){
	            var view = $.data(this, 'datagrid').dc.view;
	            var group = view.find(groupIndex!=undefined ? 'div.datagrid-group[group-index="'+groupIndex+'"]' : 'div.datagrid-group');
	            var expander = group.find('span.datagrid-row-expander');
	            if (expander.hasClass('datagrid-row-expand')){
	                expander.removeClass('datagrid-row-expand').addClass('datagrid-row-collapse');
	                group.next('table').show();
	            }
	            $(this).datagrid('fixRowHeight');
	        });
	    },
	    collapseGroup:function(jq, groupIndex){
	        return jq.each(function(){
	            var view = $.data(this, 'datagrid').dc.view;
	            var group = view.find(groupIndex!=undefined ? 'div.datagrid-group[group-index="'+groupIndex+'"]' : 'div.datagrid-group');
	            var expander = group.find('span.datagrid-row-expander');
	            if (expander.hasClass('datagrid-row-collapse')){
	                expander.removeClass('datagrid-row-collapse').addClass('datagrid-row-expand');
	                group.next('table').hide();
	            }
	            $(this).datagrid('fixRowHeight');
	        });
	    }
	});
	// end of group view definition
	
	$.fn.propertygrid.defaults = $.extend({}, $.fn.datagrid.defaults, {
		singleSelect:true,
		remoteSort:false,
		fitColumns:true,
		loadMsg:'',
		frozenColumns:[[
		    {field:'f',width:16,resizable:false}
		]],
		columns:[[
		    {field:'name',title:'Name',width:100,sortable:true},
		    {field:'value',title:'Value',width:100,resizable:false}
		]],
		
		showGroup:false,
		groupView:groupview,
		groupField:'group',
		groupFormatter:function(fvalue,rows){return fvalue}
	});
})(jQuery);


	/**带下拉框的搜索框,只支持JS方式初始化调用
	 * searchCombox - jQuery EasyUI
	 * zhs2016.10.27
	 * Dependencies:
	 *  combox
	 * ***********************example**************************
	 * <input id="ss"></input>
	 * $('#ss').searchCombox({ 
			valueField: 'value',
			textField: 'label',
			flagField:'lang',//数据中哪个字段作为flag标识,来说明可以选择,下拉框中只过滤出这种数据
			flagValue:'soft',//能被选择的数据的标识,类似于bpmx.sys_user,只能选择人
			data: [{
				label: 'java',
				value: 'Java',
				lang:'soft'
			},{
				label: 'javaScript',
				value: 'JavaScript',
				lang:'soft'
			},{
				label: 'perl',
				value: 'Perl',
				lang:'soft'
			},{
				label: '英语',
				value: 'en',
				lang:'soft'
			}
			,{
				label: 'ruby',
				value: 'Ruby',
				lang:'soft'
			},{
				label: '大白菜',
				value: 'page',
				lang:'foot'
			},{
				label: '胡萝卜',
				value: 'ffg',
				lang:'foot'
			}
			],
			searcher:function(value,name){ 
				alert(value + "," + name); 
			}
		});
	 * 
	 */
	(function($){
		
		function buildSearchCombox(target){
			var state = $.data(target, 'searchCombox');
			var opts = state.options;
			var icons = $.extend(true, [], opts.icons);
			icons.push({
				iconCls:'searchbox-button',
				handler:function(e){
					var t = $(e.data.target);
					var opts = t.searchCombox('options');
					opts.searcher.call(e.data.target, t.combobox('getValue'), t.combobox('getText'));
				}
			});
			
			$(target).addClass('searchbox-f').combobox($.extend({}, opts, {
				icons: icons,
				buttonText:''
			}));
			
			$(target).attr('searchboxName', $(target).attr('textboxName'));
			state.searchCombox = $(target).next();
			state.searchCombox.addClass('searchbox');
			
		}
		
		$.fn.searchCombox = function(options, param){
			if (typeof options == 'string'){
				var method = $.fn.searchCombox.methods[options];
				if (method){
					return method(this, param);
				} else {
					return this.combobox(options, param);
				}
			}
			
			options = options || {};
			return this.each(function(){
				var state = $.data(this, 'searchCombox');
				if (state){
					$.extend(state.options, options);
				} else {
					$.data(this, 'searchCombox', {
						options: $.extend({}, $.fn.searchCombox.defaults, $.fn.searchCombox.parseOptions(this), options)
					});
				}
				buildSearchCombox(this);
			});
		}
		
		$.fn.searchCombox.methods = {
			options: function(jq){
				var opts = jq.combobox('options');
				return $.extend($.data(jq[0], 'searchCombox').options, {
					width: opts.width,
					value: opts.value,
					originalValue: opts.originalValue,
					disabled: opts.disabled,
					readonly: opts.readonly
				});
			},
			getValue:function(jq){
				return jq.combobox('getValue');
			},
			getText:function(jq){
				return jq.combobox('getText');
			},
			destroy: function(jq){
				return jq.each(function(){
					$(this).combobox('destroy');
				});
			}
		};
		
		$.fn.searchCombox.parseOptions = function(target){
			var t = $(target);
			return $.extend({}, $.fn.combobox.parseOptions(target), $.parser.parseOptions(target), {
				searcher: (t.attr('searcher') ? eval(t.attr('searcher')) : undefined)
			});
		};
		
		$.fn.searchCombox.defaults = $.extend({}, $.fn.combobox.defaults, {
			selectOnNavigation:true,
			hasDownArrow:false,
			editable:true,
			mode:'local',
			panelHeight:150,
			inputEvents: $.extend({}, $.fn.combobox.defaults.inputEvents, {
				keyup: function(e){
					var t = $(e.data.target);
					var opts = t.searchCombox('options');
					
					if(e.keyCode!=37&&e.keyCode!=38&&e.keyCode!=39&&e.keyCode!=40){
							//调用搜索
							var data = opts.data;
							var q = t.combobox('getText');
							if(q){
					 			q=q.replace(/\s/g,"");
					 		}else{
					 			t.combobox("clear");
					 			if(data){
					 				t.combobox("loadData",$.grep(data,function(elm,index){
					 				
						 				if(opts.flagField){
												if(elm[opts.flagField].toUpperCase()==opts.flagValue.toUpperCase()){
													return true;
												}else{
													return false;
												}
										}
						 			}));
					 			}
					 			return false;
					 		}
							if(data&&data.length){
								var d = $.grep(data,function(elm,index){
									if(elm[opts.textField].indexOf(q)>=0){  //row['type']='bpmx.sys_user' 不区分大小写
										if(opts.flagField){
											if(elm[opts.flagField].toUpperCase()==opts.flagValue.toUpperCase()){
												return true;
											}else{
												return false;
											}
										}
										
										return true;									
										
									}else{
										return false;
									}
								});
								t.combobox("loadData",d);
								if(d.length>0){
									t.combobox("select",d[0][opts.valueField]);
								}
								
								t.combobox("setText",q);
							}					
							//显示下拉面板
							t.combobox('showPanel');		
					}
				}
			}),
			searcher:function(value,name){}
		});
	})(jQuery);
/**
 * zhs 扩展treegrid方法:
 * treegrid中getChildren获取的是父节点下所有子节点,包含子节点的子节点
 * 扩展一个getDirectChildren子获取直接子节点
 * */	
(function($){
	$.extend($.fn.treegrid.methods, {
		getDirectChildren: function(jq,parentId){
			var target = jq[0];
			var opts = $.data(target, 'treegrid').options;
			var body = $(target).datagrid('getPanel').find('div.datagrid-view2 div.datagrid-body');
			var nodes = [];
			if (parentId){
				getNodes(parentId);
			} else {
				var roots = getRoots(target);
				for(var i=0; i<roots.length; i++){
					nodes.push(roots[i]);
					getNodes(roots[i][opts.idField]);
				}
			}
			
			function find2(idValue){
				var opts = $.data(target, 'treegrid').options;
				var data = $.data(target, 'treegrid').data;
				var cc = [data];
				while(cc.length){
					var c = cc.shift();
					for(var i=0; i<c.length; i++){
						var node = c[i];
						if (node[opts.idField] == idValue){
							return node;
						} else if (node['children']){
							cc.push(node['children']);
						}
					}
				}
				return null;
			}
			
			function getNodes(parentId){
				var pnode = find2(parentId);
				if (pnode && pnode.children){
					for(var i=0,len=pnode.children.length; i<len; i++){
						var cnode = pnode.children[i];
						nodes.push(cnode);
					}
				}
			}
			
			return nodes;
		}
	});
})(jQuery);


/**
 * pagination - jQuery EasyUI  zhs把分頁中a標籤 href去掉
 * 
 * Dependencies:
 * 	linkbutton
 * 
 */
(function($){
	function buildToolbar(target){
		var state = $.data(target, 'pagination');
		var opts = state.options;
		var bb = state.bb = {};	// the buttons;
		
		var pager = $(target).addClass('pagination').html('<table cellspacing="0" cellpadding="0" border="0"><tr></tr></table>');
		var tr = pager.find('tr');
		
		var aa = $.extend([], opts.layout);
		if (!opts.showPageList){removeArrayItem(aa, 'list');}
		if (!opts.showRefresh){removeArrayItem(aa, 'refresh');}
		if (aa[0] == 'sep'){aa.shift();}
		if (aa[aa.length-1] == 'sep'){aa.pop();}
		
		for(var index=0; index<aa.length; index++){
			var item = aa[index];
			if (item == 'list'){
				var ps = $('<select class="pagination-page-list"></select>');
				ps.bind('change', function(){
					opts.pageSize = parseInt($(this).val());
					opts.onChangePageSize.call(target, opts.pageSize);
					selectPage(target, opts.pageNumber);
				});
				for(var i=0; i<opts.pageList.length; i++) {
					$('<option></option>').text(opts.pageList[i]).appendTo(ps);
				}
				$('<td></td>').append(ps).appendTo(tr);
			} else if (item == 'sep'){
				$('<td><div class="pagination-btn-separator"></div></td>').appendTo(tr);
			} else if (item == 'first'){
				bb.first = createButton('first');
			} else if (item == 'prev'){
				bb.prev = createButton('prev');
			} else if (item == 'next'){
				bb.next = createButton('next');
			} else if (item == 'last'){
				bb.last = createButton('last');
			} else if (item == 'manual'){
				$('<span style="padding-left:6px;"></span>').html(opts.beforePageText).appendTo(tr).wrap('<td></td>');
				bb.num = $('<input class="pagination-num" type="text" value="1" size="2">').appendTo(tr).wrap('<td></td>');
				bb.num.unbind('.pagination').bind('keydown.pagination', function(e){
					if (e.keyCode == 13){
						var pageNumber = parseInt($(this).val()) || 1;
						selectPage(target, pageNumber);
						return false;
					}
				});
				bb.after = $('<span style="padding-right:6px;"></span>').appendTo(tr).wrap('<td></td>');
			} else if (item == 'refresh'){
				bb.refresh = createButton('refresh');
			} else if (item == 'links'){
				$('<td class="pagination-links"></td>').appendTo(tr);
			}
		}
		if (opts.buttons){
			$('<td><div class="pagination-btn-separator"></div></td>').appendTo(tr);
			if ($.isArray(opts.buttons)){
				for(var i=0; i<opts.buttons.length; i++){
					var btn = opts.buttons[i];
					if (btn == '-') {
						$('<td><div class="pagination-btn-separator"></div></td>').appendTo(tr);
					} else {
						var td = $('<td></td>').appendTo(tr);
						var a = $('<a ></a>').appendTo(td);
						a[0].onclick = eval(btn.handler || function(){});
						a.linkbutton($.extend({}, btn, {
							plain:true
						}));
					}
				}
			} else {
				var td = $('<td></td>').appendTo(tr);
				$(opts.buttons).appendTo(td).show();
			}
		}
		$('<div class="pagination-info"></div>').appendTo(pager);
		$('<div style="clear:both;"></div>').appendTo(pager);
		
		function createButton(name){
			var btn = opts.nav[name];
			var a = $('<a ></a>').appendTo(tr);
			a.wrap('<td></td>');
			a.linkbutton({
				iconCls: btn.iconCls,
				plain: true
			}).unbind('.pagination').bind('click.pagination', function(){
				btn.handler.call(target);
			});
			return a;
		}
		function removeArrayItem(aa, item){
			var index = $.inArray(item, aa);
			if (index >= 0){
				aa.splice(index, 1);
			}
			return aa;
		}
	}
	
	function selectPage(target, page){
		var opts = $.data(target, 'pagination').options;
		refreshData(target, {pageNumber:page});
		opts.onSelectPage.call(target, opts.pageNumber, opts.pageSize);
	}
	
	function refreshData(target, param){
		var state = $.data(target, 'pagination');
		var opts = state.options;
		var bb = state.bb;
		
		$.extend(opts, param||{});
		
		var ps = $(target).find('select.pagination-page-list');
		if (ps.length){
			ps.val(opts.pageSize+'');
			opts.pageSize = parseInt(ps.val());
		}
		
		var pageCount = Math.ceil(opts.total/opts.pageSize) || 1;
		if (opts.pageNumber < 1){opts.pageNumber = 1;}
		if (opts.pageNumber > pageCount){opts.pageNumber = pageCount}
		if (opts.total == 0){
			opts.pageNumber = 0;
			pageCount = 0;
		}
		
		if (bb.num) {bb.num.val(opts.pageNumber);}
		if (bb.after) {bb.after.html(opts.afterPageText.replace(/{pages}/, pageCount));}
		
		var td = $(target).find('td.pagination-links');
		if (td.length){
			td.empty();
			var listBegin = opts.pageNumber - Math.floor(opts.links/2);
			if (listBegin < 1) {listBegin = 1;}
			var listEnd = listBegin + opts.links - 1;
			if (listEnd > pageCount) {listEnd = pageCount;}
			listBegin = listEnd - opts.links + 1;
			if (listBegin < 1) {listBegin = 1;}
			for(var i=listBegin; i<=listEnd; i++){
				var a = $('<a class="pagination-link" ></a>').appendTo(td);
				a.linkbutton({
					plain:true,
					text:i
				});
				if (i == opts.pageNumber){
					a.linkbutton('select');
				} else {
					a.unbind('.pagination').bind('click.pagination', {pageNumber:i}, function(e){
						selectPage(target, e.data.pageNumber);
					});
				}
			}
		}
		
		var pinfo = opts.displayMsg;
		pinfo = pinfo.replace(/{from}/, opts.total==0 ? 0 : opts.pageSize*(opts.pageNumber-1)+1);
		pinfo = pinfo.replace(/{to}/, Math.min(opts.pageSize*(opts.pageNumber), opts.total));
		pinfo = pinfo.replace(/{total}/, opts.total);
		
		$(target).find('div.pagination-info').html(pinfo);
		
//		bb.first.add(bb.prev).linkbutton({disabled: (opts.pageNumber == 1)});
//		bb.next.add(bb.last).linkbutton({disabled: (opts.pageNumber == pageCount)});
		
		if (bb.first){bb.first.linkbutton({disabled: ((!opts.total) || opts.pageNumber == 1)})}
		if (bb.prev){bb.prev.linkbutton({disabled: ((!opts.total) || opts.pageNumber == 1)})}
		if (bb.next){bb.next.linkbutton({disabled: (opts.pageNumber == pageCount)})}
		if (bb.last){bb.last.linkbutton({disabled: (opts.pageNumber == pageCount)})}
		
		setLoadStatus(target, opts.loading);
	}
	
	function setLoadStatus(target, loading){
		var state = $.data(target, 'pagination');
		var opts = state.options;
		opts.loading = loading;
		if (opts.showRefresh && state.bb.refresh){
			state.bb.refresh.linkbutton({
				iconCls:(opts.loading ? 'pagination-loading' : 'pagination-load')
			});
		}
	}
	
	$.fn.pagination = function(options, param) {
		if (typeof options == 'string'){
			return $.fn.pagination.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var opts;
			var state = $.data(this, 'pagination');
			if (state) {
				opts = $.extend(state.options, options);
			} else {
				opts = $.extend({}, $.fn.pagination.defaults, $.fn.pagination.parseOptions(this), options);
				$.data(this, 'pagination', {
					options: opts
				});
			}
			
			buildToolbar(this);
			refreshData(this);
			
		});
	};
	
	$.fn.pagination.methods = {
		options: function(jq){
			return $.data(jq[0], 'pagination').options;
		},
		loading: function(jq){
			return jq.each(function(){
				setLoadStatus(this, true);
			});
		},
		loaded: function(jq){
			return jq.each(function(){
				setLoadStatus(this, false);
			});
		},
		refresh: function(jq, options){
			return jq.each(function(){
				refreshData(this, options);
			});
		},
		select: function(jq, page){
			return jq.each(function(){
				selectPage(this, page);
			});
		}
	};
	
	$.fn.pagination.parseOptions = function(target){
		var t = $(target);
		return $.extend({},
				$.parser.parseOptions(target, [
					{total:'number',pageSize:'number',pageNumber:'number',links:'number'},
					{loading:'boolean',showPageList:'boolean',showRefresh:'boolean'}
				]), {
			pageList: (t.attr('pageList') ? eval(t.attr('pageList')) : undefined)
		});
	};
	
	$.fn.pagination.defaults = {
		total: 1,
		pageSize: 10,
		pageNumber: 1,
		pageList: [10,20,30,50],
		loading: false,
		buttons: null,
		showPageList: true,
		showRefresh: true,
		links: 10,
		layout: ['list','sep','first','prev','sep','manual','sep','next','last','sep','refresh'],
		
		onSelectPage: function(pageNumber, pageSize){},
		onBeforeRefresh: function(pageNumber, pageSize){},
		onRefresh: function(pageNumber, pageSize){},
		onChangePageSize: function(pageSize){},
		
		beforePageText: 'Page',
		afterPageText: 'of {pages}',
		displayMsg: 'Displaying {from} to {to} of {total} items',
		
		nav: {
			first: {
				iconCls: 'pagination-first',
				handler: function(){
					var opts = $(this).pagination('options');
					if (opts.pageNumber > 1){$(this).pagination('select', 1)}
				}
			},
			prev: {
				iconCls: 'pagination-prev',
				handler: function(){
					var opts = $(this).pagination('options');
					if (opts.pageNumber > 1){$(this).pagination('select', opts.pageNumber - 1)}
				}
			},
			next: {
				iconCls: 'pagination-next',
				handler: function(){
					var opts = $(this).pagination('options');
					var pageCount = Math.ceil(opts.total/opts.pageSize);
					if (opts.pageNumber < pageCount){$(this).pagination('select', opts.pageNumber + 1)}
				}
			},
			last: {
				iconCls: 'pagination-last',
				handler: function(){
					var opts = $(this).pagination('options');
					var pageCount = Math.ceil(opts.total/opts.pageSize);
					if (opts.pageNumber < pageCount){$(this).pagination('select', pageCount)}
				}
			},
			refresh: {
				iconCls: 'pagination-refresh',
				handler: function(){
					var opts = $(this).pagination('options');
					if (opts.onBeforeRefresh.call(this, opts.pageNumber, opts.pageSize) != false){
						$(this).pagination('select', opts.pageNumber);
						opts.onRefresh.call(this, opts.pageNumber, opts.pageSize);
					}
				}
			}
		}
	};
})(jQuery);
