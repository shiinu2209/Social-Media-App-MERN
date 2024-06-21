const generateCode = (codeLength) => {
  const number = String(Math.random()).split(".")[1].split("");
  const length = number.length;
  if (!codeLength) {
    codeLength = 4;
  }
  let code = "";
  for (let i = 0; i < codeLength; i++) {
    code = code + number[i];
  }
  return code;
};
module.exports = generateCode;
