import { Move, Maximize2, RotateCcw } from "lucide-react";

// panel component for configuring X/Y coordinates and scaling properties
export default function LayoutControls({
  xOffset,
  setXOffset,
  yOffset,
  setYOffset,
  scale = 1,
  setScale,
}) {
  // modify X or Y coordinate offsets within limits
  const adjustOffset = (type, amount) => {
    const setter = type === "x" ? setXOffset : setYOffset;

    setter((prev) =>
      Math.max(-200, Math.min(800, (Number(prev) || 0) + amount)),
    );
  };

  // modify layout scaling factor between min and max bounds
  const adjustScale = (amount) => {
    if (!setScale) return;
    setScale((prev) => {
      const newVal = (Number(prev) || 1) + amount;

      return Math.max(0.5, Math.min(2.0, Number(newVal.toFixed(2))));
    });
  };

  // reset layout offsets and scale to default values
  const handleReset = () => {
    setXOffset(0);
    setYOffset(0);
    if (setScale) setScale(1);
  };

  return (
    <div className="bg-[#0c1324]/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-5 font-inter">
      <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
        <div className="flex items-center gap-2">
          <Move className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-outfit">
            Layout & Dimensions
          </h3>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300 font-bold transition duration-150 uppercase tracking-wider"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">↕ Vertical (Y):</span>
            <span className="font-mono text-emerald-400 font-bold">
              {yOffset}px
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => adjustOffset("y", -10)}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 rounded-lg text-[10px] font-bold transition duration-150"
            >
              -10
            </button>
            <button
              type="button"
              onClick={() => adjustOffset("y", -2)}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 rounded-lg text-[10px] font-bold transition duration-150"
            >
              -2
            </button>
            <button
              type="button"
              onClick={() => adjustOffset("y", 2)}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 rounded-lg text-[10px] font-bold transition duration-150"
            >
              +2
            </button>
            <button
              type="button"
              onClick={() => adjustOffset("y", 10)}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 rounded-lg text-[10px] font-bold transition duration-150"
            >
              +10
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">
              ↔ Horizontal (X):
            </span>
            <span className="font-mono text-emerald-400 font-bold">
              {xOffset}px
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => adjustOffset("x", -10)}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 rounded-lg text-[10px] font-bold transition duration-150"
            >
              -10
            </button>
            <button
              type="button"
              onClick={() => adjustOffset("x", -2)}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 rounded-lg text-[10px] font-bold transition duration-150"
            >
              -2
            </button>
            <button
              type="button"
              onClick={() => adjustOffset("x", 2)}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 rounded-lg text-[10px] font-bold transition duration-150"
            >
              +2
            </button>
            <button
              type="button"
              onClick={() => adjustOffset("x", 10)}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 rounded-lg text-[10px] font-bold transition duration-150"
            >
              +10
            </button>
          </div>
        </div>

        {setScale && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                Size (Scale):
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                {Math.round(scale * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => adjustScale(-0.1)}
                className="flex-grow bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 rounded-lg text-[10px] font-bold transition duration-150"
              >
                -10%
              </button>
              <button
                type="button"
                onClick={() => adjustScale(-0.02)}
                className="flex-grow bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 rounded-lg text-[10px] font-bold transition duration-150"
              >
                -2%
              </button>
              <button
                type="button"
                onClick={() => adjustScale(0.02)}
                className="flex-grow bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 rounded-lg text-[10px] font-bold transition duration-150"
              >
                +2%
              </button>
              <button
                type="button"
                onClick={() => adjustScale(0.1)}
                className="flex-grow bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 rounded-lg text-[10px] font-bold transition duration-150"
              >
                +10%
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
