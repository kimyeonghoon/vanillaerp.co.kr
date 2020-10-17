# vanillaerp


### 프로젝트 정보
1. 프로젝트 명 : vanillaerp
2. 개발기간 : 2020/02/17 ~ 2020/08/05
3. 참여인원 : 17명
4. 담당업무 : DB설계, 화면구현, 기능개발
5. 데모 페이지 : https://vanillaerp.co.kr mgnt1@vanilla.com // 1234
(구현부분 - 경영지원 > 비품관리, 경영지원 > 창고관리)


### 개발환경
1. 개발환경 : Windows 10
2. 사용도구 : eclipse, SqlDeveloper, git
3. 사용기술 : Java 1.8, Oracle 12c, jQuery, JSON, Ajax, HTML, CSS, JSP, XML


### 개발 상세
1. 기획 및 디자인
    + 회사에서 사용할 erp를 구현
    + 맡은 부분 : 경영지원 > 비품관리/창고관리
    + 경영지원팀에서만 비품, 창고를 추가/수정/삭제할 수 있도록 함
    + 다른 부서의 경우 본인이 소속된 부서의 비품, 창고를 확인할 수 있도록 함
2. DB 설계
    + 데이터 모델링(물리, 논리)
    + 데이터 모델링을 기반으로 테이블 정의서 작성
3. Framework 설계
    + Spring 4.3.4 - Annotation Driven을 통한 컨트롤러 호출, Resource Mapping을 통한 리소스 폴더 관리, AOP, jstl
    + Mybatis 3.2.7 - Mybatis와 MariaDB 연동
5. 개발
    + Ajax를 통한 동적 WEB 구현 : 로딩된 페이지 상에서 동적으로 웹을 구현.
    + git을 통한 버전 관리
6. 테스트
    + UI테스트(테스트 수행 - 1회, 테스트 항목 - 58건, 정상완료 58건) 
    + 애플리케이션 테스트(테스트 수행 - 1회, 테스트 항목 - 50건, 정상완료 50건)
