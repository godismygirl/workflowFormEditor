const treeToFlat = (treeData) => {
  let result = [];

  function flatLoop(data, depth) {
    data.map((el) => {
      let after = { ...el, depth: depth };
      delete after.children;
      result.push(after);
      if (el.children) {
        flatLoop(el.children, depth + 1);
        //delete el.children;
      }
    });
  }

  flatLoop(treeData, 0);
  return result;
};

export default treeToFlat;
