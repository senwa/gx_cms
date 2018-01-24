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
        <title>文件上传成功</title>
		<style type="text/css">
		</style>
		<script type="text/javascript" src="${ctx}/js/easyui/jquery-1.7.2.min.js"></script>
		
    </head>
<body>
	<script type='text/javascript'>
        $(function(){
        	if("${info}"){
        		alert("${info}");
        	}
        });
     </script>
     
     <div>
     	${error}
     </div>
</body>
</html>
