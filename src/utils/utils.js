/*
 *  UUID 函数实现生成唯一标识符
 *  len: 生成的 UUID 长度，默认 16
 *  radix: 生成的 UUID 基数，默认 16
 *  返回值: 生成的 UUID 字符串
 */
export function UUID(len = 16) {
  const chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  const uuid = [];
  const radix = chars.length;
  for (let i = 0; i < len; i++) {
    uuid[i] = chars[Math.floor(Math.random() * radix)];
  }
  return uuid.join("");
}
