

/** 
import { _decorator, Component,Event, Node, tween,Sprite,CCInteger } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('playerController')
export class playerController extends Component {
    @property(Sprite)
    player: Sprite = null;
    @property(CCInteger)
    speed: number = 100;
    private _movingRight: boolean = false;
    private _movingLeft: boolean = false;

    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    start() {
        tween(this.player.node)
            .repeatForever(tween().to(1, {scaleY: 0.9}).to(1, {scaleY: 1}))
            .start();
    }

    update(dt: number) {
        if (this._movingRight) {
            this.player.node.x += this.speed * dt;
            this.player.node.rotation = -5;
        }
        if (this._movingLeft) {
            this.player.node.x -= this.speed * dt;
            this.player.node.rotation = 5;
        }
    }

    onTouchStart(event: Event.EventTouch) {
        let touchLoc = event.getLocation();
        if (touchLoc.x > winSize.width / 2) {
            this._movingRight = true;
        } else {this._movingLeft = true;
        }
    }

    onTouchMove(event: Event.EventTouch) {
        let touchLoc = event.getLocation();
        if (touchLoc.x > winSize.width / 2) {
            this._movingRight = true;
            this._movingLeft = false;
        } else {
            this._movingLeft = true;
            this._movingRight = false;
        }
    }

    onTouchEnd() {
        this._movingRight = false;
        this._movingLeft = false;
        this.player.node.rotation = 0;
    }
}
*/
import { _decorator, Component,input,Input,Camera,sys,Tween,v2, v3,EventTouch, Node, view,tween,Sprite,CCInteger, Vec3, Vec4 ,director,log} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('playerController')

export class playerController extends Component {

    private stepCount: number = 0;

    @property(Sprite)
    player: Sprite = null;
    @property(CCInteger)
    speed: number = 1000;
    @property(Camera)
    camera: Camera = null;
    private _movingRight: boolean = false;
    private _movingLeft: boolean = false;
    private x1: number = null;
    private y1: number = null;
    private z1: number = null;
    private turn: number =  null;
    
    start() {
            /** 
         * 这里是想做一个不断的缩放，以此来代替主角的跑动效果，但是会黑屏
        tween(this.player.node) 
            //.by(5, { position: v3(0,960, 0) })
            //.repeatForever(tween().to(1, {scaleY: 1.0}).to(1, {scaleY: 2.0}))
            //.to(1, { scale: v3(0.2,0.5) })
            .repeatForever(tween().to(1, { scale: v3(0.2,0.2) }).to(1, { scale: v3(0.2,0.2) }))
            .start();
        
        tween(this.player.node)
            .repeatForever(tween().by(5, { position: v3(0,960, 0) }))
            .start();
        tween(this.camera.node)
            .repeatForever(tween().by(5, { position: v3(0,960, 0) }))
            .start();*/
        //this.player.node.setScale(1, 2);

            

    }

    setInputActive(active: boolean) {
        if (active) {
            input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
            input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
            input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        } else {
            input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
            input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
            input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        }
    }
/** 
    onLoad() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }*/

    update(dt: number) {
        if (this._movingRight) {
            /** 
            this.x1 = this.player.node.position.x
            this.y1 = this.player.node.position.y
            this.z1 = this.player.node.position.z
            this.player.node.position = v3(this.x1+100,this.y1, this.z1);
            */
            tween(this.player.node)
                .by(0.2,{ position:v3(100, 0, 0)})
                //.to(0.2,{ position:v3(this.player.node.position.x+100, this.player.node.position.y, this.player.node.position.z)})
                .start()
            this.player.node.eulerAngles =  v3(0, 0, this.turn > 0 ? 0 : -20);
        }
        if (this._movingLeft) {
            /** 
            this.x1 = this.player.node.position.x
            this.y1 = this.player.node.position.y
            this.z1 = this.player.node.position.z
            this.player.node.setPosition (this.x1-100,this.y1, this.z1);
            */
            tween(this.player.node)
                .by(0.2,{ position:v3(-100, 0, 0)})
                //.to(0.2,{ position:v3(this.player.node.position.x-100, this.player.node.position.y, this.player.node.position.z)})
                .start()

            //var dir = v2(0,5);
            //var angle = dir.signAngle(v2(0,0));
            //var degree = angle / Math.PI * 180;
            this.player.node.eulerAngles =  v3(0, 0, this.turn > 0 ? 0 : 20);
            
        }
    }
    

    onTouchStart(event: EventTouch) {
        let touchLoc = event.getLocation();
        if (touchLoc.x > view.getVisibleSize().width / 2) {
            this._movingRight = true;
        } else {this._movingLeft = true;
        }
    }

    onTouchMove(event: EventTouch) {
        let touchLoc = event.getLocation();
        if (touchLoc.x > view.getVisibleSize().width / 2) {
            this._movingRight = true;
            this._movingLeft = false;
        } else {
            this._movingLeft = true;
            this._movingRight = false;
        }
    }

    onTouchEnd() {
        this._movingRight = false;
        this._movingLeft = false;
        this.player.node.eulerAngles =  v3(0, 0, this.turn > 0 ? 0 : 0);
    }
 
}