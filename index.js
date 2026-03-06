/**
 * 生成密码函数
 * @param {string} str - 必须包含的原始字符串
 * @param {number} length - 输出的密码长度
 * @param {boolean} shuffle - 是否允许对原始字符串乱序
 * @param {boolean} allowSeparator - 是否允许在原始字符串字符间插入额外字符
 * @returns {string} 生成的密码字符串
 * @throws {Error} 如果密码长度小于原始字符串长度，抛出错误
 */
function generatePassword(
  str,
  length,
  shuffle = false,
  allowSeparator = false
) {
  // 类型与边界检查
  if (typeof str !== "string") {
    throw new Error("第一个参数必须是字符串");
  }
  if (typeof length !== "number" || length < str.length) {
    throw new Error(`密码长度必须至少为原始字符串长度 (${str.length})`);
  }

  // 1. 处理乱序：如果允许乱序，则将字符串打散成数组并随机排序
  let baseChars = str.split("");
  if (shuffle) {
    // Fisher-Yates 洗牌算法打乱顺序
    for (let i = baseChars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [baseChars[i], baseChars[j]] = [baseChars[j], baseChars[i]];
    }
  }

  // 2. 确定额外需要填充的字符数
  const fillCount = length - str.length;

  // 3. 生成随机填充字符池（可打印ASCII字符范围 33-126，避开容易混淆的字符如空格、引号等，可根据需要调整）
  const generateRandomChar = () => {
    // 使用更通用的可打印字符范围: 数字、大小写字母、常见符号
    const printableChars =
      "!@#$%^&*()_+=-[]{}|;:,.<>?0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return printableChars[Math.floor(Math.random() * printableChars.length)];
  };

  // 4. 根据是否允许分隔来构建最终密码
  if (!allowSeparator) {
    // 不允许分隔：原始字符串必须连续出现
    // 随机决定原始字符串的起始位置 (0 到 fillCount)
    const startPos = Math.floor(Math.random() * (fillCount + 1));
    const result = [];

    // 先填充 startPos 个随机字符
    for (let i = 0; i < startPos; i++) {
      result.push(generateRandomChar());
    }
    // 放入原始字符串（可能是乱序后的）
    result.push(...baseChars);
    // 填充剩余字符
    for (let i = result.length; i < length; i++) {
      result.push(generateRandomChar());
    }
    return result.join("");
  } else {
    // 允许分隔：将原始字符串的字符分散插入，之间可以插入任意数量随机字符
    // 思路：在 n 个字符之间有 n+1 个空隙（包括首尾），向这些空隙中随机分配填充字符
    const n = baseChars.length;
    // 生成一个长度为 n+1 的数组，每个元素代表该位置前要插入的随机字符数
    const gaps = new Array(n + 1).fill(0);
    let remaining = fillCount;

    // 随机分配剩余填充字符到各个空隙
    for (let i = 0; i < remaining; i++) {
      // 随机选择一个空隙
      const gapIndex = Math.floor(Math.random() * (n + 1));
      gaps[gapIndex]++;
    }

    // 按顺序构建：先放 gaps[0] 个随机字符，然后放 baseChars[0]，再放 gaps[1] 个随机字符，然后 baseChars[1]... 最后放 gaps[n] 个随机字符
    const result = [];
    for (let i = 0; i < n; i++) {
      // 插入当前空隙的随机字符
      for (let j = 0; j < gaps[i]; j++) {
        result.push(generateRandomChar());
      }
      // 插入原始字符
      result.push(baseChars[i]);
    }
    // 处理最后一个空隙
    for (let j = 0; j < gaps[n]; j++) {
      result.push(generateRandomChar());
    }
    return result.join("");
  }
}

// 示例与测试
console.log("--- 测试用例 ---");

// 基础示例
console.log(
  "1. 不允许乱序，不允许分隔：",
  generatePassword("abc", 8, false, false)
);
// 可能输出: "12abc345" (abc连续出现)

console.log(
  "2. 允许乱序，不允许分隔：",
  generatePassword("abc", 8, true, false)
);
// 可能输出: "56bca789" (乱序后连续出现)

console.log(
  "3. 不允许乱序，允许分隔：",
  generatePassword("abc", 8, false, true)
);
// 可能输出: "1a2b3c45" (字符间插入了随机字符)

console.log("4. 允许乱序，允许分隔：", generatePassword("abc", 8, true, true));
// 可能输出: "b@1c9a34" (字符乱序且分散)

// 边界情况：长度等于原始字符串长度
console.log(
  "5. 长度等于原串，不允许分隔：",
  generatePassword("xyz", 3, false, false)
); // 必须输出 "xyz" 或乱序
console.log(
  "6. 长度等于原串，允许分隔：",
  generatePassword("xyz", 3, false, true)
); // 因为没有填充字符，所以还是 "xyz"

// 错误示例
try {
  generatePassword("test", 2);
} catch (e) {
  console.log("7. 错误捕获:", e.message);
}
