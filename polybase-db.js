import {
  Element as PolymerElement,
} from '@polymer/polymer/polymer-element';
import * as firebase from 'firebase';
import config from '@/config';

let fbConnection;

export default class PolybaseDB extends PolymerElement {
  constructor() {
    super();
  }

  static get properties() {
    return {
      data: {
        type: Object,
        notify: true,
        value: () => [],
      },
      endpoint: {
        type: String,
        value: '/',
      },
      lastUpdate: Object,
      fbHandler: Object,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.connect();
  }

  connect() {
    if (!fbConnection) {
      fbConnection = firebase.initializeApp(config).database();
    }
    this.fbHandler = fbConnection;
    this.fbHandler.ref(this.endpoint).on('value', this.dataIncoming.bind(this));
  }

  dataIncoming(snapshot) {
    this.set('data', snapshot.val());
    this.set('lastUpdate', new Date());
  }

  get() {
    return this.data;
  }

  toArray() {
    return Object.keys(this.data).map(key => Object.assign({}, { id: key }, this.data[key])) || [];
  }

  add(objPushed) {
    const newKey = this.fbHandler.ref(this.endpoint).push().key;
    const updates = {};
    updates[`${this.endpoint}${newKey}`] = objPushed;
    return this.fbHandler.ref().update(updates)
      .then(() => Object.assign({}, objPushed, { id: newKey }))
      .catch((err) => { throw err || 'Firebase error.'; });
  }

  update(objUpdated) {
    let keyToDelete;
    if (typeof objKey === 'object' && objUpdated.id) {
      keyToDelete = objUpdated.id;
    } else {
      throw new Error('Method parameter has to be an Object with "id" property as a Key for Firebase.');
    }
    const updates = {};
    updates[this.endpoint + keyToDelete] = objUpdated;
    return this.fbHandler.ref().update(updates)
      .then(() => Object.assign({}, objUpdated))
      .catch((err) => { throw err || 'Firebase error.'; });
  }

  remove(objKey) {
    let keyToDelete;
    if (typeof objKey === 'object' && objKey.id) {
      keyToDelete = objKey.id;
    } else if (typeof objKey === 'string' || typeof objKey === 'number') {
      keyToDelete = objKey;
    } else {
      throw new Error('Method parameter has to be an Object with "id" property as a Key for Firebase or the Key(String).');
    }
    const updates = {};
    updates[this.endpoint + keyToDelete] = null;
    return this.fbHandler.ref().update(updates)
      .catch((err) => { throw err || 'Firebase error.'; });
  }
}

customElements.define('polybase-db', PolybaseDB);
