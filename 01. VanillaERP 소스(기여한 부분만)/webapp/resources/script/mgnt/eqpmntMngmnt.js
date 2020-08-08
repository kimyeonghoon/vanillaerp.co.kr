// 게시판을 다시 그리는 function
function reloadList() { 
	var params = $("#actionForm").serialize();
	$.ajax({
		type : "post",			  
		url : "listEqAjax", 	  
		dataType : "json",  	 
		data : params,    		  
		success : function(res) { 
			if(res.result == "success") {
				redrawList(res.list, res.userDprtmntNo);
				redrawPaging(res.pb);
			} else {
				makeOneBtnPopup(1, "알림", "조회중 문제가 발생했습니다.", true, 300, 180, null, "닫기", function() {
					closePopup(1);
				});
			}
		},
		error : function(request, status, error) {  
			console.log("text : " + request.responseTxt);
			console.log("error : " + error);
		}
	});
}

// 게시물 리스트을 다시 그리는 function
function redrawList(list, userDprtmntNo) {
	if(list.length == 0) { // 조회된 결과가 없을 때
		var html = "";
		html += "<tr>";
		html += "<td colspan=\"10\">조회 결과가 없습니다.</td>";
		html += "</tr>";
		$(".board tbody").html(html);
	} else { // 조회된 결과가 있을 때
		var html = "";
		for(var i = 0 ; i < list.length ; i++) {
			html += "<tr name=\"" + list[i].EQPMNT_NO + "\">";
			if(userDprtmntNo == 5) { // 경영관리부 소속 사원이 접근했을 때 라디오버튼 생성
				html += "<td><input type=\"radio\" name=\"listRadio\" value=\"" + list[i].EQPMNT_NO + "\"></td>";
			} else { // 그외에는 라디오버튼을 생성하지 않음
				html += "<td></td>";
			}
			html += "<td>" + list[i].EQPMNT_NAME + "</td>";
			html += "<td>" + list[i].EQPMNT_TYPE_NAME + "</td>";
			html += "<td>" + list[i].DPRTMNT_NAME + "</td>";
			html += "<td>" + list[i].PRCHS_STORE + "</td>";
			html += "<td>" + list[i].PRCHS_PRICE + "</td>";
			html += "<td>" + list[i].PRCHS_DATE + "</td>";
			html += "<td>" + list[i].MEMO + "</td>";
			html += "<td>" + list[i].RGSTRTN_DATE + "</td>";
			html += "<td>" + list[i].DSCRD_DATE + "</td>";
			html += "</tr>";
		}
		$(".board tbody").html(html);
	}
}

// 페이징을 다시 그리는 function
function redrawPaging(pb) {
	var html = "<div class=\"pagingD\" id=\"first\" name=\"1\"></div>";
	
	if($("#page").val() == 1) {
		html += "<div class=\"pagingD\" id=\"before\" name=\"1\"></div>";
	} else {
		html += "<div class=\"pagingD\" id=\"before\" name=\"" + ($("#page").val() * 1 - 1)  + "\"></div>";
	}
	
	for(var i = pb.startPcount ; i <= pb.endPcount ; i++) {
		if(i == $("#page").val()) {
			html += "<div class=\"pagingD\" name=\"" + i + "\"><b>" + i + "</b></div>";
		} else {
			html += "<div class=\"pagingD\" name=\"" + i + "\">" + i + "</div>";
		}
	}
	
	if($("#page").val() == pb.maxPcount) {
		html += "<div class=\"pagingD\" id=\"next\" name=\""  + pb.maxPcount + "\"></div>";
	} else {
		html += "<div class=\"pagingD\" id=\"next\" name=\"" + ($("#page").val() * 1 + 1) + "\"></div>";
	}
	html += "<div class=\"pagingD\" id=\"last\" name=\"" + pb.maxPcount + "\"></div>";
	
	$(".paging").html(html);
}


//전체 보기, 폐기 비품 제외 보기 상태에 따라서 css 변화
function selectView() {
	if($("#selectView").val() == "allView" || $("#selectView").val() == "") { // 전체 보기
		$("#allView").css("font-weight", "bold");
		$("#excludeView").css("font-weight", "");
	} else if($("#selectView").val() == "excludeView") { // 폐기 비품 제외하고 보기
		$("#excludeView").css("font-weight", "bold");
		$("#allView").css("font-weight", "");
	}
}


