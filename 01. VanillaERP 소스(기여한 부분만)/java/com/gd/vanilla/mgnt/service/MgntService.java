package com.gd.vanilla.mgnt.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gd.vanilla.mgnt.dao.IMgntDao;

@Service
public class MgntService implements IMgntService {
	@Autowired
	public IMgntDao iMgntDao;

	/* WRHS 창고관리 */
	
	/*
	 	창고관리 리스트 AJAX
	 */
	@Override
	public int getWrhsCnt(HashMap<String, String> params) throws Throwable {
		return iMgntDao.getWrhsCnt(params);
	}
	
	@Override
	public List<HashMap<String, String>> getWrhsList(HashMap<String, String> params) throws Throwable {
		return iMgntDao.getWrhsList(params);
	}
	
	/*
	 	창고관리 추가 AJAX
	 */
	@Override
	public void addWrhs(HashMap<String, String> params) throws Throwable {
		iMgntDao.addWrhs(params);
	}
	
	/*
	 	창고관리 수정 AJAX
	 */
	@Override
	public int updateWrhs(HashMap<String, String> params) throws Throwable {
		return iMgntDao.updateWrhs(params);
	}
	
	/*
 		창고관리 폐기 AJAX
	 */
	@Override
	public int delWrhs(HashMap<String, String> params) throws Throwable {
		return iMgntDao.delWrhs(params);
	}
	
	/*
		창고관리 항목 선택 확인 AJAX
	 */
	@Override
	public int selWrhsCheck(HashMap<String, String> params) throws Throwable {
		return iMgntDao.selWrhsCheck(params);
	}
	
	@Override
	public int endWrhsCheck(HashMap<String, String> params) throws Throwable {
		return iMgntDao.endWrhsCheck(params);
	}
	
	@Override
	public List<HashMap<String, String>> getWrhs(HashMap<String, String> params) throws Throwable {
		return iMgntDao.getWrhs(params);
	}
	
	
	/* EQPMNT 비품관리 */
	
	/*
		비품관리 리스트 AJAX
	 */
	@Override
	public int getEqCnt(HashMap<String, String> params) throws Throwable {
		return iMgntDao.getEqCnt(params);
	}
	
	@Override
	public List<HashMap<String, String>> getEqList(HashMap<String, String> params) throws Throwable {
		return iMgntDao.getEqList(params);
	}
	
	/*
		비품관리 비품 추가 AJAX
	 */
	@Override
	public void addEq(HashMap<String, String> params) throws Throwable {
		iMgntDao.addEq(params);
	}
	
	/*
		비품관리 수정 AJAX
	 */
	@Override
	public int updateEq(HashMap<String, String> params) throws Throwable {
		return iMgntDao.updateEq(params);
	}
	
	/*
		비품관리 폐기 AJAX
	 */
	@Override
	public int delEq(HashMap<String, String> params) throws Throwable {
		return iMgntDao.delEq(params);
	}
	
	/*
		비품관리 항목 선택 확인 AJAX
	 */
	@Override
	public int selEqCheck(HashMap<String, String> params) throws Throwable {
		return iMgntDao.selEqCheck(params);
	}

	@Override
	public int rscrdCheck(HashMap<String, String> params) throws Throwable {
		return iMgntDao.rscrdCheck(params);
	}
	
	@Override
	public List<HashMap<String, String>> getEq(HashMap<String, String> params) throws Throwable {
		return iMgntDao.getEq(params);
	}
	
	/*
		[창고관리/비품관리] 팝업에서 셀렉트 박스 부분 디비에서 조회
	 */
	@Override
	public List<HashMap<String, String>> getDprtList(HashMap<String, String> params) throws Throwable {
		return iMgntDao.getDprtList(params);
	}

	@Override
	public List<HashMap<String, String>> getEqTypeList(HashMap<String, String> params) throws Throwable {
		return iMgntDao.getEqTypeList(params);
	}

	@Override
	public List<HashMap<String, String>> getEmplyList(HashMap<String, String> params) throws Throwable {
		return iMgntDao.getEmplyList(params);
	}
}
