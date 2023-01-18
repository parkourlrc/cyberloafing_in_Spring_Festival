import { _decorator, Component,  input, Input, Vec3, Prefab, instantiate, view, macro, tween, v2,Node, CCInteger,NodePool,Vec2, v3,director,log } from 'cc';
import { playerController } from "./playerController";
const { ccclass, property } = _decorator;

// 赛道格子类型，坑（BT_NONE）或者实路（BT_STONE）
enum TrackType {
    BT_NONE,
    BT_STONE,
};

enum GameState {
    START,
    RUNNING,
    END
}

@ccclass('GameManager')
export class GameManager extends Component {

    private static instance: GameManager;
    private gameState: GameState;//游戏状态
    private score: number;//分数
    private highestScore: number;//最高分数

    @property({type: playerController})
    public playerCtrl: playerController | null = null;

    @property({type: Node})
    public startMenu: Node | null = null;
    // 赛道预制
    @property({type: Prefab})
    public trackPrfb: Prefab | null = null;
    // 赛道长度
    @property
    public roadLength = 50;
    private _road: TrackType[] = [];

    @property(Prefab)
    obstaclePrefab: Prefab = null;

    @property(CCInteger)
    obstacleCount: number = 100;

    @property(CCInteger)
    trackCount: number = 5;

    private trackPositions: Vec2[] = [];
    private obstaclePool: NodePool = new NodePool();
/** 
    @property(CCInteger)
    x1: number = null;

    @property(CCInteger)
    y1: number = null;

    @property(CCInteger)
    z1: number = null;

    @property(CCInteger)
    speed: number = 100;
*/
    //获取GameManager类的实例，并通过他访问游戏状态、分数等信息
    public static getInstance(): GameManager {
        if (!this.instance) {
            this.instance = new GameManager();
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

    public getScore(): number {
        let score = 0;
        let scheduler = director.getScheduler();
        scheduler.schedule(() => {
            score += 1;
            console.log("Score: " + score);
        }, this, 0.2, macro.REPEAT_FOREVER, 0, false);
        return this.score;
    }

    public getHighestScore(): number {
        return this.highestScore;
    }

    public addScore(score: number) {
        this.score += score;
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
                // 设置 active 为 true 时会直接开始监听鼠标事件，此时鼠标抬起事件还未派发
                // 会出现的现象就是，游戏开始的瞬间人物已经开始移动
                // 因此，这里需要做延迟处理
                setTimeout(() => {
                    if (this.playerCtrl) {
                        this.playerCtrl.setInputActive(true);
                        tween(this.node)
                            .repeatForever(tween().by(5, { position: v3(0,-960, 0) }))
                            .start();
                    }
                }, 0.1);
                break;
            case GameState.END:
                break;
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
        this.generateRoad();

        // Initialize trackPositions array
        for (let i = 0; i < this.trackCount; i++) {
            this.trackPositions.push(v2(-200 + i * 100, 0));
        }
        
        // Spawn obstacles
        for (let i = 0; i < this.obstacleCount; i++) {
            let obstacle = instantiate(this.obstaclePrefab);
            this.obstaclePool.put(obstacle);
        }    

        for(let i = 0; i < this.obstaclePool.size(); i++) {
            let obstacle = this.obstaclePool.get()
            //this.obstaclePool.put(obstacle);
            //let j = Math.random() * this.trackCount;//随机生成[0,5)
            let randomTrack = Math.floor(Math.random() * this.trackCount);//随机生成[0,5)
            this.node.addChild(obstacle);
            obstacle.setPosition(this.trackPositions[randomTrack].x, (960/6)*i,20);
            /**
            let j = []
            j.push(Math.random() * this.trackCount);//随机生成[0,5)
            if(j[i] = j[i-1]){
                let randomTrack = Math.floor(5-j[i]);//随机生成[0,5)
                this.node.addChild(obstacle);
                obstacle.setPosition(this.trackPositions[randomTrack].x, (960/6)*i,20);
            }else {
                let randomTrack = Math.floor(j[i]);//随机生成[0,5)
                this.node.addChild(obstacle);
                obstacle.setPosition(this.trackPositions[randomTrack].x, (960/6)*i,20);
            }*/
        if(this.playerCtrl){
            // 禁止接收用户操作人物移动指令
            this.playerCtrl.setInputActive(false);
            // 重置人物位置
            this.playerCtrl.node.setPosition(v3(-320,-480,0));
        }
        }
    }

    generateRoad() {
        // 防止游戏重新开始时，赛道还是旧的赛道
        // 因此，需要移除旧赛道，清除旧赛道数据
        this.node.removeAllChildren();
        this._road = [];
        // 确保游戏运行时，人物一定站在实路上,即第一个是实路
        this._road.push(TrackType.BT_STONE);

        // 确定好每一格赛道类型
        for (let i = 1; i < this.roadLength; i++) {
            // 如果上一格赛道是坑，那么这一格一定不能为坑
            this._road.push(TrackType.BT_STONE);
        }

        // 根据赛道类型生成赛道
        for (let j = 0; j < this._road.length; j++) {
            let track = this.spawnBlockByType(this._road[j]);
            // 判断是否生成了道路，因为 spawnBlockByType 有可能返回坑（值为 null）
            this.node.addChild(track);
            track.setPosition(0, j*960, 0);
        }
    }

    spawnBlockByType(type: TrackType) {
        let track = instantiate(this.trackPrfb);
        return track;
    }

    update ( dt: number) {
/**
        for (let i = 0; i < this.obstaclePool.size(); i++) {
            let obstacle = this.obstaclePool.get()
            this.x1 = obstacle.position.x
            this.y1 = obstacle.position.y
            this.z1 = obstacle.position.z
            obstacle.position=v3(this.x1-this.speed * dt,this.y1,this.z1)
            if (obstacle.position.x < -view.getVisibleSize().width / 2) {
                this.obstaclePool.put(obstacle);
                let randomTrack = Math.floor(Math.random() * this.trackCount);//随机生成[0,5)
                let randomX = -view.getVisibleSize().width / 2 + Math.random() * view.getVisibleSize().width
                obstacle.setPosition(randomX, this.trackPositions[randomTrack].y);
            }
        }
*/

    }
    //碰撞检查
    onCollisionEnter(other, self) {
        
        if (other.node.name === 'player'&& self.node.name ==='obstacle') {
            this.gameOver();
        }
    }
        
    gameOver() {
        // Show game over message
        log('Game Over!');
        // Show score
        log(`Your Score: ${this.score}`);
        // Restart game
        director.loadScene('Main');
    }   
}


