var db;

// DBを開くメソッド（DBの新規作成、upgradeも含む）
function openDB(DBName, DBVersion, DBStoreName, callback){
  // requestにはIDBOpenDBRequestオブジェクトのインスタンスが格納される
  // IDBOpenDBRequestオブジェクトは結果（成功）またはイベントとして扱うエラー値を伴うオブジェクト
  //open()関数の第一引数はDB名、第二引数はバージョン(long型)
  //DBがない場合新規のDBが作成される
  var request = window.indexedDB.open(DBName, DBVersion);
  // DBが存在しない、もしくはversionが古い場合、新規作成アップグレード
  request.onupgradeneeded = function(event){
    console.log('DBUPGRADE');
    // オブジェクトストアを作成
    var store = event.currentTarget.result.createObjectStore(
      DBStoreName,
      {keyPath: "id"}
    );
    // このイベントを正常に抜けたらonsuccessハンドラが実行される
  };
  // requestが成功したとき
  request.onsuccess = function(event){
    //成功時の処理、request.resultに対して行うこと
    // 成功eventがrequestをtargetとして発生する
    //変数dbに成功時のeventのtrget(つまりrequest)の結果を格納
    // event.target==request, request.result==IDBDatabaseのインスタンス
    db = this.result;
    console.log("DBOPEN!");
    callback();
  };
  //requestが失敗したとき
  request.onerror = function(event){
    //error時の処理、request.errorCodeに対して行うこと
    // errorEventがrequestをtargetとして発生する
    console.error("openDB: ", event.target.errorCode);
    callback();
  };
}

// オブジェクトストアを返すメソッド
function getObjectStore(storeName, mode){
  var transaction = db.transaction(storeName, mode);
  return transaction.objectStore(storeName);
}

// 指定したkeyのデータを取得するメソッド
function getData(storeName, key, callback){
  // var store = getObjectStore(storeName, 'readwrite');
  var transaction = db.transaction(storeName, "readwrite");
  var store = transaction.objectStore(storeName);
  var request = store.get(key);
  request.onsuccess = function(event){
    var value = event.target.result;
    $('#output_area').html(value);
    // return value;
    callback(value);
  }
}

// 全データを読み出す
function getAllData(storeName, callback){
  var dataArray = [];
  var transaction = db.transaction(storeName, 'readwrite');
  var store = transaction.objectStore(storeName);
  store.openCursor().onsuccess = function(event){
    var cursor = event.target.result;
    if(cursor){
      dataArray.push(cursor.value);
      console.log(dataArray);
      cursor.continue();
    }else{
      alert('allDataGetDone');
      // $('#output_area').html(dataArray[0].value);
      callback(dataArray);
      // return dataArray;
    }
  }
}

// データを削除するメソッド
function deleteData(storeName, key, callback){
  var transaction = db.transaction(storeName, 'readwrite');
  var store = transaction.objectStore(storeName);
  var request = store.delete(key);
  request.onsuccess = function(event){
    callback();
  }
}

// データを削除するメソッド
function deleteAllData(storeName, callback){
  var dataArray = [];
  var transaction = db.transaction(storeName, 'readwrite');
  var store = transaction.objectStore(storeName);
  store.openCursor().onsuccess = function(event){
    var cursor = event.target.result;
    if(cursor){
      if(cursor.key.match(/testPage/)){
        store.delete(cursor.key);
        cursor.continue();
      }else{
        console.log('delete Failed');
      }
    }else{
      alert('deleteDone');
      // $('#output_area').html(dataArray[0].value);
      callback();
      // return dataArray;
    }
  }
}

// データを追加するメソッド（上書き）
function putData(storeName, dictionary, callback){
  var store = getObjectStore(storeName, 'readwrite');
  var request = store.put(dictionary);
  request.onsuccess = function(){
    console.log('putOK!!');
    callback();
  }
}

// ファイル名取得用メソッド
function getFileName(){
  var url = location.href;
  var fileName = url.split('/').pop();
  return fileName;
}
