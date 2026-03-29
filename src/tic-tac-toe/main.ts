import vertexShader from "./shaders/basic.vert?raw";
import fragmentShader from "./shaders/basic.frag?raw";

import {initBuffers} from "./buffers";
import {drawScene, render, resetSceneParameters} from "./scene";
import {Grid} from "./Grid";

const lang = document.documentElement.lang;
const canvas : HTMLCanvasElement = document.querySelector("#glCanvas")!;
const resetButton : HTMLButtonElement = document.querySelector("#resetButton")!;
const result : HTMLParagraphElement = document.querySelector("#tic-tac-toe-result")!;
let grid : Grid = new Grid();

const resultText = {
    en: {
        player: "Player ",
        won: " won !",
        tie: "Game ended with a tie"
    },
    fr: {
        player: "Le joueur ",
        won: " a gagné !",
        tie: "Match nul"
    }
}

main();

function createShader(gl: WebGLRenderingContext, type: number, source: string) : WebGLShader | null {
  const shader : WebGLShader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader),
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function initShaderProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader) : WebGLProgram | null {
  const shaderProgram : WebGLProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vs);
  gl.attachShader(shaderProgram, fs);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      "Unable to initialize shader program: " +
        gl.getProgramInfoLog(shaderProgram),
    );
    return null;
  }

  return shaderProgram;
}


function main() {
  const gl : WebGLRenderingContext | null = canvas.getContext("webgl");

  if (!gl) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  const vs : WebGLShader | null = createShader(gl, gl.VERTEX_SHADER, vertexShader);
  const fs : WebGLShader | null = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);

  if (!vs || !fs) {
    return;
  }

  const shaderProgram : WebGLProgram | null = initShaderProgram(gl, vs, fs);

  if (!shaderProgram) {
    return;
  }

  const programInfo = {
    program: shaderProgram,
    vertexCount: 0,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
      vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
      normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix")
    },
  };

  let buffersInfo = initBuffers(gl);

  drawScene(gl, programInfo, buffersInfo, grid);

  canvas.addEventListener("pointerdown", (event) => {
    const rect = canvas.getBoundingClientRect();

    const x = 3 * (event.clientX - rect.left) / canvas.width;
    const y = 3 * (event.clientY - rect.top) / canvas.height;
    
    if (grid.selectCell(Math.floor(x), 2-Math.floor(y))) {
      drawScene(gl, programInfo, buffersInfo, grid);
    }
  });

  resetButton.addEventListener("click", () => {
    grid.reset();
    resetSceneParameters();
    result.textContent = "";
    drawScene(gl, programInfo, buffersInfo, grid);
  });

  grid.onGameEnded((e: CustomEvent) => {
    const winner = e.detail.winner;

  const t = lang.startsWith("en") ? resultText.en : resultText.fr;
    if (winner > 0) {
      result.textContent = t.player + winner + t.won;
      render(gl, programInfo, buffersInfo, grid);
    } else {
      result.textContent = t.tie;
    }
    
  });
}