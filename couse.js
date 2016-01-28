/**
 * Created by hxl on 2015/12/26.
 */
var WINDOW_WIDTH = document.documentElement.clientWidth;
var WINDOW_HEIGHT = document.documentElement.clientHeight;
var RADIUS=8;//С����뾶
var MARGIN_TOP = 60;//������Ŀ��
var MARGIN_LEFT = 30;//����߿��
//const endTime=new Date(2015,11,29,15,40,20);//����ʱ�䣬��Ҫ����ʱ����һ�졣ע���·ݴ�0��ʼ
//var endTime=new Date();
//endTime.setTime(endTime.getTime()+3600*1000);//�޸ĺ���ÿ��Ϊ��ǰʱ���1Сʱ��ĵ���ʱ

var curShowTimeSeconds=0;
var balls = [];
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"]

window.onload=function(){
    var canvas=document.getElementById("canvas");
    var context=canvas.getContext('2d');
    WINDOW_WIDTH=document.body.clientWidth;
    WINDOW_HEIGHT=document.body.clientHeight;

    canvas.width=WINDOW_WIDTH;
    canvas.height=WINDOW_HEIGHT;
    MARGIN_LEFT=Math.round(WINDOW_WIDTH/10);//�趨ʱ��ռ��Ļ��4/5�����߸����հף���һ���հ�Ϊ1/10
    RADIUS=Math.round(WINDOW_WIDTH*4/5/108)-1;//һ������Ϊ15+93����1����Ϊ�����radius+1����������ɫС����
    MARGIN_TOP=Math.round(WINDOW_HEIGHT/5);

    curShowTimeSeconds=getCurrentShowTimeSeconds();
    //��ʱ�䶯����,ÿ��50����ȥִ��һ��render�����������һ�����뵱ǰ���벻һ���������һ�븳����ǰ��
    setInterval(function(){
        render(context);
        update();
    },50);//1000Ҳ�У���������Ҫ����С����ö̵㣬������С����ʱ��
}
function getCurrentShowTimeSeconds(){
    //ע�͵�Ϊ����ʱ���룬����Ҫ�ſ�10.11�д���
   /* var curTime=new Date();
    var ret=endTime.getTime()-curTime.getTime();
    ret=Math.round(ret/1000);
    return ret>=0 ? ret:0;//�������ʱ�Ѿ���0�ˣ��򷵻�0*/
    //ʱ��
    var curTime=new Date();
    var ret=curTime.getHours()*3600+curTime.getMinutes()*60+curTime.getSeconds();
    return ret;
}
//ʱ�估С��
function update(){
    var nextShowTimeSeconds=getCurrentShowTimeSeconds();
    var nextHours=parseInt(nextShowTimeSeconds/3600);
    var nextMinutes=parseInt((nextShowTimeSeconds-nextHours*3600)/60);
    var nextSeconds=nextShowTimeSeconds % 60;

    var curHours=parseInt(curShowTimeSeconds/3600);
    var curMinutes=parseInt((curShowTimeSeconds-curHours*3600)/60);
    var curSeconds=curShowTimeSeconds % 60;
    if(nextSeconds != curSeconds){
        if(parseInt(curHours/10) !=parseInt(nextHours/10)){//ʱ��ʮλ��
            addBalls(MARGIN_LEFT+0,MARGIN_TOP,parseInt(curHours/10));
        }
        if(parseInt(curHours%10) !=parseInt(nextHours%10)){//ʱ�ĸ�λ��
            addBalls(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(curHours/10));
        }
        if( parseInt(curMinutes/10) != parseInt(nextMinutes/10) ){//�ֵ�ʮλ��
            addBalls( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes/10) );
        }
        if( parseInt(curMinutes%10) != parseInt(nextMinutes%10) ){
            addBalls( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes%10) );
        }

        if( parseInt(curSeconds/10) != parseInt(nextSeconds/10) ){
            addBalls( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(curSeconds/10) );
        }
        if( parseInt(curSeconds%10) != parseInt(nextSeconds%10) ){
            addBalls( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(nextSeconds%10) );
        }
        curShowTimeSeconds=nextShowTimeSeconds;
    }
    updateBalls();
}
//�������Ѿ����ڵ�С����ı��˶�״̬
function updateBalls(){
    for(var i=0;i<balls.length;i++){
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;//��ֱ�����ٶ�
        balls[i].vy += balls[i].g;//���ٶ�
        if(balls[i].y >= WINDOW_HEIGHT-RADIUS){//���С��Y������Ļ�ߣ�С��뾶�����Y��ֵ���������˶�
            balls[i].y = WINDOW_HEIGHT-RADIUS;
            balls[i].vy = -balls[i].vy*0.75;//0.75Ϊ�Լ���Ŀ�����������ֵ��ʹС��������
        }
    }
    var cnt=0;
    for(var i=0;i<balls.length;i++){
        if(balls[i].x+RADIUS>0 && balls[i].x-RADIUS < WINDOW_WIDTH)//�ж�С���Ƿ�����Ļ��
            balls[cnt++] = balls[i];
    }
    while(balls.length > Math.min(300,cnt)){//��ѧ�е�minֻ��Ϊ�˼����ڴ棬�����̫��Ҳֻ��ʾ300��
        balls.pop();//������Ļ�ڵ�С����������������Ƴ��������ڴ�����
    }
}
//����С������Ʒ���
function addBalls(x,y,num){
    for(var i=0;i<digit[num].length;i++){
        for(var j=0;j<digit[num][i].length;j++){
            if(digit[num][i][j]==1){
                var aBall={
                    x:x+j*2*(RADIUS+1)+(RADIUS+1),
                    y:y+i*2*(RADIUS+1)+(RADIUS+1),
                    g:1.5+Math.random(),//���ٶ�
                    vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4,//ˮƽ������ٶȣ�-1,1��*4
                    vy:-5,
                    color: colors[ Math.floor( Math.random()*colors.length ) ]
                }
                balls.push(aBall);
            }
        }
    }
}
function render(cxt){
    cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
    var hours=parseInt(curShowTimeSeconds/3600);
    var minutes=parseInt((curShowTimeSeconds-hours*3600)/60);
    var seconds=curShowTimeSeconds % 60;
    renderDigit(MARGIN_LEFT,MARGIN_TOP,parseInt(hours/10),cxt);
    //�뾶+1����СԲ����һ��С�����ڣ��������߸���1���ؾ��룬ʹСԲ���뷽�鲻����ȫ����
    //һ�����ֺ��������7��С�򣬼�14���뾶����14*��RADIUS+1����д15��Ϊ�����������е����
    renderDigit(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(hours%10),cxt);//ʱ�Ӹ�λ
    renderDigit(MARGIN_LEFT+30*(RADIUS+1),MARGIN_TOP,10,cxt);//10Ϊ����digit�е�ð��
    renderDigit(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(minutes/10),cxt);//��Ϊһ��ð�ź��������2����ð�ſ��Ϊ4����1λ�������һ�����
    renderDigit( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(minutes%10) , cxt);
    renderDigit( MARGIN_LEFT + 69*(RADIUS+1) , MARGIN_TOP , 10 , cxt);
    renderDigit( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(seconds/10) , cxt);
    renderDigit( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(seconds%10) , cxt);
    //���Ʋ�ɫС��
    for( var i = 0 ; i < balls.length ; i ++ ){
        cxt.fillStyle=balls[i].color;
        cxt.beginPath();
        cxt.arc( balls[i].x , balls[i].y , RADIUS , 0 , 2*Math.PI , true );
        cxt.closePath();
        cxt.fill();
    }
}
//���Ƶ���ʱ�ϵ�����
function renderDigit(x,y,num,cxt) {
    cxt.fillStyle = "rgb(0,102,153)";
    //digitΪ��ά���飬��������0����9���ּ�������Ϊ10�Ĵ����ð��
    for (var i = 0; i < digit[num].length; i++){//��
        for (var j = 0; j < digit[num][i].length; j++){//��
            if (digit[num][i][j] == 1) {
                cxt.beginPath();
                //x��y���꣬�뾶����ʼ�Ƕȣ������Ƕ�
                cxt.arc(x + j * 2 * (RADIUS + 1) + (RADIUS + 1), y + i * 2 * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, 2 * Math.PI);
                cxt.closePath();
                cxt.fill();
            }
        }
    }
}