// 비품 등록 팝업
function regiEqpmmt() {
	var params = $("#actionForm").serialize();
	$.ajax({
		type : "post",			  
		url : "selboxListAjax", // 비품유형, 부서명 DB 조회
		dataType : "json",
		data : params,
		success : function(res) {
			if(res.result == "success") {
				// 팝업창 생성 시작
				var html = "";
				
				html += "<div class=\"popup_wrap\">";
				html += "<div class=\"popup_bg\"></div>";
				html += "<div class=\"popup\">";
				html += "<form action=\"#\" method=\"post\" id=\"regForm\">"
				html += "<input type=\"hidden\" name=\"emplyNo\">";
				html += "<div class=\"con\">";
				html += "<div class=\"con_title\"><div class=\"con_title_txt\">비품등록</div></div>";
				html += "<div class=\"con_con\" id=\"con_con\">";
				html += "<div class=\"conList\">";
				html += "비품명<span class=\"necessaryInput\">(*필수 입력 사항)</span><br/>";
				html += "<span><input type=\"text\" class=\"formCon\" maxlength=\"10\" placeholder=\"10자까지 입력 가능\" id=\"eqmntName\" name=\"eqmntName\" /></span>";
				html += "</div>";
				html += "<div class=\"conList\">";
				html += "유형<span class=\"necessaryInput\">(*필수 입력 사항)</span><br/>";
				html += "<span>";
				html += "<select class=\"selBox\" id=\"eqmntType\" name=\"eqmntType\">";
				html += "<option value=\"0\">유형 선택</option>";
				for(var i = 0; i < res.eqTypeList.length; i++){
					html += "<option value=\"" + res.eqTypeList[i].EQPMNT_TYPE_NO +"\">" + res.eqTypeList[i].EQPMNT_TYPE_NAME + "</option>";
				}
				html += "</select>";
				html += "</span>";
				html += "</div>";
				html += "<div class=\"conList\">";
				html += "관리부서<span class=\"necessaryInput\">(*필수 입력 사항)</span><br/>";
				html += "<span>";
				html += "<select class=\"selBox\" id=\"dpartmntNo\" name=\"dpartmntNo\" >";
				html += "<option value=\"0\">부서 선택</option>";
				// 시스템 관리자(SA) 부서는 무시
				for(var i = 0; i < res.dprtList.length; i++){
					if(res.dprtList[i].DPRTMNT_NO == 1) {
						continue;
					}
					html += "<option value=\"" + res.dprtList[i].DPRTMNT_NO +"\">" + res.dprtList[i].DPRTMNT_NAME + "</option>";
				}
				html += "</select>";
				html += "</span>";
				html += "</div>";
				html += "<div class=\"conList\">";
				html += "구입처<span class=\"necessaryInput\">(*필수 입력 사항)</span><br/>";
				html += "<span><input type=\"text\" class=\"formCon\" maxlength=\"25\" placeholder=\"25자까지 입력 가능\" id=\"prchsStore\" name=\"prchsStore\" /></span>";
				html += "</div>";
				html += "<div class=\"conList\">";
				html += "구매가격<span class=\"necessaryInput\">(*필수 입력 사항)</span><br/>";
				html += "<span><input type=\"number\" class=\"formCon\" placeholder=\"숫자만 입력 가능\" id=\"prchsPrice\" name=\"prchsPrice\" onkeypress=\"onlyNumber();\" /></span>";
				html += "</div>";
				html += "<div class=\"conList\">";
				html += "구매일<span class=\"necessaryInput\">(*필수 입력 사항)</span><br/>";
				html += "<span><input type=\"text\" class=\"formCon\" id=\"datepicker\" name=\"prchsDate\" placeholder=\"클릭 시 달력 표시\" /></span>";
				html += "</div>";
				html += "<div class=\"conList\">";
				html += "메모<br/>";
				html += "<span><input type=\"text\" class=\"formCon\" placeholder=\"100자까지 입력 가능\" name=\"memo\"/></span>";
				html += "</div>";
				html += "</div>";
				html += "</div>";
				html += "<div class=\"bottom_bar\">";
				html += "<div class=\"popup_btn\"><div class=\"popup_btn_txt\" id=\"addBtn\">등록</div></div>";
				html += "<div class=\"popup_btn\"><div class=\"popup_btn_txt\" id=\"cancelBtn\">취소</div></div>";
				html += "</form>";
				html += "</div>";
				html += "</div>";
				html += "</div>";

				$("body").prepend(html); // 팝업창 생성 끝

				// jQueryUI datepicker 사용
				$( function() {
					$( function() {
						$("#datepicker").datepicker({ dateFormat: 'yy-mm-dd', changeMonth: true, changeYear: true,
													    monthNames: ["1","2","3","4","5","6","7","8","9","10","11","12"],
													    monthNamesShort: ["1","2","3","4","5","6","7","8","9","10","11","12"],
													    dayNamesMin: ["일","월","화","수","목","금","토"] });
					});
				});
				
				// datepicker 기본 폰트 사이즈 지정
				$(".ui-widget-content").css("font-size", 16 + "px");
						
				// 팝업 CSS 수정
				$("#popup_wrap").css("z-index", 100);
				$(".popup_bg").css("z-index", 110);
				$(".popup").css("z-index", 111);
				$(".popup").css("width", 400 + "px");
				$(".popup").css("height", 500 + "px");
				$(".popup").css("left", "calc(50% - " + (400 / 2) + "px)");
				$(".popup").css("top", "calc(50% - " + (500 / 2) + "px)");
				
				// 팝업 영역이 아닌 곳을 클릭한다면 종료하도록 함
				$(".popup_bg").on("click", function() {
					$(".popup_wrap").remove();
				});
				
				// 등록 버튼 클릭 시 동작
				$("#addBtn").on("click", function() {
					if($.trim($("#eqmntName").val()) == "") {
						makeOneBtnPopup(300, "알림", "비품명을 입력해주세요.", true, 300, 180, null, "닫기", function() {
							closePopup(300);
						});
					} else if($.trim($("#eqmntType").val()) == "0" || $.trim($("#eqmntType").val()) == "") {
						makeOneBtnPopup(300, "알림", "비품 유형을 선택해주세요.", true, 300, 180, null, "닫기", function() {
							closePopup(300);
						});
					} else if($.trim($("#dpartmntNo").val()) == "0" || $.trim($("#dpartmntNo").val()) == "") {
						makeOneBtnPopup(300, "알림", "관리부서를 선택해주세요.", true, 300, 180, null, "닫기", function() {
							closePopup(300);
						});
					} else if($.trim($("#prchsStore").val()) == "") {
						makeOneBtnPopup(300, "알림", "구입처를 입력해주세요.", true, 300, 180, null, "닫기", function() {
							closePopup(300);
						});
					} else if($.trim($("#prchsPrice").val()) == "") {
						makeOneBtnPopup(300, "알림", "구매가를 입력해주세요.", true, 300, 180, null, "닫기", function() {
							closePopup(300);
						});
					} else if($.trim($("#datepicker").val()) == "") {
						makeOneBtnPopup(300, "알림", "구매일을 선택해주세요.", true, 300, 180, null, "닫기", function() {
							closePopup(300);
						});
					} else {
						$("#regForm").attr("action", "addEq");
						addEq();
						$(".popup_wrap").remove();
					}
				});
				
				// 취소 버튼 클릭 시 동작
				$("#cancelBtn").on("click", function() {
					$(".popup_wrap").remove();
				});
			} else {
				makeOneBtnPopup(1, "알림", "부서 리스트를 불러올 수 없습니다.", true, 300, 180, null, "닫기", function() {
					closePopup(1);
				});		
			}
		},
		error : function(request, status, error) {
			console.log("text : " + request.responseTxt);
			console.log("error : " + error);
		}			
	});
}


