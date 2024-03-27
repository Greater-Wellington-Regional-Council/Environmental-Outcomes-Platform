const LOCAL_HOST_REGEX = /localhost/;
const REVIEW_HOST_REGEX = /.*\.amplifyapp\.com$/;
const DEV_HOST_REGEX = /.*\.gw-eop-dev\.tech$/;
const STAGE_HOST_REGEX = /.*\.gw-eop-stage\.tech$/;
const PROD_HOSTNAME = 'plan-limits.eop.gw.govt.nz';

export const determineBackendUri = (hostname: string = window.location.hostname) => {
  console.log(hostname);
  if (PROD_HOSTNAME === hostname) {
    return 'https://data.eop.gw.govt.nz';
  }

  if (STAGE_HOST_REGEX.test(hostname)) {
    return 'https://data.gw-eop-stage.tech';
  }

  if (DEV_HOST_REGEX.test(hostname) || REVIEW_HOST_REGEX.test(hostname)) {
    return 'https://data.gw-eop-dev.tech';
  }

  if (LOCAL_HOST_REGEX.test(hostname)) {
    return 'http://localhost:8080';
  }

  return 'https://data.gw-eop-dev.tech';
  // return 'http://localhost:8080';
};
