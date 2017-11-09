import Vue from 'vue';
import { send } from './utils.js';
import tpl from './msgs.html';
import './msgs.css';

Vue.component('Msgs', {
  template: tpl,
  props: {
    threads: { type: Boolean, default: false },
    query: { type: String, required: true }
  },
  data: function() {
    return {
      uids: [],
      perPage: 100,
      pages: []
    };
  },
  created: function() {
    this.setMsgs();
  },
  computed: {
    url: function() {
      return this.threads ? '/threads' : '/msgs';
    },
    length: function() {
      return this.pages.length
        ? Object.getOwnPropertyNames(this.msgs).length
        : 0;
    },
    app: () => window.app
  },
  methods: {
    setMsgs: function(msgs, uids) {
      if (!msgs) {
        this.msgs = {};
        this.pages = [];
      } else {
        Object.assign(this.msgs, msgs);
        this.pages.push(uids);
      }
    },
    fetch: function() {
      this.uids = [];
      this.setMsgs();
      return this.send('', {
        q: this.query,
        preload: this.perPage
      }).then(res => {
        this.setMsgs(res.msgs, res.uids.slice(0, this.perPage));
        this.uids = res.uids;
      });
    },
    send: function(prefix, params) {
      return send(this.url + prefix, params);
    },
    canLoadMore: function() {
      return this.length < this.uids.length;
    },
    loadMore: function() {
      let uids = this.uids.slice(this.length, this.length + this.perPage);
      return this.send('/info', { uids: uids }).then(res =>
        this.setMsgs(res, uids)
      );
    },
    page: function(uids) {
      let msgs = [];
      for (const uid of uids) {
        let msg = this.msgs[uid];
        msg.parsed_uid = uid;
        msg.origin_url = '/api/origin/' + msg.uid;
        msg.parsed_url = '/api/parsed/' + uid;
        msgs.push(msg);
      }
      return msgs;
    }
  }
});