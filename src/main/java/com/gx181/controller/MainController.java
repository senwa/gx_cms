package com.gx181.controller;


import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.gx181.comm.FileUtil;
import com.gx181.property.Config;

@Controller
@RequestMapping(value="/admin") 
public class MainController {

	@Resource(name = "configProperty")
	private Config configProperty;  
	Logger logger = LoggerFactory.getLogger(MainController.class);
	
	   @RequestMapping(value ="/main") 
	   public ModelAndView main(HttpServletRequest request){ 
	     ModelAndView mv =new ModelAndView(); 
	     mv.addObject("spring", "spring mvc"); 
	     mv.setViewName("/admin/main"); 
	     System.gc();    //回收资源
	     String projectPath = configProperty.getProjectPath();
	     logger.debug("正式官网项目路径:{}",projectPath);
	     
	     //清空并重新复制一份官网项目到工作空间
	     String refreshWorkSpace = request.getParameter("refreshWorkSpace");
	     String cmsAbsolutePath = request.getSession().getServletContext().getRealPath("");
	     String tempWorkPath = cmsAbsolutePath+File.separator+"tempWork";//临时目录已经配置成静态资源路径
	     
	     if(StringUtils.isNotEmpty(refreshWorkSpace)&&refreshWorkSpace.equalsIgnoreCase("1")){
	    	 //执行拷贝,把配置的官网项目路径下的整个文件夹复制到tempWork临时目录下,只有这样才能识别预览
		     try {
		    	logger.info("++++++++1.删除临时目录+++++++");
		    	FileUtil.deleteDir(new File(tempWorkPath));
		    	logger.info("++++++++2.创建临时目录+++++++");
		    	FileUtil.createFolderFile(tempWorkPath);
		    	logger.info("++++++++3.开始向临时目录拷贝官网项目文件+++++++");
				FileUtil.copyDir(projectPath, tempWorkPath);
				logger.info("++++++++4.向临时目录拷贝官网项目文件结束+++++++");
				logger.debug("当前临时官网项目路径:{}",tempWorkPath);
			} catch (IOException e) {
				e.printStackTrace();
			}
	     }
	     
	     //加载静态网页文件列表
	     logger.info("++++++++开始读取官网文件列表+++++++");
	     SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	     Map<String,String> fileInfo = null;
	     List<Map<String,String>> list = new ArrayList<Map<String,String>>();
	     
	     //读取临时工作空间目录下的文件列表,这样才能读到最后修改时间;依靠名字和拷贝出的临时目录下的文件对应上
	     if(tempWorkPath!=null&&!tempWorkPath.isEmpty()){
	    	 File projectDir = new File(tempWorkPath);
	    	 if(projectDir!=null&&projectDir.exists()&&projectDir.isDirectory()){
	    		 //只获取并显示当前路径下的文件和文件夹信息,不进行递归加载
	    		 String[] files = projectDir.list();
	    		 if(files!=null&&files.length>0){
	    			 File tempFile = null;
	    			 for(int i=0; i<files.length; i++){
	    				 tempFile = new File(projectDir,files[i]);
	    				 if(FileUtil.isNormalFile(tempFile)){//只处理特定类型的文件
	    					 fileInfo = new HashMap<String,String>();
			    			 fileInfo.put("isDir", tempFile.isDirectory()?"1":"0");//文件或者文件夹类别
			    			 fileInfo.put("fileName", tempFile.getName());//名称
			    			 fileInfo.put("fileExt", FileUtil.getFileExt(tempFile));//后缀
			    			 fileInfo.put("parentDirPath", "tempWork");//,当前父文件夹路径
			    			 fileInfo.put("lastModify", sdf.format(new Date(tempFile.lastModified())));
			    			 list.add(fileInfo);
			    			 tempFile = null;
	    				 }
		    		 }
	    		 }
	    	 }
	     }
	     
	  Collections.sort(list,new Comparator<Map<String,String>>(){
			@Override
			public int compare(Map<String, String> arg0, Map<String, String> arg1) {
				
				if("0".equalsIgnoreCase(arg0.get("isDir"))&&"1".equalsIgnoreCase(arg1.get("isDir"))){
					return 1;
				}else if("1".equalsIgnoreCase(arg0.get("isDir"))){
					return -1;
				}else{
					return 0;
				}
			}
	     });
	     logger.info("++++++++读取官网文件列表结束+++++++");
	     mv.addObject("files", list);
	     System.gc();    //回收资源
	     return mv; 
	}
}
