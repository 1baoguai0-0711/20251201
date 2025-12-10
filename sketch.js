// 精靈動畫設定
let spriteImg;
let sprite2Img;
let sprite3Img;
let sprite4Img;
let sprite5Img;
const TOTAL_FRAMES = 6; // 精靈表中有 6 張圖片
const TOTAL_FRAMES_2 = 9; // 2all.png 有 9 張圖片
let frameW = 0;
let frameH = 0;
let frameW2 = 0;
let frameH2 = 0;
let frameW3 = 0;
let frameH3 = 0;
let frameW4 = 0;
let frameH4 = 0;
let frameW5 = 0;
let frameH5 = 0;
let frameDelay = 6; // 每幀持續的 draw 次數，數字越小動畫越快

// 角色位置與狀態
let posX1, posX2, posY; // 兩個獨立 x 位置：posX1 用於主要顯示，posX2 用於同時顯示另一張（1all/2all）
let speed = 4;
let movingLeft = false;
let movingRight = false;
let facing = 1; // 1 = 右, -1 = 左
let facing2 = 1; // 2all 的朝向（獨立於主角）
let lastFacing = 1; // 紀錄最近一次移動方向，用於靜止時的朝向
let displayScale = 3; // 放大倍數，可調
// 跳躍相關
const TOTAL_FRAMES_3 = 4; // 3all.png 有 4 張
let isJumping = false;
let jumpTick = 0;
let jumpDelay = 8; // 跳躍動畫每幀持續時間
let jumpHeight = 80; // 跳起的像素高度（可調）
let baseY = 0;
let yOffset = 0;
// 空白鍵的動作（4all 播放完生成 5all 角色）
const TOTAL_FRAMES_4 = 4;
const TOTAL_FRAMES_5 = 4;
let isPlaying4 = false;
let play4Tick = 0;
let play4Delay = 8;
let spawnedChars = []; // 陣列保存被產生的新角色

