/**
 * Created by Administrator on 2015/11/29.
 */
var speed = 3;    //��������

//pkt�����Ÿ���pkt
var packets = [];
var send_pkt = [];
var receive_pkt = [];

var N = 5;                //���ڴ�С
var base = 0;             //�����
var nextSeqNum = 0;       //��С��δʹ�����
var expectNum = 0;        //���������

var pause = false;

//��ʼ��
init();

setInterval(update,50);

var timer = 0;
var timerOn = false;

//�����߼���ÿ��һ��ʱ�����һ��
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
//����pkt
function sendPkt(){
    if(nextSeqNum < base + N && !pause){
        packets[nextSeqNum].direction = 1;
        $("#s_pkt" + nextSeqNum).css("background-color", "lightgreen");
        $("#pkt" + nextSeqNum).css('background-color','lightgreen').show();
        nextSeqNum++;
    }
    timerOn = true;
}


//���ʹ��������а�
function sendAllPkts(){
    for(var i=base;i<nextSeqNum ;i++) {
        packets[i].direction = 1;
        $("#s_pkt" + i).css("background-color", "lightgreen");
        $("#pkt" + i).css('background-color', 'lightgreen').show();
    }
}

//���÷�����֮ǰ������ɫ
function setSenderColor(num){
    for(var i=0; i<num; i++){
        changeSenderColor(i, "deepskyblue");
    }
}

//���÷����ߴ��ڵ�λ��,���Ҹı�ǰ�淢�Ϳ����ɫ
function setWindow(num){
    $("#send-window").css('left', 13 + num*30);
}

//��ʼ���߼�
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
//��ȡpkt��Y���λ��
function getPktY(pktNumber){
    var thisPkt = "#pkt" + pktNumber;
    return parseInt($(thisPkt).css("top"));
}

//����pkt����ɫ
function changePktColor(pktNumber,color){
    packets[pktNumber].color = color;
    var thisPkt = "#pkt" + pktNumber;
    $(thisPkt).css("background-color",color);
}

//����sender����ɫ
function changeSenderColor(senderNumber, color){
    var thisPkt = "#s_pkt" + senderNumber;
    $(thisPkt).css("background-color",color);
}

//����receiver����ɫ
function changeReceiverColor(receiverNumber, color){
    var thisPkt = "#r_pkt" + receiverNumber;
    $(thisPkt).css("background-color", color);
}

//����pkt���Ұ�pktλ�ó�ʼ��������
function hidePkt(pktNumber){
    var thisPkt = "#pkt" + pktNumber;
    console.log(pktNumber);
    packets[pktNumber].direction = 0;
    $(thisPkt).css('top',80).hide();
    $("#pkt" + pktNumber).html(pktNumber);
}

//�ƶ�ָ����pkt
function movePkt(pktNumber){
        var thisPkt = "#pkt" + pktNumber;
        var top = parseInt($(thisPkt).css("top"));
        $(thisPkt).css("top", top + speed * packets[pktNumber].direction);
}

//�ƶ� send window
function moveSendWindow(){
    var left = parseInt($("#send-window").css('left'));
    $("#send-window").css('left', left + 30);
}

//�ƶ� receiver window
function moveReceiveWindow(){
    var left = parseInt($("#receive-window").css('left'));
    $("#receive-window").css('left', left + 30);
}