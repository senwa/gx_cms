package com.gx181.comm;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import net.sf.json.JSONArray;
import net.sf.json.JSONException;
import net.sf.json.JSONObject;

public class StringUtils {
	/**
	    * 字符串判断长度是否符合条件。如果不符合。用传递的字符右侧补充
	    *
	    * @param srcString 源字符串
	    * @param flag            大小写标识，ture小写，false大些
	    * @return 改写后的新字符串
	    */
		public static String padRight(String str, int length, char car) {
			if (str.isEmpty()==false && length>str.length()){
				return str+String.format("%" + (length - str.length()) + "s", "").replace(" ", String.valueOf(car));
			}else{
				return str;
			}
		}
		/**
	    * 字符串判断长度是否符合条件。如果不符合。用传递的字符左侧补充
	    *
	    * @param srcString 源字符串
	    * @param flag            大小写标识，ture小写，false大些
	    * @return 改写后的新字符串
	    */
		public static String padLeft(String str, int length, char car) {
			if (str.isEmpty()==false && length>str.length()){
				return String.format("%" + (length - str.length()) + "s", "").replace(" ", String.valueOf(car))+str;
			}else{
				return str;
			}
		}
		
	  /**
	    * 将一个字符串的首字母改为大写或者小写
	    *
	    * @param srcString 源字符串
	    * @param flag            大小写标识，ture小写，false大些
	    * @return 改写后的新字符串
	    */
	   public static String toLowerCaseInitial(String srcString, boolean flag) {
	       StringBuilder sb = new StringBuilder();
	       if (flag) {
	               sb.append(Character.toLowerCase(srcString.charAt(0)));
	       } else {
	               sb.append(Character.toUpperCase(srcString.charAt(0)));
	       }
	       sb.append(srcString.substring(1));
	       return sb.toString();
	   }
	   
		/**
		 * 判断字符串是否为空
		 * 
		 * @param str
		 * @return
		 */
		public static boolean isEmpty(String str) {
			if (str == null)
				return true;
			if (str.trim().equals(""))
				return true;
			return false;
		}

		/**
		 * 判断字符串非空
		 * 
		 * @param str
		 * @return
		 */
		public static boolean isNotEmpty(String str) {
			return !isEmpty(str);
		}
		/**
		 * 判读输入字符是否是数字
		 * 
		 * @param s
		 * @return
		 */
		public static boolean isNumberic(String s) {
			if (StringUtils.isEmpty(s))
				return false;
			boolean rtn = validByRegex("^[-+]{0,1}\\d*\\.{0,1}\\d+$", s);
			if (rtn)
				return true;

			return validByRegex("^0[x|X][\\da-eA-E]+$", s);
		}

		/**
		 * 是否是整数。
		 * 
		 * @param s
		 * @return
		 */
		public static boolean isInteger(String s) {
			boolean rtn = validByRegex("^[-+]{0,1}\\d*$", s);
			return rtn;

		}

		/**
		 * 是否是电子邮箱
		 * 
		 * @param s
		 * @return
		 */
		public static boolean isEmail(String s) {
			boolean rtn = validByRegex(
					"(\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*)*", s);
			return rtn;
		}

		/**
		 * 手机号码
		 * 
		 * @param s
		 * @return
		 */
		public static boolean isMobile(String s) {
			boolean rtn = validByRegex(
					"^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\\d{8})$", s);
			return rtn;
		}

		/**
		 * 电话号码
		 * 
		 * @param
		 * @return
		 */
		public static boolean isPhone(String s) {
			boolean rtn = validByRegex(
					"(0[0-9]{2,3}\\-)?([2-9][0-9]{6,7})+(\\-[0-9]{1,4})?", s);
			return rtn;
		}

		/**
		 * 邮编
		 * 
		 * @param s
		 * @return
		 */
		public static boolean isZip(String s) {
			boolean rtn = validByRegex("^[0-9]{6}$", s);
			return rtn;
		}

		/**
		 * qq号码
		 * 
		 * @param s
		 * @return
		 */
		public static boolean isQq(String s) {
			boolean rtn = validByRegex("^[1-9]\\d{4,9}$", s);
			return rtn;
		}

		/**
		 * ip地址
		 * 
		 * @param s
		 * @return
		 */
		public static boolean isIp(String s) {
			boolean rtn = validByRegex(
					"^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
					s);
			return rtn;
		}

		/**
		 * 判断是否中文
		 * 
		 * @param s
		 * @return
		 */
		public static boolean isChinese(String s) {
			boolean rtn = validByRegex("^[\u4e00-\u9fa5]+$", s);
			return rtn;
		}

		/**
		 * 字符和数字
		 * 
		 * @param s
		 * @return
		 */
		public static boolean isChrNum(String s) {
			boolean rtn = validByRegex("^([a-zA-Z0-9]+)$", s);
			return rtn;
		}

		/**
		 * 判断是否是URL
		 * 
		 * @param url
		 * @return
		 */
		public static boolean isUrl(String url) {
			return validByRegex(
					"(http://|https://)?([\\w-]+\\.)+[\\w-]+(/[\\w- ./?%&=]*)?",
					url);
		}

		/**
		 * 判断是否json格式
		 * 
		 * @param json
		 * @return
		 */
		public static Boolean isJson(String json) {
			if (isEmpty(json))
				return false;
			try {
				JSONObject.fromObject(json);
				return true;
			} catch (JSONException e) {
				try {
					JSONArray.fromObject(json);
					return true;
				} catch (JSONException ex) {
					return false;
				}
			}
		}
		
		/**
		 * 使用正则表达式验证。
		 * 
		 * @param regex
		 * @param input
		 * @return
		 */
		public static boolean validByRegex(String regex, String input) {
			Pattern p = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
			Matcher regexMatcher = p.matcher(input);
			return regexMatcher.find();
		}
		
		/**
		 * 判断某个字符串是否为数字
		 * 
		 * @param str
		 * @return
		 */
		public static boolean isNumeric(String str) {
			for (int i = str.length(); --i >= 0;) {
				if (!Character.isDigit(str.charAt(i))) {
					return false;
				}
			}
			return true;
			
		}
		
		/**
		 * 截取字符串中最开始的数字 如1023 asda 截取1023
		 * */
		public static String getNumberInString(String str){
			String res = null;
			if(StringUtils.isNotEmpty(str)){
				Pattern pt =  Pattern.compile("\\d+", Pattern.CASE_INSENSITIVE);
				Matcher mt = pt.matcher(str);
				if(mt.find()){
					res = mt.group(0);
				}
			}
			return res;
		}
		
		/*public static void main(String args[]){
			
			System.out.println(getNumberInString("12321 sada 21sdfs sdf 33"));
		}*/
}
