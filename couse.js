/**
 * Created by hxl on 2015/12/26.
 */
var WINDOW_WIDTH = document.documentElement.clientWidth;
var WINDOW_HEIGHT = document.documentElement.clientHeight;
var RADIUS=8;//小蓝球半径
var MARGIN_TOP = 60;//距上面的宽度
var MARGIN_LEFT = 30;//距左边宽度
//const endTime=new Date(2015,11,29,15,40,20);//结束时间，即要倒计时到这一天。注：月份从0开始
//var endTime=new Date();
//endTime.setTime(endTime.getTime()+3600*1000);//修改后让每次为当前时间的1小时后的倒计时

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
    MARGIN_LEFT=Math.round(WINDOW_WIDTH/10);//设定时器占屏幕的4/5，两边各留空白，则一个空白为1/10
    RADIUS=Math.round(WINDOW_WIDTH*4/5/108)-1;//一个数字为15+93，减1是因为算的是radius+1，看绘制蓝色小球那
    MARGIN_TOP=Math.round(WINDOW_HEIGHT/5);

    curShowTimeSeconds=getCurrentShowTimeSeconds();
    //让时间动起来,每隔50毫秒去执行一下render函数，如果下一个秒与当前的秒不一样，则把下一秒赋给当前秒
    setInterval(function(){
        render(context);
        update();
    },50);//1000也行，不过它还要绘制小球，最好短点，给绘制小球多点时间
}
function getCurrentShowTimeSeconds(){
    //注释的为倒计时代码，还需要放开10.11行代码
   /* var curTime=new Date();
    var ret=endTime.getTime()-curTime.getTime();
    ret=Math.round(ret/1000);
    return ret>=0 ? ret:0;//如果倒计时已经到0了，则返回0*/
    //时钟
    var curTime=new Date();
    var ret=curTime.getHours()*3600+curTime.getMinutes()*60+curTime.getSeconds();
    return ret;
}
//时间及小球
function update(){
    var nextShowTimeSeconds=getCurrentShowTimeSeconds();
    var nextHours=parseInt(nextShowTimeSeconds/3600);
    var nextMinutes=parseInt((nextShowTimeSeconds-nextHours*3600)/60);
    var nextSeconds=nextShowTimeSeconds % 60;

    var curHours=parseInt(curShowTimeSeconds/3600);
    var curMinutes=parseInt((curShowTimeSeconds-curHours*3600)/60);
    var curSeconds=curShowTimeSeconds % 60;
    if(nextSeconds != curSeconds){
        if(parseInt(curHours/10) !=parseInt(nextHours/10)){//时的十位数
            addBalls(MARGIN_LEFT+0,MARGIN_TOP,parseInt(curHours/10));
        }
        if(parseInt(curHours%10) !=parseInt(nextHours%10)){//时的个位数
            addBalls(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(curHours/10));
        }
        if( parseInt(curMinutes/10) != parseInt(nextMinutes/10) ){//分的十位数
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
//对所有已经存在的小彩球改变运动状态
function updateBalls(){
    for(var i=0;i<balls.length;i++){
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;//竖直方向速度
        balls[i].vy += balls[i].g;//加速度
        if(balls[i].y >= WINDOW_HEIGHT-RADIUS){//如果小球Y大于屏幕高－小球半径，则给Y赋值让其向上运动
            balls[i].y = WINDOW_HEIGHT-RADIUS;
            balls[i].vy = -balls[i].vy*0.75;//0.75为自己设的空气阻力，负值会使小球向上抛
        }
    }
    var cnt=0;
    for(var i=0;i<balls.length;i++){
        if(balls[i].x+RADIUS>0 && balls[i].x-RADIUS < WINDOW_WIDTH)//判断小球是否还在屏幕中
            balls[cnt++] = balls[i];
    }
    while(balls.length > Math.min(300,cnt)){//数学中的min只是为了减少内存，如果球太多也只显示300个
        balls.pop();//不在屏幕内的小球则把它从数组中移除，减少内存消耗
    }
}
//单个小彩球绘制方法
function addBalls(x,y,num){
    for(var i=0;i<digit[num].length;i++){
        for(var j=0;j<digit[num][i].length;j++){
            if(digit[num][i][j]==1){
                var aBall={
                    x:x+j*2*(RADIUS+1)+(RADIUS+1),
                    y:y+i*2*(RADIUS+1)+(RADIUS+1),
                    g:1.5+Math.random(),//加速度
                    vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4,//水平方向的速度（-1,1）*4
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
    //半径+1，即小圆球在一个小方块内，左右两边各留1像素距离，使小圆球与方块不是完全相切
    //一个数字横向最多有7个小球，即14个半径，即14*（RADIUS+1），写15是为了再它们再有点距离
    renderDigit(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(hours%10),cxt);//时钟个位
    renderDigit(MARGIN_LEFT+30*(RADIUS+1),MARGIN_TOP,10,cxt);//10为数组digit中的冒号
    renderDigit(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(minutes/10),cxt);//因为一个冒号横着最多有2个，冒号宽度为4，多1位是让其多一点距离
    renderDigit( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(minutes%10) , cxt);
    renderDigit( MARGIN_LEFT + 69*(RADIUS+1) , MARGIN_TOP , 10 , cxt);
    renderDigit( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(seconds/10) , cxt);
    renderDigit( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(seconds%10) , cxt);
    //绘制彩色小球
    for( var i = 0 ; i < balls.length ; i ++ ){
        cxt.fillStyle=balls[i].color;
        cxt.beginPath();
        cxt.arc( balls[i].x , balls[i].y , RADIUS , 0 , 2*Math.PI , true );
        cxt.closePath();
        cxt.fill();
    }
}
//绘制倒计时上的数字
function renderDigit(x,y,num,cxt) {
    cxt.fillStyle = "rgb(0,102,153)";
    //digit为二维数组，里面存放着0——9数字及索引号为10的存放着冒号
    for (var i = 0; i < digit[num].length; i++){//行
        for (var j = 0; j < digit[num][i].length; j++){//列
            if (digit[num][i][j] == 1) {
                cxt.beginPath();
                //x、y坐标，半径，开始角度，结束角度
                cxt.arc(x + j * 2 * (RADIUS + 1) + (RADIUS + 1), y + i * 2 * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, 2 * Math.PI);
                cxt.closePath();
                cxt.fill();
            }
        }
    }
}