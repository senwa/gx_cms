package com.gx181.security;

import java.util.Collection;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;


public class AdminAuthenticationProvider implements AuthenticationProvider {

	 protected Logger logger = LoggerFactory.getLogger(this.getClass());
	  
	    private UserDetailsService userDetailsService = null;

	    public AdminAuthenticationProvider() {
	        super();
	    }
	    /**
	     * @param userDetailsService
	     */
	    public AdminAuthenticationProvider(UserDetailsService userDetailsService) {
	        super();
	        this.userDetailsService = userDetailsService;
	    }

	    public UserDetailsService getUserDetailsService() {
	        return userDetailsService;
	    }

	    public void setUserDetailsService(UserDetailsService userDetailsService) {
	        this.userDetailsService = userDetailsService;
	    }

	    /**
	     * provider的authenticate()方法，用于登录验证
	     */
	    @SuppressWarnings("unchecked")
	    public Authentication authenticate(Authentication authentication) throws AuthenticationException {

	        // 1. Check username and password
	        try {
	            doLogin(authentication);
	        } catch (Exception e) {
	            if (e instanceof AuthenticationException) {
	                throw (AuthenticationException) e;
	            }
	            logger.error("failure to doLogin", e);
	        }

	        // 2. Get UserDetails
	        UserDetails userDetails = null;
	        try {
	            userDetails = this.userDetailsService.loadUserByUsername(authentication.getName());
	        } catch (Exception e) {
	            if (e instanceof AuthenticationException) {
	                throw (AuthenticationException) e;
	            }
	            logger.error("failure to get user detail", e);
	        }
	        
	        // 3. Check and get all of admin roles and contexts.
	        Collection<GrantedAuthority> authorities = (Collection<GrantedAuthority>) userDetails.getAuthorities();
	        if (authorities != null && !authorities.isEmpty()) {
	            AdminAuthenticationToken token = new AdminAuthenticationToken(authentication.getName(),
	                    authentication.getCredentials(), authorities);
	            token.setDetails(userDetails);
	            return token;
	        }
	        throw new BadCredentialsException("没有分配权限");
	    }
	    protected void doLogin(Authentication authentication) throws AuthenticationException {
	    	//校验用户名密码
	       String account = authentication.getPrincipal()!=null?String.valueOf(authentication.getPrincipal()):"";
	       String pwd = authentication.getCredentials()!=null?String.valueOf(authentication.getCredentials()):"";
	        
	       UserDetails user = userDetailsService.loadUserByUsername(account);
	       
	       //判断
	       if(user==null){
	    	   throw new UsernameNotFoundException(account+"不存在");
	       }
	       if(user.getPassword()==null||!user.getPassword().equalsIgnoreCase(pwd)){
	    	   throw new BadCredentialsException("密码不正确");
	       }
	        
	    }
	    @Override
	    public boolean supports(Class<?> authentication) {
	        return true;
	    }

}
