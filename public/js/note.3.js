  var log = console.log;
  /*Initialize Firebase*/
  var config = {
    apiKey: "AIzaSyCuO5OPdr5VZvlAHgmCZmOExBEdI1-D3nc",
    authDomain: "cgoon-note.firebaseapp.com",
    databaseURL: "https://cgoon-note.firebaseio.com",
    projectId: "cgoon-note",
    storageBucket: "cgoon-note.appspot.com",
    messagingSenderId: "820211052518"
  };
  firebase.initializeApp(config);




  var db = firebase.database();
  var ref = null;
  /*요 위에 두개가 db관련된 변수*/

  var auth = firebase.auth();
  /*firebase의 database와 auth를 사용하는거임*/
  var google = new firebase.auth.GoogleAuthProvider();
  var user = null;
  var li = $(".navs");
  var ta = $("#contents"); 

  /*signin되면 실행되는 함수 고고!!*/
  function init(){
    li.empty();
    ref = db.ref("root/note" + user.uid);
    /*우리의 데이터가 들어가는 곳은 저기!
    https://console.firebase.google.com/project/cgoon-note/database/cgoon-note/data
    요기 들어가보면 node가 작성되어 있어 쨔쨘! 등록누르면!
    */
   ref.on("child_added",callbackAdd);
   ref.on("child_changed",callbackChg);
   ref.on("child_removed",callbackRmv);
  }
  /*로그인되자마자 ref에 root/note에 user uid를 작성하고
  child_added -> child가 추가가된다면 아래 함수를 실행해주세요.
  이 child_added는 firebase의 함수.  */

  /*데이터는 추가 변경 삭제 세가지의 경우의 수가 있지. 그러니까
  세가지 경우에 대한 내용을 만들어줄거야 콜백도 세개~~~~*/

  /*dataBase 콜백함수들*/
  function callbackAdd(data) {
    log("추가" , data.key , data.val());
    var html = `
    <ul id="${data.key}">
     <li>${data.val().content.substr(0,16)}..</li>
     <li>${timeConverter(data.val().saveTime)}</li>
     <li onclick="delData(this);">x</li>
    </ul>`;
    li.append(html);
    };
    /*
    substr은 글자열의 어디서부터 몇글자를 가져올지 정하는것
    ${data.val().content.substr(0,16)}.. 이렇게 쓴것은
    data.val().content의 문자열의 0번째부터 16개만 가져오고 끝에 ..를 붙여라
    */

  function callbackChg(data) {
    log("수정체인지" , data.key , data.val());
    };
  function callbackRmv(data) {
    //log("제거" , data.key , data.val());
    if(confirm("정말로삭제하시겠습니까")) $("#" + data.key).remove();
    /*if문 안이 true가 되면 remove하렴
    confirm은 alert와 다르게 말 그대로 confirm을 요청함.
    확인과 취소 두가지 버튼이 등장. 확인을 누르면 true 취소는 false*/
    };


  /*데이터베이스구현고고!!!*/
  $("#bt_add").click(function () { 
  });

  /*save누르면 db에 작성한 글이 올라가고 cancel하면 날아가게*/
  $("#bt_save").click(function(){
    var content = ta.val();
    /*얘는 ta에 value값을 가지고 오라고*/
    if(content==""){      
      alert("내용을입력하세요")
      /*content가 빈값이면 = 아무것도 안작성했으면 = 경고창띄워줭*/
      ta.focus();
    }else{
      ref = db.ref("root/note/"+user.uid);
      ref.push({
        content: content,
        saveTime: new Date().getTime()
      }).key;
    }
  });
  /*내가 입력한 데이터는 그대로 저장시켜주고 content에다가 입력입력
    그리고 getTime으로 내가 입력한 시간까지 저장을 시키려고 함미당
    자바스크립트로 현재시간 구현하기 구글검색해서 참고할것*/

  $("#bt_cancel").click(function(){
      ta.val('');
    /*var ta안에 들어간 value값을 빈값으로 두어라
    이거 textarea 니까 value로 받아야지*/
  });

  function delData(obj){
    var id = log($(obj).parent().attr.("id");
    ref = db.ref("root/note" + user.uid + "/" + id);
    ref.remove;
    })


  /*2번방식*/
  $("#bt_google_login").on("click",function(){
    auth.signInWithRedirect(google);
  })

  $("#bt_google_logout").on("click",function(){
    auth.signOut();
  })  
  
  auth.onAuthStateChanged(function(data){
    /*이 방식은 auth가 sign in인지 out인지 여기서 받아주는것
    1번방식은 각각에서 뿌려주는거였고
    이 메서드는 auth의 상태가 변했을때를 감지하여 작동하는 메서드
    auth의 상태가 changed되면 이 함수를 실행해줄게요
    sign in이 되든 sign out이 되든 아무튼 변신!
    log(data);*/
    if(data){
      /*data가 존재한다면 = 로그인상태*/
      user = data;
      $("#bt_google_login").hide();
      $("#bt_google_logout").show();
      $(".emailArea").html(data.email);
      $(".symbolArea").show();
      $(".symbolArea > img").attr("src",data.photoURL);
      init();
    }else{
      /*else는 data가 존재하지 않는다면 = 로그아웃상태*/
      user = null;
      $("#bt_google_logout").hide();
      $("#bt_google_login").show();
      $(".emailArea").html("");
      $(".symbolArea").hide();
      $(".symbolArea  img").attr("src","");
    }
  })




/***** Timestamp 값을 GMT표기로 바꾸는 함수 *****/
function timeConverter(ts){
  var a = new Date(ts);
  log(a);
  /*var months = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];*/
  var months = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
	var year = a.getFullYear();
  /*var month = months[a.getMonth()];*/
  var month = addZero(a.getMonth()+1);
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	//var str = String(year).substr(2)+"년 "+month+" "+date+"일 "+amPm(addZero(hour))+"시 "+addZero(min)+"분 "+addZero(sec) +"초";
  /*var str = year+"년 "+month+" "+date+"일 "+amPm(hour)+"시 "+addZero(min)+"분 "+addZero(sec) +"초";
  -> 이거를 아래에다가 나오는 방식만 바꿔서 냅둔거얌 당황해지마 미래의 나 >_<*/
  var str = year+"-"+month+"-"+date+" "+hour+":"+addZero(min)+":"+addZero(sec);
	return str;
}

/***** 0~9까지의 숫자의 앞에 0을 붙이는 함수 *****/
function addZero(n) {
	if(n<10) return "0"+n;
	else return n;
}

/***** 오전/오후 붙여주는 함수 *****/
function amPm(h) {
	if(h<12) return "오전 "+addZero(h);
	else if(h>12) return "오후 "+addZero(h-12);
	else return "오후 12";
}


/*
  auth.onAuthStateChanged(function(data){*/
/*인증 상태 관찰자 설정 및 사용자 데이터 가져오기
-> firebase홈페이지에 인증 - 웹 - 시작하기에 있는거 카피붙여넣기 했음*/
/*log(data);
  });*/

  /*1번 note.js의 방법으로 하면 새로고침 할때마다 로그인을 해줘야하는데
  2번방식으로 접근하면 로그인 한번 하면 계속 로그인상태를 유지함.
  changed가 되었는지 안되었는지 계속 동작하면서 감지하는 것.
  .then해가지고 들어가는 방법도 있지만
  2번방식! 클릭하면 그냥 펑션을 실행해.
  값이 변하면 다음의 콜백을 실행해. 이렇게 하는게 
  훨씬 직관적이고 좋음 그냥 모르겠고 이 방법을 써보자.*/