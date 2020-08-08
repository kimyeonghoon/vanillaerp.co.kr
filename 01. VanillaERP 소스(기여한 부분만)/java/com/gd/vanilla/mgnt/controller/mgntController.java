package com.gd.vanilla.mgnt.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gd.vanilla.common.bean.PagingBean;
import com.gd.vanilla.common.service.IPagingService;
import com.gd.vanilla.mgnt.service.IMgntService;

@Controller
public class mgntController {
	@Autowired
	public IMgntService iMgntService;

	@Autowired
	public IPagingService iPagingService;

	/* EQPMNT 비품관리 */
	
	/*
		비품관리 메인 : 비품의 리스트 생성, 페이징 생성
	 */	
	@RequestMapping(value = "/eqpmntMngmnt") 
	public ModelAndView eqpmntMngmnt(HttpSession session, ModelAndView mav) throws Throwable {
		
		// 현재 로그인한 사람의 부서번호를 넣음(경영관리부가 아닌 다른 부서일 경우 해당 부서항목만 리스트 불러오도록 설정)
		if(String.valueOf(session.getAttribute("sDprtmntNo")).equals("5")) {
			mav.addObject("permission", "ok");
		} else {
			mav.addObject("permission", "readonly");
		}
		
		mav.setViewName("mgnt/eqpmntMngmnt");
		return mav;
	}
	
	/*
		비품관리 리스트 AJAX : 비품의 리스트 생성, 페이징 생성
	*/	
	@RequestMapping(value = "/listEqAjax", method = RequestMethod.POST, produces = "text/json;charset=UTF-8")
	@ResponseBody
	public String listEqAjax(@RequestParam HashMap<String, String> params, ModelAndView mav, HttpSession session) throws Throwable {
		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> modelMap = new HashMap<String, Object>();

		// 현재 로그인한 사람의 부서번호를 넣음(경영관리부가 아닌 다른 부서일 경우 해당 부서항목만 리스트 불러오도록 설정)
		params.put("userDprtmntNo",String.valueOf(session.getAttribute("sDprtmntNo")));
		
		// 페이지의 값이 null인 경우 1로 지정
		if(params.get("page") == null) {
			params.put("page", "1");
		}
		// selectView의 값이 null인 경우 allView로 지정
		if(params.get("selectView") == null) {
			params.put("selectView", "allView");
		}
		
		try {
			// 비품의 갯수를 셈
			int cnt = iMgntService.getEqCnt(params);
			
			// 페이징 빈 생성
			PagingBean pb = iPagingService.getPageingBean(Integer.parseInt(params.get("page")), cnt, 10, 5);

			params.put("startCnt", Integer.toString(pb.getStartCount()));
			params.put("endCnt", Integer.toString(pb.getEndCount()));
			
			// 비품 리스트를 불러옴
			List<HashMap<String,String>> list = iMgntService.getEqList(params);
			
			//view에 전달할 값 추가(list, pb, userDprtmntNo, result)
			modelMap.put("list", list);
			modelMap.put("pb", pb);
			modelMap.put("userDprtmntNo",String.valueOf(session.getAttribute("sDprtmntNo")));
			modelMap.put("result", "success");
		} catch (Throwable e) {
			e.printStackTrace();
			modelMap.put("result", "exception");
		}
		
		return mapper.writeValueAsString(modelMap);
	}
	
	/*
		비품관리 비품 추가 AJAX : 비품을 추가하는 AJAX
	*/
	@RequestMapping(value = "/addEqAjax", method = RequestMethod.POST, produces = "text/json;charset=UTF-8")
	@ResponseBody
	public String addEqAjax(@RequestParam HashMap<String, String> params, ModelAndView mav) throws Throwable {
		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> modelMap = new HashMap<String, Object>();
		try {
			// 비품 추가
			iMgntService.addEq(params);
			modelMap.put("result", "success");
		} catch (Throwable e) {
			e.printStackTrace();
			modelMap.put("result", "exception");
		}
		
		return mapper.writeValueAsString(modelMap);
	}
	
