package com.gx181.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

public class MyAccessDeniedHandler implements AccessDeniedHandler {

	private String accessDeniedUrl;

	public String getAccessDeniedUrl() {
		return accessDeniedUrl;
	}
	
	public void setAccessDeniedUrl(String accessDeniedUrl) {
		this.accessDeniedUrl = accessDeniedUrl;
	}
	

	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response,
			AccessDeniedException ex) throws IOException, ServletException {
		request.setAttribute("ex", ex);
		try{			
			if (request != null){
				request.getSession().invalidate();
				request.getRequestDispatcher(accessDeniedUrl).forward(request, response);
			}
		}
		catch(Exception e){
			e.printStackTrace();
		}
	}

}
