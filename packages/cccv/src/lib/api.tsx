const LOCAL_HOST_REGEX = /localhost/;
const REVIEW_HOST_REGEX = /.*\.amplifyapp\.com$/;
const DEV_HOST_REGEX = /.*\.gw-eop-dev\.tech$/;
const STAGE_HOST_REGEX = /.*\.gw-eop-stage\.tech$/;
const PROD_HOSTNAME = 'plan-limits.eop.gw.govt.nz';

export const determineBackendUri = (hostname: string = window.location.hostname) => {
  if (PROD_HOSTNAME === hostname)
    return 'https://data.eop.gw.govt.nz';

  if (STAGE_HOST_REGEX.test(hostname))
    return 'https://data.gw-eop-stage.tech';

  if (DEV_HOST_REGEX.test(hostname) || REVIEW_HOST_REGEX.test(hostname))
    return 'https://data.gw-eop-dev.tech';

  if (LOCAL_HOST_REGEX.test(hostname))
    return 'http://localhost:8080'

  return 'https://data.gw-eop-dev.tech';
};

export const get = async (url: string) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000); // Set timeout to 5 seconds

  const res = await fetch(url, {signal: controller.signal});

  clearTimeout(timeoutId);

  if (!res.ok) {
    console.log(res)
    return null
  }

  return await res.json();
}
