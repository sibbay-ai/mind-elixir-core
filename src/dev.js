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
        background: 'rgb(80, 194, 139)',
        color: '#fff',
        border: '',
        borderRadius: '5px'
      },
      children: [
        {
          style: {
            background: 'rgb(80, 194, 139)',
            color: '#fff',
            border: '',
            borderRadius: '5px'
          },
          text: '文字节点',
          id: 'show',
        },
        {
          style: {
            background: '',
            color: 'rgb(102, 102, 102)',
            border: '',
          },
          children: [],
          text: '单选节点',
          icons: ['📩️'],
          id: 'single_choice'
        },
        {
          style: {
            background: '',
            color: 'rgb(102, 102, 102)',
            border: '',
          },
          children: [],
          text: '单选任务',
          icons: ['📩️', '🕑', '🌲️'],
          id: 'single_task_choice'
        },
        {
          style: {
            background: '',
            color: 'rgb(102, 102, 102)',
            border: '',
          },
          children: [],
          text: '多选节点',
          icons: ['📨️'],
          id: 'multi_choice'
        },
        {
          style: {
            background: '',
            color: 'rgb(102, 102, 102)',
            border: '',
          },
          children: [],
          text: '继续节点',
          icons: ['💨️'],
          id: 'continue'
        },
        {
          style: {
            background: '',
            color: 'rgb(102, 102, 102)',
            border: '',
          },
          children: [],
          text: '语音输入',
          icons: ['🖊'],
          id: 'voice_input'
        },
        {
          style: {
            background: '',
            color: 'rgb(102, 102, 102)',
            border: '',
          },
          children: [],
          text: '语音文字',
          icons: ['✏'],
          id: 'voice_text_input'
        },
        {
          style: {
            background: '',
            color: 'rgb(102, 102, 102)',
            border: '',
          },
          children: [],
          text: '文字输入',
          icons: ['🖌'],
          id: 'text_input'
        },
        {
          style: {
            background: '',
            color: 'rgb(102, 102, 102)',
            border: '',
          },
          children: [],
          text: '延时节点',
          icons: ['⏱️'],
          id: 'delayed'
        },
        {
          style: {
            background: '',
            color: 'rgb(102, 102, 102)',
            border: '',
          },
          children: [],
          text: '拨轮节点',
          icons: ['📅'],
          id: 'wheel'
        },
        {
          style: {
            background: '',
            color: 'rgb(102, 102, 102)',
            border: '',
          },
          children: [],
          text: '能量节点',
          icons: ['🧧'],
          id: 'energy'
        }
      ],
      text: '文字节点',
      id: 'show'
    },
    {
      style: {
        background: '#fff',
        color: '#666',
        border: '1px dashed #888',
        borderRadius: '0px'
      },
      text: '条件节点(E)',
      id: 'condition_edit'
    },
    {
      style: {
        background: '#fff',
        color: '#666',
        border: '1px solid #888',
        borderRadius: '0px'
      },
      text: '条件节点(D)',
      id: 'condition_design'
    },
    {
      style: {
        background: '#fff',
        color: '#4b4b4b',
        border: '2px solid #b8d7fb',
        borderRadius: '20px'
      },
      text: '业务节点(E)',
      id: 'code_edit'
    },
    {
      style: {
        background: '#dbe2e3',
        color: '#434b54',
        borderRadius: '6px'
      },
      text: '业务节点(D)',
      id: 'code_design'
    },
    {
      style: {
        background: '#fff',
        color: '#f29a66',
        border: '2px solid #f29a66',
        borderRadius: '20px'
      },
      text: '步骤节点',
      id: 'bunch'
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
