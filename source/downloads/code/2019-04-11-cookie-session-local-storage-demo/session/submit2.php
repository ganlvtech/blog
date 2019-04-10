<?php
session_start();
echo '你喜欢游泳吗？';
if ($_SESSION['swim'] == '1') {
    echo '喜欢';
} else {
    echo '不喜欢';
}
echo '<br>';

echo '你喜欢拳击吗？';
if ($_SESSION['boxing'] == '1') {
    echo '喜欢';
} else {
    echo '不喜欢';
}
echo '<br>';

echo '你要不要报一个健身班？';
if ($_POST['go'] == '1') {
    echo '要';
} else {
    echo '不要';
}