	/*
		비품관리 수정 AJAX : 비품을 수정하는 AJAX
	*/
	@RequestMapping(value = "/modEqAjax", method = RequestMethod.POST, produces =  "text/json;charset=UTF-8")
	@ResponseBody
	public String modEqAjax(@RequestParam HashMap<String,String> params, ModelAndView mav) throws Throwable {
		
		ObjectMapper mapper = new ObjectMapper();
		
		Map<String, Object> modelMap = new HashMap<String, Object>();
		try {
			// 비품을 업데이트 하고, 변수로 업데이트가 된 행의 수를 담음
			int cnt = iMgntService.updateEq(params);
	
			// 업데이트가 정상적으로 이루어졌을 경우 modelMap에 result 키의 값을 success로 지정. 실패시 fail으로 지정
			if(cnt > 0) {
				modelMap.put("result", "success");
			} else {
				modelMap.put("result", "fail");
			}
		} catch (Throwable e) {
			e.printStackTrace();
			modelMap.put("result", "exception");
		}
		
		return mapper.writeValueAsString(modelMap);
	}
	
	/*
		 비품 폐기 AJAX : 비품을 폐기하는 AJAX
	*/
	@RequestMapping(value = "/delEqAjax", method = RequestMethod.POST, produces = "text/json;charset=UTF-8")
	@ResponseBody
	public String delEqAjax(@RequestParam HashMap<String, String> params, ModelAndView mav) throws Throwable {
		
		ObjectMapper mapper = new ObjectMapper();
		
		Map<String, Object> modelMap = new HashMap<String, Object>();
		try {
			// 비품을 업데이트 하고, 변수로 폐기가 된 행의 수를 담음
			int cnt = iMgntService.delEq(params);
			
			// 폐기가 정상적으로 이루어졌을 경우 modelMap에 result 키의 값을 success로 지정. 실패시 notDelete으로 지정
			if(cnt > 0) {
				modelMap.put("result", "success");
			} else {
				modelMap.put("result", "notDelete");
			}
		} catch (Throwable e) {
			e.printStackTrace();
			modelMap.put("result", "exception");
		}
		
		return mapper.writeValueAsString(modelMap);
	}
	
	/*
		비품관리 항목 선택 확인 AJAX : 선택한 비품을 수정 또는 삭제할 수 있는지 여부 확인
	*/
	@RequestMapping(value = "/selEqCheckAjax", method = RequestMethod.POST, produces = "text/json;charset=UTF-8") 
	@ResponseBody
	public String selEqCheckAjax(@RequestParam HashMap<String, String> params, ModelAndView mav) throws Throwable {
		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> modelMap = new HashMap<String, Object>();
		
		// 수정 버튼과 삭제 버튼 중 어느 버튼을 선택했는지를 modelMap에 담음
		modelMap.put("selectMenu", params.get("selectMenu"));
		
		if(params.get("listRadio") == null) { // 항목을 선택하지 않은 상태에서 버튼 클릭
			modelMap.put("result", "notSelected");
		} else { // 항목을 선택한 후 버튼 클릭
			
			// 선택한 항목의 고유 번호를 modelMap에 담음
			modelMap.put("listRadio", params.get("listRadio"));
			
			try {
				// 선택한 비품이 존재하는지 확인
				int cnt = iMgntService.selEqCheck(params);
				
				// 이미 폐기된 비품인지 아닌지 여부를 확인
				int rscrdCheck = iMgntService.rscrdCheck(params);
				
				
				if(cnt > 0) { // 선택한 비품이 디비에 존재하는 경우 아래 내용이 실행됨
					
					if(params.get("selectMenu").equals("del") && rscrdCheck > 0) { // [폐기버튼] 폐기 불가(이미 폐기됨)
						modelMap.put("result", "dscrdExist");
					} else if(params.get("selectMenu").equals("mod") && rscrdCheck > 0) { // [수정버튼] 수정 불가(이미 폐기됨) 
						modelMap.put("result", "dscrdExist");
					} else if(params.get("selectMenu").equals("mod")) { // [수정버튼] 수정이 가능한 상태

						// 해당 항목의 내용을 리스트로 저장
						List<HashMap<String,String>> list = iMgntService.getEq(params);
						
						// 부서 리스트를 불러온 후 값을 담음
						List<HashMap<String,String>> dprtList = iMgntService.getDprtList(params);
						
						// 비품 타입을 불러온 후 값을 담음
						List<HashMap<String,String>> eqTypeList = iMgntService.getEqTypeList(params);
						
						modelMap.put("list", list);
						modelMap.put("eqTypeList", eqTypeList);
						modelMap.put("dprtList", dprtList);
						modelMap.put("result", "success");
					} else { // [삭제버튼] 삭제가 가능한 상태
						modelMap.put("result", "success");
					}
				}
			} catch (Throwable e) {
				e.printStackTrace();
				modelMap.put("result", "exception");
			}
		}
		return mapper.writeValueAsString(modelMap);
	}
	
