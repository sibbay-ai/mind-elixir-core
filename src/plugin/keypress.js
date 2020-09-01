export default function (mind) {
  let selectChildNodeTemplate = false
  let selectSiblingNodeTemplate = false
  let key2func = {
    13: (e) => {
      // ctrl enter
      if (e.ctrlKey) {
        mind.choiceNewNodeTemplate(mind.currentNode.parentElement.parentNode.parentNode.previousSibling.childNodes[0])
        selectSiblingNodeTemplate = true
        return
      }
      // enter
      mind.insertSibling()
    },
    9: (e) => {
      // tab
      mind.addChild()
    },
    113: () => {
      // f2
      mind.beginEdit()
    },
    38: () => {
      // up
      mind.selectPrevSibling()
    },
    40: () => {
      // down
      mind.selectNextSibling()
    },
    37: () => {
      // left
      if (!mind.currentNode) return
      if (mind.currentNode.offsetParent.offsetParent.className === 'rhs')
        mind.selectParent()
      else if (mind.currentNode.offsetParent.offsetParent.className === 'lhs')
        mind.selectFirstChild()
    },
    39: () => {
      // right
      if (!mind.currentNode) return
      if (mind.currentNode.offsetParent.offsetParent.className === 'rhs')
        mind.selectFirstChild()
      else if (mind.currentNode.offsetParent.offsetParent.className === 'lhs')
        mind.selectParent()
    },
    33() {
      // pageUp
      mind.moveUpNode()
    },
    34() {
      // pageDown
      mind.moveDownNode()
    },
    // ctrl z
    90: e => {
      if (!mind.allowUndo) return
      if (e.metaKey || e.ctrlKey) mind.undo()
    },
    // ctrl .
    190: e => {
      if (!e.ctrlKey) return
      mind.choiceNewNodeTemplate()
      selectChildNodeTemplate = true
    }
  }
  mind.map.onkeyup = e => {
    if (e.keyCode === 17 && selectChildNodeTemplate) {
      mind.clearNodeTemplate()
      selectChildNodeTemplate = false
    }
    if (e.keyCode === 17 && selectSiblingNodeTemplate) {
      mind.clearNodeTemplate(mind.currentNode.parentElement.parentNode.parentNode.previousSibling.childNodes[0])
      selectSiblingNodeTemplate = false
    }
  }
  mind.map.onkeydown = e => {
    console.log(e, e.target, e.currentTarget)
    if (e.target !== e.currentTarget) {
      // input
      // send all key for user define
      mind.bus.fire('operation', {
        name: 'inputKeypress',
        obj: e,
      })
      return
    }
    e.preventDefault()
    if (e.keyCode === 8 || e.keyCode === 46) {
      // del,backspace
      if (mind.currentLink) mind.removeLink()
      else mind.removeNode()
    } else {
      key2func[e.keyCode] && key2func[e.keyCode](e)
    }
  }
}
