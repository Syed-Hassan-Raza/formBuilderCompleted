import fetch from 'isomorphic-fetch';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
  OPTIONS: '',
};

export function post(url, data) {
  return fetch('http://localhost:3000/posts/1', {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    
  }).then(response => response);
}

export function get(url) {
  return fetch(url, {
    method: 'GET',
    headers,
  }).then(response => response.json());
}