	/*
		[비품관리/창고관리] 셀렉트박스 리스트 조회 AJAX(등록버튼 클릭시 : <select>박스의 <option>값을 동적으로 처리하기 위해 부서, 사원, 비품유형을 조회 
	*/
	@RequestMapping(value = "/selboxListAjax", method = RequestMethod.POST, produces = "text/json;charset=UTF-8")
	@ResponseBody
	public String selboxListAjax(@RequestParam HashMap<String, String> params, ModelAndView mav) throws Throwable {
		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> modelMap = new HashMap<String, Object>();
		
		try {
			// 부서 리스트를 불러온 후 값을 담음
			List<HashMap<String,String>> dprtList = iMgntService.getDprtList(params);
			
			// 직원의 리스트를 불러온 후 값을 담음
			List<HashMap<String,String>> emplyList = iMgntService.getEmplyList(params);
			
			// 비품 타입을 불러온 후 값을 담음
			List<HashMap<String,String>> eqTypeList = iMgntService.getEqTypeList(params);

			modelMap.put("eqTypeList", eqTypeList);
			modelMap.put("dprtList", dprtList);
			modelMap.put("emplyList", emplyList);
			modelMap.put("result", "success");
		} catch (Throwable e) {
			e.printStackTrace();
			modelMap.put("result", "exception");
		}
		
		return mapper.writeValueAsString(modelMap);
	}


	/* WRHS */
	
	/*
		창고관리 메인 페이지 : 현재 로그인한 사용자가 해당 주소로 접근 시 경영관리부서 직원인지 확인 후 mgnt/wrhsMngmnt로 이동(해당 부서 정보도 같이 넘김)
	*/
	@RequestMapping(value = "/wrhsMngmnt")
	public ModelAndView wrhsMngmnt(HttpSession session, ModelAndView mav) throws Throwable {
		
		// 해당 페이지에 접근한 사람이 경영관리부 소속인지 아닌지 체크(아닐 경우 읽기 전용)
		if(String.valueOf(session.getAttribute("sDprtmntNo")).equals("5")) {
			mav.addObject("permission", "ok");
		} else {
			mav.addObject("permission", "readonly");
		}
		
		mav.setViewName("mgnt/wrhsMngmnt");
		
		return mav;
	}
	
