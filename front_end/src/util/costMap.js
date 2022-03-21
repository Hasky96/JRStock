export default function costMap(num) {
  if (num.length < 5) {
    return num;
  }
  let result = "";
  const unit = ["", "만", "억", "조", "경"];
  let size = parseInt(num.length / 4);
  let rem = num.length % 4;
  if (rem === 0) {
    size -= 1;
    rem = 4;
  }
  result += num.substr(0, rem) + unit[size] + " ";
  let flag = true;
  for (let i = rem; i < rem + 4; i++) {
    if (num[i] === "0" && flag) {
      continue;
    }
    result += num[i];
    flag = false;
  }
  if (!flag) {
    result += unit[size - 1];
  }
  return result;
}
