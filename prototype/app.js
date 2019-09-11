
// const TXT = "MAMP is a free, local server environment that can be installed under macOS and Windows with just a few clicks. MAMP provides them with all the tools they need to run WordPress on their desktop PC for testing or development purposes, for example. It doesn't matter if you prefer Apache or Nginx or if you want to work with PHP, Python, Perl or Ruby.";
const TXT = "Hello1234567890";
const BACKSPACE = 8;
const DELETE = 46;
const SHIFT = 16;
var isstart = false;
var cdsec = 0;
var milis = 0;
var sec = 0;
var min = 0;
var keydownCount = 0;
var beforeTxt = "";
$(function () {
    var $tarea = $('.typearea');
    var $sarea = $('.showarea');
    var rap = null;
    var failcount = 0;

    $('.btn-start').on('click', function () {

        if (!isstart) {
            // when stopped(initial state)
            isstart = true;
            $('.btn-start').val('STOP');

            // 3sec countdown
            var si = setInterval(function () {
                var count = 3;
                $('.raptime').html(count - cdsec);

                // start Rap
                if (cdsec === 3) {
                    clearInterval(si);
                    $tarea.prop('disabled',false);
                    // $('.btn-reset').prop('disabled', true);
                    $tarea.focus();
                    $sarea.val(TXT);
                    rap = setInterval(function () {
                        milis++;
                        if(milis === 100) {
                            milis = 0;
                            sec++;
                            if (sec === 60) {
                                sec = 0;
                                min++;
                            }
                        }
                        $('.raptime').html(getRaptime());
                    }, 10);
                }
                cdsec++;
            }, 1000);
        } else {
            clearInterval(rap);
            reset();
        }
    })

    // 入力判定
    $tarea.on('keyup', function(e){

        //backspace無効
        if (e.keyCode === BACKSPACE) {
            return;
        }

        var inputTxt = $(this).val();
        var correctTxt = TXT.substring(0, inputTxt.length);
        // 間違ってたら画面揺らし、1ミス＋＋
        if (inputTxt !== correctTxt) {
            shakeTarea(this);
            failcount++;
            var beforeStr = getDuplicateStrings(inputTxt, correctTxt);
            $(this).val(beforeStr);
        } else {
            // 正しかったら車位置移動
            if (beforeTxt !== inputTxt) {
                beforeTxt = inputTxt;
                carmove(inputTxt, TXT);
            }
        }

        // 最後まで入力し切ったら終了
        if (inputTxt === TXT) {
            clearInterval(rap);
            showFinished(failcount);
        }
    });

    // 不正防止
    // ctrl+v
    $tarea.on('keydown', function (e) {

        // 入力文字数に対し、キータッチ回数(ミスタッチ含まず)が少ない場合、何らかのチートが行われたとみなす
        // when keytouch count is less than input text length, some cheat may happens.
        keydownCount++;
        var inputTxt = $(this).val().length;
        if ((keydownCount - failcount) < inputTxt) {
            alert('不正入力');
            clearInterval(rap);
        }

        if (e.keyCode==91) {
            alert('変なキー押さないで！')
            e.keyCode=0;
        }
        if(e.keyCode==86 && e.ctrlKey==true){
            alert("貼り付けは禁止です。")
            e.keyCode=0
        }
    });


    // D&D
    $tarea.on('drop dragover', function(e){
        e.stopPropagation();
        e.preventDefault();
        alert('あ、そうゆうのなしで');
    });

    // hide finishedpanel
    $('.btn-close').on('click', function () {
        $('.finished-panel').hide();
        $('.finished-panel-cover').hide();
    })

    $('.btn-reset').on('click', function () {
        reset();
    })
});

function startCountdown() {
    cdsec--;
    var $time = $('.time');
    $time.html(cdsec);
    if (cdsec == 0) {
        clearInterval();
    }
}

function shakeTarea(tarea) {
    // effect(揺らす、2px、2回)
    $('.typearea').effect('shake', '2', '2');
}

// 車移動アニメ
function carmove(inputtxt, TXT) {
    var $runningLine = $('.running-line');
    // var percent = inputtxt.length / TXT.length;
    var percent = 1 / TXT.length;
    var moved = ($runningLine.width() * percent );
    // $('.running-car').attr('margin-left: ' + ($runningLine.width() * percent - $('.running-car').width()) + 'px;');
    var maxMoved = $runningLine.width() * (inputtxt.length / TXT.length);
    if (maxMoved > moved) {
        $('.running-car').animate({'left' : "+=" + moved + 'px'}, { easing: 'linear'});
    }
}

function isInputMatched() {
    var inputTxt = $('.typearea').val();
    var correctTxt = TXT.substring(0, inputTxt.length);
    return inputTxt === correctTxt;
}

function getDuplicateStrings(str1, str2) {
    var retStr = '';
    for (let i = 0; i < str1.length; i++) {
        if (str1[i] !== str2[i]) {
            break;
        }
        retStr += str1[i];
    }
    return retStr;
}

function showFinished(failcount) {
    $('.typearea').prop('disabled', true);
    var finishedPanelWidth = $('.finished-panel').width();
    var finishedPanelHeight = $('.finished-panel').height();

    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    $('.finished-panel').attr('style', 'left: ' + (windowWidth/2-finishedPanelWidth/2)+'px;top:'+(windowHeight/2-finishedPanelHeight/2)+'px;');

    $('.finished-panel').show();
    // $('.finished-panel').focus();
    $('.btn-close').focus();
    $('.failcount').text(failcount);
    $('.finished-panel-cover').show();
}

/**
 * リセット
 */
function reset() {
    milis = 0;
    sec = 0;
    min = 0;
    isstart = false;
    cdsec = 0;
    $('.raptime').html(0);
    $('.btn-start').val('START');
    $('.typearea').val('');
    $('.showarea').val('');
    $('.running-car').css('left', '0px');
}

/**
 * 時間計測
 */
function getRaptime() {
    var strmilis =  milis < 10 ? '0' + milis : milis.toString();
    var strsec = sec < 10 ? '0' + sec : sec.toString();
    var strmin = min < 10 ? '0' + min : min.toString();
    return strmin + ':' + strsec + ':' + strmilis;
}
