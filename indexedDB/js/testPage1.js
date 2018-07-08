$(document).ready(function(){
  // 登録を押下した回数をカウント
  var registerCount = 0;
  var outputText = '';
  $('#register_button').on({
    'click' : function(){
      var inputText = $('#input_form').val();
      var key = getFileName() + registerCount;
      var dictionary = {id: key, value: inputText};
      openDB("testDB", 1, "testStore");
      setTimeout(function(){
        // var storeObject = getObjectStore("testStore", 'readwrite');
        putData("testStore", dictionary);
        // var outputData = getData(storeObject, key);
        // outputText += outputData + '<br/>'
        // $('#output_area').html(outputText);
        registerCount += 1;
      }, 1000);
    }
  });

  // なぜか関数化したらうまくとりだせない・・・
  //getAllDataメソッドがなぜか2回はしり、1回目にはopenCursor()がsuccessにならず、2回目にsucccessになるため
  // 時間遅延でoutputしようとしたがreturnでの値が返ってこない
  // なぜ？？20180709
  $('#output_button').on({
    'click' : function(){

      // var data = getData("testStore", "testPage1.html0");
      // $('#output_area').html(data);

      // var storeObject = getObjectStore("testStore", 'readwrite');
      var outputData = getAllData("testStore");
      setTimeout(function(){
        console.log(outputData);
        $('#output_area').html(outputData);
      }, 1000);
    }
  })


})
