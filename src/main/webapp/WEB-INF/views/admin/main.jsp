<%@ taglib prefix='security' uri='http://www.springframework.org/security/tags' %> 
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<!DOCTYPE html> 
<html>
  <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>国欣CMS管理系统</title>
		<!-- 新 Bootstrap 核心 CSS 文件 -->
		<link href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
		<!-- 可选的Bootstrap主题文件（一般不使用） -->
		<script src="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap-theme.min.css"></script>
		<!-- jQuery文件。务必在bootstrap.min.js 之前引入 -->
		<script src="https://cdn.bootcss.com/jquery/2.1.1/jquery.min.js"></script>
		<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
		<script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    </head>
<body>
  <security:authorize access="hasRole('ADMIN')">
 	<div class="container">
 		
 	
 	
 	
 	</div>
   </security:authorize>
</body>
</html>
