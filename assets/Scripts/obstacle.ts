import { _decorator, Component, Node, Label , director , macro, color} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('obstacle')
export class obstacle extends Component {
    @property({type: Label})
    public obstacleLabel: Label | null = null;

    start() {
        let scheduler = director.getScheduler();
        let i = 0;
        scheduler.schedule(() => {
            i += 1;
            if(Math.round(i/3-2/3) === (i/3-2/3)){
                this.obstacleLabel.string = '没有钱' ; 
                this.obstacleLabel.color = color(34,50,224);
            }
            if(Math.round(i/3-1/3) === (i/3-1/3)){
                this.obstacleLabel.string = '成绩差' ; 
                this.obstacleLabel.color = color(57,224,34);
            }
            if(Math.round(i/3) === (i/3)){
                this.obstacleLabel.string = '没对象' ; 
                this.obstacleLabel.color = color(34,224,216);
            }

        }, this, 0.2, macro.REPEAT_FOREVER, 0, false);
        
    }

    update(deltaTime: number) {
        
    }
}


