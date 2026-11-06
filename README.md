## shareInstagramStory

기존 `callNative` 디스패처에 `shareInstagramStory` 분기만 추가합니다.

> ⚠️ **콜백 처리**
> 응답은 `data.callback`으로 받은 문자열을 **그대로 실행**합니다.
> `KbbJS.mobi.customFnStore.<uuid>` 형태로 매번 달라지므로 **하드코딩 금지**입니다.

### 응답 상태값

| status | 의미 |
|---|---|
| `success` | 인스타그램 스토리 화면 호출 성공 |
| `not_installed` | 인스타그램 앱 미설치 |
| `unsupported_platform` | 설치되어 있으나 스토리 공유 인텐트를 처리할 수 없음 (Android) |

---

### Android

```kotlin
"shareInstagramStory" -> {
    if (!isInstalled("com.instagram.android")) return respond(callback, "not_installed")

    // https URL → cacheDir 저장 → FileProvider content:// URI
    val bgUri = downloadToContentUri(params.optString("imageUrl"))

    val intent = Intent("com.instagram.share.ADD_TO_STORY").apply {
        setDataAndType(bgUri, "image/png")
        putExtra("source_application", FACEBOOK_APP_ID)
        params.optString("linkUrl").takeIf { it.isNotEmpty() }
            ?.let { putExtra("content_url", it) }
        addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    }
    if (intent.resolveActivity(packageManager) == null) return respond(callback, "unsupported_platform")
    startActivity(intent)
    respond(callback, "success")
}

private fun respond(callback: String, status: String) =
    webView.post { webView.evaluateJavascript("$callback('$status')", null) }
```

#### Manifest 선행 조건

1. **패키지 가시성 (Android 11+)**
   ```xml
   <queries>
       <package android:name="com.instagram.android" />
   </queries>
   ```
2. **FileProvider** — `grantUriPermissions="true"` 필수
   `file://` URI를 그대로 넘기면 Instagram이 읽지 못합니다.

---

### iOS

```swift
case "shareInstagramStory":
    guard let scheme = URL(string: "instagram-stories://share?source_application=\(FACEBOOK_APP_ID)"),
          UIApplication.shared.canOpenURL(scheme) else {
        respond(callback, "not_installed")
        return
    }

    UIPasteboard.general.setItems(
        [["com.instagram.sharedSticker.backgroundImage": imageData]],
        options: [.expirationDate: Date().addingTimeInterval(300)]
    )
    UIApplication.shared.open(scheme)
    respond(callback, "success")
```

#### Info.plist 선행 조건

`LSApplicationQueriesSchemes`에 `instagram-stories`를 추가합니다.

```xml
<key>LSApplicationQueriesSchemes</key>
<array>
    <string>instagram-stories</string>
</array>
```

> 💡 **Android와의 차이**
> iOS는 인텐트 대신 **페이스트보드에 이미지를 올려두고 스킴을 여는 방식**입니다. 그래서 이미지 전달 경로가 Android와 완전히 다릅니다.


Android


private const val FACEBOOK_APP_ID = "1817170559719071"
// ...
putExtra("source_application", FACEBOOK_APP_ID)
iOS


URL(string: "instagram-stories://share?source_application=1817170559719071")
