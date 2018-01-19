package com.gx181.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.gx181.model.AdminUserDetails;
import com.gx181.service.AdminService;

/**用户详细信息获取
 */
public class AdminUserDetailsService implements UserDetailsService {
    private Logger logger = LoggerFactory.getLogger(AdminUserDetailsService.class);
    private AdminService adminService;
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
    	logger.debug("查询用户权限:",username);
        AdminUserDetails userDetails = adminService.getAdminByAccount(username);
        ///这个就是权限系统最后的用户信息
        return userDetails;
    }

    public AdminService getAdminService() {
        return adminService;
    }

    public void setAdminService(AdminService adminService) {
        this.adminService = adminService;
    }

}