function preload() {
  // 先嘗試載入 1all.png（根目錄或 ./1/），並同時嘗試載入 2all.png 的常見路徑
  spriteImg = loadImage('1all.png',
    img => { spriteImg = img; console.log('載入 1all.png 成功 (root)'); },
    err => {
      console.warn('未找到 root 的 1all.png，改從 ./1/1all.png 嘗試', err);
      spriteImg = loadImage('1/1all.png',
        img2 => { spriteImg = img2; console.log('載入 1/1all.png 成功 (./1/)'); },
        err2 => { console.error('載入 1all.png 失敗（嘗試 root 與 ./1/），請確認檔案位置', err2); }
      );
    }
  );

  // 載入 2all.png (走動動畫，用於左右移動)
  sprite2Img = loadImage('2all.png',
    img => { sprite2Img = img; console.log('載入 2all.png 成功 (root)'); },
    err => {
      console.warn('未找到 root 的 2all.png，改從 ./1/2all.png 或 ./2/2all.png 嘗試', err);
      // 嘗試常見子資料夾
      sprite2Img = loadImage('1/2all.png',
        img2 => { sprite2Img = img2; console.log('載入 1/2all.png 成功 (./1/)'); },
        err2 => {
          sprite2Img = loadImage('2/2all.png',
            img3 => { sprite2Img = img3; console.log('載入 2/2all.png 成功 (./2/)'); },
            err3 => { console.error('載入 2all.png 失敗（嘗試多個路徑），請確認檔案位置', err3); }
          );
        }
      );
    }
  );

  // 載入 3all.png（跳躍動畫）
  sprite3Img = loadImage('3all.png',
    img => { sprite3Img = img; console.log('載入 3all.png 成功 (root)'); },
    err => {
      console.warn('未找到 root 的 3all.png，改從 ./1/3all.png 或 ./3/3all.png 嘗試', err);
      sprite3Img = loadImage('1/3all.png',
        img2 => { sprite3Img = img2; console.log('載入 1/3all.png 成功 (./1/)'); },
        err2 => {
          sprite3Img = loadImage('3/3all.png',
            img3 => { sprite3Img = img3; console.log('載入 3/3all.png 成功 (./3/)'); },
            err3 => { console.error('載入 3all.png 失敗（嘗試多個路徑），請確認檔案位置', err3); }
          );
        }
      );
    }
  );

  // 載入 4all.png（空白鍵動作）與 5all.png（被生成的角色）
  sprite4Img = loadImage('4all.png',
    img => { sprite4Img = img; console.log('載入 4all.png 成功 (root)'); },
    err => {
      console.warn('未找到 root 的 4all.png，嘗試 ./1/4all.png 或 ./4/4all.png', err);
      sprite4Img = loadImage('1/4all.png',
        img2 => { sprite4Img = img2; console.log('載入 1/4all.png 成功 (./1/)'); },
        err2 => {
          sprite4Img = loadImage('4/4all.png',
            img3 => { sprite4Img = img3; console.log('載入 4/4all.png 成功 (./4/)'); },
            err3 => { console.error('載入 4all.png 失敗（嘗試多個路徑），請確認檔案位置', err3); }
          );
        }
      );
    }
  );

  sprite5Img = loadImage('5all.png',
    img => { sprite5Img = img; console.log('載入 5all.png 成功 (root)'); },
    err => {
      console.warn('未找到 root 的 5all.png，嘗試 ./1/5all.png 或 ./5/5all.png', err);
      sprite5Img = loadImage('1/5all.png',
        img2 => { sprite5Img = img2; console.log('載入 1/5all.png 成功 (./1/)'); },
        err2 => {
          sprite5Img = loadImage('5/5all.png',
            img3 => { sprite5Img = img3; console.log('載入 5/5all.png 成功 (./5/)'); },
            err3 => { console.error('載入 5all.png 失敗（嘗試多個路徑），請確認檔案位置', err3); }
          );
        }
      );
    }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  // 初始位置在畫面中間
  // 將兩張圖略微分開顯示，並同時可移動
  posX1 = width / 2 - 60;
  posX2 = width / 2 + 60;
  baseY = height / 2;
  posY = baseY;

  // 若圖片已載入，計算每幀寬高；若尚未載入，會在 draw 中延遲計算
  if (spriteImg && spriteImg.width) {
    frameW = floor(spriteImg.width / TOTAL_FRAMES);
    frameH = spriteImg.height;
  }
  if (sprite2Img && sprite2Img.width) {
    frameW2 = floor(sprite2Img.width / TOTAL_FRAMES_2);
    frameH2 = sprite2Img.height;
  }
  if (sprite3Img && sprite3Img.width) {
    frameW3 = floor(sprite3Img.width / TOTAL_FRAMES_3);
    frameH3 = sprite3Img.height;
  }
  if (sprite4Img && sprite4Img.width) {
    frameW4 = floor(sprite4Img.width / TOTAL_FRAMES_4);
    frameH4 = sprite4Img.height;
  }
  if (sprite5Img && sprite5Img.width) {
    frameW5 = floor(sprite5Img.width / TOTAL_FRAMES_5);
    frameH5 = sprite5Img.height;
  }
  imageMode(CENTER);
}

function draw() {
  background('#a2d2ff');
  // 更新移動狀態（支援按住鍵）
  movingLeft = keyIsDown(LEFT_ARROW);
  movingRight = keyIsDown(RIGHT_ARROW);

  // 決定使用哪個精靈表與幀數
  let currentImg = spriteImg;
  let currentFrames = TOTAL_FRAMES;
  let cw = frameW;
  let ch = frameH;
  // 先預設垂直偏移
  yOffset = 0;

  if (movingLeft) {
    // 按左鍵：用 2all 取代主角，向左前進，不翻轉（保持原向）
    if (sprite2Img) {
      currentImg = sprite2Img;
      currentFrames = TOTAL_FRAMES_2;
      cw = frameW2;
      ch = frameH2;
    }
    posX1 -= speed;     // 以主位置 posX1 移動
    facing = 1;         // 不翻轉（scale(1,1)）讓圖面向左
    lastFacing = 1;
  } else if (movingRight) {
    // 按右鍵：用 2all 取代主角，向右前進，需水平翻轉以面向右
    if (sprite2Img) {
      currentImg = sprite2Img;
      currentFrames = TOTAL_FRAMES_2;
      cw = frameW2;
      ch = frameH2;
    }
    posX1 += speed;     // 以主位置 posX1 移動
    facing = -1;        // 翻轉（scale(-1,1)）讓圖面向右
    lastFacing = -1;
  } else {
    // 靜止時使用 1all.png（idle）
    currentImg = spriteImg;
    currentFrames = TOTAL_FRAMES;
    cw = frameW;
    ch = frameH;
    // 靜止時採用最後移動方向的朝向
    facing = lastFacing;
  }

  // 處理跳躍（上鍵）狀態：若按下上鍵且尚未跳躍，啟動跳躍
  if (keyIsDown(UP_ARROW) && !isJumping) {
    isJumping = true;
    jumpTick = 0;
    // 立刻抬起（在第一幀前）
    yOffset = -jumpHeight;
  }

  // 若正在跳躍，切換使用 3all.png 並依跳躍進度控制垂直位移
  let jumpIdx = 0;
  if (isJumping) {
    if (sprite3Img) {
      currentImg = sprite3Img;
      currentFrames = TOTAL_FRAMES_3;
      cw = frameW3;
      ch = frameH3;
    }

    jumpIdx = floor(jumpTick / jumpDelay);
    if (jumpIdx < 1) {
      // 在第 1 幀之前，保持向上
      yOffset = -jumpHeight;
    } else {
      // 到第 2 張後往下（回到原位）
      yOffset = 0;
    }

    // 畫面到最後一幀後結束跳躍
    if (jumpIdx >= TOTAL_FRAMES_3) {
      isJumping = false;
      jumpTick = 0;
      yOffset = 0;
    } else {
      jumpTick++;
    }
  }

  // 處理空白鍵動作（4all），改為「按住空白鍵時持續顯示並播放 4all；放開時恢復 1all」
  // 判斷是否按住空白鍵：按住時顯示並播放 4all，放開時恢復為其他狀態
  const spaceDown = keyIsDown(32); // 32 = Space
  if (spaceDown) {
    isPlaying4 = true;
    // 切換為 4all 的圖與幀設定
    if (sprite4Img) {
      currentImg = sprite4Img;
      currentFrames = TOTAL_FRAMES_4;
      cw = frameW4;
      ch = frameH4;
    }
    // 4all 按住時持續向前移動（使用原先的移動方向邏輯）
    posX1 += (-facing) * speed;
    // 推進播放計數以驅動動畫（按住時循環）
    play4Tick++;
  } else {
    // 放開空白鍵：停止播放 4all，重置計數，畫面會使用其它 currentImg（通常為 1all）
    isPlaying4 = false;
    play4Tick = 0;
  }

  // 若當前圖片還沒載入，顯示提示文字
  if (!currentImg || !currentImg.width) {
    push();
    translate(width / 2, height / 2);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(18);
    text('等待載入精靈圖，或找不到 1all.png / 2all.png', 0, 0);
    pop();
    return;
  }

  // 若未預先計算幀寬高，現在計算一次
  if (currentImg === spriteImg && (!cw || !ch)) {
    frameW = floor(spriteImg.width / TOTAL_FRAMES);
    frameH = spriteImg.height;
    cw = frameW; ch = frameH;
  }
  if (currentImg === sprite2Img && (!cw || !ch)) {
    frameW2 = floor(sprite2Img.width / TOTAL_FRAMES_2);
    frameH2 = sprite2Img.height;
    cw = frameW2; ch = frameH2;
  }

  // 計算目前幀索引
  let idx;
  if (isPlaying4) {
    // 當正在播放 4all（按住空白鍵）時，讓 4all 連續循環播放
    // 使用 modulo 使動畫循環，不會停在最後一格
    idx = floor(play4Tick / play4Delay) % currentFrames;
  } else if (isJumping) {
    idx = constrain(floor(jumpTick / jumpDelay), 0, currentFrames - 1);
  } else {
    idx = floor(frameCount / frameDelay) % currentFrames;
  }
  const sx = idx * cw;
  const sy = 0;

  // 顯示大小
  const displayW = cw * displayScale;
  const displayH = ch * displayScale;

  // 邊界限制
  const halfWMain = displayW / 2;
  posX1 = constrain(posX1, halfWMain, width - halfWMain);
  // 另一張圖的顯示寬度（若未載入則使用 frameW2 欄位）
  const displayW2 = (frameW2 || (sprite2Img ? floor(sprite2Img.width / TOTAL_FRAMES_2) : 0)) * displayScale;
  const halfW2 = displayW2 / 2;
  posX2 = constrain(posX2, halfW2, width - halfW2);

  // 實際繪製位置包含跳躍偏移
  const drawY = baseY + yOffset;

  // 繪製（支援翻轉）
  push();
  // 主要角色繪製（使用 posX1）
  translate(posX1, drawY);
  scale(facing, 1); // 若 facing 為 -1，會水平翻轉
  // 使用 image 的裁切版本，因為我們已經 translate 到中心，使用 (0,0)
  // 注意：當 scale(-1,1) 時，影像仍以正寬度繪製，所以不須調整 sx
  image(currentImg, 0, 0, displayW, displayH, sx, sy, cw, ch);
  pop();

  // 同時繪製另一張（1all 或 2all），位於 posX2，使用自己的幀索引
  // 已改為：當按鍵時 currentImg = sprite2 並在主位置 posX1 繪製，
  // 所以移除額外以 posX2 再繪製的區塊（避免重疊）

  // 已移除 5all 的產生與繪製，空白鍵只會播放並移動 4all（不會生成任何新角色）
} // end draw()

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 更新位置（保持於中間附近）
  posY = height / 2;
  // 重新置中兩個角色
  posX1 = width / 2 - 60;
  posX2 = width / 2 + 60;
}

// 若需額外的鍵盤互動處理（例如按鍵放開時清除狀態），可視情況加上
function keyPressed() {
  // 允許 WASD 或左右鍵
  if (keyCode === LEFT_ARROW) {
    movingLeft = true;
  } else if (keyCode === RIGHT_ARROW) {
    movingRight = true;
  } else if (keyCode === 32 || key === ' ') { // 空白鍵觸發 4all 播放
    // 不再在這裡直接改變 isPlaying4，draw() 會以 keyIsDown(32) 決定是否播放
  }
}

function keyReleased() {
  if (keyCode === LEFT_ARROW) {
    movingLeft = false;
  } else if (keyCode === RIGHT_ARROW) {
    movingRight = false;
  } else if (keyCode === 32) { // 放開空白鍵立即停止 4all（保險）
    isPlaying4 = false;
    play4Tick = 0;
  }
}
