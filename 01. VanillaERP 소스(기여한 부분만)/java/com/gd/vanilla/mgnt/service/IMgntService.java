package com.gd.vanilla.mgnt.service;

import java.util.HashMap;
import java.util.List;

public interface IMgntService {
	/* WRHS 창고관리 */
			
	// 창고관리 리스트 AJAX
	public int getWrhsCnt(HashMap<String, String> params) throws Throwable;
	public List<HashMap<String, String>> getWrhsList(HashMap<String, String> params) throws Throwable;
	// 창고관리 추가 AJAX
	public void addWrhs(HashMap<String, String> params) throws Throwable;
	// 창고관리 수정 AJAX
	public int updateWrhs(HashMap<String, String> params) throws Throwable;
	// 창고 폐기 AJAX
	public int delWrhs(HashMap<String, String> params) throws Throwable;
	// 창고관리 항목 선택 확인 AJAX
	public int selWrhsCheck(HashMap<String, String> params) throws Throwable;
	public int endWrhsCheck(HashMap<String, String> params) throws Throwable;
	public List<HashMap<String, String>> getWrhs(HashMap<String, String> params) throws Throwable;
	
	
	/* EQPMNT 비품 */
	
	// 비품관리 리스트 AJAX
	public int getEqCnt(HashMap<String, String> params) throws Throwable;
	public List<HashMap<String, String>> getEqList(HashMap<String, String> params) throws Throwable;
	// 비품관리 비품 추가 AJAX
	public void addEq(HashMap<String, String> params) throws Throwable;
	// 비품관리 수정 AJAX
	public int updateEq(HashMap<String, String> params) throws Throwable;
	// 비품 폐기 AJAX
	public int delEq(HashMap<String, String> params) throws Throwable;
	// 비품관리 항목 선택 확인 AJAX
	public int selEqCheck(HashMap<String, String> params) throws Throwable;
	public int rscrdCheck(HashMap<String, String> params) throws Throwable;
	public List<HashMap<String, String>> getEq(HashMap<String, String> params) throws Throwable;
	// [창고관리/비품관리] 팝업에서 셀렉트 박스 부분 디비에서 조회
	public List<HashMap<String, String>> getDprtList(HashMap<String, String> params) throws Throwable;
	public List<HashMap<String, String>> getEqTypeList(HashMap<String, String> params) throws Throwable;
	public List<HashMap<String, String>> getEmplyList(HashMap<String, String> params) throws Throwable;

}