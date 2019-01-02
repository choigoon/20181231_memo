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

  $("#bt_google_login").on("click",function(){
    auth.signInWithPopup(google).then(function(data){
      log(data);
      $("#bt_google_login").hide();
      $("#bt_google_logout").show();
      user = data.user;
      $(".emailArea").html(user.email);
      $(".symbolArea").show();
      $(".symbolArea  img").attr("src",user.photoURL);
    });

    /*google의 로그인을 담당하는 객체를 클릭하면 signin을 하는데
    하면 그 결과가 then -> 뒤의 function 안으로 들어옵니다
    그게 성공하면 나오는 결과값을 data라고 하는데 그걸 콘솔창에 찍어라*/

    
    /*firebase에 있는거 카피해서 붙여놓은거임
    얘를 클릭하면 auth에 google이 나오는 팝업창을 띄워서 그 이후에
    결과값에 따라 뒤에 함수에 나오는 내용을 실행하겠다*/

    /*#bt_google를 클릭해서 = 로그인버튼을 클릭해서 -> 팝업을 띄우고 
    -> 그거에 결과값을 리턴받으면
    -> 사용자의 정보를 data에 담아 받는거지 -> 그걸 console에 찍고*/
  })

  $("#bt_google_logout").on("click",function(){
    auth.signOut().then(function(data){
      log("data");
      $("#bt_google_logout").hide();
      $("#bt_google_login").show();
      user = null;
      $(".emailArea").html("");
      $(".symbolArea").hide();
      $(".symbolArea  img").attr("src","");
    });
  })  
    /*google의 로그아웃을 담당하는 객체를 클릭하면 signin을 하는데
    하면 그 결과가 then -> 뒤의 function 안으로 들어옵니다
    그게 성공하면 나오는 결과값을 data라고 하는데 그걸 콘솔창에 찍어라*/  


  auth.onAuthStateChanged(function(data){
/*인증 상태 관찰자 설정 및 사용자 데이터 가져오기
-> firebase홈페이지에 인증 - 웹 - 시작하기에 있는거 카피붙여넣기 했음*/
log(data);
  })