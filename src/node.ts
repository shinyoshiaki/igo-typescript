export const Node = {
  Base: {
    //BASEノードに格納するID値をエンコードするためのメソッド
    //BASEノードに格納されているID値をデコードするためにも用いられる
    ID: function(nid: number) {
      return -nid - 1;
    }
  },

  //CHECKノード用の定数が定義されているクラス
  Chck: {
    //文字列の終端を表す文字コード
    //この文字はシステムにより予約されており、辞書内の形態素の表層形および解析対象テキストに含まれていた場合の動作は未定義
    TERMINATE_CODE: 0,

    //CHECKノードが未使用だということを示すための文字コード
    //この文字はシステムにより予約されており、辞書内の形態素の表層形および解析対象テキストに含まれていた場合の動作は未定義
    VACANT_CODE: 1,

    //使用可能な文字の最大値
    CODE_LIMIT: 0xffff,
    TERMINATE_CHAR: String.fromCharCode(0)
  }
};
