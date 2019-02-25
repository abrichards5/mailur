export function call(method, url, data, headers = null) {
  let params = {
    method: method,
    credentials: 'same-origin'
  };
  if (headers) {
    params.headers = headers;
    params.body = data;
  } else if (method == 'post') {
    params.headers = { 'Content-Type': 'application/json' };
    params.body = data && JSON.stringify(data);
  }
  return fetch(url, params).then(response => {
    let res;
    if (response.headers.get('Content-Type') != 'application/json') {
      res = response.text();
    } else {
      res = response.json();
    }
    return res.then(res => {
      if (!response.ok && !res.errors) {
        return { errors: [`${response.status} ${response.statusText}`] };
      }
      return res;
    });
  });
}

export function trancate(value, max = 15, simbol = '…') {
  max = max || 15;
  if (value.length > max) {
    value = value.slice(0, max - 1) + simbol;
  }
  return value;
}

export function contains(one, two) {
  return one.toLowerCase().indexOf(two.toLowerCase()) != -1;
}
