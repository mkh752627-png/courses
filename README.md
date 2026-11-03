<!DOCTYPE html> 
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ملفاتي</title>
<style>
body{background:#0f0f0f; color:white; font-family:sans-serif; padding:20px; text-align:center}
.grid{display:grid; grid-template-columns:repeat(auto-fill, minmax(90px,1fr)); gap:20px; max-width:500px; margin:20px auto}
.item{text-decoration:none; color:white}
.circle{width:70px; height:70px; border-radius:50%; background:#000; border:1px solid #333; display:grid; place-items:center; font-size:28px; font-weight:bold; margin:0 auto 8px; transition:0.2s}
.item:hover .circle{transform:translateY(-4px); border-color:#fff; box-shadow:0 5px 15px rgba(255,255,255,0.2)}
.name{font-size:13px; opacity:0.8}
</style>
</head>
<body>
<h2>📁 ملفاتي</h2>
<div class="grid">
  <a class="item" href="index.html"><div class="circle" style="background:#ff5722;">N</div><div class="name">gg.html</div></a>
  <a class="item" href="n.html"><div class="circle" style="background:#4caf50;">T</div><div class="name">Technician</div></a>
  <a class="item" href="Test.html"><div class="circle" style="background:#2196f3;">t</div><div class="name">test</div></a>
  <a class="item" href="about.html"><div class="circle" style="background:#9c27b0;">A</div><div class="name">about.html</div></a>
</div>
</body>
</html>
