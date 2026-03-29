export type WebGLBuffers = Record<string, WebGLBuffer>;

export function initBuffers(gl: WebGLRenderingContext) {
  const gridArrays = loadGridArrays();

  let positions : number[] = gridArrays.positions;

  const nbGridPoints = positions.length / 3;

  const crossArrays = loadCrossArrays(nbGridPoints);
  const nbCrossPoints = crossArrays.positions.length / 3;

  const circleArrays = loadCircleArrays(nbGridPoints + nbCrossPoints);

  positions = positions.concat(crossArrays.positions);
  positions = positions.concat(circleArrays.positions);
  
  let colors : number[] = gridArrays.colors;
  colors = colors.concat(crossArrays.colors);
  colors = colors.concat(circleArrays.colors);

  let vertexNormals : number[] = gridArrays.normals;
  vertexNormals = vertexNormals.concat(crossArrays.normals);
  vertexNormals = vertexNormals.concat(circleArrays.normals);

  let indices : number[] = gridArrays.indices;
  indices = indices.concat(crossArrays.indices);
  indices = indices.concat(circleArrays.indices);

  const nbGridVertices = gridArrays.indices.length;
  const nbCrossVertices = crossArrays.indices.length; 
  const nbCircleVertices = circleArrays.indices.length; 

  const positionBuffer : WebGLBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const colorBuffer : WebGLBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  const cubeVerticesNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  const buffers : WebGLBuffers = {
  position : positionBuffer,
  color : colorBuffer,
  vertexNormal : cubeVerticesNormalBuffer,
  indices : indexBuffer,
  }
  return {
    buffers: buffers,
    nbGridVertices: nbGridVertices,
    nbCrossVertices: nbCrossVertices,
    nbCircleVertices: nbCircleVertices,
    vertexCount: indices.length
  };
}

function loadGridArrays() {
  let positions : number[] = [];
  let colors : number[] = [];
  let normals : number[] = [];
  let indices : number[] = [];

  const frontPositions : number[] = [ 
    // grid positions
    -0.35, 1.0, 1.0,  -0.31, 1.0, 1.0,  -0.31, -1.0, 1.0,  -0.35, -1.0, 1.0,
    0.31, 1.0, 1.0,  0.35, 1.0, 1.0,  0.35, -1.0, 1.0,  0.31, -1.0, 1.0,
    -1.0, 0.35, 1.0,  1.0, 0.35, 1.0,  1.0, 0.31, 1.0,  -1.0, 0.31, 1.0, 
    -1.0, -0.31, 1.0,  1.0, -0.31, 1.0,  1.0, -0.35, 1.0,  -1.0, -0.35, 1.0,
  ];
  let backPositions : number[] = [];
  let rightPositions : number[] = [];
  let leftPositions : number[] = [];
  let topPositions : number[] = [];
  let bottomPositions : number[] = [];

  for (let i = 0; i < frontPositions.length; i+=3) {
    switch ((i/3)%4) {
      case 0:
        leftPositions.push(frontPositions[i], frontPositions[i+1], 0)
        leftPositions.push(frontPositions[i], frontPositions[i+1], frontPositions[i+2])
        topPositions.push(frontPositions[i], frontPositions[i+1], frontPositions[i+2])
        topPositions.push(frontPositions[i], frontPositions[i+1], 0)
        break;
      case 1:
        rightPositions.push(frontPositions[i], frontPositions[i+1], frontPositions[i+2])
        rightPositions.push(frontPositions[i], frontPositions[i+1], 0)
        topPositions.push(frontPositions[i], frontPositions[i+1], 0)
        topPositions.push(frontPositions[i], frontPositions[i+1], frontPositions[i+2])
        break;
      case 2:
        rightPositions.push(frontPositions[i], frontPositions[i+1], 0)
        rightPositions.push(frontPositions[i], frontPositions[i+1], frontPositions[i+2])
        bottomPositions.push(frontPositions[i], frontPositions[i+1], frontPositions[i+2])
        bottomPositions.push(frontPositions[i], frontPositions[i+1], 0)
        break;
      case 3:
        leftPositions.push(frontPositions[i], frontPositions[i+1], frontPositions[i+2])
        leftPositions.push(frontPositions[i], frontPositions[i+1], 0)
        bottomPositions.push(frontPositions[i], frontPositions[i+1], 0)
        bottomPositions.push(frontPositions[i], frontPositions[i+1], frontPositions[i+2])
        break;
    }
    backPositions.push(frontPositions[i], frontPositions[i+1], 0);

  }
  positions = positions.concat(frontPositions, backPositions, rightPositions, leftPositions, topPositions, bottomPositions);
  
  const nbPoints = positions.length / 3;

  for (let i = 0; i < nbPoints; i++) { 
    colors.push(0.6, 0.6, 0.6, 1.0);
  }

  for (let i = 0; i < frontPositions.length/3; i++) {
    normals.push(0.0, 0.0, 1.0);
  }
  for (let i = 0; i < backPositions.length/3; i++) {
    normals.push(0.0, 0.0, -1.0);
  }
  for (let i = 0; i < rightPositions.length/3; i++) {
    normals.push(1.0, 0.0, 0.0);
  }
  for (let i = 0; i < leftPositions.length/3; i++) {
    normals.push(-1.0, 0.0, 0.0);
  }
  for (let i = 0; i < topPositions.length/3; i++) {
    normals.push(0.0, 1.0, 0.0);
  }
  for (let i = 0; i < bottomPositions.length/3; i++) {
    normals.push(0.0, -1.0, 0.0);
  }

  const frontIndices = [
    0, 1, 2,  0, 2, 3,
    4, 5, 6,  4, 6, 7,
    8, 9, 10,  8, 10, 11,
    12, 13, 14, 12, 14, 15
  ];

  indices = indices.concat(frontIndices);

  let offset = 16;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < frontIndices.length; j++) {
      indices.push(frontIndices[j] + offset);
    }
    offset += 16
  }

  return {
    positions,
    colors,
    normals,
    indices
  }
}

