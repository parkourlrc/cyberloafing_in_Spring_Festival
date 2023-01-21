import { _decorator, Component, Node , sys, Label, director, CCInteger } from 'cc';
import { GameManager } from "./GameManager";
const { ccclass, property } = _decorator;

enum GameState {
    START,
    RUNNING,
    END
}

@ccclass('GameManagergameover')
export class GameManagergameover extends Component {

    private static instance: GameManagergameover;
    private gameState: GameState;//游戏状态
    private highestScore: number=0;//最高分数

    @property({type: Node})
    public gameovermenu: Node | null = null;

    @property({type: Label})
    public stepsLabel: Label | null = null;

    @property({type: Label})
    public highestLabel: Label | null = null;

        //获取GameManager类的实例，并通过他访问游戏状态、分数等信息
        public static getInstance(): GameManagergameover {
            if (!this.instance) {
                this.instance = new GameManagergameover();
            }
            return this.instance;
        }
    //
        private constructor() {
            super();
            this.gameState = GameState.START;
        }

    start() {
        this.curState = GameState.START; 
    }

    set curState (value: GameState) {
        switch(value) {
            case GameState.START:
                this.init();
                if (this.stepsLabel) {
                    let score = sys.localStorage.getItem("score");//从全局中获得score值
                    this.stepsLabel.string = '0';   // 将步数重置为0
                    this.stepsLabel.string = '本局分数：' + (score);
                    let highestScore=sys.localStorage.getItem("highestScore");
                    if (Number(score) > Number(highestScore)){
                        this.highestScore = Number(score)
                        sys.localStorage.setItem("highestScore" ,this.highestScore.toString());
                        this.highestLabel.string = '历史最高分数：' + (score);
                    }
                    {
                        this.highestLabel.string = '历史最高分数：' + (highestScore);
                    }
                    
                break;
                }
            case GameState.RUNNING:
                if (this.gameovermenu) {
                    this.gameovermenu.active = false;
                }
                
                director.loadScene('Main');
            }
    }

    init(){
        //激活主界面
        if (this.gameovermenu) {
            this.gameovermenu.active = true;
        }

    }

    update(deltaTime: number) {
        
    }
    onStartButtonClicked() {
        this.curState = GameState.RUNNING;
    }
}



