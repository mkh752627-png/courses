# courses
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تجربتي</title>
  <style>
    body { font-family: sans-serif; background: #0f0f0f; color: white; display: grid; place-items: center; height: 100vh; text-align: center; }
    .card { background: #1a1a1a; padding: 40px; border-radius: 20px; border: 1px solid #333; }
    button { background: white; color: black; padding: 12px 24px; border-radius: 10px; border: 0; font-weight: bold; margin-top: 20px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🔥 اشتغل!</h1>
    <p>تم ربط ستوديو دارت بقيتهب بنجاح</p>
    <p id="time"></p>
    <button onclick="document.getElementById('time').innerText = new Date().toLocaleString('ar-YE')">جرب الضغط</button>
  </div>
</body>
</html>
