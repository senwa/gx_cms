<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>国欣CMS管理系统</title>
		<!-- 新 Bootstrap 核心 CSS 文件 -->
		<link href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
		<link rel="stylesheet" href="${ctx}/styles/login/css/form-elements.css">
        <link rel="stylesheet" href="${ctx}/styles/login/css/style.css">
		
		
		<!-- 可选的Bootstrap主题文件（一般不使用） -->
		<script src="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap-theme.min.css"></script>
		<!-- jQuery文件。务必在bootstrap.min.js 之前引入 -->
		<script src="https://cdn.bootcss.com/jquery/2.1.1/jquery.min.js"></script>
		<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
		<script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    </head>
 	
    <body>
    	<!-- Top content -->
        <div class="top-content">
            <div class="inner-bg">
                <div class="container">
                    <div class="row">
                        <div class="col-sm-8 col-sm-offset-2 text">
                            <h1><strong>国欣ERP<sup>+</sup></strong> CMS后台管理系统</h1>
                            <div class="description">
                            	<p>
	                            	基于移动互联和人工智能技术开发的企业一体化智能管理平台
                            	</p>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 col-sm-offset-3 form-box">
                        	<div class="form-top">
                        		<div class="form-top-left">
                        			<h3>管理员登录</h3>
                            		<p>--------------------------------------------------------------------------------</p>
                        		</div>
                        		<div class="form-top-right">
                        			<i class="fa fa-lock"></i>
                        		</div>
                            </div>
                            <div class="form-bottom">
                            	<c:if test="${param.error != null}">
									<p>
										Invalid username and password.
									</p>
								</c:if>
								<c:if test="${param.logout != null}">
									<p>
										You have been logged out.
									</p>
								</c:if>
                            	<form:form action="${ctx}/j_spring_security_check" method="post"  class="login-form">
			                    	<div class="form-group">
			                    		<label class="sr-only" for="form-username">Username</label>
			                        	<input type="text" name="username" placeholder="请输入用户名..." class="form-username form-control" id="form-username">
			                        </div>
			                        <div class="form-group">
			                        	<label class="sr-only" for="form-password">Password</label>
			                        	<input type="password" name="password" placeholder="请输入密码..." class="form-password form-control" id="form-password">
			                        </div>
			                        <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/> 
			                        <button type="submit" class="btn">登录</button>
			                    </form:form>
		                    </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Javascript -->
        <script src="${ctx}/js/jquery.backstretch.min.js"></script>
        <!--[if lt IE 10]>
            <script src="assets/js/placeholder.js"></script>
        <![endif]-->
        <script type='text/javascript'>
        	jQuery(document).ready(function() {
			    $.backstretch("${ctx}/styles/login/img/1.jpg");
			    
			    /*
			        Form validation
			    */
			    $('.login-form input[type="text"], .login-form input[type="password"], .login-form textarea').on('focus', function() {
			    	$(this).removeClass('input-error');
			    });
			    
			    $('.login-form').on('submit', function(e) {
			    	
			    	$(this).find('input[type="text"], input[type="password"], textarea').each(function(){
			    		if( $(this).val() == "" ) {
			    			e.preventDefault();
			    			$(this).addClass('input-error');
			    		}
			    		else {
			    			$(this).removeClass('input-error');
			    		}
			    	});
			    	
			    });
			});
        </script>
    </body>
</html>