// 비품 등록 AJAX
function addEq() {
	var params = $("#regForm").serialize();
	$.ajax({
		type : "post",			  
		url : "addEqAjax", 
		dataType : "json",
		data : params,
		success : function(res) {
			if(res.result == "success") {
				reloadList();
				$(".popup_bg").on("click", function(){
					$(".popup_wrap").remove();
				});
			} else {
				makeOneBtnPopup(300, "알림", "오류가 발생했습니다.", true, 300, 180, null, "닫기", function() {
					closePopup(300);
				});		
			}
		},
		error : function(request, status, error) {
			console.log("text : " + request.responseTxt);
			console.log("error : " + error);
		}			
	});
}


// 비품 수정 팝업
function modifyEqpmmt(list, listRadio, eqTypeList, dprtList) {

	// 팝업 생성 시작
	var html = "";
	
	html += "<div class=\"popup_wrap\">";
	html += "<div class=\"popup_bg\"></div>";
	html += "<div class=\"popup\">";
	html += "<form action=\"#\" method=\"post\" id=\"regForm\">"
	html += "<input type=\"hidden\" name=\"emplyNo\">";
	html += "<input type=\"hidden\" name=\"listRadio\" value=\"" + listRadio + "\">";
	html += "<div class=\"con\">";
	html += "<div class=\"con_title\"><div class=\"con_title_txt\">비품수정</div></div>";
	html += "<div class=\"con_con\" id=\"con_con\">";
	html += "<div class=\"conList\">";
	html += "비품명<span class=\"necessaryInput\">(*필수 입력 사항)</span><br/>";
	html += "<span><input type=\"text\" class=\"formCon\" maxlength=\"10\" placeholder=\"10자까지 입력 가능\" id=\"eqmntName\" name=\"eqmntName\" value=\"" + list[0].EQPMNT_NAME + "\" /></span>";
	html += "</div>";
	html += "<div class=\"conList\">";
	html += "유형<span class=\"necessaryInput\">(*필수 입력 사항)</span><br/>";
	html += "<span>";
	html += "<select class=\"selBox\" id=\"eqmntType\" name=\"eqmntType\">";
	html += "<option value=\"0\">유형 선택</option>";
	for(var i = 0; i < eqTypeList.length; i++){
		html += "<option value=\"" + eqTypeList[i].EQPMNT_TYPE_NO +"\">" + eqTypeList[i].EQPMNT_TYPE_NAME + "</option>";
	}
	html += "</select>";
	html += "</span>";
	html += "</div>";
	html += "<div class=\"conList\">";
	html += "관리부서<span class=\"necessaryInput\">(*필수 입력 사항)</span><br/>";
	html += "<span>";
	html += "<select class=\"selBox\" id=\"dpartmntNo\" name=\"dpartmntNo\" >";
	html += "<option value=\"0\">부서 선택</option>";
	for(var i = 0; i < dprtList.length; i++){
		if(dprtList[i].DPRTMNT_NO == 1) {
			continue;
		}
		html += "<option value=\"" + dprtList[i].DPRTMNT_NO +"\">" + dprtList[i].DPRTMNT_NAME + "</option>";
	}
	html += "</select>";
	html += "</span>";
	html += "</div>";
	html += "<div class=\"conList\">";
	html += "구입처<span class=\"necessaryInput\">(*필수 입력 사항)</span><br/>";
	html += "<span><input type=\"text\" class=\"formCon\" maxlength=\"25\" placeholder=\"25자까지 입력 가능\" id=\"prchsStore\" name=\"prchsStore\" value=\"" + list[0].PRCHS_STORE + "\"/></span>";
	html += "</div>";
	html += "<div class=\"conList\">";
	html += "구매가격<span class=\"necessaryInput\">(*필수 입력 사항)</span><br/>";
	html += "<span><input type=\"number\" class=\"formCon\" placeholder=\"숫자만 입력 가능\" id=\"prchsPrice\" name=\"prchsPrice\" value=\"" + list[0].PRCHS_PRICE + "\" onkeypress=\"onlyNumber();\" /></span>";
	html += "</div>";
	html += "<div class=\"conList\">";
	html += "구매일<span class=\"necessaryInput\">(*필수 입력 사항)</span><br/>";
	html += "<span><input type=\"text\" class=\"formCon\" id=\"datepicker\" name=\"prchsDate\" value=\"" + list[0].PRCHS_DATE + "\"  placeholder=\"클릭 시 달력 표시\" /></span>";
	html += "</div>";
	html += "<div class=\"conList\">";
	html += "메모<br/>";
	if(typeof list[0].MEMO != "undefined") {
		html += "<span><input type=\"text\" class=\"formCon\" name=\"memo\" placeholder=\"100자까지 입력 가능\" value=\"" + list[0].MEMO + "\"/></span>";
	} else {
		html += "<span><input type=\"text\" class=\"formCon\" name=\"memo\" placeholder=\"100자까지 입력 가능\" /></span>";
	} 
	html += "</div>";
	html += "</div>";
	html += "</div>";
	html += "<div class=\"bottom_bar\">";
	html += "<div class=\"popup_btn\"><div class=\"popup_btn_txt\" id=\"modBtn\">수정</div></div>";
	html += "<div class=\"popup_btn\"><div class=\"popup_btn_txt\" id=\"cancelBtn\">취소</div></div>";
	html += "</form>";
	html += "</div>";
	html += "</div>";
	html += "</div>";
	

	$("body").prepend(html); // 팝업 생성 끝
	
	$("#eqmntType").val(list[0].EQPMNT_TYPE_NO);
	$("#dpartmntNo").val(list[0].DPRTMNT_NO);

	// datepicker 설정
	$( function() {
		$( function() {
			$("#datepicker").datepicker({ dateFormat: 'yy-mm-dd', changeMonth: true, changeYear: true,
										    monthNames: ["1","2","3","4","5","6","7","8","9","10","11","12"],
										    monthNamesShort: ["1","2","3","4","5","6","7","8","9","10","11","12"],
										    dayNamesMin: ["일","월","화","수","목","금","토"] });
		});
	});
	
	// datepicker 폰트 사이즈 설정
	$(".ui-widget-content").css("font-size", 16 + "px");
	
	// 팝업 css 설정
	$("#popup_wrap").css("z-index", 100);
	$(".popup_bg").css("z-index", 110);
	$(".popup").css("z-index", 111);
	$(".popup").css("width", 400 + "px");
	$(".popup").css("height", 500 + "px");
	$(".popup").css("left", "calc(50% - " + (400 / 2) + "px)");
	$(".popup").css("top", "calc(50% - " + (500 / 2) + "px)");
	
	// 팝업 영역이 아닌 곳을 클릭한다면 종료하도록 함
	$(".popup_bg").on("click", function() {
		$(".popup_wrap").remove();
	});
	
	// 수정 버튼 클릭 시 동작
	$("#modBtn").on("click", function() {
		if($.trim($("#eqmntName").val()) == "") {
			makeOneBtnPopup(300, "알림", "비품명을 입력해주세요.", true, 300, 180, null, "닫기", function() {
				closePopup(300);
			});
		} else if($.trim($("#eqmntType").val()) == "0" || $.trim($("#eqmntType").val()) == "") {
			makeOneBtnPopup(300, "알림", "비품 유형을 선택해주세요.", true, 300, 180, null, "닫기", function() {
				closePopup(300);
			});
		} else if($.trim($("#dpartmntNo").val()) == "0" || $.trim($("#dpartmntNo").val()) == "") {
			makeOneBtnPopup(300, "알림", "관리부서를 선택해주세요.", true, 300, 180, null, "닫기", function() {
				closePopup(300);
			});
		} else if($.trim($("#prchsStore").val()) == "") {
			makeOneBtnPopup(300, "알림", "구입처를 입력해주세요.", true, 300, 180, null, "닫기", function() {
				closePopup(300);
			});
		} else if($.trim($("#prchsPrice").val()) == "") {
			makeOneBtnPopup(300, "알림", "구매가를 입력해주세요.", true, 300, 180, null, "닫기", function() {
				closePopup(300);
			});
		} else if($.trim($("#datepicker").val()) == "") {
			makeOneBtnPopup(300, "알림", "구매일을 선택해주세요.", true, 300, 180, null, "닫기", function() {
				closePopup(300);
			});
		} else {
			$("#regForm").attr("action", "modEq");
			modEq();
			closePopup(300);
		}
	});
	
	// 취소 버튼 클릭 시 동작
	$("#cancelBtn").on("click", function() {
		$(".popup_wrap").remove();
	});
}


