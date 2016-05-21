/**
 * Created by Administrator on 2015/11/29.
 */
var speed = 3;    //公共属性

//pkt数组存放各个pkt
var packets = [];
var send_pkt = [];
var receive_pkt = [];

var N = 5;                //窗口大小
var base = 0;             //基序号
var nextSeqNum = 0;       //最小的未使用序号
var expectNum = 0;        //待接受序号

var pause = false;

//初始化
init();

setInterval(update,50);

var timer = 0;
var timerOn = false;

//更新逻辑，每隔一段时间调用一次
function update(){
    if(!pause){
        for(var i=0;i<10;i++){
            movePkt(i);
        }
        for(var i=0; i<10; i++){
            if(getPktY(i)<70){
                packets[i].direction = 1;
                hidePkt(i);
                if(receive_pkt[i].received){
                    send_pkt[i].received = true;
                    changeSenderColor(i, "deepskyblue");
                    setWindow(i + 1);
                    base = i + 1;
                    setSenderColor(i+1);
                }
            }else if(getPktY(i)>245 ){
                if(i == expectNum){
                    packets[i].direction = -1;
                    changePktColor(i, "yellow");
                    changeReceiverColor(i, "red");
                    receive_pkt[i].received = true;
                    expectNum ++;
                    moveReceiveWindow();
                }else{
                    $("#pkt" + i).html(expectNum - 1);
                    packets[i].direction = -1;
                    changePktColor(i, "yellow");
                }
            }
        }
        if(timerOn){
            timer ++;
            if(timer > 400){
                sendAllPkts();
                timer = 0;
                timerOn = false;
            }
        }
        if(packets[base].received){
            timer = 0;
            timerOn = false;
        }
    }
}
//发送pkt
function sendPkt(){
    if(nextSeqNum < base + N && !pause){
        packets[nextSeqNum].direction = 1;
        $("#s_pkt" + nextSeqNum).css("background-color", "lightgreen");
        $("#pkt" + nextSeqNum).css('background-color','lightgreen').show();
        nextSeqNum++;
    }
    timerOn = true;
}


//发送窗口内所有包
function sendAllPkts(){
    for(var i=base;i<nextSeqNum ;i++) {
        packets[i].direction = 1;
        $("#s_pkt" + i).css("background-color", "lightgreen");
        $("#pkt" + i).css('background-color', 'lightgreen').show();
    }
}

//设置发送者之前包的颜色
function setSenderColor(num){
    for(var i=0; i<num; i++){
        changeSenderColor(i, "deepskyblue");
    }
}

//设置发送者窗口的位置,并且改变前面发送块的颜色
function setWindow(num){
    $("#send-window").css('left', 13 + num*30);
}

//初始化逻辑
function init(){
    for(var i=0; i<10 ;i++){
        packets[i] = {
            direction: 0,
            status: "pkt",
            hidden: false
        };
        send_pkt[i] = {
            ack_received:false
        };
        receive_pkt[i] = {
            received: false
        };
    }
    $("#pause-btn").click(function(){
        if(pause){
            pause = false;
            $("#btn-pause").html("Pause");
        }else{
            pause = true;
            $("#btn-pause").html("Resume");
        }
    });
}
//获取pkt的Y轴的位置
function getPktY(pktNumber){
    var thisPkt = "#pkt" + pktNumber;
    return parseInt($(thisPkt).css("top"));
}

//更改pkt的颜色
function changePktColor(pktNumber,color){
    packets[pktNumber].color = color;
    var thisPkt = "#pkt" + pktNumber;
    $(thisPkt).css("background-color",color);
}

//更改sender的颜色
function changeSenderColor(senderNumber, color){
    var thisPkt = "#s_pkt" + senderNumber;
    $(thisPkt).css("background-color",color);
}

//更改receiver的颜色
function changeReceiverColor(receiverNumber, color){
    var thisPkt = "#r_pkt" + receiverNumber;
    $(thisPkt).css("background-color", color);
}

//隐藏pkt并且把pkt位置初始化到顶部
function hidePkt(pktNumber){
    var thisPkt = "#pkt" + pktNumber;
    console.log(pktNumber);
    packets[pktNumber].direction = 0;
    $(thisPkt).css('top',80).hide();
    $("#pkt" + pktNumber).html(pktNumber);
}

//移动指定的pkt
function movePkt(pktNumber){
        var thisPkt = "#pkt" + pktNumber;
        var top = parseInt($(thisPkt).css("top"));
        $(thisPkt).css("top", top + speed * packets[pktNumber].direction);
}

//移动 send window
function moveSendWindow(){
    var left = parseInt($("#send-window").css('left'));
    $("#send-window").css('left', left + 30);
}

//移动 receiver window
function moveReceiveWindow(){
    var left = parseInt($("#receive-window").css('left'));
    $("#receive-window").css('left', left + 30);
}