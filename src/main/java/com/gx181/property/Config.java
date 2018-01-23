package com.gx181.property;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component("configProperty")
public class Config {
	@Value("#{prop[projectPath]}")  
	private String projectPath;
	
	@Value("#{prop[account]}")  
	private String account;
	
	@Value("#{prop[pwd]}")  
	private String pwd;
	
	public String getProjectPath() {
		return projectPath;
	}
	public void setProjectPath(String projectPath) {
		this.projectPath = projectPath;
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
	@Override
	public String toString() {
		return "Config [projectPath=" + projectPath + ", account=" + account + ", pwd=" + pwd + "]";
	}
	
	
}
