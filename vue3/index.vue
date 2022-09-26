<template><HOC /></template>
<script setup lang="tsx">
import { compose, usePromiseFetch, WithLog } from './utils';
import View from './View.vue';

const params = { id: 10 };

const request = (params = {}) => {
  // mock the fetch
  // parmas is the params of the request
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ name: 'ssh' });
    }, 1000);
  });
};

// const HOC = usePromiseFetch(View, request, params);
// const HOC = WithLog(usePromiseFetch(View, request, params));
const composed = compose(usePromiseFetch(request), WithLog);
const HOC = composed(View);
</script>
