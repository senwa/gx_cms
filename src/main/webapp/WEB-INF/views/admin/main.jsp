<%@ taglib prefix='security' uri='http://www.springframework.org/security/tags' %> 
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html> 
<html>
  <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta name="_csrf" content="${_csrf.token}"/>
		<meta name="_csrf_header"  content="${_csrf.headerName}"/>
        <title>国欣CMS管理系统</title>
		<style type="text/css">
			#refreshBtn{
				color:red;
				font-weight:bold;
				margin-left:10px;
				cursor:pointer;
				border:1px solid #cfcfcf;
				background-color:#e6e81d;
			}
			#refreshBtn:hover{
				color:blue;
				text-decoration: underline;
			}
			
			#commitCmsBtn{
				color:red;
				font-weight:bold;
				margin-left:10px;
				cursor:pointer;
				border:1px solid #cfcfcf;
				background-color:#e6e81d;
			}
			#commitCmsBtn:hover{
				color:blue;
				text-decoration: underline;
			}
			.fileName{
				width:100%;
				padding:10px 0px 10px 10px;
				display:inline-block;
				line-height:20px;
				height: 28px;
				text-decoration: none;
				color:blue;
				cursor:pointer;
				border-bottom: 1px dotted #ccc;
				position:relative;
			}
			.fileName:hover{
				background-color:#cfcfcf;
			}
			.fileName .lastModify{
				color:gray;
				position:relative;
				bottom:0px;
				right:10px;
				font-size:0.9em;
			}
			
			#fileContent{
				width:100%;
			}
			#imagesShowPanel{
				width:100%;
				display:none;
				padding-top: 30px;
			}
			.imgContainer{
				width:200px;
				height:200px;
				display: inline-block;
				float:left;
				padding: 5px;
				border: 2px solid #ccc;
				margin: 5px;
				background-color: #FFF;
			}
			.imgContainer img{
				width:100%;
				height:100%;
				display: inline-block;
			}
			
			.imgContainer .imgInfo{
				background-color:#FFF;
				color:#000;
				font-weight:bold;
				width: 100%;
				text-align: center;
				position: relative;
				bottom:20px;
			}
			
			.jsContainer{
				width:200px;
				height:200px;
				display: inline-block;
				float:left;
				padding: 5px;
				border: 2px solid #ccc;
				margin: 5px;
				background-color: #FFF;
			}
			.jsContainer .jsFont{
				width: 190px;
				height: 190px;
				line-height: 190px;
				font-size: 60px;
				font-style: italic;
				text-align: center;
			}
			.jsContainer .jsInfo{
				background-color:#FFF;
				font-weight:bold;
				width: 100%;
				text-align: center;
				position: relative;
				bottom:20px;
				color:blue;
				cursor:pointer;
				text-decoration: underline;
			}
			
			.htmlPreview{
				background-color:#FFF;
				font-weight:bold;
				width: 100%;
				text-align: center;
				position: relative;
				top:20px;
				color:blue;
				cursor:pointer;
				text-decoration: underline;
			}
			
			#toolBarPanel{
				width:100%;
				height:30px;
				position:fixed;
				background-color:#FFF;
				padding-bottom:3px;
				border-bottom:2px solid #ccc;
			}
			
			.folderDiv{
				background-repeat: no-repeat;
				background-image: url(${ctx}/images/folder64.png);
				background-size: 100% 90%;
				width: 100%;
				height: 100%;
				text-align: center;
				font-size: 18px;
				font-weight: bold;
				background-position-x: 20px;
				cursor:pointer;
			}
			.folderDiv:hover{
				background-color:#cfcccc;
			}
			.folderDiv .folderInfo{
				background-color:#FFF;
				font-weight:bold;
				width: 100%;
				text-align: center;
				position: relative;
				bottom: -170px;
			}
			
			#createDirBtn{
				display: inline-block;
				border: 1px outset #ccc;
				padding: 5px;
				background-color: #ccf;
				cursor:pointer;
			}
			#createDirBtn:hover{
				color:#FFF;
				background-color: #666;
			}
		</style>
        
        <link rel="stylesheet" type="text/css" href="${ctx}/js/easyui/themes/gray/easyui.css">
		<link rel="stylesheet" type="text/css" href="${ctx}/js/easyui/themes/icon.css">
		<script type="text/javascript" src="${ctx}/js/easyui/jquery-1.7.2.min.js"></script>
		<script type="text/javascript" src="${ctx}/js/easyui/jquery.easyui.min.js"></script>
		<script type="text/javascript" src="${ctx}/js/easyui/jquery.easyui.patch.js" ></script>
		<script type="text/javascript" src="${ctx}/js/easyui/jquery.easyui.ext.js" ></script>
		<script type="text/javascript" src="${ctx}/js/easyui/json2.js"></script>
		<script type="text/javascript" src="${ctx}/js/easyui/locale/easyui-lang-zh_CN.js"></script>
		<link rel="stylesheet" type="text/css" href="${ctx}/js/easyui/poshytip-1.2/tip-yellow/tip-yellow.css" >
		<script type="text/javascript" src="${ctx}/js/easyui/poshytip-1.2/jquery.poshytip.min.js"></script>
		
    </head>
