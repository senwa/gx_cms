package com.gx181.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class MainController {

	 @RequestMapping("/main") 
	   public ModelAndView hello(){ 
	     ModelAndView mv =new ModelAndView(); 
	     mv.addObject("spring", "spring mvc"); 
	     mv.setViewName("main"); 
	     return mv; 
	   } 
}
