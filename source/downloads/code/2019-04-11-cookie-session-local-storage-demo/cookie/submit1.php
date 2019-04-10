<?php
setcookie('swim', $_POST['swim']);
setcookie('boxing', $_POST['boxing']);
?><!DOCTYPE html>
<html>

<head>
    <title>游泳健身了解一下</title>
    <link rel="stylesheet" href="../common/style.css">
</head>

<body>
    <h1>游泳健身了解一下</h1>
    <img class="strong-man" src="../common/strong-man.png" alt="长胡子猛男">

    <div class="form">
        <h2>问卷 2</h2>

        <form action="submit2.php" method="POST">

            <div>
                <p>你要不要报一个健身班？</p>
                <input type="radio" name="go" value="1" id="go-1">
                <label for="go-1">要</label>
                <input type="radio" name="go" value="0" id="go-0">
                <label for="go-0">不要</label>
            </div>

            <p>
                <input type="submit" value="提交">
            </p>

        </form>
    </div>
</body>

</html>
