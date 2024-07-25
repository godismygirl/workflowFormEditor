const deepCopy = (aObject) => {
  if (!aObject) {
    return aObject;
  }

  let v;
  let bObject = Array.isArray(aObject) ? [] : {};
  for (const k in aObject) {
    v = aObject[k];
    bObject[k] = typeof v === 'object' ? deepCopy(v) : v;
  }

  return bObject;
};

export default deepCopy;