function loadCrossArrays(offset: number) {
  let positions : number[] = [];
  let backPositions : number[] = [];
  let colors : number[] = [];
  let normals : number[] = [];
  let indices : number[] = [];

  positions = [
    0.0, 0.3, 1.0,  0.7, 1.0, 1.0,  1.0, 0.7, 1.0,  
    0.3, 0.0, 1.0,  1.0, -0.7, 1.0,  0.7, -1.0, 1.0,
    0.0, -0.3, 1.0, -0.7, -1.0, 1.0,  -1.0, -0.7, 1.0,
    -0.3, 0.0, 1.0,  -1.0, 0.7, 1.0,  -0.7, 1.0, 1.0,
  ];
  backPositions = [
    0.0, 0.3, 0.5,  0.7, 1.0, 0.5,  1.0, 0.7, 0.5,  
    0.3, 0.0, 0.5,  1.0, -0.7, 0.5,  0.7, -1.0, 0.5,
    0.0, -0.3, 0.5, -0.7, -1.0, 0.5,  -1.0, -0.7, 0.5,
    -0.3, 0.0, 0.5,  -1.0, 0.7, 0.5,  -0.7, 1.0, 0.5
  ];
  let exteriorPositions : number[] = [];

  exteriorPositions.push(positions[0], positions[1], positions[2]);
  exteriorPositions.push(backPositions[0], backPositions[1], backPositions[2]);
  for (let i = 3; i < positions.length; i+=3) {
    exteriorPositions.push(positions[i], positions[i+1], positions[i+2]);
    exteriorPositions.push(backPositions[i], backPositions[i+1], backPositions[i+2]);
    exteriorPositions.push(positions[i], positions[i+1], positions[i+2]);
    exteriorPositions.push(backPositions[i], backPositions[i+1], backPositions[i+2]);
  }
  exteriorPositions.push(positions[0], positions[1], positions[2]);
  exteriorPositions.push(backPositions[0], backPositions[1], backPositions[2]);

  positions = positions.concat(backPositions, exteriorPositions);

  const nbCrossPoints = positions.length/3;
  
  for (let i = 0; i < nbCrossPoints; i++) { 
    colors.push(1.0, 0.1, 0.1, 1.0);
  }
  
  for (let i = 0; i < backPositions.length/3; i++) {
    normals.push(0.0, 0.0, 1.0);
  }
  for (let i = 0; i < backPositions.length/3; i++) {
    normals.push(0.0, 0.0, -1.0);
  }
  const exteriorNormals : number[][] = [
    [-1.0, 1.0, 0.0], [1.0, 1.0, 0.0], [1.0, -1.0, 0.0], 
    [1.0, 1.0, 0.0], [1.0, -1.0, 0.0], [-1.0, -1.0, 0.0],
    [1.0, -1.0, 0.0], [-1.0, -1.0, 0.0], [-1.0, 1.0, 0.0],
    [-1.0, -1.0, 0.0], [-1.0, 1.0, 0.0], [1.0, 1.0, 0.0]
  ]
  for (let normal of exteriorNormals) {
    for (let j = 0; j < 4; j++) {
      normals.push(...normal);
    }
  }

  const backOffset = offset + backPositions.length/3;
  const exteriorOffset = offset + 2*backPositions.length/3
  
  for (let i = 0; i < backPositions.length/3; i++) {
    if (i%3 == 0) {
      const i_last = (i+3)%(backPositions.length/3);
      indices.push(i + offset, i+1 + offset, i+2 + offset);
      indices.push(i + offset, i+2 + offset, i_last + offset);

      indices.push(i + backOffset, i+1 + backOffset, i+2 + backOffset);
      indices.push(i + backOffset, i+2 + backOffset, i_last + backOffset);
    }

    const j = 4*i;
    indices.push(j + exteriorOffset, j+1 + exteriorOffset, j+2 + exteriorOffset);
    indices.push(j+1 + exteriorOffset, j+2 + exteriorOffset, j+3 + exteriorOffset);
  }
  indices.push(offset, 3 + offset, 6 + offset);
  indices.push(offset, 6 + offset, 9 + offset);

  indices.push(backOffset, 3 + backOffset, 6 + backOffset);
  indices.push(backOffset, 6 + backOffset, 9 + backOffset);

  return {
    positions,
    colors,
    normals,
    indices
  };
}

