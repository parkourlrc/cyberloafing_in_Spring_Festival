import { _decorator, Component, Node, tween, v2, v3, Sprite, CCInteger, director} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('bg_sprite')
export class bg_sprite extends Component {
    
    @property( Sprite)
    bg1: Sprite = null;
    @property( Sprite)
    bg2: Sprite = null;
    @property(CCInteger)
    speed: number = 100;
    private _bg1Height: number;
    private _bg2Height: number;
    
    


    onLoad() {
        this._bg1Height = this.bg1.node.getComponent(Sprite).spriteFrame.height;
        this._bg2Height = this.bg2.node.getComponent(Sprite).spriteFrame.height;
    }

    update(dt: number) {

        tween(this.bg1.node)
            .by(5, { position: v3(0,-960, 0) })
            .call(() => {
                console.log('animation finished');
            })
            .start();
            if (this.bg1.node.position == v3(0,-960)){
                //tween(this.bg1.node).stop();
                this.bg1.node.position = v3(0,0)
            }

        
        tween(this.bg2.node)
            .by(5, { position: v3(0,-960, 0) })
            .call(() => {
                console.log('animation finished');
            })
            .start();
            if (this.bg2.node.position == v3(0,0)){
                //tween(this.bg2.node).stop();
                this.bg2.node.setPosition(0,960);
            }
    }
}