	/*
		창고관리 리스트 AJAX : 창고 리스트 생성, 페이징 생성
	*/	
	@RequestMapping(value = "/listWrhsAjax", method = RequestMethod.POST, produces = "text/json;charset=UTF-8")
	@ResponseBody
	public String listWhqAjax(@RequestParam HashMap<String, String> params, ModelAndView mav, HttpSession session) throws Throwable {
		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> modelMap = new HashMap<String, Object>();
		
		// 현재 로그인한 사람의 부서번호를 넣음
		params.put("userDprtmntNo",String.valueOf(session.getAttribute("sDprtmntNo")));
		
		// 페이지의 값이 null인 경우 1로 지정
		if(params.get("page") == null) {
			params.put("page", "1");
		}
		
		// selectView의 값이 null인 경우 allView로 지정
		if(params.get("selectView") == null) {
			params.put("selectView", "allView");
		}
		
		try {
			// 창고의 갯수를 셈
			int cnt = iMgntService.getWrhsCnt(params);
			
			// 페이징 빈 생성
			PagingBean pb = iPagingService.getPageingBean(Integer.parseInt(params.get("page")), cnt, 10, 5);
			
			params.put("startCnt", Integer.toString(pb.getStartCount()));
			params.put("endCnt", Integer.toString(pb.getEndCount()));
			
			// 창고 리스트를 불러옴
			List<HashMap<String,String>> list = iMgntService.getWrhsList(params);
			
			// 창고 리스트, 페이징 관련 값, 성공 값을 modelMap에 저장
			modelMap.put("list", list);
			modelMap.put("pb", pb);
			modelMap.put("userDprtmntNo",String.valueOf(session.getAttribute("sDprtmntNo")));
			modelMap.put("result", "success");
		} catch (Throwable e) {
			e.printStackTrace();
			modelMap.put("result", "exception");
		}
		
		return mapper.writeValueAsString(modelMap);
	}
	
	/*
		창고관리 창고 추가 AJAX : 창고를 추가하는 AJAX
	*/
	@RequestMapping(value = "/addWrhsAjax", method = RequestMethod.POST, produces = "text/json;charset=UTF-8")
	@ResponseBody
	public String addWrhsAjax(@RequestParam HashMap<String, String> params, ModelAndView mav) throws Throwable {
		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> modelMap = new HashMap<String, Object>();
		
		try {
			// 창고 추가
			iMgntService.addWrhs(params);
			modelMap.put("result", "success");
		} catch (Throwable e) {
			e.printStackTrace();
			modelMap.put("result", "exception");
		}
		
		return mapper.writeValueAsString(modelMap);
	}
	
	/*
		창고관리 수정 AJAX : 창고를 수정하는 AJAX
	*/
	@RequestMapping(value = "/modWrhsAjax", method = RequestMethod.POST, produces =  "text/json;charset=UTF-8")
	@ResponseBody
	public String modWrhsAjax(@RequestParam HashMap<String,String> params, ModelAndView mav) throws Throwable {
		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> modelMap = new HashMap<String, Object>();
		
		try {
			// 창고를 업데이트 하고, 변수로 업데이트가 된 행의 수를 담음
			int cnt = iMgntService.updateWrhs(params);
			
			// 업데이트가 정상적으로 이루어졌을 경우 modelMap에 result 키의 값을 success로 지정. 실패시 fail으로 지정
			if(cnt > 0) {
				modelMap.put("result", "success");
			} else {
				modelMap.put("result", "fail");
			}
		} catch (Throwable e) {
			e.printStackTrace();
			modelMap.put("result", "exception");
		}
		
		return mapper.writeValueAsString(modelMap);
	}
	
	/*
	 	창고 폐기 AJAX : 창고를 폐기하는 AJAX
	*/
	@RequestMapping(value = "/delWrhsAjax", method = RequestMethod.POST, produces = "text/json;charset=UTF-8")
	@ResponseBody
	public String delWrhsAjax(@RequestParam HashMap<String, String> params, ModelAndView mav) throws Throwable {
		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> modelMap = new HashMap<String, Object>();
		
		try {
			// 창고를 업데이트 하고, 변수로 폐기가 된 행의 수를 담음
			int cnt = iMgntService.delWrhs(params);
			
			// 폐기가 정상적으로 이루어졌을 경우 modelMap에 result 키의 값을 success로 지정. 실패시 notDelete으로 지정
			if(cnt > 0) {
				modelMap.put("result", "success");
			} else {
				modelMap.put("result", "notDelete");
			}
		} catch (Throwable e) {
			e.printStackTrace();
			modelMap.put("result", "exception");
		}
		
		return mapper.writeValueAsString(modelMap);
	}
	
