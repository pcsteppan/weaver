enum ThreadType{
  WARP,
  WEFT
}

class Color{
  hue: Number;
  saturation: Number;
  brightness: Number;
  constructor(hue: Number, saturation: Number, brightness: Number){
    this.hue = hue;
    this.saturation = saturation;
    this.brightness = brightness;
  }
}

class Loom{
  harnessCount: number;
  treadleCount: number;
  // vertical
  warpThreadCount: number;
  // horizontal
  weftThreadCount: number;
  harnesses: Harness[];
  treadles: Treadle[];
  treadling: Treadling;
  warpThreads: Thread[];
  weftThreads: Thread[];

  constructor(harnessCount: number, 
              treadleCount: number, 
              weftThreadCount: number, 
              warpThreadCount: number){
    this.harnessCount = harnessCount;
    this.treadleCount = treadleCount;
    this.warpThreadCount = warpThreadCount;
    this.weftThreadCount = weftThreadCount;
    
    this.warpThreads = [];
    this.weftThreads = [];
    this.harnesses = [];
    this.treadles = [];
    this.treadling = new Treadling();

    for(let i = 0; i < warpThreadCount; i++){
      this.warpThreads.push(new Thread(ThreadType.WARP, new Color(0,0,0), "|"));
    }
    for(let i = 0; i < weftThreadCount; i++){
      this.weftThreads.push(new Thread(ThreadType.WEFT, new Color(0,0,1), "—"));
    }
    for(let i = 0; i < harnessCount; i++){
      this.harnesses.push(new Harness());
    }
    for(let i = 0; i < treadleCount; i++){
      this.treadles.push(new Treadle());
      
    }
  }
  setupWarpThreads(colors: Color[]){}
  setUpWeftThreads(colors: Color[]){}
  beat(instructionID: number){
    let weftText = this.weftThreads[instructionID].text;
    let line = []
    for(let i = 0; i < this.warpThreadCount; i++){
      line.push(weftText);
    }
    this.treadling.instructions[instructionID].harnesses.forEach((harness)=>{
      harness.threads.forEach((thread)=>{
        line[thread.warpThreadId] = thread.text;
      })
    })
    return line;
  }
  print(){
    let weave = [];
    for(let i = 0; i < this.treadling.instructions.length; i++){
      weave.push(this.beat(i).join(' '));
    }
    console.log(weave.join('\n'))
  }
}

class Treadling{
  instructions: Treadle[];

  constructor(){
    console.log("Treadling created.");
    this.instructions = [];
  }
}

class Treadle{
  static treadleCount: number = 0;

  id: number;
  harnesses: Array<Harness>;

  attachHarness(harness: Harness){
    this.harnesses.push(harness);
  }
  constructor(){
    this.id = Treadle.treadleCount++;
    this.harnesses = [];
  }
}

class Harness{
  static harnessCount: number = 0;
  
  id: number;
  threads: Array<Thread>;

  attachThread(thread: Thread){
    this.threads.push(thread);
  }
  constructor(){
    this.id = Harness.harnessCount++;
    this.threads = [];
  }
}

class Thread{
  static warpThreadCount: number = 0;

  type: ThreadType;
  color: Color;
  text: String;
  // acts as position for warp threads
  warpThreadId: number;

  constructor(type: ThreadType, color: Color, text: String){
    this.type = type;
    this.color = color;
    this.text = text;
    if(this.type===ThreadType.WARP){
      this.warpThreadId = Thread.warpThreadCount++;
    }else{
      this.warpThreadId = -1;
    }
  }
}

const loom = new Loom(4,4,16,16);
loom.warpThreads.forEach((warpThread, i) => {
  loom.harnesses[i % 4].attachThread(warpThread);
})
loom.treadles[0].attachHarness(loom.harnesses[0]);
loom.treadles[0].attachHarness(loom.harnesses[1]);
loom.treadles[1].attachHarness(loom.harnesses[1]);
loom.treadles[1].attachHarness(loom.harnesses[2]);
loom.treadles[2].attachHarness(loom.harnesses[2]);
loom.treadles[2].attachHarness(loom.harnesses[3]);
loom.treadles[3].attachHarness(loom.harnesses[3]);
loom.treadles[3].attachHarness(loom.harnesses[0]);
loom.treadling.instructions = [
  loom.treadles[0],
  loom.treadles[1],
  loom.treadles[2],
  loom.treadles[3],
  loom.treadles[0],
  loom.treadles[1],
  loom.treadles[2],
  loom.treadles[3],
  loom.treadles[0],
  loom.treadles[1],
  loom.treadles[2],
  loom.treadles[3],
  loom.treadles[0],
  loom.treadles[1],
  loom.treadles[2],
  loom.treadles[3]
]

loom.print()