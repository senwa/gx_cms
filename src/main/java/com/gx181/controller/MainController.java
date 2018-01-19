package com.gx181.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value="/admin") 
public class MainController {

	 @RequestMapping(value ="/main") 
	   public ModelAndView hello(){ 
	     ModelAndView mv =new ModelAndView(); 
	     mv.addObject("spring", "spring mvc"); 
	     mv.setViewName("/admin/main"); 
	     
	     //加载静态网页文件列表
	     
	     
	     
	     System.out.println("main");
	     return mv; 
	   }
	 
	 @RequestMapping(value ="/login") 
	   public ModelAndView login(){ 
	     ModelAndView mv =new ModelAndView(); 
	     mv.addObject("spring", "spring mvc"); 
	     mv.setViewName("main"); 
	     return mv; 
	   } 
}
