package com.gx181.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.gx181.comm.StringUtils;


public class AdminUserDetails implements UserDetails{
	
	private String account;
	private String pwd;
	private Date lastLoginDate;
	private String roles;
	
	public String getRoles() {
		return roles;
	}
	public void setRoles(String roles) {
		this.roles = roles;
	}
	public String getAccount() {
		return account;
	}
	public void setAccount(String account) {
		this.account = account;
	}
	public String getPwd() {
		return pwd;
	}
	public void setPwd(String pwd) {
		this.pwd = pwd;
	}
	public Date getLastLoginDate() {
		return lastLoginDate;
	}
	public void setLastLoginDate(Date lastLoginDate) {
		this.lastLoginDate = lastLoginDate;
	}
	@Override
	public String toString() {
		return "AdminUserDetails [account=" + account + ", pwd=" + pwd + ", lastLoginDate=" + lastLoginDate + "]";
	}
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		Collection<GrantedAuthority> rtnList= new ArrayList<GrantedAuthority>();
		if(!StringUtils.isEmpty(this.roles)){
			
			String[] roleArray = roles.split("#");
			if(roleArray.length>0){
				for(String role:roleArray){
					rtnList.add(new SimpleGrantedAuthority(role));
				}
			}
		}
		
		return rtnList;
	}
	@Override
	public String getPassword() {
		
		return this.pwd;
	}
	@Override
	public String getUsername() {
		
		return this.account;
	}
	@Override
	public boolean isAccountNonExpired() {
		
		return true;
	}
	@Override
	public boolean isAccountNonLocked() {
		
		return true;
	}
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}
	@Override
	public boolean isEnabled() {
		return true;
	}

}
