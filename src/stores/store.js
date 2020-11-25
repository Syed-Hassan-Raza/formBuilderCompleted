import Store from "beedle";
import { get, post } from "./requests";
import ID from "../UUID";

let _saveUrl;
let _onPost;
let _onLoad;
let token =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6IjNkYjNiN2U4OTA3OWY1ZTkxN2RlMWRjMmUwNGMyOGMwIiwidHlwIjoiSldUIn0.eyJuYmYiOjE2MDYyOTcwODYsImV4cCI6MTYwNjMwMDY4NiwiaXNzIjoiaHR0cHM6Ly9pZC53b3JrYXdhcmUuY29tIiwiYXVkIjoiaHR0cHM6Ly9pZC53b3JrYXdhcmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjJBM0JBMDExRDQ1NzUzRTc3REZCRTg2NjgxQkFBQzZCMjU3REJDODciLCJzdWIiOiI4YmI4Nzc3MC1mZTZkLTQzMGYtYTRlMi0zNzcwMjQ4OTk0NjgiLCJhdXRoX3RpbWUiOjE2MDYyOTY4NDYsImlkcCI6ImxvY2FsIiwidXNlcl9pZCI6IjE3NzQwIiwiY29tcGFueV9pZCI6IjEiLCJ1c2VyX25hbWUiOiJzYWpqYWRAZGVtbyIsIm1vYmlsZV9hcHBfdG9rZW4iOiIiLCJjbGllbnRfdHlwZV9pZCI6IjE3IiwicmVnaW9uX2lkIjoiMCIsInR3b19mYWN0b3JfYXV0aCI6Ik5vbmUiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwib2ZmbGluZV9hY2Nlc3MiXSwiYW1yIjpbInB3ZCJdfQ.N8omeKwpTjZsghxRk6oHP1-iWIicX7ho_1w2F3r3sPqj4FOARnn0DVxkTdrcWp6PKaFq4p3M1hiONTRo0OwaHwJazNy3jZ5ywAPPs8fwN_CTA7fSuaKIVGt6f1lBACzpPUc8aPPqnFau2ZExZzIp63kSs_zk6Vb8k9OmmXXnQ0AsstjvYHrmbf3B-25trZ15VvNqYKH12tjGG0PEfx-wgup_2ZxH3V1rqywh3aY455sPdTATLIqAsHKDO21P33ESZNp2lubIDezCUxIW901b2yfkgUCMWBtw204vUN1m-ggHVUb5l8R7DBYkvUX1NQhzYNXEgBrNmMWpp4J6Oi6NVw";
let headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
  "OData-Version": "4.0",
  "OData-MaxVersion": "4.0",
  "ZUMO-API-VERSION": "2.0.0",
  Prefer: "return=representation",
};
const store = new Store({
  actions: {
    setData(context, data, saveData) {
      context.commit("setData", data);
      if (saveData) this.save(data);
    },

    load(context, { loadUrl, saveUrl, data }) {
      _saveUrl = saveUrl;
      if (_onLoad) {
        _onLoad().then((x) => {
          this.assignIds(x);
          this.setData(context, x);
        });
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

    assignIds(data) {
      data.Fields.forEach((item) => {
        item.id = ID.uuid();
      });

      if (data.FieldGroups && data.FieldGroups.length > 0) {
        data.FieldGroups.forEach((item) => {
          item.id = ID.uuid();
          this.assignIds(item);
        });
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
      //console.log(data);
    },

    createTypeDetails(element) {
      if (element.Type === 15) {
        element.TypeDetail = JSON.stringify({ data: element.TypeDetail });
      } else if (element.Type === 12 || element.Type === 5) {
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

  getPicklists() {
    // read all entities
   return fetch("https://api-staging.workaware.com/api/v2/picklists", {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((response) => {
        // this.setState({
        //   friends: response
        // })
        alert('ff')

        console.log(response);
        return response;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
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
