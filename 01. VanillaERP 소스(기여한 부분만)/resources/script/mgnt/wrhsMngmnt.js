// 게시판을 다시 그리는 function
function reloadList() { 
	var params = $("#actionForm").serialize();
	$.ajax({
		type : "post",			  
		url : "listWrhsAjax", 	  
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
		error : function(reqsuest, status, error) {  
			console.log("text : " + reqsuest.responseTxt);
			console.log("error : " + error);
		}
	});
}


// 게시물 리스트을 다시 그리는 function
function redrawList(list, userDprtmntNo) {
	if(list.length == 0) { // 조회된 결과가 없을 때
		var html = "";
		html += "<tr>";
		html += "<td colspan=\"12\">조회 결과가 없습니다.</td>";
		html += "</tr>";
		$(".board tbody").html(html);
	} else { // 조회된 결과가 있을 때
		var html = "";
		for(var i = 0 ; i < list.length ; i++) { 
			html += "<tr name=\"" + list[i].WRHS_NO + "\">";
			if(userDprtmntNo == 5) { // 경영관리부 소속 사원이 접근했을 때 라디오버튼 생성
				html += "<td><input type=\"radio\" name=\"listRadio\" value=\"" + list[i].WRHS_NO + "\"></td>";
			} else { // 그외에는 라디오버튼을 생성하지 않음
				html += "<td></td>";
			}
			html += "<td>" + list[i].WRHS_NO + "</td>";
			html += "<td>" + list[i].WRHS_NAME + "</td>";
			html += "<td>" + list[i].WRHS_LCTN + "</td>";
			html += "<td>" + list[i].CNTRCT_DATE + "</td>";
			html += "<td>" + list[i].SCHDL_END_DATE + "</td>";
			if(list[i].CNTRCT_TYPE == "1") {
				html += "<td>임대</td>";
			} else if(list[i].CNTRCT_TYPE == "2") {
				html += "<td>매매</td>";
			} else {
				html += "-";
			}
			html += "<td>" + list[i].DPRTMNT_NAME + "</td>";
			html += "<td>" + list[i].EMPLY_NAME + "</td>";
			html += "<td>" + list[i].RMRK + "</td>";
			html += "<td>" + list[i].RGSTRTN_DATE + "</td>";
			html += "<td>" + list[i].DSPSL_DATE + "</td>";
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
	if($("#selectView").val() == "allView" || $("#selectView").val() == "") {
		$("#allView").css("font-weight", "bold");
		$("#excludeView").css("font-weight", "");
	} else if($("#selectView").val() == "excludeView") {
		$("#excludeView").css("font-weight", "bold");
		$("#allView").css("font-weight", "");
	}
} 


// 창고 등록 팝업
function regiWrhs() {
	var params = $("#actionForm").serialize();
	$.ajax({
		type : "post",			  
		url : "selboxListAjax",  // 부서명 DB 조회
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
				html += "<div class=\"con\">";
				html += "<div class=\"con_title\"><div class=\"con_title_txt\">창고등록</div></div>";
				html += "<div class=\"con_con\" id=\"con_con\">";
				html += "<div class=\"conList\">";
				html += "창고명<span class=\"necessaryInput\">(*필수 입력 사항)</span><br/>";
				html += "<span><input type=\"text\" class=\"formCon\" maxlength=\"10\" placeholder=\"10자까지 입력 가능\" id=\"wrhsName\" name=\"wrhsName\" /></span>";
				html += "</div>";
				html += "<div class=\"conList\">";
				html += "창고위치<span class=\"necessaryInput\">(*필수 입력 사항)</span><br/>";
				html += "<span><input type=\"text\" class=\"selBox\" id=\"wrhsLctn\" name=\"wrhsLctn\" placeholder=\"10자까지 입력 가능\" maxlength=\"10\" /></span>";
				html += "</div>";
				html += "<div class=\"conList\">";
				html += "관리자<span class=\"necessaryInput\">(*필수 입력 사항)</span><br/>";
				html += "<div class=\"manager\"><div class=\"department_sel\">";
				html += "<select class=\"selBox\" id=\"dpartmntNo\" name=\"dpartmntNo\" >";
				html += "<option value=\"0\">부서 선택</option>";
				for(var i = 0; i < res.dprtList.length; i++){
					if(res.dprtList[i].DPRTMNT_NO == 1) {
						continue;
					}
					html += "<option value=\"" + res.dprtList[i].DPRTMNT_NO +"\">" + res.dprtList[i].DPRTMNT_NAME + "</option>";
				}
				html += "</select>";
				html += "</div>";
				html += "<div class=\"employee_sel\">";
				html += "<select class=\"selBox\" id=\"emplyNo\" name=\"emplyNo\" disabled=\"disabled\" >";
				html += "<option value=\"0\">관리자 선택</option>";
				html += "</select>";
				html += "</div>";
				html += "</div>";
				html += "</div>";
				html += "<div class=\"conList\">";
				html += "계약유형<span class=\"necessaryInput\">(*필수 입력 사항)</span><br/>";
				html += "<select class=\"selBox\" id=\"cntrctType\" name=\"cntrctType\" >";
				html += "<option value=\"0\">계약유형</option>";
				html += "<option value=\"1\">임대</option>";
				html += "<option value=\"2\">매매</option>";
				html += "</select>";
				html += "</div>";
				html += "<div class=\"conList\">";
				html += "계약일<span class=\"necessaryInput\">(*필수 입력 사항)</span><br/>";
				html += "<span><input type=\"text\" class=\"formCon\" id=\"cntrctDate\" name=\"cntrctDate\"  placeholder=\"클릭 시 달력 표시\" /></span>";
				html += "</div>";
				html += "<div class=\"conList\">";
				html += "종료예정일<br/>";
				html += "<span><input type=\"text\" class=\"formCon\" id=\"endSchdDate\" name=\"endSchdDate\"  placeholder=\"클릭 시 달력 표시\" /></span>";
				html += "</div>";
				html += "<div class=\"conList\">";
				html += "메모<br/>";
				html += "<span><input type=\"text\" class=\"formCon\" placeholder=\"100자까지 입력 가능\" name=\"rmrk\"/></span>";
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
						$( "#cntrctDate" ).datepicker({ dateFormat: 'yy-mm-dd', changeMonth: true, changeYear: true,
						    monthNames: ["1","2","3","4","5","6","7","8","9","10","11","12"],
						    monthNamesShort: ["1","2","3","4","5","6","7","8","9","10","11","12"],
						    dayNamesMin: ["일","월","화","수","목","금","토"] });
						$( "#endSchdDate" ).datepicker({ dateFormat: 'yy-mm-dd', changeMonth: true, changeYear: true,
						    monthNames: ["1","2","3","4","5","6","7","8","9","10","11","12"],
						    monthNamesShort: ["1","2","3","4","5","6","7","8","9","10","11","12"],
						    dayNamesMin: ["일","월","화","수","목","금","토"] });
					});
				});
				
				// datepicker 기본 폰트 사이즈 지정
				$(".ui-widget-content").css("font-size", 16 + "px");
				
				$("#popup_wrap").css("z-index", 100);
				$(".popup_bg").css("z-index", 110);
				$(".popup").css("z-index", 111);
				$(".popup").css("width", 400 + "px");
				$(".popup").css("height", 500 + "px");
				$(".popup").css("left", "calc(50% - " + (400 / 2) + "px)");
				$(".popup").css("top", "calc(50% - " + (500 / 2) + "px)");
				
				// 팝업 CSS 수정
				$(".popup_bg").on("click", function() {
					$(".popup_wrap").remove();
				});
				
				// 부서명 선택시 DB조회해서 해당 부서의 사원 선택할 수 있도록 함
				$("#dpartmntNo").change(function(){
					$("#dpartmntNo").val($(this).val());
					emplyList();
				});
				
				// 등록 버튼 동작
				$("#addBtn").on("click", function() {
					if($.trim($("#wrhsName").val()) == "") {
						makeOneBtnPopup(300, "알림", "창고명을 입력해주세요.", true, 300, 180, null, "닫기", function() {
							closePopup(300);
						});
					} else if($.trim($("#wrhsLctn").val()) == "") {
						makeOneBtnPopup(300, "알림", "창고위치을 입력해주세요.", true, 300, 180, null, "닫기", function() {
							closePopup(300);
						});
					} else if($.trim($("#dpartmntNo").val()) == "0" || $.trim($("#dpartmntNo").val()) == "") {
						makeOneBtnPopup(300, "알림", "관리부서를 선택해주세요.", true, 300, 180, null, "닫기", function() {
							closePopup(300);
						});
					} else if($.trim($("#emplyNo").val()) == "0" || $.trim($("#emplyNo").val()) == "") {
						makeOneBtnPopup(300, "알림", "관리자를 선택해주세요.", true, 300, 180, null, "닫기", function() {
							closePopup(300);
						});
					} else if($.trim($("#emplyNo").val()) == "0" || $.trim($("#cntrctType").val()) == "") {
						makeOneBtnPopup(300, "알림", "계약유형을 선택해주세요.", true, 300, 180, null, "닫기", function() {
							closePopup(300);
						});
					} else if($.trim($("#cntrctDate").val()) == "") {
						makeOneBtnPopup(300, "알림", "계약일을 선택해주세요.", true, 300, 180, null, "닫기", function() {
							closePopup(300);
						});
					} else {
						$("#regForm").attr("action", "addWrhs");
						addWrhs();
					}
				});
				
				// 취소 버튼 동작
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


// 창고 등록 AJAX
function addWrhs() {
	var params = $("#regForm").serialize();
	
	$.ajax({
		type : "post",			  
		url : "addWrhsAjax", 
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
		error : function(reqsuest, status, error) {
			console.log("text : " + reqsuest.responseTxt);
			console.log("error : " + error);
		}			
	});
}


// 창고 수정 팝업
function modWrhsPopup(listRadio, list, dprtList) {
	
	// 팝업 생성 시작
	var html = "";
	
	html += "<div class=\"popup_wrap\">";
	html += "<div class=\"popup_bg\"></div>";
	html += "<div class=\"popup\">";
	html += "<form action=\"#\" method=\"post\" id=\"regForm\">"
	html += "<input type=\"hidden\" name=\"listRadio\" value=\"" + listRadio + "\">";
	html += "<div class=\"con\">";
	html += "<div class=\"con_title\"><div class=\"con_title_txt\">창고 수정</div></div>";
	html += "<div class=\"con_con\" id=\"con_con\">";
	html += "<div class=\"conList\">";
	html += "창고명<span class=\"necessaryInput\">(*필수 입력 사항)</span><br/>";
	html += "<span><input type=\"text\" class=\"formCon\" maxlength=\"10\" placeholder=\"10자까지 입력 가능\" id=\"wrhsName\" name=\"wrhsName\" value=\"" + list[0].WRHS_NAME + "\" /></span>";
	html += "</div>";
	html += "<div class=\"conList\">";
	html += "창고위치<span class=\"necessaryInput\">(*필수 입력 사항)</span><br/>";
	html += "<span><input type=\"text\" class=\"selBox\" id=\"wrhsLctn\" name=\"wrhsLctn\" value=\"" + list[0].WRHS_LCTN + "\"  placeholder=\"10자까지 입력 가능\" maxlength=\"10\" /></span>";
	html += "</div>";
	html += "<div class=\"conList\">";
	html += "관리자<span class=\"necessaryInput\">(*필수 입력 사항)</span><br/>";
	html += "<div class=\"manager\"><div class=\"department_sel\">";
	html += "<select class=\"selBox\" id=\"dpartmntNo\" name=\"dpartmntNo\" >";
	html += "<option value=\"0\">부서 선택</option>";
	for(var i = 0; i < dprtList.length; i++){
		// 시스템 관리자(SA) 부서는 무시
		if(dprtList[i].DPRTMNT_NO == 1) {
			continue;
		}
		html += "<option value=\"" + dprtList[i].DPRTMNT_NO +"\">" + dprtList[i].DPRTMNT_NAME + "</option>";
	}
	html += "</select>";
	html += "</div>";
	html += "<div class=\"employee_sel\">";
	html += "<select class=\"selBox\" id=\"emplyNo\" name=\"emplyNo\" >";
	html += "<option value=\"0\">관리자 선택</option>";
	html += "</select>";
	html += "</div>";
	html += "</div>";
	html += "</div>";
	html += "<div class=\"conList\">";
	html += "계약유형<span class=\"necessaryInput\">(*필수 입력 사항)</span><br/>";
	html += "<select class=\"selBox\" id=\"cntrctType\" name=\"cntrctType\" >";
	html += "<option value=\"0\">계약유형</option>";
	html += "<option value=\"1\">임대</option>";
	html += "<option value=\"2\">매매</option>";
	html += "</select>";
	html += "</div>";
	html += "<div class=\"conList\">";
	html += "계약일<span class=\"necessaryInput\">(*필수 입력 사항)</span><br/>";
	html += "<span><input type=\"text\" class=\"formCon\" id=\"cntrctDate\" name=\"cntrctDate\" value=\"" + list[0].CNTRCT_DATE + "\"  placeholder=\"클릭 시 달력 표시\" /></span>";
	html += "</div>";
	html += "<div class=\"conList\">";
	html += "종료예정일<br/>";
	// 종료 예정일 null 값인 경우 처리
	if(typeof list[0].SCHDL_END_DATE != "undefined") {
		html += "<span><input type=\"text\" class=\"formCon\" id=\"endSchdDate\" name=\"endSchdDate\" value=\"" + list[0].SCHDL_END_DATE + "\"  placeholder=\"클릭 시 달력 표시\" /></span>";
	} else {
		html += "<span><input type=\"text\" class=\"formCon\" id=\"endSchdDate\" name=\"endSchdDate\" /></span>";
	}
	html += "</div>";
	html += "<div class=\"conList\">";
	html += "메모<br/>";
	// 비고 null 값인 경우 처리
	if(typeof list[0].RMRK != "undefined") {
		html += "<span><input type=\"text\" class=\"formCon\" placeholder=\"100자까지 입력 가능\" name=\"rmrk\" value=\"" + list[0].RMRK + "\"/></span>";
	} else {
		html += "<span><input type=\"text\" class=\"formCon\" placeholder=\"100자까지 입력 가능\" name=\"rmrk\"/></span>";
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
	
	$("#cntrctType").val(list[0].CNTRCT_TYPE);
	
	// 부서, 사원, 계약일 값 지정
	$("#dpartmntNo").val(list[0].DPRTMNT_NO);
	// 기존 사원 정보를 담기 위해 부서원 조회
	$("#regForm").attr("action", "emplyListAjax2");
	emplyList();

	$("#emplyNo").val(list[0].EMPLY_NO);
	
	// jQueryUI datepicker 사용
	$( function() {
		$( function() {
			$( "#cntrctDate" ).datepicker({ dateFormat: 'yy-mm-dd', changeMonth: true, changeYear: true,
			    monthNames: ["1","2","3","4","5","6","7","8","9","10","11","12"],
			    monthNamesShort: ["1","2","3","4","5","6","7","8","9","10","11","12"],
			    dayNamesMin: ["일","월","화","수","목","금","토"] });
			$( "#endSchdDate" ).datepicker({ dateFormat: 'yy-mm-dd', changeMonth: true, changeYear: true,
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
	
	// 부서명 선택시 DB조회해서 해당 부서의 사원 선택할 수 있도록 함
	$("#dpartmntNo").change(function(){
		$("#dpartmntNo").val($(this).val());
		emplyList();
	});
	
	// 수정 버튼 클릭 시 동작
	$("#modBtn").on("click", function() {
		if($.trim($("#wrhsName").val()) == "") {
			makeOneBtnPopup(300, "알림", "창고명을 입력해주세요.", true, 300, 180, null, "닫기", function() {
				closePopup(300);
			});
		} else if($.trim($("#wrhsLctn").val()) == "") {
			makeOneBtnPopup(300, "알림", "창고위치을 입력해주세요.", true, 300, 180, null, "닫기", function() {
				closePopup(300);
			});
		} else if($.trim($("#dpartmntNo").val()) == "0" || $.trim($("#dpartmntNo").val()) == "") {
			makeOneBtnPopup(300, "알림", "관리부서를 선택해주세요.", true, 300, 180, null, "닫기", function() {
				closePopup(300);
			});
		} else if($.trim($("#emplyNo").val()) == "0" || $.trim($("#emplyNo").val()) == "") {
			makeOneBtnPopup(300, "알림", "관리자를 선택해주세요.", true, 300, 180, null, "닫기", function() {
				closePopup(300);
			});
		} else if($.trim($("#emplyNo").val()) == "0" || $.trim($("#cntrctType").val()) == "") {
			makeOneBtnPopup(300, "알림", "계약유형을 선택해주세요.", true, 300, 180, null, "닫기", function() {
				closePopup(300);
			});
		} else if($.trim($("#cntrctDate").val()) == "") {
			makeOneBtnPopup(300, "알림", "계약일을 선택해주세요.", true, 300, 180, null, "닫기", function() {
				closePopup(300);
			});
		} else {
			$("#regForm").attr("action", "modWrhs");
			modWrhs();
		}
	});
	
	// 취소 버튼 클릭 시 동작
	$("#cancelBtn").on("click", function() {
		$(".popup_wrap").remove();
	});
}

//창고 수정 AJAX
function modWrhs(){
	var params = $("#regForm").serialize();
	$.ajax({
		type : "post",			  
		url : "modWrhsAjax", 
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
		error : function(reqsuest, status, error) {
			console.log("text : " + reqsuest.responseTxt);
			console.log("error : " + error);
		}			
	});
}


//창고 폐기 팝업창 생성
function delWrhsPopup(listRadio) {
	var html = "<form action=\"#\" method=\"post\" id=\"delWrhs\">" +
				   "<input type=\"hidden\" name=\"listRadio\" value=\"" + listRadio + "\" />선택한 창고을 폐기하시겠습니까?</form>";
	makeTwoBtnPopup(2, "창고 폐기", html, true, 400, 180, null, "폐기", function(){ // 폐기 버튼 클릭 동작
		$("#delWrhs").attr("action", "delWrhs");
		delWrhs();
		closePopup(2);
	}, "취소", function(){ // 취소 버튼 클릭 동작
		closePopup(2);
	}
)};

// 창고 폐기 AJAX
function delWrhs() {
	var params = $("#delWrhs").serialize();
	$.ajax({
		type : "post",			  
		url : "delWrhsAjax", 
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
		error : function(reqsuest, status, error) {
			console.log("text : " + reqsuest.responseTxt);
			console.log("error : " + error);
		}			
	});
}


//수정, 폐기 동작 전 선택한 항목 체크하는 AJAX
function selWrhsCheck() {
	var params = $("#actionForm").serialize();
	$.ajax({
		type : "post",			  
		url : "selWrhsCheckAjax", 
		dataType : "json",
		data : params,
		success : function(res) {
			if(res.result == "success" && res.selectMenu == "mod") { // [수정버튼] 수정가능
				modWrhsPopup(res.listRadio, res.list, res.dprtList);
			} else if(res.result == "success" && res.selectMenu == "del") { // [삭제버튼] 삭제가능
				delWrhsPopup(res.listRadio);
			} else if(res.result == "endWrhsCheck") { // [수정/삭제버튼] 삭제불가(이미 폐기됨)
				makeOneBtnPopup(1, "알림", "이미 폐기된 창고입니다.", true, 300, 180, null, "닫기", function() {
					closePopup(1);
				});	
			} else if(res.result == "notSelected" && res.selectMenu == "mod") { // [수정버튼] 창고선택X
				makeOneBtnPopup(1, "알림", "수정할 창고을 선택해주세요.", true, 300, 180, null, "닫기", function() {
					closePopup(1);
				});						
			} else if(res.result == "notSelected" && res.selectMenu == "del") { // [폐기버튼] 창고선택X
				makeOneBtnPopup(1, "알림", "폐기할 창고을 선택해주세요.", true, 300, 180, null, "닫기", function() {
					closePopup(1);
				});		
			} else {
				makeOneBtnPopup(1, "알림", "알 수 없는 오류입니다. 관리자에게 문의해주세요.", true, 300, 180, null, "닫기", function() {
					closePopup(1);
				});		
			}
		},
		error : function(reqsuest, status, error) {
			console.log("text : " + reqsuest.responseTxt);
			console.log("error : " + error);
		}			
	});
}

//사원정보 조회
function emplyList() {
	var params = $("#regForm").serialize();
	$.ajax({
		type : "post",			  
		url : "emplyListAjax2", 
		dataType : "json",
		data : params,
		async: false,	// 동기방식으로 진행하기 위해 사용했으나... jQuery 1.8부터는 지원하지 않는 방식이므로 대책 필요.
		success : function(res) {
			if(res.result == "success") {
				var html = "";
				html += "<option value=\"0\">관리자 선택</option>";
				if(res.emplyList.length < 1) { // 해당 부서에 사원이 없을 경우
					$("#emplyNo").attr("disabled", "disabled");
				} else { // 해당 부서에 사원이 있을 경우
					$("#emplyNo").removeAttr("disabled");
				}
				for(var i = 0; i < res.emplyList.length; i++) {
					html += "<option value=\"" + res.emplyList[i].EMPLY_NO +"\">" + res.emplyList[i].EMPLY_NAME + "</option>";
				}
				// emplyNo 아래에 있는 모든 요소 제거
				$("#emplyNo *").remove();
				
				$("#emplyNo").prepend(html);
			} else {
				makeOneBtnPopup(300, "알림", "오류가 발생했습니다.", true, 300, 180, null, "닫기", function() {
					closePopup(300);
				});		
			}
		},
		error : function(reqsuest, status, error) {
			console.log("text : " + reqsuest.responseTxt);
			console.log("error : " + error);
		}			
	});
}