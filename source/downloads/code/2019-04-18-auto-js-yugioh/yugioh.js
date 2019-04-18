if (!requestScreenCapture(true)) {
    toast("请求截图失败");
    exit();
}

var btns = {
    vs: images.read('/sdcard/auto-js-yugioh/vs.png'),
    start: images.read('/sdcard/auto-js-yugioh/start.png'),
    auto: images.read('/sdcard/auto-js-yugioh/auto.png'),
    win: images.read('/sdcard/auto-js-yugioh/win.png'),
    lose: images.read('/sdcard/auto-js-yugioh/lose.png'),
    back2: images.read('/sdcard/auto-js-yugioh/back2.png'),
    back: images.read('/sdcard/auto-js-yugioh/back.png'),
    ok: images.read('/sdcard/auto-js-yugioh/ok.png'),
};

var counts = {
    vs: 0,
    start: 0,
    auto: 0,
    win: 0,
    lose: 0,
    back: 0,
    back2: 0,
    ok: 0,
};

var w = floaty.window(
    <frame gravity="center">
        <text id="text" textColor="white">悬浮文字</text>
    </frame>
);
w.exitOnClose();
w.text.click(() => {
    w.setAdjustEnabled(!w.isAdjustEnabled());
});

for (; ;) {
    var img = captureScreen();
    for (var i in btns) {
        var p = findImage(img, btns[i], {});
        if (p) {
            click(p.x + btns[i].getWidth() / 2, p.y + btns[i].getHeight() / 2);
            counts[i]++;
            var str = 'WIN: ' + counts.win + '\n' + 'LOSE: ' + counts.lose;
            ui.run(function () {
                w.text.setText(str);
            });
        }
    }
    sleep(1500);
}