<body>
  <security:authorize access="hasRole('ADMIN')">
	<div id="container" class="easyui-layout" data-options="fit:true">   
	    <div data-options="region:'west',title:'文件列表<span id=\'refreshBtn\'>重置当前工作空间</span><span title=\'提交后就会覆盖到正式官网\' id=\'commitCmsBtn\'>提交</span>',split:true" style="width:250px;">
	    	<div style='width:100%;height:100%;overflow-x: hidden;'>
	    		<form id='refreshForm'  action="${ctx}/admin/main"  method="post">
			    	<input type="hidden" id="refreshWorkSpace" name="refreshWorkSpace" value="1"/>
			    	<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/> 
			    </form>
	    		<form id='downloadForm' target="framFile"  action="${ctx}/fileManage/download" enctype="multipart/form-data" method="post">
			    	<input type="hidden" id="downFileName" name="downFileName" value=""/>
			    	<input type="hidden" id="downCurrentPath" name="downCurrentPath" value=""/>
			    	<input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/> 
			    </form>
	    		<c:forEach var="file" items="${files}" varStatus="status">
	            <div class='fileName' isDir='${file.isDir}' fileName='${file.fileName}'  onclick='loadFile(this)'>
	            	<a>${file.fileName}</a>
	            	 <c:if test="${file.isDir==0}">
	            	 	<div class='lastModify'>最后修改时间${file.lastModify}</div>
	            	 </c:if>
	            </div>   
	            </c:forEach>
	    	</div>
	    </div>   
	    <div data-options="region:'center'" style="padding:5px;background:#eee;">
	    	<div id='toolBarPanel'>
	    		<div style='margin-right:20px;width: auto;display:inline-block;height: 27px;line-height: 27px;'>当前目录:<div id='currentPathShow' style='display: inline;color: #d7386b;'></div></div>
	    		<form style="width: auto;display:inline-block;background-color: #ccc;height: 27px;line-height: 27px;" target="framFile" onsubmit="return checkFile();" action="${ctx}/fileManage/upload" enctype="multipart/form-data" method="post"><input type="file" name="uploadfile"/><input type="hidden" id="currentPath" name="currentPath" value=""/><input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/> <button type="submit">提交</button></form>
	    		<div id='createDirBtn' onclick='createDir()' title='只支持新建,要删除请联系管理员'>新建文件夹</div>
	    	</div>
	    	<iframe id="framFile" name="framFile" style="display:none;" ></iframe>
	    	<div id='imagesShowPanel'></div>
	    	<iframe id="fileContent" onload="javascript:iframeAutoHeight();"  width='100%' name='fileContent'  src='' frameborder='0' scrolling='no'></iframe>
	    </div>   
	</div>  
	<script type='text/javascript'>
    	var folderArr=[];//存放当前处于哪个目录下   
		$(function(){
	        var header = $("meta[name='_csrf_header']").attr("content");
			var token =$("meta[name='_csrf']").attr("content");
			$.ajaxSetup({   
	              beforeSend: function (xhr) {  
	                   xhr.setRequestHeader(header, token);  
	              }  
			}); 
			
			$("#refreshBtn").attr('title','清空当前所有改变,重新复制官网项目文件到当前工作空间');
			$("#refreshBtn").bind('click',function(){
				//刷新前,要清空当前页面显示的内容,要不删除不掉
				$("#framFile").attr("src","");
				$("#imagesShowPanel").empty();
				$("#fileContent").attr("src","");
				$("#refreshForm").submit();
			});
			
			if("${param.refreshWorkSpace}"==1){
				alert("重新加载成功!");
			}
			
			//$("#refreshBtn").attr('title','清空当前所有改变,重新复制官网项目文件到当前工作空间');
			//把修改覆盖到官网,注意是覆盖
			$("#commitCmsBtn").bind('click',function(){
				  var r=confirm("确定要把当前工作空间内的文件覆盖到正式官网吗?")
				  if (r==true){
				   	$.post("${ctx}/fileManage/synOverCms", {},
			   			function(data){
			   				if(data&&data.isSuccess==1){
			   					alert("覆盖成功!");
			   					//重新加载当前页面
			   					$("#refreshBtn").trigger('click');
			   				}else{
			   					alert(data.info);
			   				}
			   			},'json');
				  }
			});
			
        });
        
        
	     function iframeAutoHeight(){
	     	var height=1300;
		    var userAgent = navigator.userAgent;
		    var iframe = parent.document.getElementById('fileContent');
		    var subdoc = iframe.contentDocument || iframe.contentWindow.document;
		    var subbody = subdoc.body;
		    var realHeight;
		    //谷歌浏览器特殊处理
		    if(userAgent.indexOf("Chrome") > -1){
		        realHeight = subdoc.documentElement.scrollHeight;
		    }
		    else{
		        realHeight = subbody.scrollHeight;
		    }
		    if(realHeight < height){
		        $(iframe).height(height);
		    }
		    else{
		        $(iframe).height(realHeight);
		    }
		}
		
		function checkFile(){
			$("#currentPath").val(folderArr.join("/"));
			return true;
			
			/*var maxSize = 2*1024*1024;  //2M 
		    var img = document.getElementById("uploadImage");
		
		    if(img.value == "" || img.value == undefined || img.value == null){
		        alert("请选择文件!");
		        return false;
		    }else if (!/\.(gif|jpg|jpeg|png|GIF|JPG|JPEF|PNG)$/.test(img.value)){
		        alert("图片类型必须为gif|jpg|jpeg|png中的一种!");
		        return false;
		    }else if(img.files[0].size > maxSize){
		        alert("上传图片不能超过2M !");
		        return false;
		    }*/
		}
		
		function loadFile(self){
			var isDir = $(self).attr('isDir');
			$("#fileContent,#imagesShowPanel,#toolBarPanel").hide();
			
			//点击文件
			var fileName = $(self).attr('fileName');
			if(isDir==0){//点击的是顶层html文件
				 $("#fileContent").show();
				 $('#fileContent').attr('src','${ctx}/tempWork/'+fileName);  
			}else{
				//点击的是顶层文件夹
				if(fileName=='images'||fileName=='js'||fileName=='news'){//图片文件夹或者js和css文件夹,下方全是文件
					$("#imagesShowPanel").empty();
					folderArr=[];
					folderArr.push(fileName);
					$("#currentPath").val(folderArr.join("/"));
					$("#toolBarPanel").show();
					$("#imagesShowPanel").show();
				
					getFileList(folderArr.join("/"));
				}
			}
			
			
			//window.document.getElementById("fileContent").src="${ctx}/tempWork/index.html";
		 	/*  	var iframe = window.frames['fileContent'];
		 	  	alert("${ctx}/tempWork/index.html");
		 	  	alert(iframe);
				iframe.src="${ctx}/tempWork/index.html";*/
		 	
		 	/*$.post("${ctx}/fileManage/getFileContent", {filePath:$(self).attr("filePath")},
			   function(data){*/
			     	//$("#fileContent").contents(data);
			   		/*console.log(window.document.getElementById("fileContent"));
			   		window.document.getElementById("fileContent").contents(data);*/
			//   	var iframe = window.frames['fileContent'];
		/*		iframe.document.open();
				iframe.document.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">/n');
				iframe.document.write('<html xmlns="http://www.w3.org/1999/xhtml">/n');
				iframe.document.write('<head>/n');
				iframe.document.write('<meta http-equiv="Content-Type" content="text/html; charset=gb2312" />/n');
				iframe.document.write('</head>/n');
				iframe.document.write('<body>/n');
				iframe.document.write('请等待...');
				iframe.document.write('</body>/n');
				iframe.document.write('</html>/n');*/
				
				/*iframe.document.write(data);
				iframe.document.close();
			   }, "html");*/
		}
		
		function getFileList(filePath){
			//显示当前目录
			$("#currentPathShow").text("/"+folderArr.join("/"));
			
			$.post("${ctx}/fileManage/getFileList", {filePath:filePath},
		   			function(data){
		   				$("#imagesShowPanel").empty();
		   				console.log(data);
		   				if(data&&data.length>0){
		   					for(var i=0; i<data.length; i++){
		   						if(data[i].isImage==1){//图片
		   							var $imgDiv = $("<div class='imgContainer'></div>");
			   						$imgDiv.html("<img src='${ctx}/tempWork/"+filePath+"/"+data[i].fileName+"' /><div class='imgInfo'>"+data[i].fileName+" ("+data[i].imgWidth+"x"+data[i].imgHeight+") </div>");
			   						$imgDiv.poshytip({
			   							showOn: 'hover',
			   							content:"<img src='${ctx}/tempWork/"+filePath+"/"+data[i].fileName+"' />"
			   						});
			   						$("#imagesShowPanel").append($imgDiv);
		   						}else if(data[i].isDir==1){
		   							var $folderDiv = $("<div class='jsContainer'></div>");
		   							$folderDiv.html("<div class='folderDiv' filePath='"+filePath+"' fileName='"+data[i].fileName+"'  onclick='deepInFolder(this)'>"+"<div class='folderInfo' fileName='"+data[i].fileName+"' >"+data[i].fileName+" </div></div>");
		   							$("#imagesShowPanel").append($folderDiv);
		   						
		   						}else{
		   							if(data[i].fileExt=='js'||data[i].fileExt=='JS'){
		   								var $jsDiv = $("<div class='jsContainer'></div>");
			   							$jsDiv.html("<div class='jsFont'>JS</div><div class='jsInfo' filePath='"+filePath+"' fileName='"+data[i].fileName+"' onclick='downloadFile(this)'>"+data[i].fileName+" </div>");
			   							$("#imagesShowPanel").append($jsDiv);
		   							}else if(data[i].fileExt=='css'||data[i].fileExt=='CSS'){
		   								var $cssDiv = $("<div class='jsContainer'></div>");
		   								$cssDiv.html("<div class='jsFont'>CSS</div><div class='jsInfo' filePath='"+filePath+"' fileName='"+data[i].fileName+"' onclick='downloadFile(this)'>"+data[i].fileName+" </div>");
		   								$("#imagesShowPanel").append($cssDiv);
		   							}else if(data[i].fileExt=='html'||data[i].fileExt=='HTML'){
		   								var $cssDiv = $("<div class='jsContainer'></div>");
		   								$cssDiv.html("<div class='htmlPreview' filePath='"+filePath+"' fileName='"+data[i].fileName+"' onclick='preView(this)'> 预 览 </div>"+"<div class='jsFont'>HTML</div><div class='jsInfo' filePath='"+filePath+"' fileName='"+data[i].fileName+"' onclick='downloadFile(this)'>"+data[i].fileName+" </div>");
		   								$("#imagesShowPanel").append($cssDiv);
		   							}
		   						}
		   					}
		   				}
		   			},'json');
		
		}
		
		function downloadFile(self){
			var fileName = $(self).attr("fileName");
			var filePath = $(self).attr("filePath");
			if(fileName){
				$("#downFileName").val(fileName);
				$("#downCurrentPath").val(filePath);
				$("#downloadForm").submit();
			}
		}
		
		//打开文件夹
		function deepInFolder(self){
			//var filePath = $(self).attr("filePath");
			var folderName = $(self).attr("fileName");
			if(folderName!=folderArr[folderArr.length-1]){
				folderArr.push(folderName);
			}
			
			getFileList(folderArr.join("/"));
		}
		
		function preView(self){
			var fileName = $(self).attr("fileName");
			var filePath = $(self).attr("filePath");
			var p=[];
			if(filePath){
				p.push(filePath);
			}
			if(fileName){
				p.push(fileName);
				window.open("${ctx}/tempWork/"+p.join("/"));
			}
		}
		
		function createDir(){
			var dirName=prompt("请输入要新建的文件夹名称","");
			if (dirName!=null && dirName!=""){
			  var filePath = folderArr.join("/")+"/"+dirName;
			  $.post("${ctx}/fileManage/createFolder", {filePath:filePath},
	   			function(data){
	   				if(data&&data.isSuccess==1){
	   					alert("创建成功,请点击左侧文件夹刷新");
	   				}else{
	   					alert(data.info);
	   				}
	   			},'json');
			}
		}
	</script>
   </security:authorize>
</body>
</html>
