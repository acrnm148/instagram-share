package com.example.instagramshare

import android.content.Context
import android.content.Intent
import android.webkit.JavascriptInterface
import android.webkit.WebView
import androidx.core.content.FileProvider
import org.json.JSONObject
import java.io.File
import java.net.URL
import java.util.concurrent.Executors

/**
 * Exposed to the web page as window.InstagramBridge.postMessage(json) — see
 * instagram-share/src/lib/instagramBridge.ts for the request/response contract.
 */
class InstagramBridge(
    private val context: Context,
    private val webView: WebView,
) {
    private val executor = Executors.newSingleThreadExecutor()
    private val instagramPackage = "com.instagram.android"

    @JavascriptInterface
    fun postMessage(message: String) {
        val request = JSONObject(message)
        val id = request.getString("id")
        val action = request.getString("action")
        val payload = request.getJSONObject("payload")

        executor.execute {
            val result = try {
                when (action) {
                    "shareInstagramStory" -> shareToStory(payload)
                    "shareInstagramDirect" -> shareGeneric(payload)
                    else -> errorResult("unknown_action: $action")
                }
            } catch (e: Exception) {
                errorResult(e.message ?: e.javaClass.simpleName)
            }
            respond(id, result)
        }
    }

    private fun isInstagramInstalled(): Boolean = try {
        context.packageManager.getPackageInfo(instagramPackage, 0)
        true
    } catch (e: Exception) {
        false
    }

    private fun downloadImage(imageUrl: String, fileName: String): File {
        val dir = File(context.cacheDir, "shared_images").apply { mkdirs() }
        val file = File(dir, fileName)
        URL(imageUrl).openStream().use { input ->
            file.outputStream().use { output -> input.copyTo(output) }
        }
        return file
    }

    private fun shareToStory(payload: JSONObject): JSONObject {
        if (!isInstagramInstalled()) return unavailableResult("not_installed")

        val imageUrl = payload.getString("imageUrl")
        val linkUrl = payload.opt("linkUrl") as? String
        val imageFile = downloadImage(imageUrl, "story_bg.png")
        val uri = FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", imageFile)

        val intent = Intent("com.instagram.share.ADD_TO_STORY").apply {
            setDataAndType(uri, "image/png")
            putExtra("source_application", context.packageName)
            linkUrl?.let { putExtra("content_url", it) }
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }

        if (intent.resolveActivity(context.packageManager) == null) {
            return unavailableResult("unsupported_platform")
        }
        context.startActivity(intent)
        return successResult()
    }

    /**
     * Instagram has no API to target a specific DM recipient. This opens Instagram's own
     * share screen with the content; the user picks "Direct" and a recipient inside it.
     */
    private fun shareGeneric(payload: JSONObject): JSONObject {
        if (!isInstagramInstalled()) return unavailableResult("not_installed")

        val text = payload.optString("text", "")
        val imageUrl = payload.opt("imageUrl") as? String

        val intent = Intent(Intent.ACTION_SEND).apply {
            setPackage(instagramPackage)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            if (imageUrl != null) {
                val imageFile = downloadImage(imageUrl, "direct_share.jpg")
                val uri = FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", imageFile)
                type = "image/*"
                putExtra(Intent.EXTRA_STREAM, uri)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            } else {
                type = "text/plain"
            }
            if (text.isNotEmpty()) putExtra(Intent.EXTRA_TEXT, text)
        }

        if (intent.resolveActivity(context.packageManager) == null) {
            return unavailableResult("unsupported_platform")
        }
        context.startActivity(intent)
        return successResult()
    }

    private fun successResult() = JSONObject().put("status", "success")

    private fun unavailableResult(reason: String) =
        JSONObject().put("status", "unavailable").put("reason", reason)

    private fun errorResult(msg: String) =
        JSONObject().put("status", "error").put("message", msg)

    private fun respond(id: String, result: JSONObject) {
        webView.post {
            val js = "window.__onInstagramBridgeResult && window.__onInstagramBridgeResult(" +
                "${JSONObject.quote(id)}, ${JSONObject.quote(result.toString())});"
            webView.evaluateJavascript(js, null)
        }
    }
}
