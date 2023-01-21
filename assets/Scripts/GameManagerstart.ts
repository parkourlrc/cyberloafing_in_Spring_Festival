import {  _decorator, Component, Sprite, Contact2DType, PhysicsSystem2D, Label, Collider2D, IPhysics2DContact, Input, Vec3, Prefab, instantiate, view, macro, tween, v2,Node, CCInteger,NodePool,Vec2, v3,director,log} from 'cc';
const { ccclass, property } = _decorator;

enum GameState {
    START,
    RUNNING,
    END
}

@ccclass('GameManagerstart')
export class GameManagerstart extends Component {
    
    private static instance: GameManagerstart;
    private gameState: GameState;//游戏状态
    private score: number;//分数
    private highestScore: number;//最高分数
    //开始菜单
    @property({type: Node})
    public startMenu: Node | null = null;
    
    //获取GameManager类的实例，并通过他访问游戏状态、分数等信息
    public static getInstance(): GameManagerstart {
        if (!this.instance) {
            this.instance = new GameManagerstart();
        }
        return this.instance;
    }
//
    private constructor() {
        super();
        this.gameState = GameState.START;
        this.score = 0;
        this.highestScore = 0;
    }

    public startGame() {
        this.gameState = GameState.RUNNING;
        this.score = 0;
    }

    public endGame() {
        this.gameState = GameState.END;
        if (this.score > this.highestScore) {
            this.highestScore = this.score;
        }
    }

    public restartGame() {
        this.startGame();
    }


    start () {
        this.curState = GameState.START;        
    }
    set curState (value: GameState) {
        switch(value) {
            case GameState.START:
                this.init();
                break;
            case GameState.RUNNING:
                if (this.startMenu) {
                    this.startMenu.active = false;
                }
                director.loadScene('Main');
            }
    }

    onStartButtonClicked() {
        this.curState = GameState.RUNNING;
    }

    init(){
        //激活主界面
        if (this.startMenu) {
            this.startMenu.active = true;
        }

    }


}
