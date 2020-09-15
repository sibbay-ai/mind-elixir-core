export let withctrl = function (e) {
  if ((navigator.platform === "Win32") || (navigator.platform === "Windows")) return e.ctrlKey
  if ((navigator.platform === "Mac68K") || (navigator.platform === "MacPPC") || (navigator.platform === "Macintosh") || (navigator.platform === "MacIntel")) return e.metaKey
  return false
}

export let isctrl = function (e) {
  if ((navigator.platform === "Win32") || (navigator.platform === "Windows")) return e.keyCode === 17
  if ((navigator.platform === "Mac68K") || (navigator.platform === "MacPPC") || (navigator.platform === "Macintosh") || (navigator.platform === "MacIntel")) return e.keyCode === 91
  return false
}

export default function (mind) {
  let selectChildNodeTemplate = false
  let selectSiblingNodeTemplate = false
  let key2func = {
    13: (e) => {
      // ctrl enter
      if (withctrl(e) && !e.shiftKey) {
        mind.choiceNewNodeTemplate(mind.currentNode.parentElement.parentNode.parentNode.previousSibling.childNodes[0])
        selectSiblingNodeTemplate = true
        return
      }
      // ctrl shift enter
      if (withctrl(e) && e.shiftKey) {
        mind.choiceNewNodeTemplate(mind.currentNode.parentElement.parentNode.parentNode.previousSibling.childNodes[0], 'up')
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
      if (e.metaKey || withctrl(e)) mind.undo()
    },
    // ctrl .
    190: e => {
      if (!withctrl(e)) return
      mind.choiceNewNodeTemplate()
      selectChildNodeTemplate = true
    },
    // ctrl ,
    188: e => {
      if (!withctrl(e)) return
      mind.choiceNewNodeTemplate(null, 'up')
      selectChildNodeTemplate = true
    }
  }
  mind.map.onkeyup = e => {
    if (isctrl(e) && selectChildNodeTemplate) {
      mind.clearNodeTemplate()
      selectChildNodeTemplate = false
    }
    if (isctrl(e) && selectSiblingNodeTemplate) {
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
    if (e.keyCode === 8 || e.keyCode === 46) {
      // del,backspace
      e.preventDefault()
      if (mind.currentLink) mind.removeLink()
      else mind.removeNode()
    } else {
      if (key2func[e.keyCode]) {
        e.preventDefault()
        key2func[e.keyCode](e)
        return
      }
      if (!mind.currentNode) return
      if (e.shiftKey || e.ctrlKey || e.metaKey) return
      mind.createInputDiv(mind.currentNode)
      e.stopPropagation()
    }
  }
}
