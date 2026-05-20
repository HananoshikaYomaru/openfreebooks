export type VisualizerColors = {
  text: string;
  operator: string;
  carry: string;
  borrow: string;
  result: string;
  line: string;
  highlight: string;
  highlightBorder: string;
  error: string;
};

type CellData = {
  text?: string;
  color?: string;
  crossedOut?: boolean;
  smallText?: string;
  smallColor?: string;
};

type Frame = {
  cells: Record<string, CellData>;
  lines: Array<{ y: number; startX: number; endX: number }>;
  highlights: Array<{ x: number; y: number; w: number; h: number }>;
  message: string;
};

export class MathVisualizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private wrapper: HTMLElement;
  private themeRoot: HTMLElement;

  frames: Frame[] = [];
  currentFrame = 0;
  isPlaying = false;
  private playInterval: ReturnType<typeof setInterval> | null = null;
  speed = 800;
  operation: "+" | "-" | "*" | "/" = "+";

  private colors: VisualizerColors = {
    text: "#1e293b",
    operator: "#64748b",
    carry: "#ef4444",
    borrow: "#9a6b2e",
    result: "#16a34a",
    line: "#cbd5e1",
    highlight: "rgba(59, 130, 246, 0.15)",
    highlightBorder: "rgba(59, 130, 246, 0.4)",
    error: "#ef4444",
  };

  onMessage?: (msg: string, isError?: boolean) => void;
  onStep?: (current: number, total: number) => void;
  onPlayState?: (playing: boolean) => void;

  constructor(opts: {
    canvas: HTMLCanvasElement;
    wrapper: HTMLElement;
    themeRoot: HTMLElement;
  }) {
    this.canvas = opts.canvas;
    const ctx = opts.canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D not available");
    this.ctx = ctx;
    this.wrapper = opts.wrapper;
    this.themeRoot = opts.themeRoot;
    this.refreshColors();
  }

  refreshColors() {
    const s = getComputedStyle(this.themeRoot);
    const get = (name: string, fallback: string) =>
      s.getPropertyValue(name).trim() || fallback;
    this.colors = {
      text: get("--va-text", "#1a1a1a"),
      operator: get("--va-operator", "#767676"),
      carry: get("--va-carry", "#dc2626"),
      borrow: get("--va-borrow", "#9a6b2e"),
      result: get("--va-result", "#2a7d52"),
      line: get("--va-line", "#e8e8e8"),
      highlight: get("--va-highlight", "rgba(154, 107, 46, 0.15)"),
      highlightBorder: get("--va-highlight-border", "rgba(154, 107, 46, 0.4)"),
      error: get("--va-error", "#dc2626"),
    };
  }

  resizeCanvas() {
    const rect = this.wrapper.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    this.render();
  }

  setSpeed(ms: number) {
    this.speed = ms;
    if (this.isPlaying) {
      this.pause();
      this.play();
    }
  }

  setOperation(op: "+" | "-" | "*" | "/") {
    this.operation = op;
  }

  generateFromInput(raw: string) {
    const lines = raw
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => /^\d+$/.test(s));

    if (lines.length < 2) {
      this.showMessage("Please enter at least two numbers.", true);
      return;
    }

    this.frames = [];
    this.currentFrame = 0;
    this.pause();

    try {
      if (this.operation === "+") {
        this.generateAddition(lines);
      } else {
        let current = lines[0];
        const finalStepFrames: Frame[] = [];

        for (let i = 1; i < lines.length; i++) {
          const next = lines[i];

          if (i > 1) {
            const transFrame = this.createEmptyFrame();
            transFrame.message = `Intermediate result: ${current}. Preparing next operation...`;
            for (let k = 0; k < current.length; k++) {
              this.setCell(transFrame, k, 1, {
                text: current[k],
                color: this.colors.result,
              });
            }
            this.frames.push(transFrame);
          }

          if (this.operation === "-") {
            this.generateSubtraction(current, next);
            const diff = BigInt(current) - BigInt(next);
            if (diff < 0n) {
              throw new Error(
                "Result dropped below zero. Negative visualization not supported."
              );
            }
            current = diff.toString();
          } else if (this.operation === "*") {
            this.generateMultiplication(current, next);
            current = (BigInt(current) * BigInt(next)).toString();
          } else if (this.operation === "/") {
            if (BigInt(next) === 0n) throw new Error("Cannot divide by zero.");
            this.generateDivision(current, next);
            current = (BigInt(current) / BigInt(next)).toString();
          }

          finalStepFrames.push(this.cloneGrid(this.frames[this.frames.length - 1]));
        }

        if (finalStepFrames.length > 1) {
          this.frames.push(this.mergeFramesToSummary(finalStepFrames));
        }
      }

      if (this.frames.length > 0) {
        this.render();
        this.play();
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      this.showMessage(`Error: ${msg}`, true);
    }
  }

  private showMessage(msg: string, isError = false) {
    this.onMessage?.(msg, isError);
  }

  private cloneGrid(grid: Frame): Frame {
    return JSON.parse(JSON.stringify(grid)) as Frame;
  }

  private createEmptyFrame(): Frame {
    return { cells: {}, lines: [], highlights: [], message: "" };
  }

  private setCell(frame: Frame, x: number, y: number, data: CellData) {
    frame.cells[`${x},${y}`] = { ...frame.cells[`${x},${y}`], ...data };
  }

  private getCell(frame: Frame, x: number, y: number): CellData | null {
    return frame.cells[`${x},${y}`] ?? null;
  }

  private mergeFramesToSummary(finalFrames: Frame[]): Frame {
    const summaryFrame = this.createEmptyFrame();
    summaryFrame.message = "Final Summary of All Steps";
    let currentOffsetX = 0;

    for (let i = 0; i < finalFrames.length; i++) {
      const f = finalFrames[i];
      let minX = Infinity;
      let maxX = -Infinity;
      let hasCells = false;
      Object.keys(f.cells).forEach((key) => {
        const [x] = key.split(",").map(Number);
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        hasCells = true;
      });
      if (!hasCells) continue;

      const shiftX = currentOffsetX - minX;

      Object.entries(f.cells).forEach(([key, cell]) => {
        const [x, y] = key.split(",").map(Number);
        summaryFrame.cells[`${x + shiftX},${y}`] = { ...cell };
      });

      f.lines.forEach((line) => {
        summaryFrame.lines.push({
          y: line.y,
          startX: line.startX + shiftX,
          endX: line.endX + shiftX,
        });
      });

      if (i > 0) {
        summaryFrame.cells[`${currentOffsetX - 2},2`] = {
          text: "→",
          color: this.colors.operator,
        };
      }

      currentOffsetX += maxX - minX + 1 + 3;
    }

    return summaryFrame;
  }

  private generateAddition(numbers: string[]) {
    const maxLen = Math.max(...numbers.map((s) => s.length));
    const padded = numbers.map((s) => s.padStart(maxLen, "0"));
    const frame = this.createEmptyFrame();
    frame.message = `Setting up addition for ${numbers.join(" + ")}`;
    const numCount = numbers.length;
    const width = maxLen + 2;

    this.setCell(frame, 0, numCount, { text: "+", color: this.colors.operator });

    for (let r = 0; r < numCount; r++) {
      const pStr = padded[r];
      for (let i = 0; i < maxLen; i++) {
        if (i >= maxLen - numbers[r].length) {
          this.setCell(frame, i + 2, r + 1, { text: pStr[i], color: this.colors.text });
        }
      }
    }

    const lineY = numCount + 1;
    frame.lines.push({ y: lineY, startX: 0, endX: width });
    this.frames.push(this.cloneGrid(frame));

    let carry = 0;

    for (let i = maxLen - 1; i >= 0; i--) {
      let sum = carry;
      const columnDigits: number[] = [];
      for (let r = 0; r < numCount; r++) {
        const d = parseInt(padded[r][i], 10);
        sum += d;
        columnDigits.push(d);
      }

      const nextCarry = Math.floor(sum / 10);
      const digit = sum % 10;
      const col = i + 2;

      const stepFrame = this.cloneGrid(this.frames[this.frames.length - 1]);
      stepFrame.highlights.push({
        x: col,
        y: carry > 0 ? 0 : 1,
        w: 1,
        h: carry > 0 ? numCount + 1 : numCount,
      });

      let msg = `Add column: ${columnDigits.join(" + ")}`;
      if (carry > 0) msg += ` + ${carry} (carry) = ${sum}.`;
      else msg += ` = ${sum}.`;
      if (nextCarry > 0) msg += ` Write ${digit}, carry ${nextCarry}.`;
      else msg += ` Write ${digit}.`;
      stepFrame.message = msg;
      this.frames.push(stepFrame);

      const resultFrame = this.cloneGrid(this.frames[this.frames.length - 1]);
      resultFrame.highlights = [];
      this.setCell(resultFrame, col, lineY + 1, {
        text: digit.toString(),
        color: this.colors.result,
      });
      if (nextCarry > 0) {
        this.setCell(resultFrame, col - 1, 0, {
          text: nextCarry.toString(),
          color: this.colors.carry,
        });
      }
      resultFrame.message = msg;
      this.frames.push(resultFrame);

      carry = nextCarry;
    }

    if (carry > 0) {
      const finalFrame = this.cloneGrid(this.frames[this.frames.length - 1]);
      const carryStr = carry.toString();
      for (let c = 0; c < carryStr.length; c++) {
        this.setCell(finalFrame, 1 - (carryStr.length - 1 - c), lineY + 1, {
          text: carryStr[c],
          color: this.colors.result,
        });
      }
      finalFrame.message = "Write final carry down.";
      this.frames.push(finalFrame);
    }
  }

  private generateSubtraction(s1: string, s2: string) {
    const n1 = BigInt(s1);
    const n2 = BigInt(s2);
    if (n1 < n2) {
      throw new Error(
        "First number must be greater than or equal to second number for visualizer."
      );
    }

    const maxLen = Math.max(s1.length, s2.length);
    const p1 = s1.padStart(maxLen, "0").split("").map(Number);
    const p2 = s2.padStart(maxLen, "0").split("").map(Number);

    const frame = this.createEmptyFrame();
    frame.message = `Setting up subtraction for ${s1} - ${s2}`;
    const width = maxLen + 2;

    this.setCell(frame, 0, 2, { text: "−", color: this.colors.operator });
    for (let i = 0; i < maxLen; i++) {
      if (i >= maxLen - s1.length) {
        this.setCell(frame, i + 2, 1, { text: p1[i].toString(), color: this.colors.text });
      }
      if (i >= maxLen - s2.length) {
        this.setCell(frame, i + 2, 2, { text: p2[i].toString(), color: this.colors.text });
      }
    }
    frame.lines.push({ y: 3, startX: 0, endX: width });
    this.frames.push(this.cloneGrid(frame));

    for (let i = maxLen - 1; i >= 0; i--) {
      let d1 = p1[i];
      const d2 = p2[i];
      const col = i + 2;

      if (d1 < d2) {
        let borrowIdx = i - 1;
        while (borrowIdx >= 0 && p1[borrowIdx] === 0) borrowIdx--;

        for (let j = borrowIdx; j < i; j++) {
          const bFrame = this.cloneGrid(this.frames[this.frames.length - 1]);
          const cellToCross = this.getCell(bFrame, j + 2, 1);
          this.setCell(bFrame, j + 2, 1, { crossedOut: true });
          const newVal = p1[j] === 0 ? 9 : p1[j] - 1;
          p1[j] = newVal;
          this.setCell(bFrame, j + 2, 0, {
            text: newVal.toString(),
            color: this.colors.borrow,
          });
          if (j < i - 1) {
            bFrame.message = "Borrowing across zero. Cross out 0, make it 9.";
          } else {
            bFrame.message = `Borrow 1 from ${cellToCross?.text ?? ""}, leaving ${newVal}.`;
          }
          bFrame.highlights = [{ x: j + 2, y: 0, w: 1, h: 2 }];
          this.frames.push(bFrame);
        }

        p1[i] += 10;
        d1 = p1[i];
        const addFrame = this.cloneGrid(this.frames[this.frames.length - 1]);
        this.setCell(addFrame, col, 1, { crossedOut: true });
        this.setCell(addFrame, col, 0, { text: d1.toString(), color: this.colors.borrow });
        addFrame.message = `Add 10 to current column, making it ${d1}.`;
        addFrame.highlights = [{ x: col, y: 0, w: 1, h: 2 }];
        this.frames.push(addFrame);
      }

      const subFrame = this.cloneGrid(this.frames[this.frames.length - 1]);
      const origDigit = parseInt(s1.padStart(maxLen, "0")[i], 10);
      subFrame.highlights = [
        {
          x: col,
          y: p1[i] > origDigit ? 0 : 1,
          w: 1,
          h: p1[i] > origDigit ? 3 : 2,
        },
      ];
      subFrame.message = `Subtract: ${d1} - ${d2} = ${d1 - d2}.`;
      this.frames.push(subFrame);

      const resultFrame = this.cloneGrid(this.frames[this.frames.length - 1]);
      resultFrame.highlights = [];
      const res = d1 - d2;
      const currentP1 = BigInt(p1.slice(0, i + 1).join(""));
      const currentP2 = BigInt(p2.slice(0, i + 1).join(""));
      if (res > 0 || i === maxLen - 1 || currentP1 > currentP2) {
        this.setCell(resultFrame, col, 4, {
          text: res.toString(),
          color: this.colors.result,
        });
      }
      resultFrame.message = `Write ${res}.`;
      this.frames.push(resultFrame);
    }
  }

  private generateMultiplication(s1: string, s2: string) {
    const topOffset = 2;
    const stackWidth = Math.max(s1.length, s2.length);
    const rightOffset = stackWidth;
    const opCol = rightOffset - s2.length;
    const width = rightOffset + 1;

    const frame = this.createEmptyFrame();
    frame.message = `Setting up multiplication: ${s1} × ${s2}`;

    this.setCell(frame, opCol, topOffset + 1, {
      text: "×",
      color: this.colors.operator,
    });
    for (let i = 0; i < s1.length; i++) {
      this.setCell(frame, rightOffset - s1.length + 1 + i, topOffset, {
        text: s1[i],
        color: this.colors.text,
      });
    }
    for (let i = 0; i < s2.length; i++) {
      this.setCell(frame, rightOffset - s2.length + 1 + i, topOffset + 1, {
        text: s2[i],
        color: this.colors.text,
      });
    }
    frame.lines.push({ y: topOffset + 2, startX: opCol, endX: rightOffset });
    this.frames.push(this.cloneGrid(frame));

    const partialProducts: string[] = [];
    let rowOffset = topOffset + 2;

    for (let j = s2.length - 1; j >= 0; j--) {
      const d2 = parseInt(s2[j], 10);
      let carry = 0;
      let partial = "";
      const shift = s2.length - 1 - j;

      const startFrame = this.cloneGrid(this.frames[this.frames.length - 1]);
      Object.keys(startFrame.cells).forEach((k) => {
        if (k.endsWith(",0") || k.endsWith(",1")) delete startFrame.cells[k];
      });

      for (let i = s1.length - 1; i >= 0; i--) {
        const d1 = parseInt(s1[i], 10);
        const prod = d1 * d2 + carry;
        const nextCarry = Math.floor(prod / 10);
        const digit = prod % 10;
        const highlightCol = rightOffset - s1.length + 1 + i;
        const bottomCol = rightOffset - s2.length + 1 + j;

        const stepFrame = this.cloneGrid(this.frames[this.frames.length - 1]);
        stepFrame.highlights = [
          { x: highlightCol, y: topOffset, w: 1, h: 1 },
          { x: bottomCol, y: topOffset + 1, w: 1, h: 1 },
        ];
        let msg = `${d1} × ${d2}`;
        if (carry > 0) msg += ` + ${carry} (carry) = ${prod}.`;
        else msg += ` = ${prod}.`;
        if (nextCarry > 0) msg += ` Write ${digit}, carry ${nextCarry}.`;
        else msg += ` Write ${digit}.`;
        stepFrame.message = msg;
        if (carry > 0) {
          this.setCell(stepFrame, highlightCol, topOffset - 1, {
            text: carry.toString(),
            color: this.colors.carry,
          });
        }
        this.frames.push(stepFrame);

        const writeFrame = this.cloneGrid(stepFrame);
        writeFrame.highlights = [];
        const writeCol = rightOffset - shift - (s1.length - 1 - i);
        this.setCell(writeFrame, writeCol, rowOffset, {
          text: digit.toString(),
          color: this.colors.result,
        });
        if (nextCarry > 0) {
          this.setCell(writeFrame, highlightCol - 1, topOffset - 1, {
            text: nextCarry.toString(),
            color: this.colors.carry,
          });
        }
        this.frames.push(writeFrame);

        carry = nextCarry;
        partial = digit.toString() + partial;
      }

      if (carry > 0) {
        const finalFrame = this.cloneGrid(this.frames[this.frames.length - 1]);
        const writeCol = rightOffset - shift - s1.length;
        this.setCell(finalFrame, writeCol, rowOffset, {
          text: carry.toString(),
          color: this.colors.result,
        });
        finalFrame.message = "Write final carry down.";
        this.frames.push(finalFrame);
        partial = carry.toString() + partial;
      }

      if (shift > 0) {
        const padFrame = this.cloneGrid(this.frames[this.frames.length - 1]);
        for (let k = 0; k < shift; k++) {
          this.setCell(padFrame, rightOffset - k, rowOffset, {
            text: "0",
            color: this.colors.operator,
          });
        }
        padFrame.message = "Add placeholder zero(s).";
        this.frames.push(padFrame);
        partial = partial + "0".repeat(shift);
      }

      partialProducts.push(partial);
      rowOffset++;
    }

    if (partialProducts.length > 1) {
      const addSetupFrame = this.cloneGrid(this.frames[this.frames.length - 1]);
      addSetupFrame.lines.push({ y: rowOffset, startX: opCol, endX: rightOffset });
      this.setCell(addSetupFrame, opCol, rowOffset - 1, {
        text: "+",
        color: this.colors.operator,
      });
      addSetupFrame.message = "Add the partial products together.";
      Object.keys(addSetupFrame.cells).forEach((k) => {
        if (k.endsWith(`,${topOffset - 1}`)) delete addSetupFrame.cells[k];
      });
      this.frames.push(addSetupFrame);

      let carry = 0;
      const maxP = Math.max(...partialProducts.map((p) => p.length));

      for (let i = 0; i < maxP; i++) {
        let sum = carry;
        for (let j = 0; j < partialProducts.length; j++) {
          const pStr = partialProducts[j];
          if (i < pStr.length) sum += parseInt(pStr[pStr.length - 1 - i], 10);
        }
        const digit = sum % 10;
        const nextCarry = Math.floor(sum / 10);
        const col = rightOffset - i;
        const resFrame = this.cloneGrid(this.frames[this.frames.length - 1]);
        this.setCell(resFrame, col, rowOffset, {
          text: digit.toString(),
          color: this.colors.result,
        });
        let msg = `Sum column = ${sum}. Write ${digit}.`;
        if (nextCarry > 0) {
          this.setCell(resFrame, col - 1, topOffset + 1, {
            text: nextCarry.toString(),
            color: this.colors.carry,
          });
          msg += ` Carry ${nextCarry}.`;
        }
        resFrame.message = msg;
        this.frames.push(resFrame);
        carry = nextCarry;
      }

      if (carry > 0) {
        const finalFrame = this.cloneGrid(this.frames[this.frames.length - 1]);
        this.setCell(finalFrame, rightOffset - maxP, rowOffset, {
          text: carry.toString(),
          color: this.colors.result,
        });
        finalFrame.message = "Write final addition carry.";
        this.frames.push(finalFrame);
      }
    }
  }

  private generateDivision(s1: string, s2: string) {
    if (s2.length > 15) throw new Error("Divisor too large for visualizer (max 15 digits).");
    const div = parseInt(s2, 10);
    if (div === 0) throw new Error("Cannot divide by zero");
    if (BigInt(s1) === 0n) throw new Error("0 divided by anything is 0");

    const frame = this.createEmptyFrame();
    const divLen = s2.length;
    const divOffset = 0;
    const divStart = divLen + 1;
    frame.message = `Setup long division: ${s1} ÷ ${s2}`;

    for (let i = 0; i < divLen; i++) {
      this.setCell(frame, divOffset + i, 2, { text: s2[i], color: this.colors.operator });
    }
    this.setCell(frame, divLen, 2, { text: ")", color: this.colors.text });
    for (let i = 0; i < s1.length; i++) {
      this.setCell(frame, divStart + i, 2, { text: s1[i], color: this.colors.text });
    }
    frame.lines.push({ y: 1.5, startX: divStart - 0.2, endX: divStart + s1.length });
    this.frames.push(this.cloneGrid(frame));

    const dividendArr = s1.split("");
    let currentVal = 0;
    let row = 3;
    let quotientStr = "";

    for (let i = 0; i < dividendArr.length; i++) {
      const nextDigit = parseInt(dividendArr[i], 10);
      currentVal = currentVal * 10 + nextDigit;

      const bringFrame = this.cloneGrid(this.frames[this.frames.length - 1]);
      if (row > 3) {
        this.setCell(bringFrame, divStart + i, row - 1, {
          text: nextDigit.toString(),
          color: this.colors.text,
        });
        bringFrame.message = `Bring down ${nextDigit}. Current value is ${currentVal}.`;
        bringFrame.highlights = [{ x: divStart + i, y: 2, w: 1, h: row - 2 }];
      } else {
        bringFrame.message = `Consider ${currentVal}.`;
        bringFrame.highlights = [{ x: divStart, y: 2, w: i + 1, h: 1 }];
      }
      this.frames.push(bringFrame);

      if (currentVal >= div || i === dividendArr.length - 1 || quotientStr.length > 0) {
        const qDigit = Math.floor(currentVal / div);
        quotientStr += qDigit.toString();

        const qFrame = this.cloneGrid(this.frames[this.frames.length - 1]);
        qFrame.highlights = [];
        this.setCell(qFrame, divStart + i, 0, {
          text: qDigit.toString(),
          color: this.colors.result,
        });
        qFrame.message = `${div} goes into ${currentVal} exactly ${qDigit} times.`;
        this.frames.push(qFrame);

        if (qDigit > 0 || i === dividendArr.length - 1) {
          const subVal = qDigit * div;
          const subStr = subVal.toString();
          const subFrame = this.cloneGrid(this.frames[this.frames.length - 1]);
          this.setCell(subFrame, divStart + i - subStr.length, row, {
            text: "-",
            color: this.colors.operator,
          });
          for (let k = 0; k < subStr.length; k++) {
            this.setCell(subFrame, divStart + i - subStr.length + 1 + k, row, {
              text: subStr[k],
              color: this.colors.borrow,
            });
          }
          subFrame.lines.push({
            y: row + 1,
            startX: divStart + i - subStr.length,
            endX: divStart + i + 1,
          });
          subFrame.message = `Multiply ${qDigit} × ${div} = ${subVal}, then subtract.`;
          this.frames.push(subFrame);

          currentVal = currentVal - subVal;
          row += 2;
          const resFrame = this.cloneGrid(this.frames[this.frames.length - 1]);
          const currStr = currentVal.toString();
          for (let k = 0; k < currStr.length; k++) {
            this.setCell(resFrame, divStart + i - currStr.length + 1 + k, row - 1, {
              text: currStr[k],
              color: this.colors.text,
            });
          }
          resFrame.message = `Remainder is ${currentVal}.`;
          this.frames.push(resFrame);
        }
      }
    }
  }

  render() {
    this.refreshColors();
    if (this.frames.length === 0) {
      const dpr = window.devicePixelRatio || 1;
      this.ctx.clearRect(0, 0, this.canvas.width / dpr, this.canvas.height / dpr);
      return;
    }

    const frame = this.frames[this.currentFrame];
    const ctx = this.ctx;
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, this.canvas.width / dpr, this.canvas.height / dpr);

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    Object.keys(frame.cells).forEach((key) => {
      const [x, y] = key.split(",").map(Number);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    });

    if (!Number.isFinite(minX)) {
      this.updateUI();
      return;
    }

    minX -= 1;
    maxX += 1;
    minY -= 1;
    maxY += 1;

    const cols = maxX - minX + 1;
    const rows = maxY - minY + 1;
    const w = this.canvas.width / dpr;
    const h = this.canvas.height / dpr;
    const cellSize = Math.min(w / cols, h / rows, 60);
    const offsetX = (w - cols * cellSize) / 2 - minX * cellSize;
    const offsetY = (h - rows * cellSize) / 2 - minY * cellSize;

    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    frame.highlights.forEach((hl) => {
      ctx.fillStyle = this.colors.highlight;
      ctx.fillRect(
        offsetX + hl.x * cellSize,
        offsetY + hl.y * cellSize,
        hl.w * cellSize,
        hl.h * cellSize
      );
      ctx.strokeStyle = this.colors.highlightBorder;
      ctx.lineWidth = 2;
      ctx.strokeRect(
        offsetX + hl.x * cellSize,
        offsetY + hl.y * cellSize,
        hl.w * cellSize,
        hl.h * cellSize
      );
    });

    ctx.strokeStyle = this.colors.line;
    ctx.lineWidth = 3;
    frame.lines.forEach((line) => {
      ctx.beginPath();
      ctx.moveTo(offsetX + line.startX * cellSize, offsetY + line.y * cellSize);
      ctx.lineTo(offsetX + line.endX * cellSize, offsetY + line.y * cellSize);
      ctx.stroke();
    });

    const mono = getComputedStyle(this.themeRoot).getPropertyValue("--mono").trim() || "monospace";
    ctx.font = `bold ${cellSize * 0.6}px ${mono}`;

    Object.entries(frame.cells).forEach(([key, cell]) => {
      const [x, y] = key.split(",").map(Number);
      const cx = offsetX + x * cellSize + cellSize / 2;
      const cy = offsetY + y * cellSize + cellSize / 2;
      ctx.fillStyle = cell.color || this.colors.text;
      if (cell.text) ctx.fillText(cell.text, cx, cy);
      if (cell.crossedOut) {
        ctx.strokeStyle = this.colors.carry;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - cellSize * 0.3, cy + cellSize * 0.3);
        ctx.lineTo(cx + cellSize * 0.3, cy - cellSize * 0.3);
        ctx.stroke();
      }
    });

    this.updateUI();
  }

  private updateUI() {
    if (this.frames.length > 0) {
      const msg = this.frames[this.currentFrame].message;
      this.onMessage?.(msg, false);
      this.onStep?.(this.currentFrame + 1, this.frames.length);
    }
  }

  play() {
    if (this.frames.length === 0) return;
    if (this.currentFrame >= this.frames.length - 1) this.currentFrame = 0;
    this.isPlaying = true;
    this.onPlayState?.(true);
    this.playInterval = setInterval(() => {
      if (this.currentFrame < this.frames.length - 1) this.step(1);
      else this.pause();
    }, this.speed);
  }

  pause() {
    this.isPlaying = false;
    this.onPlayState?.(false);
    if (this.playInterval) clearInterval(this.playInterval);
    this.playInterval = null;
  }

  togglePlay() {
    if (this.isPlaying) this.pause();
    else this.play();
  }

  step(dir: number) {
    const newFrame = this.currentFrame + dir;
    if (newFrame >= 0 && newFrame < this.frames.length) {
      this.currentFrame = newFrame;
      this.render();
    }
  }

  destroy() {
    this.pause();
  }
}
