import { reactive, onMounted, unref, defineComponent, watch } from 'vue';
/**
 * HOC Component transform function
 * @param {(params: any) => Promise<any>} promiseFn
 * @param {Object} params
 */
const usePromiseFetch = (
  promiseFn: (params: any) => Promise<any>,
  params = {},
) => {
  const obj = reactive<{ result: null | {}; error: boolean; loading: boolean }>(
    {
      result: null,
      error: false,
      loading: false,
    },
  );

  const fetchRequest = async params => {
    obj.loading = true;
    const result = await promiseFn(params).finally(() => {
      obj.loading = false;
    });
    obj.result = result;
  };

  /**
   * @param {JSX.IntrinsicElements | any} Wrapped
   */
  return function wrap(Wrapped: JSX.IntrinsicElements | any) {
    onMounted(() => fetchRequest(params));
    watch(params, newVal => fetchRequest(newVal), { immediate: true });

    const NewWrapped = defineComponent<InstanceType<typeof Wrapped>>({
      setup(props, ctx) {
        return {
          slots: ctx.slots,
          attrs: ctx.attrs,
          props,
          this: this,
        };
      },
      render() {
        if (obj.loading) return <span>loading...</span>;
        if (obj.error) return <span>error...</span>;
        return (
          <Wrapped
            slots={this.slots}
            attrs={this.attrs}
            props={this.props}
            loading={unref(obj.loading)}
            result={unref(obj.result)}
          />
        );
      },
    });
    return NewWrapped;
  };
};

function compose(...funcs: Function[]) {
  if (funcs.length === 0) {
    return <T extends any>(arg: T) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args: any) => a(b(...args)));
}

function normalizeProps(vm) {
  return {
    on: vm.$listeners,
    attr: vm.$attrs,
    scopedSlots: vm.$scopedSlots,
  };
}

const WithLog = (Wrapped: JSX.IntrinsicElements | any) => {
  return defineComponent({
    mounted() {
      console.log('log');
    },
    render() {
      const props = normalizeProps(this);
      return <Wrapped {...props} />;
    },
  });
};

export { usePromiseFetch, compose, WithLog };