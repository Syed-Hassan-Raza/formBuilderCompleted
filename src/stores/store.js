import Store from "beedle";
import { get, post } from "./requests";

let _saveUrl;
let _onPost;
let _onLoad;

const store = new Store({
  actions: {
    setData(context, data, saveData) {
      debugger
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
      debugger
      const { data } = context.state;

      if (element.parentId) {
        this.addChild(data.FieldGroups, element);
      }
      else {
        if (element.element == 'FieldGroups') {
          data.FieldGroups.push(element);
        }
        else {
          data.Fields.push(element);
        }
      }

      this.setData(context, data, false);
      this.saveTemplateOptions(context, element);
      console.log(data)
    },

    saveTemplateOptions(context, newData) {
     
      const { data } = context.state;
      if (!data.TemplateOptions) {
        data.TemplateOptions = [];
      }
      if (newData.options) {
        data.TemplateOptions[newData.TypeDetail] = newData.options;
        this.setData(context, data, false);
      }
    },

    createChild(context, element) {
      const { data } = context.state;
     
      // data.forEach((item) => {
      //   if (item.id == element.parentId) {
      //     if (!item.FieldGroups){
      //       item.FieldGroups = [];
      //     }

      //     if (!item.FieldGroups.some(i => i.id == element.item.id)){
      //       item.FieldGroups = item.FieldGroups.concat([element.item]);
      //     }
      //   }
      // });
      this.addItem(data, element);
      this.setData(context, data, true);
      this.saveTemplateOptions(context, element.item);
    },

    addChild(data, element) {
      data.forEach((item, index, object) => {

        if (item.id === element.parentId) {

          if (!item.Fields)
           item.Fields= [];
          
          if (!item.FieldGroups)
           item.FieldGroups= [];
          
          if (element.item.element == 'FieldGroups')
            item.FieldGroups.push(element.item);
          else
            item.Fields.push(element.item);

          return;
        }

        if (item.FieldGroups) {
          this.addChild(item.FieldGroups, element);
        }
      });
    },
    mapData(context){
      const { data } = context.state;
      this.doMap(data);
    },
    
    doMap(data){
      let r=[];
      data.forEach((item, index, object) => {
        if (item.FieldGroups) {
         let i=item.FieldGroups.filter(v=>v.element==='TextInput');
         item.Fields=i;
         delete item.FieldGroups['TextInput'];
    
         return this.doMap(item.FieldGroups);
        }
        else{
          return
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

      if (!removed)
        this.removeItem(data.FieldGroups, element);
        
      this.setData(context, data, true);
    },
    removeItem(data, element) {

      let removed = false;
      data.forEach((pItem, pIndex, pObject) => {

        if (element.element == 'FieldGroups') {
          if (pItem.id == element.id) {
            data.splice(pIndex, 1);
            return;
          }
        }
        else {
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

    findObjectById(root, newData, action) {
      if (root) {
        for (var k in root) {
          if (root[k].id == newData.parentId) {
            if (action == "fetch") {
              if (root[k].FieldGroups == null) {
                root[k].FieldGroups = [];
              }
              root[k].FieldGroups.push(newData.item);
              return root;
            } else {
              delete root.FieldGroups[k];
            }
          } else if (root[k].FieldGroups) {
            return this.findObjectById(root[k].FieldGroups, newData, "fetch");
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
    data: {
      id: 5015,
      NameField: "Label",
      GlobalActions: [],
      AfterEachSaveActions: [],
      AfterFirstSaveActions: [],
      Name: "Fillable Fields with Assignee Items",
      Label: "",
      Type: null,
      Fields: [],
      FieldGroups: []
    }
  },
});

store.setExternalHandler = (onLoad, onPost) => {
  _onLoad = onLoad;
  _onPost = onPost;
};

export default store;
