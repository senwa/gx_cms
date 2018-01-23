package com.gx181.service;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.gx181.model.AdminUserDetails;
import com.gx181.property.Config;
@Service
public class AdminService {

	@Resource(name = "configProperty")  
	private Config configProperty;  
	Logger logger = LoggerFactory.getLogger(AdminService.class);
	public AdminUserDetails getAdminByAccount(String username) {
		//TODO:从配置文件或者数据库读取
		String account = configProperty.getAccount();
		String pwd = configProperty.getPwd();
		AdminUserDetails u = new AdminUserDetails(); 
		
		if(account==null||account.isEmpty()||pwd==null||pwd.isEmpty()){
			logger.warn("未配置登录的账号和密码,将使用默认的账号密码");
			u.setAccount("zhs");
			u.setPwd("123");
		}else{
			u.setAccount(account);
			u.setPwd(pwd);
		}
		
		u.setRoles("ROLE_ADMIN#ROLE_USER#ADMIN");
		return u;
	}

}
