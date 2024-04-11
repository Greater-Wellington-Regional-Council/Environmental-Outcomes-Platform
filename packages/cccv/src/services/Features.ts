const features = {
  "showFMUAsPopup": false,
}

const service = {
  on: (featureName: string) => _.get(features, featureName, false)
}

export default service;
