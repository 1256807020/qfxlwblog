import CodeCopy from "./copy.vue";
// import myProgress from './ReadingProgress'
import Vue from "vue";

export default {
  updated() {
    // 等待dom加载完成之后执行
    this.$nextTick(() => {
      this.update();
    });
  },
  // mounted(){
  //   // 插入进度条 !临时操作
  //   const globalUIEl = document.querySelector('.global-ui')
  //   const p = Vue.extend(myProgress)
  //   const progress = new p()
  //   progress.$mount()
  //   globalUIEl.appendChild(progress.$el)
  // },
  methods: {
    update() {
      // 获取所有的dom，之后在所有的代码块上插入vue的组件
      const dom = Array.from(document.querySelectorAll(selector));
      dom.forEach(el => {
        // 判断一下，当前节点是不是已经插入了
        if (/v-copy/.test(el.className)) {
          return;
        }
        // 创建copy组件
        const C = Vue.extend(CodeCopy);
        const copy = new C();

        // 下面这些是组件的props以及一些私有属性
        copy.copyText = copyText;
        copy.code = el.textContent;
        copy._parent = el;
        copy.$mount();
        el.className += ` v-copy`;
        // 将copy添加进代码区域
        el.appendChild(copy.$el);

        // 添加span标签，增加三个小点
        const span = document.createElement('span')
        span.style = 'display: block;background: url("https://www.qfxlw.com/upload/thumbs/1549547773427.png") 10px 10px / 40px no-repeat rgb(40, 44, 52);height: 30px;width: 100%;margin-bottom: -7px;border-radius: 5px;';
        Array.from(el.children).forEach(curEl => {
          if(curEl.nodeName === 'CODE') {
            el.insertBefore(span, curEl)
          }
        })
      });
    }
  }
};
