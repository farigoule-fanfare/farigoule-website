const actualMul = jest.requireActual('multer');

function mockedMul(options = {}) {
  const normalized = { ...options, storage: actualMul.memoryStorage() };
  return actualMul(normalized);
}

Object.assign(mockedMul, actualMul);

module.exports = mockedMul;
