  var log = console.log;
  // Initialize Firebase
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
  var auth = firebase.auth();
  /*firebase의 database와 auth를 사용하는거임*/
  var google = new firebase.auth.GoogleAuthProvider();
  var user = null;

  /*2번방식*/
  $("#bt_google_login").on("click",function(){
    auth.signInWithPopup(google);
  })

  $("#bt_google_logout").on("click",function(){
    auth.signOut();
  })  
  
  auth.onAuthStateChanged(function(data){
    /*이 방식은 auth가 sign in인지 out인지 여기서 받아주는것
    1번방식은 각각에서 뿌려주는거였고
    이 메서드는 auth의 상태가 변했을때를 감지하여 작동하는 메서드
    auth의 상태가 changed되면 이 함수를 실행해줄게요
    sign in이 되든 sign out이 되든 아무튼 변신!*/
    log(data);
    if(data){
      /*data가 존재한다면 = 로그인상태*/
      user = data.user;
      $("#bt_google_login").hide();
      $("#bt_google_logout").show();
      $(".emailArea").html(data.email);
      $(".symbolArea").show();
      $(".symbolArea  img").attr("src",data.photoURL);
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


  auth.onAuthStateChanged(function(data){
/*인증 상태 관찰자 설정 및 사용자 데이터 가져오기
-> firebase홈페이지에 인증 - 웹 - 시작하기에 있는거 카피붙여넣기 했음*/
log(data);
  })

  /*1번 note.js의 방법으로 하면 새로고침 할때마다 로그인을 해줘야하는데
  2번방식으로 접근하면 로그인 한번 하면 계속 로그인상태를 유지함.
  changed가 되었는지 안되었는지 계속 동작하면서 감지하는 것.
  .then해가지고 들어가는 방법도 있지만
  2번방식! 클릭하면 그냥 펑션을 실행해.
  값이 변하면 다음의 콜백을 실행해. 이렇게 하는게 
  훨씬 직관적이고 좋음 그냥 모르겠고 이 방법을 써보자.*/