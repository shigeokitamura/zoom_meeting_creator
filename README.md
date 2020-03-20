# Zoom Meeting Creator
[Zoom](https://zoom.us/) でInstant meetingを作成し、URLをSlackに通知します。

# How To Use
1. https://marketplace.zoom.us/docs/guides/authorization/jwt/jwt-with-zoom
を参考にJWT Appを作成し、 `API Key` と `API Secret` を取得します。
2. https://api.slack.com/messaging/webhooks を参考にSlack appを作成し、Incoming Webhooksを有効にします。
3. Google Apps Scriptを開き、ファイル > プロジェクトのプロパティ > スクリプトのプロパティに `APIKey` , `APISecret`, `SlackWebhookURL` をそれぞれ設定します。
4. main関数を実行します。

トリガーを設定すると定期的にミーティングを開始できます。