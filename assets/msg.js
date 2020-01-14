import Vue from 'vue';
import { Slider } from './slider.js';
import tpl from './msg.html';

Vue.component('msg', {
  template: tpl,
  props: {
    msg: { type: Object, required: true },
    body: { type: String },
    edit: { type: Object },
    thread: { type: Boolean, default: false },
    opened: { type: Boolean, default: false },
    detailed: { type: Boolean, default: false },
    picked: { type: Boolean, default: false },
    pick: { type: Function },
    editTags: { type: Function, required: true }
  },
  data: function() {
    return {
      open: this.$parent.open,
      openMsg: this.$parent.openMsg,
      details: this.$parent.details,
      call: this.$parent.call
    };
  },
  methods: {
    openInMain: function(q) {
      window.app.openInMain(q);
    },
    openDefault: function() {
      if (this.thread) {
        this.openInMain(this.msg.query_thread);
      } else {
        this.details(this.msg.uid);
      }
    },
    openInSplit: function() {
      let q = this.msg.query_thread;
      if (!this.thread) {
        q = `${q} uid:${this.msg.uid}`;
      }
      window.app.openInSplit(q);
    },
    archive: function(msg) {
      let data = { old: ['#inbox'] };
      return this.editTags(data, [msg.uid]);
    },
    del: function(msg) {
      let data = { new: ['#trash'] };
      return this.editTags(data, [msg.uid]);
    },
    read: function(msg) {
      let data = {};
      data[msg.is_unread ? 'new' : 'old'] = ['\\Seen'];
      return this.editTags(data, [msg.uid]);
    },
    pin: function(msg) {
      let data = {};
      data[msg.is_pinned ? 'old' : 'new'] = ['\\Flagged'];
      return this.editTags(data, [msg.uid]);
    },
    reply: function(msg, forward = null) {
      let end = forward ? '?forward=1' : '';
      this.call('get', msg.url_reply + end).then(res =>
        this.open(res.query_edit)
      );
    },
    makeRicher: function() {
      for (let i of this.$el.querySelectorAll('img[data-src]')) {
        i.src = i.dataset.src;
      }
      for (let i of this.$el.querySelectorAll('*[data-style]')) {
        i.style = i.dataset.style;
      }
    },
    slide: function(e, idx) {
      e.preventDefault();
      new Slider({
        el: '.slider',
        propsData: {
          slides: this.msg.files.filter(i => i.image),
          index: idx
        }
      });
    }
  }
});
