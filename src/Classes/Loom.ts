enum ThreadType {
  Warp = "WARP",
  Weft = "WEFT"
}

// Interfaces

type LoomDimensions={
  warp: number;
  weft: number;
  harnesses: number;
  treadles: number; 
}

interface ThreadRepresentationInterface {
  [cssName:string] : string;
}

interface ThreadInterface {
  type: ThreadType;
  representation: ThreadRepresentationInterface;
}

interface HarnessInterface {
  threads: Set<ThreadInterface>;
}

interface TreadleInterface {
  harnesses: Set<HarnessInterface>
}

interface LoomInterface {
  dimensions: LoomDimensions;
  warpThreads: ThreadInterface[];
  weftThreads: ThreadInterface[];
  harnesses: HarnessInterface[];
  treadles: TreadleInterface[];
  treadlingInstructions: (TreadleInterface|null)[];
  // tieup: Map<TreadleInterface, HarnessInterface[]>;
}

// Implementation

type ThreadRepresentation={
  [cssName:string]: string
}

class Thread implements ThreadInterface {
  type: ThreadType;
  representation: ThreadRepresentation;

  constructor(type: ThreadType, representation={default: ""}) {
    this.type = type;
    this.representation = representation;

    // default thread representation
    if("default" in representation){
      if(this.type === 'WARP'){
        // default warp thread color is black
        this.representation = {backgroundColor: "#bb8"}
      } else {
        // default weft thread color is white
        this.representation = {backgroundColor: "#229"}
      }
    }
  }
}

class Harness implements HarnessInterface{
  threads: Set<Thread>;
  constructor(){
    this.threads = new Set<Thread>();
  }

  attachThread(thread: Thread) {
    this.threads.add(thread);
  }

  unattachThread(thread: Thread) {
    this.threads.delete(thread);
  }
}

class Treadle implements TreadleInterface {
  harnesses: Set<Harness>;
  id: number;

  constructor(index: number) {
    this.id = index;
    this.harnesses = new Set<Harness>();
  }

  attachHarness(harness: Harness) {
    this.harnesses.add(harness);
  }

  unattachHarness(harness: Harness) {
    this.harnesses.delete(harness);
  }

  getAttachedHarnesses() {
    return Array.from(this.harnesses);
  }
}

class Loom implements LoomInterface {
  dimensions: LoomDimensions;
  warpThreads: Thread[];
  weftThreads: Thread[];
  harnesses: Harness[];
  treadles: Treadle[];
  treadlingInstructions: (Treadle|null)[];
  
  constructor(dimensions: LoomDimensions){
    this.dimensions = dimensions;
    this.warpThreads = new Array(dimensions.warp).fill(null).map(() => new Thread(ThreadType.Warp));
    this.weftThreads = new Array(dimensions.weft).fill(null).map(() => new Thread(ThreadType.Weft));
    this.harnesses = new Array(dimensions.harnesses).fill(null).map(() => new Harness());
    this.treadles = new Array(dimensions.treadles).fill(null).map((_, i) => new Treadle(i));
    this.treadlingInstructions = new Array(dimensions.weft).fill(null);
  }

  getTopThreadAt(x: number, y: number) : Thread{
    const treadle = this.treadlingInstructions[y];
    if (treadle instanceof Treadle){
      const threadRef : Thread = this.warpThreads[x];
      const warpOnTop = treadle.getAttachedHarnesses().some((harness)=>harness.threads.has(threadRef));
      return warpOnTop ? threadRef : this.weftThreads[y];
    }
    return this.weftThreads[y];
  }

  setTreadlingInstruction(row: number, col: number){
    if(this.treadlingInstructions[row]===this.treadles[col]){
      this.treadlingInstructions[row] = null;
    } else {
      this.treadlingInstructions[row] = this.treadles[col];
    }
  }
}

export default Loom;