	/*
		창고관리 항목 선택 확인 AJAX : 선택한 창고를 수정 또는 삭제할 수 있는지 여부 확인
	*/
	@RequestMapping(value = "/selWrhsCheckAjax", method = RequestMethod.POST, produces = "text/json;charset=UTF-8") 
	@ResponseBody
	public String selWrhsCheckAjax(@RequestParam HashMap<String, String> params, ModelAndView mav) throws Throwable {
		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> modelMap = new HashMap<String, Object>();
		
		// 수정 버튼과 삭제 버튼 중 어느 버튼을 선택했는지를 modelMap에 담음
		modelMap.put("selectMenu", params.get("selectMenu"));
		
		// 항목을 선택하지 않은 상태에서 수정이나 삭제버튼을 누렀을 경우 result에 notSelected를 담음
		if(params.get("listRadio") == null) {
			modelMap.put("result", "notSelected");
		} else {
			// 선택한 항목의 고유 번호를 modelMap에 담음
			modelMap.put("listRadio", params.get("listRadio"));
			try {
				// 선택한 창고가 존재하는지 확인
				int cnt = iMgntService.selWrhsCheck(params);
				
				// 이미 폐기된 창고인지 아닌지 여부를 확인
				int endWrhsCheck = iMgntService.endWrhsCheck(params);
				
				// 선택한 창고가 디비에 존재하는 경우 아래 내용이 실행됨
				if(cnt > 0) {
					
					if(params.get("selectMenu").equals("del") && endWrhsCheck > 0) { // [폐기버튼] 폐기 불가(이미 폐기됨)
						modelMap.put("result", "endWrhsCheck");
					} else if(params.get("selectMenu").equals("mod") && endWrhsCheck > 0) { // [수정버튼] 수정 불가(이미 폐기됨) 
						modelMap.put("result", "endWrhsCheck");
					} else if(params.get("selectMenu").equals("mod")) { // [수정버튼] 수정이 가능한 상태
					
						// 해당 항목의 내용을 리스트로 저장
						List<HashMap<String,String>> list = iMgntService.getWrhs(params);
						
						// 부서 리스트를 불러온 후 값을 담음
						List<HashMap<String,String>> dprtList = iMgntService.getDprtList(params);
						
						// 사원 리스트를 불러온 후 값을 담음
						List<HashMap<String,String>> emplyList = iMgntService.getEmplyList(params);
	
						modelMap.put("list", list);
						modelMap.put("dprtList", dprtList);
						modelMap.put("emplyList", emplyList);
						modelMap.put("result", "success");
					} else { // [삭제버튼] 삭제가 가능한 상태
						modelMap.put("result", "success");
					}
					
				}
			} catch (Throwable e) {
				e.printStackTrace();
				modelMap.put("result", "exception");
			}
		}
		
		return mapper.writeValueAsString(modelMap);
	}
	
	/*
		사원조회 리스트 AJAX : <select>박스 <option>에 들어갈 값 조회 
	*/
	@RequestMapping(value = "/emplyListAjax", method = RequestMethod.POST, produces = "text/json;charset=UTF-8")
	@ResponseBody
	public String emplyListAjax(@RequestParam HashMap<String, String> params, ModelAndView mav) throws Throwable {
		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> modelMap = new HashMap<String, Object>();
		
		try {
			// 선택한 부서에 속해있는 사원 리스트 조회
			List<HashMap<String,String>> emplyList = iMgntService.getEmplyList(params);
			
			modelMap.put("emplyList", emplyList);
			modelMap.put("result", "success");
		} catch (Throwable e) {
			
			e.printStackTrace();
			modelMap.put("result", "exception");
		}
		
		return mapper.writeValueAsString(modelMap);
	}
	
}