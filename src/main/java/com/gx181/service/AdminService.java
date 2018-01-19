package com.gx181.service;

import org.springframework.stereotype.Service;

import com.gx181.model.AdminUserDetails;
@Service
public class AdminService {

	public AdminUserDetails getAdminByAccount(String username) {
		//TODO:从文件或者数据库读取
		
		AdminUserDetails u = new AdminUserDetails(); 
		u.setAccount("zhs");
		u.setPwd("123");
		u.setRoles("ROLE_ADMIN#ROLE_USER#ADMIN");
		return u;
	}

}
