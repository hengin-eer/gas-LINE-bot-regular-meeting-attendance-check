let prop = PropertiesService.getScriptProperties().getProperties()
// 環境変数を取得するためにインスタンス化（環境変数はプロジェクトの設定から設定できる）

function myFunction() {
  let today = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd');
  // 今日の日付をyyyy/MM/dd形式で取得
  let templateFile = DriveApp.getFileById(prop.TEMPLATE_FILE)
  // フォームのテンプレートファイルを取得（環境変数はプロジェクトの設定から確認できる）
  let OutputFolder = DriveApp.getFolderById(prop.OUTPUT_FOLDER)
  // コピーされたフォームを置くフォルダーを取得
  let newFileName = today+templateFile.getName().replace('template_', '')
  // コピーされたフォームにつける名前（template_ を削除する）
  let newfile = templateFile.makeCopy(newFileName, OutputFolder)
  // テンプレートファイルをもとにフォームをコピー
  let copyfile_id = newfile.getUrl()
  // コピーしたフォームファイルのurlを取得

  let message = (`

${today}の定例会の出欠フォームを送信します\n\n
⚠️出席する方のみフォームに回答してください\n
⚠️苗字のみを入力してください\n\n
このメッセージは自動送信していますので、定例会が休みの日は回答不要です\n
${copyfile_id}`);
// LINEで送るメッセージ

  sendMessage(message)
  // LINEでメッセージを送る関数を実行
}

function sendMessage(message) {
  const ACCESS_TOKEN = prop.ACCESS_TOKEN
  // APIの認証に必要なアクセストークンを環境変数から取得（書記局員の個人LINEアカウントから認証しているため、引継ぎ時には変更する必要がある）
  const LINE_NOTIFY_API = 'https://notify-api.line.me/api/notify'
  // APIを使用するためのurl（LINEのデベロッパーが仕様を変更しない限り、いじらなくて良い）

  const options =
  {
    "method": "post",
    "payload": { "message": message },
    "headers": { "Authorization": "Bearer " + ACCESS_TOKEN }
  }
  // メッセージを送るためのオプション。通信方式を指定、メッセージを指定、認証情報を記載

  UrlFetchApp.fetch(LINE_NOTIFY_API, options)
  // LINEでメッセージを送信するための通信

  console.log("success!\n")
  // プログラムの実行後、ログに表示される。デバッグ（途中で処理に失敗すると表示されないため）
}
