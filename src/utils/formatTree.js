export const transformToTreeFormat = (sNodes, setting) => {
  let i,
    l,
    key = (setting && setting.idKey) || 'id',
    parentKey = (setting && setting.parentKey) || 'pid',
    childKey = (setting && setting.childKey) || 'children';
  if (!key || key == '' || !sNodes) return [];

  var r = [];
  var tmpMap = {};
  for (i = 0, l = sNodes.length; i < l; i++) {
    tmpMap[sNodes[i][key]] = sNodes[i];
  }
  for (i = 0, l = sNodes.length; i < l; i++) {
    if (
      tmpMap[sNodes[i][parentKey]] &&
      sNodes[i][key] != sNodes[i][parentKey]
    ) {
      if (!tmpMap[sNodes[i][parentKey]][childKey])
        tmpMap[sNodes[i][parentKey]][childKey] = [];
      tmpMap[sNodes[i][parentKey]][childKey].push(sNodes[i]);
    } else {
      r.push(sNodes[i]);
    }
  }
  return r;
};

export const flattenTreeFormat = (treeData) => {
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