//비품 수정 AJAX
function modEq(){
	var params = $("#regForm").serialize();
	$.ajax({
		type : "post",			  
		url : "modEqAjax", 
		dataType : "json",
		data : params,
		success : function(res) {
			if(res.result == "success") {
				reloadList();
				$(".popup_wrap").remove();
			} else {
				makeOneBtnPopup(300, "알림", "오류가 발생했습니다.", true, 300, 180, null, "닫기", function() {
					closePopup(300);
				});		
			}
		},
		error : function(request, status, error) {
			console.log("text : " + request.responseTxt);
			console.log("error : " + error);
		}			
	});
}


//비품 폐기 팝업창 생성
function delEqpmmt(listRadio) {
	var html = "<form action=\"#\" method=\"post\" id=\"delEq\">" +
				   "<input type=\"hidden\" name=\"listRadio\" value=\"" + listRadio + "\" />선택한 비품을 폐기하시겠습니까?</form>";
	
	makeTwoBtnPopup(2, "비품 삭제", html, true, 400, 180, null, "폐기", function(){ // 폐기 버튼 클릭 동작
		delEq();
		closePopup(2);
	}, "취소", function(){ // 취소 버튼 클릭 동작
		closePopup(2);
	}
)};


//비품 폐기 AJAX
function delEq() {
	$("#delEq").attr("action", "delEq");
	var params = $("#delEq").serialize();
	$.ajax({
		type : "post",			  
		url : "delEqAjax", 
		dataType : "json",
		data : params,
		success : function(res) {
			if(res.result == "success") {
				reloadList();
			} else {
				makeOneBtnPopup(1, "알림", "오류가 발생했습니다.", true, 300, 180, null, "닫기", function() {
					closePopup(1);
				});
			}
		},
		error : function(request, status, error) {
			console.log("text : " + request.responseTxt);
			console.log("error : " + error);
		}			
	});
}


