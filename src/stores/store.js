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
      //     if (!item.FieldsGroup){
      //       item.FieldsGroup = [];
      //     }

      //     if (!item.FieldsGroup.some(i => i.id == element.item.id)){
      //       item.FieldsGroup = item.FieldsGroup.concat([element.item]);
      //     }
      //   }
      // });
      this.addItem(data, element);
      this.setData(context, data, true);
      console.log(data);
    },

    addItem(data, element) {
      data.forEach((item, index, object) => {
        if (item.id === element.parentId) {
          if (!item.FieldsGroup)
            item.FieldsGroup = [];

            item.FieldsGroup.push(element.item);
          return;
        }

        if (item.FieldsGroup) {
          this.addItem(item.FieldsGroup, element);
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

        if (item.FieldsGroup) {
          this.removeItem(item.FieldsGroup, element);
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
    svaveChanges(context, newData) {
      const { data } = context.state;

      const r = this.findObjectById(data, newData, "fetch");
      // r.FieldsGroup.push(newData);
      this.setData(context, r, false);
      console.log(data);
    },

    findObjectById(root, newData, action) {
      debugger;
      if (root) {
        for (var k in root) {
          if (root[k].id == newData.parentId) {
            if (action == "fetch") {
              if (root[k].FieldsGroup == null) {
                root[k].FieldsGroup = [];
              }
              root[k].FieldsGroup.push(newData.item);
              return root;
            } else {
              delete root.FieldsGroup[k];
            }
          } else if (root[k].FieldsGroup) {
            return this.findObjectById(root[k].FieldsGroup, newData,'fetch');
          }
        }
        //return root;
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
