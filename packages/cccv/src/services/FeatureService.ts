const featureService = {
  "showFMUAsPopup": false,
}

const service = {
  on: (featureName: string) => _.get(featureService, featureName, false)
}

export default service;
