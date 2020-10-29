import Store from "beedle";
import { get, post } from "./requests";

let _saveUrl;
let _onPost;
let _onLoad;

const store = new Store({
  actions: {
    setData(context, data, saveData) {
      context.commit("setData", data);
      if (saveData) this.save(data);
    },

    load(context, { loadUrl, saveUrl, data }) {
      _saveUrl = saveUrl;
      if (_onLoad) {
        _onLoad().then((x) => this.setData(context, x));
      } else if (loadUrl) {
        get(loadUrl).then((x) => {
          if (data && data.length > 0 && x.length === 0) {
            data.forEach((y) => x.push(y));
          }
          this.setData(context, x);
        });
      } else {
        this.setData(context, data);
      }
    },

    create(context, element) {
      const { data } = context.state;
      

      if (element.parentId) {
        this.createTypeDetails(element.item);
        this.addChild(data.FieldGroups, element);
      } else {
        if (element.element == "FieldGroups") {
          this.createTypeDetails(element);
          data.FieldGroups.push(element);
        } else {
          this.createTypeDetails(element);
          data.Fields.push(element);
        }
      }

      this.setData(context, data, true);
    // console.log(data)
    },

    createTypeDetails(element) {
      if (element.Type===15)
      {
      element.TypeDetail = JSON.stringify({data:element.TypeDetail});   
      } 
      else if(element.Type===12){
      element.TypeDetail = JSON.stringify(element.TypeDetail); 
      } 
    },

    createChild(context, element) {
      const { data } = context.state;

      this.addItem(data, element);
      this.setData(context, data, true);
      this.saveTemplateOptions(context, element.item);
    },

    addChild(data, element) {
      data.forEach((item, index, object) => {
        if (item.id === element.parentId) {
          if (!item.Fields) item.Fields = [];

          if (!item.FieldGroups) item.FieldGroups = [];

          if (element.item.element == "FieldGroups")
            item.FieldGroups.push(element.item);
          else item.Fields.push(element.item);

          return;
        }

        if (item.FieldGroups) {
          this.addChild(item.FieldGroups, element);
        }
      });
    },

    delete(context, element) {
      const { data } = context.state;
      let removed = false;
      data.Fields.forEach((item, index, object) => {
        if (item.id == element.id) {
          data.Fields.splice(index, 1);
          removed = true;
          return;
        }
      });

      if (!removed) this.removeItem(data.FieldGroups, element);

      this.setData(context, data, true);
    },
    removeItem(data, element) {
      let removed = false;
      data.forEach((pItem, pIndex, pObject) => {
        if (element.element == "FieldGroups") {
          if (pItem.id == element.id) {
            data.splice(pIndex, 1);
            return;
          }
        } else {
          if (pItem.Fields) {
            pItem.Fields.forEach((cItem, cIndex, cObject) => {
              if (cItem.id === element.id) {
                pItem.Fields.splice(cIndex, 1);
                removed = true;
                return;
              }
            });
          }
        }

        if (!removed && pItem.FieldGroups && pItem.FieldGroups.length >= 0)
          this.removeItem(pItem.FieldGroups, element);
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
      // r.FieldGroups.push(newData);
      this.setData(context, r, false);
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
    data: {
      id: null,
      NameField: null,
      GlobalActions: [],
      AfterEachSaveActions: [],
      AfterFirstSaveActions: [],
      Name: null,
      Label: null,
      Type: null,
      Fields: [],
      FieldGroups: [],
      TemplateOptions: [],
      CompanyForm: [],
    },
  },
});

store.setExternalHandler = (onLoad, onPost) => {
  _onLoad = onLoad;
  _onPost = onPost;
};

export default store;
