import {mat4, type ReadonlyVec2} from "gl-matrix";

import{type WebGLBuffers} from "./buffers";
import { GridCell, type Grid } from "./Grid";

const depth = 10/3;
const cellSize = 2.5/3;
let then = 0;
let currentTime = 0;
let winner : number = GridCell.EMPTY;
let winningIndices : number[] = [-1, -1, -1];

export function resetSceneParameters() {
  then = 0;
  currentTime = 0;
  winner = GridCell.EMPTY;
  winningIndices = [-1, -1, -1];
}

export function render(gl: WebGLRenderingContext, programInfo: any, buffersInfo: any, grid: Grid, now: number = 0) {
  currentTime += now - then;
  then = now;
  winner = grid.getWinner();
  winningIndices = grid.getWinningIndices();
  drawScene(gl, programInfo, buffersInfo, grid);
  if (winner != GridCell.EMPTY) {
    requestAnimationFrame((now) => render(gl, programInfo, buffersInfo, grid, now));
  }
}

export function drawScene(gl: WebGLRenderingContext, programInfo: any, buffersInfo: any, grid: Grid) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fieldOfView = (45 * Math.PI) / 180;
  const aspect = gl.canvas.width / gl.canvas.height;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  loadArrayBuffers(gl, programInfo, buffersInfo.buffers);

  drawGrid(gl, programInfo, buffersInfo, projectionMatrix);

  fillGrid(gl, programInfo, buffersInfo, projectionMatrix, grid);
}

function fillGrid(gl: WebGLRenderingContext, programInfo: any, buffersInfo: any, projectionMatrix: mat4, grid: Grid) {
  const cells = grid.getCells();

  for (let i = 0; i < cells.length; i++) {
    const x = i % 3;
    const y = Math.floor(i / 3);
    switch (cells[i]) {
      case GridCell.CROSS:
        drawCross(gl, programInfo, buffersInfo, projectionMatrix, [x, y]);
        break;
      case GridCell.CIRCLE:
        drawCircle(gl, programInfo, buffersInfo, projectionMatrix, [x, y]);
        break;
      default:
        break;
    }
  }
}

function drawGrid(gl: WebGLRenderingContext, programInfo: any, buffersInfo: any, projectionMatrix: mat4) {
  const modelViewMatrix = mat4.create();

  mat4.translate(
    modelViewMatrix,
    modelViewMatrix,
    [0, 0, -depth],
  );

  let normalMatrix = mat4.create();
  mat4.invert(normalMatrix, modelViewMatrix);
  mat4.transpose(normalMatrix, normalMatrix);

  gl.useProgram(programInfo.program);

  loadMatrices(gl, programInfo, projectionMatrix, modelViewMatrix, normalMatrix);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffersInfo.buffers.indices);
  {
    const vertexCount = buffersInfo.nbGridVertices;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
}

function drawCross(gl: WebGLRenderingContext, programInfo: any, buffersInfo: any, projectionMatrix: mat4, position: ReadonlyVec2) {
  const matrices = createMatrices(position, GridCell.CROSS);

  gl.useProgram(programInfo.program);

  loadMatrices(gl, programInfo, projectionMatrix, matrices.modelViewMatrix, matrices.normalMatrix);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffersInfo.buffers.indices);
  {
    const vertexCount = buffersInfo.nbCrossVertices;
    const type = gl.UNSIGNED_SHORT;
    const offset = buffersInfo.nbGridVertices * Uint16Array.BYTES_PER_ELEMENT; // multiply by size of type
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
}

function drawCircle(gl: WebGLRenderingContext, programInfo: any, buffersInfo: any, projectionMatrix: mat4, position: ReadonlyVec2) {
  const matrices = createMatrices(position, GridCell.CIRCLE);

  loadArrayBuffers(gl, programInfo, buffersInfo.buffers);

  gl.useProgram(programInfo.program);

  loadMatrices(gl, programInfo, projectionMatrix, matrices.modelViewMatrix, matrices.normalMatrix);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffersInfo.buffers.indices);
  {
    const vertexCount = buffersInfo.nbCircleVertices;
    const type = gl.UNSIGNED_SHORT;
    const offset = (buffersInfo.nbGridVertices + buffersInfo.nbCrossVertices) * Uint16Array.BYTES_PER_ELEMENT; // multiply by size of type
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
}

function loadArrayBuffers(gl: WebGLRenderingContext, programInfo: any, buffers: WebGLBuffers) : void {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0,);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexNormal);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexNormal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
}

function createMatrices(position: ReadonlyVec2, cellType: number) {
  const modelViewMatrix = mat4.create();

  mat4.translate(
    modelViewMatrix,
    modelViewMatrix,
    [position[0] * cellSize - cellSize, position[1] * cellSize - cellSize, -depth],
  );
  mat4.scale(
    modelViewMatrix,
    modelViewMatrix,
    [1/depth, 1/depth, 1/depth],
  );
  const index = position[0] + 3*position[1];
  if (winner === cellType && winningIndices.includes(index)) {
    mat4.scale(
      modelViewMatrix,
      modelViewMatrix,
      [1 + Math.sin(currentTime/100)/25, 1 + Math.sin(currentTime/100)/25, 1 + Math.sin(currentTime/100)/25],
    );
  }

  let normalMatrix = mat4.create();
  mat4.invert(normalMatrix, modelViewMatrix);
  mat4.transpose(normalMatrix, normalMatrix);

  return {
    modelViewMatrix: modelViewMatrix,
    normalMatrix: normalMatrix
  }
}

function loadMatrices(gl: WebGLRenderingContext, programInfo: any, projectionMatrix: mat4, modelViewMatrix: mat4, normalMatrix: mat4) : void {
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix,
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix,
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.normalMatrix,
    false,
    normalMatrix,
  );
}