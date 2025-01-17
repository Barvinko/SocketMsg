export function objectEqual<T>(obj1: T, obj2: T): boolean {
  const jsonString1 = JSON.stringify(obj1);
  const jsonString2 = JSON.stringify(obj2);
  return jsonString1 === jsonString2;
}
