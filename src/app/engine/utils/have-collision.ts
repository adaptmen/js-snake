

export function haveCollision(path1: [number, number][], path2: [number, number][]): boolean {
  return path1.some(p1 => !!path2.find(p2 => p1[0] === p2[0] && p1[1] === p2[1]));
}

export function haveCollisionInPath(path: [number, number][]): boolean {
  let haveCollision = false;
  for (let i = 0; i < path.length; i++) {
    haveCollision = path.slice(i + 1, path.length).some(part1 => part1[0] === path[i][0] && part1[1] === path[i][1]);
    if (haveCollision) {
      break;
    }
  }
  return haveCollision;
}