package com.example.instagramshare

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebView
import androidx.appcompat.app.AppCompatActivity

// 10.0.2.2 is the emulator's alias for the host machine's localhost.
private const val DEV_SERVER_URL = "http://10.0.2.2:3000"

class MainActivity : AppCompatActivity() {

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (BuildConfig.DEBUG) {
            WebView.setWebContentsDebuggingEnabled(true)
        }

        val webView = WebView(this)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.addJavascriptInterface(InstagramBridge(this, webView), "InstagramBridge")
        webView.loadUrl(DEV_SERVER_URL)

        setContentView(webView)
    }
}