//수정, 폐기 동작 전 선택한 항목 체크하는 AJAX
function selEqCheck() {
	var params = $("#actionForm").serialize();
	
	$.ajax({
		type : "post",			  
		url : "selEqCheckAjax", 
		dataType : "json",
		data : params,
		success : function(res) {
			if(res.result == "success" && res.selectMenu == "mod") { // [수정버튼] 수정가능
				modifyEqpmmt(res.list, res.listRadio, res.eqTypeList, res.dprtList);
			} else if(res.result == "success" && res.selectMenu == "del") { // [삭제버튼] 삭제가능
				delEqpmmt(res.listRadio);
			} else if(res.result == "dscrdExist") { // [수정/삭제버튼] 삭제불가(이미 폐기됨)
				makeOneBtnPopup(1, "알림", "이미 폐기된 비품입니다.", true, 300, 180, null, "닫기", function() {
					closePopup(1);
				});	
			} else if(res.result == "notSelected" && res.selectMenu == "mod") { // [수정버튼] 비품선택X
				makeOneBtnPopup(1, "알림", "수정할 비품을 선택해주세요.", true, 300, 180, null, "닫기", function() {
					closePopup(1);
				});						
			} else if(res.result == "notSelected" && res.selectMenu == "del") { // [폐기버튼] 비품선택X
				makeOneBtnPopup(1, "알림", "폐기할 비품을 선택해주세요.", true, 300, 180, null, "닫기", function() {
					closePopup(1);
				});		
			} else {
				makeOneBtnPopup(1, "알림", "알 수 없는 오류입니다. 관리자에게 문의해주세요.", true, 300, 180, null, "닫기", function() {
					closePopup(1);
				});		
			}
		},
		error : function(request, status, error) {
			console.log("text : " + request.responseTxt);
			console.log("error : " + error);
		}			
	});
}

// 숫자만 입력할 수 있도록 함(소수는 혹시라도 쓸 수 있을 것 같아서 .은 제외)
function onlyNumber() {
	if(event.keyCode < 46 || event.keyCode > 57)
		event.returnValue=false;
}
