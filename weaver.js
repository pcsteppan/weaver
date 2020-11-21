var ThreadType;
(function (ThreadType) {
    ThreadType[ThreadType["WARP"] = 0] = "WARP";
    ThreadType[ThreadType["WEFT"] = 1] = "WEFT";
})(ThreadType || (ThreadType = {}));
var Color = /** @class */ (function () {
    function Color(hue, saturation, brightness) {
        this.hue = hue;
        this.saturation = saturation;
        this.brightness = brightness;
    }
    return Color;
}());
var Loom = /** @class */ (function () {
    function Loom(harnessCount, treadleCount, weftThreadCount, warpThreadCount) {
        this.harnessCount = harnessCount;
        this.treadleCount = treadleCount;
        this.warpThreadCount = warpThreadCount;
        this.weftThreadCount = weftThreadCount;
        this.warpThreads = [];
        this.weftThreads = [];
        this.harnesses = [];
        this.treadles = [];
        this.treadling = new Treadling();
        for (var i = 0; i < warpThreadCount; i++) {
            this.warpThreads.push(new Thread(ThreadType.WARP, new Color(0, 0, 0), "|"));
        }
        for (var i = 0; i < weftThreadCount; i++) {
            this.weftThreads.push(new Thread(ThreadType.WEFT, new Color(0, 0, 1), "—"));
        }
        for (var i = 0; i < harnessCount; i++) {
            this.harnesses.push(new Harness());
        }
        for (var i = 0; i < treadleCount; i++) {
            this.treadles.push(new Treadle());
        }
    }
    Loom.prototype.setupWarpThreads = function (colors) { };
    Loom.prototype.setUpWeftThreads = function (colors) { };
    Loom.prototype.beat = function (instructionID) {
        var weftText = this.weftThreads[instructionID].text;
        var line = [];
        for (var i = 0; i < this.warpThreadCount; i++) {
            line.push(weftText);
        }
        this.treadling.instructions[instructionID].harnesses.forEach(function (harness) {
            harness.threads.forEach(function (thread) {
                line[thread.warpThreadId] = thread.text;
            });
        });
        return line;
    };
    Loom.prototype.print = function () {
        var weave = [];
        for (var i = 0; i < this.treadling.instructions.length; i++) {
            weave.push(this.beat(i).join(' '));
        }
        console.log(weave.join('\n'));
    };
    return Loom;
}());
var Treadling = /** @class */ (function () {
    function Treadling() {
        console.log("Treadling created.");
        this.instructions = [];
    }
    return Treadling;
}());
var Treadle = /** @class */ (function () {
    function Treadle() {
        this.id = Treadle.treadleCount++;
        this.harnesses = [];
    }
    Treadle.prototype.attachHarness = function (harness) {
        this.harnesses.push(harness);
    };
    Treadle.treadleCount = 0;
    return Treadle;
}());
var Harness = /** @class */ (function () {
    function Harness() {
        this.id = Harness.harnessCount++;
        this.threads = [];
    }
    Harness.prototype.attachThread = function (thread) {
        this.threads.push(thread);
    };
    Harness.harnessCount = 0;
    return Harness;
}());
var Thread = /** @class */ (function () {
    function Thread(type, color, text) {
        this.type = type;
        this.color = color;
        this.text = text;
        if (this.type === ThreadType.WARP) {
            this.warpThreadId = Thread.warpThreadCount++;
        }
        else {
            this.warpThreadId = -1;
        }
    }
    Thread.warpThreadCount = 0;
    return Thread;
}());
var loom = new Loom(4, 4, 16, 16);
loom.warpThreads.forEach(function (warpThread, i) {
    loom.harnesses[i % 4].attachThread(warpThread);
});
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
];
loom.print();
