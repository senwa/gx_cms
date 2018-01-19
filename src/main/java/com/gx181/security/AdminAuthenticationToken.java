package com.gx181.security;

import java.util.Collection;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

public class AdminAuthenticationToken extends AbstractAuthenticationToken {
	 
	  /**
	   * 
	   */
	  private static final long serialVersionUID = 5976309306377973996L;

	  private final Object principal;
	  private Object credentials;

	  public AdminAuthenticationToken(Object principal, Object credentials) {
	    super(null);
	    this.principal = principal;
	    this.credentials = credentials;
	    setAuthenticated(false);
	  }

	 AdminAuthenticationToken(Object principal, Object credentials, Collection<? extends GrantedAuthority> authorities) {
	    super(authorities);
	    this.principal = principal;
	    this.credentials = credentials;
	    super.setAuthenticated(true); //注意，这里设置为true了！ must use super, as we override
	  }

	  public Object getCredentials() {
	    return this.credentials;
	  }

	  public Object getPrincipal() {
	    return this.principal;
	  }

	  public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
	    if (isAuthenticated) {
	      throw new IllegalArgumentException("Cannot set this token to trusted - use constructor which takes a GrantedAuthority list instead");
	    }
	    super.setAuthenticated(false);
	  }

	  @Override
	  public void eraseCredentials() {
	    super.eraseCredentials();
	    credentials = null;
	  }
	}