function loadCircleArrays(offset: number) {
  let positions : number[] = [];
  let backPositions : number[] = [];
  let interiorPositions : number[] = [];
  let exteriorPositions : number[] = [];
  let colors : number[] = [];
  let normals : number[] = [];
  let indices : number[] = [];
  
  const nbPointsPerCircle = 40;
  const bigRadius = 1.0;
  const smallRadius = 0.7;
  for (let i = 0; i < nbPointsPerCircle; i++) { 
    const angle = (i / nbPointsPerCircle) * 2.0 * Math.PI;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const bigx = cos * bigRadius;
    const bigy = sin * bigRadius;
    const midx = cos * (bigRadius + smallRadius)/2;
    const midy = sin * (bigRadius + smallRadius)/2;
    const smallx = cos * smallRadius;
    const smally = sin * smallRadius;

    positions.push(midx, midy, 1.0);
    backPositions.push(midx, midy, 0.5);
    interiorPositions.push(smallx, smally, 0.75);
    exteriorPositions.push(bigx, bigy, 0.75);
  }

  positions = positions.concat(backPositions, interiorPositions, exteriorPositions);
  
  const nbCirclePoints = positions.length;
  
  for (let i = 0; i < nbCirclePoints; i++) { 
    colors.push(0.1, 1.0, 0.1, 1.0);
  }
  
  for (let i = 0; i < nbPointsPerCircle; i++) {
    normals.push(0.0, 0.0, 1.0);
  }
  for (let i = 0; i < nbPointsPerCircle; i++) {
    normals.push(0.0, 0.0, -1.0);
  }
  for (let i = 0; i < nbPointsPerCircle; i++) {
    const angle = (i / nbPointsPerCircle) * 2.0 * Math.PI;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    normals.push(-cos, -sin, 0.0);
  }
  for (let i = 0; i < nbPointsPerCircle; i++) {
    const angle = (i / nbPointsPerCircle) * 2.0 * Math.PI;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    normals.push(cos, sin, 0.0);
  }

  const backOffset = offset + nbPointsPerCircle;
  const interiorOffset = offset + nbPointsPerCircle*2;
  const exteriorOffset = offset + nbPointsPerCircle*3;

  for (let i = 0; i < nbPointsPerCircle; i++) {
    const i_next = (i+1)%nbPointsPerCircle;
    indices.push(i + offset, i + exteriorOffset, i_next + exteriorOffset);
    indices.push(i + offset, i_next + exteriorOffset, i_next + offset);
    
    indices.push(i + exteriorOffset, i + backOffset, i_next + backOffset);
    indices.push(i + exteriorOffset, i_next + backOffset, i_next + exteriorOffset);
    
    indices.push(i + backOffset, i + interiorOffset, i_next + interiorOffset);
    indices.push(i + backOffset, i_next + interiorOffset, i_next + backOffset);
    
    indices.push(i + interiorOffset, i + offset, i_next + offset);
    indices.push(i + interiorOffset, i_next + offset, i_next + interiorOffset);
  }

  return {
    positions,
    colors,
    normals,
    indices
  };
}