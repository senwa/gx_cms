package com.gx181.controller;


import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.ModelAndView;

import com.gx181.comm.FileUtil;
import com.gx181.comm.StringUtils;
import com.gx181.property.Config;

@Controller
@RequestMapping(value="/fileManage") 
public class FileManagerController {

	@Resource(name = "configProperty")
	private Config configProperty;  
	Logger logger = LoggerFactory.getLogger(FileManagerController.class);
	
	 @RequestMapping(value ="/getFileContent",produces="text/html;charset=UTF-8") 
	 @ResponseBody 
	 public String getFileContent(HttpServletRequest request, HttpServletResponse response){ 
		 String filePath = request.getParameter("filePath");
		 try{
			 if(StringUtils.isNotEmpty(filePath)){
				 if(filePath.contains("..")){
					 throw new Exception("Bad guy...");
				 }
				 File file = new File(filePath);
				 if(file.exists()&&file.isFile()&&FileUtil.isNormalFile(file)&&("css".equalsIgnoreCase(FileUtil.getFileExt(file))||"js".equalsIgnoreCase(FileUtil.getFileExt(file))||"html".equalsIgnoreCase(FileUtil.getFileExt(file)))){
					String fileContentStr = FileUtil.inputStream2String(new FileInputStream(file));
					
					
					return fileContentStr;
				 }
			 }
		 }catch(Exception e){
			 e.printStackTrace();
		 }
		 return "";
	 }
	 
	 @RequestMapping(value ="/getFileList") 
	 @ResponseBody 
	 public List<Map<String,String>> getFileList(HttpServletRequest request, HttpServletResponse response){ 
		 String filePath = request.getParameter("filePath");//images js news这类的
		 try{
			 if(StringUtils.isNotEmpty(filePath)){
				 if(filePath.contains("..")){
					 throw new Exception("Bad guy...");
				 }
				 
				 String cmsAbsolutePath = request.getSession().getServletContext().getRealPath("");
			     String tempWorkPath = cmsAbsolutePath+File.separator+"tempWork";//临时目录已经配置成静态资源路径
				 File fileDir = new File(tempWorkPath+File.separator+filePath);
				 List<Map<String,String>> list = new ArrayList<Map<String,String>>();
				 if(fileDir.exists()&&fileDir.isDirectory()){
					 Map<String,String> fileInfo = null;
					 File[] files = fileDir.listFiles();
		    		 if(files!=null&&files.length>0){
		    			 BufferedImage sourceImg = null;
		    			 for(int i=0; i<files.length; i++){
		    				 if(FileUtil.isNormalFile(files[i])){//只处理特定类型的文件
		    					 fileInfo = new HashMap<String,String>();
				    			 fileInfo.put("isDir", files[i].isDirectory()?"1":"0");//文件或者文件夹类别
				    			 fileInfo.put("fileName", files[i].getName());//名称
				    			 fileInfo.put("fileExt", FileUtil.getFileExt(files[i]));//后缀
				    			 fileInfo.put("parentDirPath", filePath);//,当前父文件夹路径
				    			 fileInfo.put("fileSize", String.format("%.1f",files[i].length()/1024.0));
				    			 boolean isImage = FileUtil.isImage(files[i]);
				    			 fileInfo.put("isImage", isImage?"1":"0");//,当前父文件夹路径
				    			 if(isImage){
				    				 sourceImg =ImageIO.read(new FileInputStream(files[i])); 
					    			 fileInfo.put("imgWidth", sourceImg.getWidth()+"");
					    			 fileInfo.put("imgHeight", sourceImg.getHeight()+"");
				    			 }
				    			 list.add(fileInfo);
		    				 }
			    		 }
		    		 }
					 
				 }
				return list; 
			 }
		 }catch(Exception e){
			 e.printStackTrace();
		 }
		 return null;
	 }
	 
