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
  harnessCount: Number;
  treadleCount: Number;
  // vertical
  warpThreadCount: Number;
  // horizontal
  weftThreadCount: Number;
  harnesses: Harness[];
  treadles: Treadle[];
  treadling: Treadling;
  warpThreads: Thread[];
  weftThreads: Thread[];

  constructor(harnessCount: Number, 
              treadleCount: Number, 
              weftThreadCount: Number, 
              warpThreadCount: Number){
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
  print(){
    let weave = [];
    for(let i = 0; i < this.weftThreadCount; i++){
      weave.push([]);
      for(let j = 0; j < this.warpThreadCount; j++){
        weave[i].push(" ")
      }
    }
    // iterate through treadling instructions
    // iterate through harnesses attached to treadles
    // iterate through threads attached to harness
    // threads provide x position
    // treadling instruction index provides y positioni
    // use x and y position to index into weave
    // character is determined by whether
    //    warp/vertical thread was attached to harness
    //    otherwise use character of weft/horizontal thread
    for(let i = 0; i < this.weftThreadCount; i++){
      for(let j = 0; j < this.warpThreadCount; j++){
        // weave[][] = 
      }
    }
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
  harnesses: Harness[];
  attachHarness(harness: Harness){
    this.harnesses.push(harness);
  }
}

class Harness{
  threads: Thread[];
  attachThread(thread: Thread){
    this.threads.push(thread);
  }
}

class Thread{
  type: ThreadType;
  color: Color;
  text: String;

  constructor(type: ThreadType, color: Color, text: String){
    this.type = type;
    this.color = color;
    this.text = text;
  }
}

const loom = new Loom(4,4,16,16);
loom.warpThreads.forEach((warpThread, i) => {
  loom.harnesses[i % 3].attachThread(warpThread);
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
loom.print();

/*
| — | — | — | —
— | — | — | — |
| — | — | — | —
— | — | — | — |
| — | — | — | —
— | — | — | — |

| | — — | | — —
— | | — — | | —
— — | | — — | |
| — — | | — — |
| | — — | | — —
— | | — — | | —
— — | | — — | |
| — — | | — — |
*/