# -*- coding: utf-8 -*-

import requests

url = "https://13.210.26.62/api/1.0/quizzes/create"  # Replace with the actual API URL

headers = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZGI0YWMxMzJmNGJjNGViMzcxNmU5NSIsImlhdCI6MTY5MjA5MzE1NH0.hTIO-LJv_7jT4nPQ_t86soLo6ZGH97WqHyFHu3iCVYs",
    "Content-Type": "application/json"
}

data = {
  "article": {
        "title": "加密貨幣2",
        "category": "加密貨幣",
        "easy": 3,
        "normal": 3,
        "hard": 4,
        "content": "加密貨幣是什麼？ Investopedia 介紹，加密貨幣是由密碼學保護的數位或虛擬貨幣，而當今多數的加密貨幣，都是建立在區塊鏈的技術之上，通常不是由各國家或政府單位發行。相對來說，我們日常使用的金錢，則稱為法定貨幣，是由政府發行的交易媒介。比較這兩者之間，可以發現加密貨幣有兩個重要特性：去中心化，以及透明、不可竄改。\n\n加密貨幣特性1：去中心化\n平常轉帳給別人、或購物刷卡時，其實金流經過了許多地方，才能到達朋友或商家手中，包括銀行、清算中心、第三方支付業者等等，但同樣的場景換到加密貨幣時，這些第三方機構或平台就不復存在，而是直接與對方交易，如此一來能節省時間以及手續費。\n\n然而這樣做的話，金流要如何留下紀錄？由於加密貨幣是以區塊鏈為核心技術，交易發生時必須在區塊鏈中經過認證的程序，並且會留下記錄或證明。《紐約時報》解釋，可以想像區塊鏈是一張 Google 雲端表單，但非托管在 Google 的伺服器中，而是全世界各處的電腦網路共同維護。當交易發生時，就由這些共同維護的電腦，經過複雜的演算法，確認該交易資訊正確，並記載到表單（區塊鏈）當中，不會以單一機構或人，來決定是否通過，甚至是審查你的交易。\n\n加密貨幣特性2：透明、不可竄改\n加密貨幣另一個特性為透明、不可事後修改，這項特性同樣是源自區塊鏈。當共同維護的電腦「記好帳」之後，畢竟是多人驗證之下的紀錄，如果真的要擅自改動，就得經過所有人驗證、讓所有人一起調整記錄，幾乎是難以做到；另外，區塊鏈大多是公開、開源的，意味著所有人都能檢查交易紀錄，或追蹤特定帳戶持有人的活動（但是帳戶持有人的身份是加密的，所以你無法知道這些在進行交易的帳戶背後是誰），因此才會說交易無法再隨意改動或刪除。"
    }
}

response = requests.post(url, json=data, headers=headers)

print("Response Status Code:", response.status_code)
print("Response Content:", response.json())