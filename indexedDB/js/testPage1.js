$(document).ready(function(){
  //次へボタン押下時
  $('#next_page').on({
    'click' : function(){
      openDB(DBName, 1, storeName, function(){
        console.log(getFileName());
        if(getFileName() == 'testPage1.html'){
          // コールバック関数を読みだした回数をカウントする変数
          var countCallback = 0;
          for(var question_i = 1; question_i < 7; question_i++){
            var key = getFileName() + $('#question' + question_i).attr('id');
            var value = $('#question' + question_i + ' .answerField').html();
            var dictionary = {id: key, value: value};
            putData(storeName, dictionary, function(){
              countCallback += 1;
              if(countCallback >= 6){
                location.href = './testPage2.html';
              }
            });
          }
        }else{
          // コールバック関数を読みだした回数をカウントする変数
          var countCallback = 0;
          for(var question_i = 1; question_i < 7; question_i++){
            var key = getFileName() + $('#question' + (question_i + 6)).attr('id');
            var value = $('#question' + (question_i + 6) + ' .answerField').html();
            var dictionary = {id: key, value: value};
            putData(storeName, dictionary, function(){
              countCallback += 1;
              if(countCallback >= 6){
                getAllData(storeName, function(dataArray){
                  console.log(dataArray);
                });
              }
            });
          }
        }
      });
    }
  });

  $('#prev_page').on({
    'click' : function(){
      openDB(DBName, 1, storeName, function(){
        // コールバック関数を読みだした回数をカウントする変数
        var countCallback = 0;
        for(var question_i = 1; question_i < 13; question_i++){
          var key = getFileName() + $('#question' + question_i).attr('id');
          var value = $('#question' + question_i + ' .answerField').html();
          var dictionary = {id: key, value: value};
          deleteAllData(storeName, function(){
            countCallback += 1;
            if(countCallback >= 12){
              location.href = './testPage1.html';
            }
          });
        }
      });
    }
  });





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
  // 仮説
  // getAllDataメソッド実行時、store.openCursor().onsuccessまで処理が走るが
  // onsuccessは成功時に以下のcallback関数を実行するのでいったんスルーされ
  // 先にoutputDataへのgetAllDataメソッドの実行結果が格納される？
  // なので、getAllDataメソッドが2回行われたように見え、returnされるのは$().htmlが
  // 終わった後なのでなにも取得できない
  $('#output_button').on({
    'click' : function(){
      openDB("testDB", 1, "testStore", function(){
        getAllData("testStore", function(dataArray){
          $('#output_area').html(dataArray[0].value);
          console.log(dataArray);
        });
      });
      // var data = getData("testStore", "testPage1.html0");
      // $('#output_area').html(data);

      // var storeObject = getObjectStore("testStore", 'readwrite');
      // var outputData = getAllData("testStore");
      // setTimeout(function(){
      //   console.log(outputData);
      //   $('#output_area').html(outputData);
      // }, 1000);

      // callback関数を持たせることでうまく処理ができたodagaki 20180710
      // getAllData("testStore", function(dataArray){
      //   $('#output_area').html(dataArray[0].value);
      //   console.log(dataArray);
      // });
    }
  })


})
