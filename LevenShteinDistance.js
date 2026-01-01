// function LevenshteinDistance (Character str1 [1 to lenStr1], Character str2 [1 to lenStr2]) return Integer is
// begin
//    (* lenStr1+1 行 lenStr2+1 列のテーブル d を用意する *)
//    variable Integer d [0 to lenStr1, 0 to lenStr2] ;

//    for Integer i1 := 0 to lenStr1 do let d[i1,0] := i1 ;
//    for Integer i2 := 0 to lenStr2 do let d[0,i2] := i2 ;

//    for Integer i1 := 1 to lenStr1 do
//        for Integer i2 := 1 to lenStr2 do
//            begin
//            constant Integer cost := if str1[i1] == str2[i2] then 0 else 1 ;
//            let d[i1,i2] := minimum
//              (
//              d [i1-1, i2  ] + 1,     (* 文字の削除 *)
//              d [i1  , i2-1] + 1,     (* 文字の挿入 *)
//              d [i1-1, i2-1] + cost   (* 文字の置換 *)
//              )
//            end ;

//    return d [lenStr1, lenStr2]
// end

function LevenshteinDistance(str1, str2) {
	const l1 = str1.length;
	const l2 = str2.length;

	const D = new Array((l1 + 1) * (l2 + 1));

	const get = (i1, i2) => D[i1 * (l2 + 1) + i2];
	const set = (i1, i2, v) => D[i1 * (l2 + 1) + i2] = v;

	for (let i1 = 0; i1 <= l1; i1++) {
		set(i1, 0, i1);
	}

	for (let i2 = 0; i2 <= l2; i2++) {
		set(0, i2, i2);
	}

	for (let i1 = 1; i1 <= l1; i1++) {
		for (let i2 = 1; i2 <= l2; i2++) {

			const cost = str1[i1 - 1] == str2[i2 - 1] ? 0 : 1;

			const minDist = Math.min(
				get(i1 - 1, i2) + 1, // 削除
				get(i1, i2 - 1) + 1, // 挿入
				get(i1 - 1, i2 - 1) + cost // 置換
			);

			set(i1, i2, minDist);
		}
	}

	return D;
}
