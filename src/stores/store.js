import Store from 'beedle';
import { get, post } from './requests';

let _saveUrl;
let _onPost;
let _onLoad;

const store = new Store({
  actions: {
    setData(context, data, saveData) {
      context.commit('setData', data);
      if (saveData) this.save(data);
    },

    load(context, { loadUrl, saveUrl, data }) {
      _saveUrl = saveUrl;
      if (_onLoad) {
        _onLoad().then(x => this.setData(context, x));
      } else if (loadUrl) {
        get(loadUrl).then(x => {
          if (data && data.length > 0 && x.length === 0) {
            data.forEach(y => x.push(y));
          }
          this.setData(context, x);
        });
      } else {
        this.setData(context, data);
      }
    },

    create(context, element) {
      const { data } = context.state;
      data.push(element);
      this.setData(context, data, true);
    },

    createChild(context, element) {
      const { data } = context.state;

      // data.forEach((item) => {
      //   if (item.id == element.parentId) {
      //     if (!item.childs){
      //       item.childs = [];
      //     }

      //     if (!item.childs.some(i => i.id == element.item.id)){
      //       item.childs = item.childs.concat([element.item]);
      //     }
      //   }
      // });
      this.addItem(data, element);
      this.setData(context, data, true);
    },

    addItem(data, element) {
      data.forEach((item, index, object) => {
        if (item.id === element.parentId) {
          if (!item.childs)
            item.childs = [];

            item.childs.push(element.item);
          return;
        }

        if (item.childs) {
          this.addItem(item.childs, element);
        }
      });
    },

    delete(context, element) {
      const { data } = context.state;
      //data.splice(data.indexOf(element), 1);
      this.removeItem(data, element);
      this.setData(context, data, true);
    },

    removeItem(data, element) {
      data.forEach((item, index, object) => {
        if (item.id === element.id) {
          object.splice(index, 1);
          return;
        }

        if (item.childs) {
          this.removeItem(item.childs, element);
        }
      });
    },

    updateOrder(context, elements) {
      this.setData(context, elements, true);
    },

    save(data) {
      document.execCommand(data);
      if (_onPost) {
        _onPost({ task_data: data });
      } else if (_saveUrl) {
        post(_saveUrl, { task_data: data });
      }
    },
  },

  mutations: {
    setData(state, payload) {
      // eslint-disable-next-line no-param-reassign
      state.data = payload;
      return state;
    },
  },

  initialState: {
    data: [],
  },
});

store.setExternalHandler = (onLoad, onPost) => {
  _onLoad = onLoad;
  _onPost = onPost;
};

export default store;
