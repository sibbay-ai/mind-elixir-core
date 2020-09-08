import MindElixir, { E } from './index'
import i18n from "./i18n";

let mind = new MindElixir({
  el: '#map',
  newTopicName: '子节点',
  // direction: MindElixir.SIDE,
  direction: MindElixir.RIGHT,
  // data: MindElixir.new('new topic'),
  data: MindElixir.example2,
  locale: 'en',
  draggable: true,
  editable: true,
  contextMenu: true,
  builtInTags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
  nodeTemplate: [
    {
      style: {
        background: '#27ae61',
        color: '#ecf0f1',
        border: '',
      },
      children: [
        {
          style: {
            background: '#f39c11',
            color: '#ecf0f1',
            border: '',
          },
          children: [],
          text: '普通选项',
          icons: ['🟠'],
          id: '1choice'
        },
        {
          style: {
            background: '#f39c11',
            color: '#ecf0f1',
            border: '',
          },
          children: [],
          text: '文字输入',
          icons: ['🖊️'],
          id: '2choice'
        }
      ],
      text: '文字节点',
      id: 'show'
    },
    {
      style: {
        background: '#e74c3c',
        color: '#ecf0f1',
        border: '',
      },
      text: '条件节点',
      id: 'condition'
    },
    {
      style: {
        background: '#34495e',
        color: '#ecf0f1',
        border: '',
      },
      text: '代码节点',
      id: 'code'
    },
    {
      style: {
        background: '#9b59b6',
        color: '#ecf0f1',
        border: '',
      },
      text: '延时节点',
      id: 'wait'
    }
  ],
  contextMenuOption: {
    focus: true,
    link: true,
    extend: [
      {
        name: 'Node edit',
        onclick: () => {
          alert('extend menu')
        },
      },
    ],
  },
  toolBar: true,
  nodeMenu: true,
  keypress: true,
  allowUndo: false,
  before: {
    insertSibling(el, obj) {
      console.log(el, obj)
      // if (this.currentNode.nodeObj.parent.root) {
      //   return false
      // }
      return true
    },
    async addChild(el, obj) {
      await sleep()
      // if (this.currentNode.nodeObj.parent.root) {
      //   return false
      // }
      return true
    },
  },
})
mind.init()
function sleep() {
  return new Promise((res, rej) => {
    setTimeout(() => res(), 100)
  })
}
console.log('test E function', E('bd4313fbac40284b'))
// let mind2 = new MindElixir({
//   el: '#map2',
//   direction: 2,
//   data: data.data,
//   draggable: true
// })
// mind2.init()

mind.bus.addListener('operation', operation => {
  console.log(operation)
  // return {
  //   name: action name,
  //   obj: target object
  // }

  // name: [insertSibling|addChild|removeNode|beginEdit|finishEdit]
  // obj: target

  // name: moveNode
  // obj: {from:target1,to:target2}
})
mind.bus.addListener('selectNode', node => {
  console.log(node)
})
window.m = mind
