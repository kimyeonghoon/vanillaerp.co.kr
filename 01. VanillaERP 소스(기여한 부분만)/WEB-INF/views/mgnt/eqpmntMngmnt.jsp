<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Vanilla ERP - 비품관리</title>
<!-- 헤더 -->
<c:import url="/header"></c:import>
<script src="./resources/script/jquery/jquery-ui.js"></script>
<!-- 비품관리 js 파일 -->
<script src="./resources/script/mgnt/eqpmntMngmnt.js"></script>
<link rel="stylesheet" href="./resources/css/jquery/jquery-ui.css">
<!-- 비품관리 css 파일 -->
<link rel="stylesheet" href="./resources/css/mgnt/eqpmntMngmnt.css">
<script type="text/javascript">
$(document).ready(function() {
	
	// page 값을 전달받은 경우 #page의 value를 전달받은 값으로 변경 
	if("${param.page}" != "") {
		$("#page").val("${param.page}");
	}
	
	// search 값을 전달받은 경우 #search의 value를 전달받은 값으로 변경
	if("${param.search}" != "") {
		$("#search").val("${param.search}");
	}
	
	// search 값을 전달받은 경우 #search의 value를 전달받은 값으로 변경
	if("${param.searchGbn}" != "") {
		$("#searchGbn").val("${param.searchGbn}");
	}

	// 항목과 페이징을 새로 그림
	reloadList();
	
	
	// 검색 버튼 동작
	$("#searchBtn").on("click", function() {
		if($("[name='searchGbn']").val() == 0) {
			makeOneBtnPopup(2, "알림", "검색 유형을 선택해주세요.", true, 300, 180, null, "닫기", function() {
				closePopup(2);
			});
		} else if($("[name='searchGbn']").val() != 0 && $("[name='searchTxt']").val() == '') {
			makeOneBtnPopup(2, "알림", "검색어를 입력해주세요.", true, 300, 180, null, "닫기", function() {
			closePopup(2);
			});
		} else {
			$("#page").val("1");
			reloadList();
		}
	});
	
	// 검색창에서 엔터키 무력화
	$("[name='searchTxt']").on("keypress", function() {
		if(event.keyCode == 13) {
			$("#searchBtn").click();
			return false;
		}		
	});
	
	
	// 전체 보기, 폐기 비품 제외 보기 버튼 동작
	$(".viewSpan").on("click", function() {
		$("#selectView").val($(this).attr("id"));
		$("#page").val("1");
		selectView();
		reloadList();
	});
	
	// 등록 버튼 동작
	$(".writeBtn").on("click", function() {
		regiEqpmmt();
	});
	
	// 수정 버튼 동작
	$(".modifyBtn").on("click", function() {
		$("#actionForm").attr("action", "selEqCheckAjax");
		$("#selectMenu").val("mod");
		selEqCheck();
	});
	
	// 삭제 버튼 동작
	$(".deleteBtn").on("click", function() {
		$("#actionForm").attr("action", "selEqCheckAjax");
		$("#selectMenu").val("del");
		selEqCheck();
	});
	
	// 페이징 버튼 동작
	$(".paging").on("click", ".pagingD", function() {
		$("#page").val($(this).attr("name"));
		reloadList();
	});
	
	// 경영지원팀이 아닌 사람이 해당 페이지에 접근했을 경우 읽기전용으로 작동하도록 설정
	if($("#permission").val() != "ok") {
		$(".searchBtn").css("margin-bottom", "10px");
		$(".deleteBtn").remove();
		$(".modifyBtn").remove();
		$(".writeBtn").remove();
	}
	
	// 전체 보기, 폐기 비품 제외 보기 상태에 따라서 css 변화
	selectView();
	
});

</script>
</head>
<body>
<!-- 탑/레프트 -->
<c:import url="/topLeft">
<%-- 현재 페이지 해당 메뉴번호 지정 --%>
	<c:param name="menuNo" value="23"></c:param>
</c:import>
<!-- 구현내용 -->
<div class="title_wrap">
	<div class="title_table">
		<div class="title_txt">비품관리</div>
	</div>
</div>
<div class="contents_area">
	<!-- 내용은 여기에 구현하세요. -->
	<div class="tbl1">
		<form action="#" method="post" id="actionForm">
			<input type="hidden" name="page" id="page" value="1" />
			<input type="hidden" name="permission" id="permission" value="${permission}" />
			<input type="hidden" name="selectView" id="selectView" />
			<input type="hidden" name="selectMenu" id="selectMenu" />
			<input type="hidden" name="menuNo" id="currentMenu" />
			<select class="select" name="searchGbn">
				<option value="0">분류 선택</option>
				<option value="1">비품명</option>
				<option value="2">관리부서</option>
			</select>
			<input type="text" class="search" name="searchTxt"><input type="button" class="searchBtn" id="searchBtn">
			<span class="viewSpan" id="allView">&nbsp;&nbsp;전체 보기&nbsp;</span>
			<span class="viewSpan" id="excludeView">&nbsp;폐기된 비품 제외하고 보기&nbsp;</span>
			<input type="button" value="폐기" class="deleteBtn">
			<input type="button" value="수정" class="modifyBtn">
			<input type="button" value="등록" class="writeBtn">
			<table class="board">
				<colgroup>
					<col width="2%" />
					<col width="15%" />
					<col width="5%" />
					<col width="8%" />
					<col width="10%" />
					<col width="8%" />
					<col width="8%" />
					<col width="*" />
					<col width="8%" />
					<col width="8%" />
				</colgroup>
				<thead>
					<tr>
						<th></th>
						<th>비품명</th>
						<th>유형</th>
						<th>관리부서</th>
						<th>구입처</th>
						<th>구매가격</th>
						<th>구매일</th>
						<th>메모</th>
						<th>등록일</th>
						<th>폐기일</th>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		</form>
		<div class="paging">
		</div>
	</div>
</div>


<!-- 구현끝 -->
<!-- 바텀 -->
<c:import url="/bottom"></c:import>
</body>
</html>