	 @RequestMapping("upload")
	 public ModelAndView  upload(MultipartHttpServletRequest multiRequest) throws Exception{
	         //将当前上下文初始化给  CommonsMutipartResolver （多部分解析器）
	       // CommonsMultipartResolver multipartResolver=new CommonsMultipartResolver(request.getSession().getServletContext());
	        //检查form中是否有enctype="multipart/form-data"
			 ModelAndView mv =new ModelAndView(); 
		     mv.addObject("info", "文件上传成功"); 
		     mv.setViewName("/admin/fileUploadSuccess"); 	
			 Map<String, MultipartFile> files = multiRequest.getFileMap(); 
			 try{
				 if(!files.isEmpty()){
		        	 String currentPath = multiRequest.getParameter("currentPath");
		        	 String cmsAbsolutePath = multiRequest.getSession().getServletContext().getRealPath("");
		    	     String tempWorkPath = cmsAbsolutePath+File.separator+"tempWork";//临时目录已经配置成静态资源路径
		        	
		    	     if(StringUtils.isNotEmpty(currentPath)&&currentPath.contains("..")){
		    	    	 throw new Exception("bad guy....");
		    	     }
		    	     
		           //获取multiRequest 中所有的文件名
		            Iterator<String> iter=multiRequest.getFileNames();
		            while(iter.hasNext()){
		                //一次遍历所有文件
		                MultipartFile file=multiRequest.getFile(iter.next().toString());
		                if(file!=null)
		                {
		                    String realPath=tempWorkPath + File.separator+currentPath+File.separator+file.getOriginalFilename();
		                    logger.warn("收到上传的文件,存储到:"+realPath);
		                    //上传
		                    file.transferTo(new File(realPath));
		                }
		            }
		        }
				 
			 }catch(Exception e){
				 e.printStackTrace();
				 mv.addObject("info", "文件上传失败"); 
				 mv.addObject("error", e.getMessage()); 
			 }
	    
	     return mv;
	 }
	 
	@RequestMapping("download") 
	public ModelAndView download(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		String  downFileName= request.getParameter("downFileName");
		String  downCurrentPath= request.getParameter("downCurrentPath");
		 ModelAndView mv =new ModelAndView(); 
	     mv.addObject("info", "文件下载成功"); 
	     mv.setViewName("/admin/fileUploadSuccess"); 	
		try{
			if(StringUtils.isNotEmpty(downFileName)){
				//filepath = URLDecoder.decode(filepath,"UTF-8");
				String cmsAbsolutePath = request.getSession().getServletContext().getRealPath("");
	    	    String tempWorkPath = cmsAbsolutePath+File.separator+"tempWork";//临时目录已经配置成静态资源路径
	        	
	    	     if(StringUtils.isNotEmpty(downCurrentPath)&&downCurrentPath.contains("..")){
	    	    	 throw new Exception("bad guy....");
	    	     }
				String downloadPath = tempWorkPath+File.separator+downCurrentPath+File.separator+downFileName;
				//判断文件是否存在，创建文件
			    File file=new File(downloadPath);
			  //验证要下载的文件是否存在当前文件夹下，防止linux../../ect/passoword漏洞
			    File fileParent=new File(tempWorkPath);
			    if(!file.exists()||!FileUtil.isSubFile(fileParent, file))
			    {
			    	 throw new Exception("bad guy....");
			    }
			    logger.warn("下载文件{}",downloadPath);
			    FileInputStream fileInputStream = new FileInputStream(file);
				byte[] bytes = FileUtil.readByte(fileInputStream);
				fileInputStream.close();
				FileUtil.downLoadFileByByte(request, response, bytes, downFileName);
			}
		}catch(java.io.FileNotFoundException e){
			e.printStackTrace();
			System.out.println("没找到路径下的文件:"+downCurrentPath+"/"+downFileName);
			 mv.addObject("info", "找不到要下载的文件,文件下载失败"); 
			 mv.addObject("error", e.getMessage()); 
		} catch (Exception e) {
			 e.printStackTrace();
			 mv.addObject("info", "文件下载失败"); 
			 mv.addObject("error", e.getMessage()); 
		}
		return mv;
	}
	 
}
