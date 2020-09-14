import {
  moveNodeObj,
  removeNodeObj,
  insertNodeObj,
  insertBeforeNodeObj,
  generateNewObj,
  checkMoveValid,
  addParentLink,
  moveUpObj,
  moveDownObj,
  generateNewTemplateObjs,
  generateNewTemplateObj, generateUUID,
} from './utils/index'
import {findEle, createExpander, createGroup, getTopicDiv} from './utils/dom'
import { LEFT, RIGHT, SIDE } from './const'
import vari from "./var";
let $d = document
/**
 * @namespace NodeOperation
 */
export let updateNodeStyle = function (object) {
  if (!object.style) return
  let nodeEle = findEle(object.id)
  updateNodeStyleWithNode(nodeEle, object)
  if (object.icons) {
    let icons = object.icons
    let iconsEl = nodeEle.querySelector('.icons')
    if (iconsEl) {
      iconsEl.innerHTML = icons.map(icon => `<span>${icon}</span>`).join('')
    } else {
      let iconsContainer = $d.createElement('span')
      iconsContainer.className = 'icons'
      iconsContainer.innerHTML = icons
          .map(icon => `<span>${icon}</span>`)
          .join('')
      nodeEle.insertBefore(iconsContainer, getTopicDiv(nodeEle))
    }
  }
  this.linkDiv()
}

export let updateNodeStyleWithNode = function (node, object) {
  node.style.color = object.style.color
  node.style.background = object.style.background
  node.style.fontSize = object.style.fontSize + 'px'
  node.style.fontWeight = object.style.fontWeight || 'normal'
  if (object.style.border) node.style.border = object.style.border
  if (object.style.borderRadius) node.style.borderRadius = object.style.borderRadius
  if (object.templateID) node.templateID = object.templateID
}

export let updateNodeObjStyle = function (nodeObj, upd) {
  console.log(upd)
  if (upd.style) {
    if (nodeObj.style) {
      nodeObj.style.color = upd.style.color
      nodeObj.style.background = upd.style.background
    } else {
      nodeObj.style = {color: upd.style.color, background: upd.style.background}
    }
    if (upd.style.border) nodeObj.style.border = upd.style.border
    if (upd.style.borderRadius) nodeObj.style.borderRadius = upd.style.borderRadius
  } else {
    nodeObj.style = {color: '', background: ''}
  }
  if (upd.icons) nodeObj.icons = upd.icons
  if (upd.templateID) nodeObj.templateID = upd.templateID
}

export let updateNodeTags = function (object) {
  if (!object.tags) return
  let nodeEle = findEle(object.id)
  let tags = object.tags
  let tagsEl = nodeEle.querySelector('.tags')
  if (tagsEl) {
    tagsEl.innerHTML = tags.map(tag => `<span>${tag}</span>`).join('')
  } else {
    let tagsContainer = $d.createElement('div')
    tagsContainer.className = 'tags'
    tagsContainer.innerHTML = tags.map(tag => `<span>${tag}</span>`).join('')
    nodeEle.appendChild(tagsContainer)
  }
  this.linkDiv()
}

export let updateNodeIcons = function (object) {
  if (!object.icons) return
  let nodeEle = findEle(object.id)
  let icons = object.icons
  let iconsEl = nodeEle.querySelector('.icons')
  if (iconsEl) {
    iconsEl.innerHTML = icons.map(icon => `<span>${icon}</span>`).join('')
  } else {
    let iconsContainer = $d.createElement('span')
    iconsContainer.className = 'icons'
    iconsContainer.innerHTML = icons
      .map(icon => `<span>${icon}</span>`)
      .join('')
    // fixed sequence: text -> icons -> tags
    if (nodeEle.lastChild.className === 'tags') {
      nodeEle.insertBefore(iconsContainer, nodeEle.lastChild)
    } else {
      nodeEle.appendChild(iconsContainer)
    }
  }
  this.linkDiv()
}

export let updateNodeSvgChart = function () {
  // TODO
}

/**
 * @function
 * @instance
 * @name insertSibling
 * @memberof NodeOperation
 * @description Create a sibling node.
 * @param {TargetElement} el - Target element return by E('...'), default value: currentTarget.
 * @example
 * insertSibling(E('bd4313fbac40284b'))
 */
export let insertSibling = function (el, node) {
  let nodeEle = el || this.currentNode
  if (!nodeEle) return
  let nodeObj = nodeEle.nodeObj
  if (nodeObj.root === true) {
    this.addChild()
    return
  }
  let newNodeObj = node || generateNewObj()
  insertNodeObj(nodeObj, newNodeObj)
  addParentLink(this.nodeData)
  let t = nodeEle.parentElement
  console.time('insertSibling_DOM')

  let { grp, top } = createGroup(newNodeObj)

  let children = t.parentNode.parentNode
  children.insertBefore(grp, t.parentNode.nextSibling)
  if (children.className === 'box') {
    this.processPrimaryNode(grp, newNodeObj)
    this.linkDiv()
  } else {
    this.linkDiv(grp.offsetParent)
  }
  if (!node) {
    this.createInputDiv(top.children[0])
  }
  this.selectNode(top.children[0], true)
  top.scrollIntoViewIfNeeded()
  console.timeEnd('insertSibling_DOM')
  this.bus.fire('operation', {
    name: 'insertSibling',
    obj: newNodeObj,
  })
}

export let insertBefore = function (el, node) {
  let nodeEle = el || this.currentNode
  if (!nodeEle) return
  let nodeObj = nodeEle.nodeObj
  if (nodeObj.root === true) {
    this.addChild()
    return
  }
  let newNodeObj = node || generateNewObj()
  insertBeforeNodeObj(nodeObj, newNodeObj)
  addParentLink(this.nodeData)
  let t = nodeEle.parentElement
  console.time('insertSibling_DOM')

  let { grp, top } = createGroup(newNodeObj)

  let children = t.parentNode.parentNode
  children.insertBefore(grp, t.parentNode)
  if (children.className === 'box') {
    this.processPrimaryNode(grp, newNodeObj)
    this.linkDiv()
  } else {
    this.linkDiv(grp.offsetParent)
  }
  if (!node) {
    this.createInputDiv(top.children[0])
  }
  this.selectNode(top.children[0], true)
  top.scrollIntoViewIfNeeded()
  console.timeEnd('insertSibling_DOM')
  this.bus.fire('operation', {
    name: 'insertSibling',
    obj: newNodeObj,
  })
}

/**
 * @function
 * @instance
 * @name addChild
 * @memberof NodeOperation
 * @description Create a child node.
 * @param {TargetElement} el - Target element return by E('...'), default value: currentTarget.
 * @example
 * addChild(E('bd4313fbac40284b'))
 */
export let addChild = function (el, node) {
  console.time('addChild')
  let nodeEle = el || this.currentNode
  if (!nodeEle) return
  let nodeObj = nodeEle.nodeObj
  if (nodeObj.expanded === false) {
    console.warn('Node should be extended')
    return
  }
  let newNodeObj = node || generateNewObj()
  nodeObj.expanded = true
  if (nodeObj.children) nodeObj.children.push(newNodeObj)
  else nodeObj.children = [newNodeObj]
  addParentLink(this.nodeData)
  let top = nodeEle.parentElement

  let { grp, top: newTop } = createGroup(newNodeObj)

  if (top.tagName === 'T') {
    if (top.children[1]) {
      top.nextSibling.appendChild(grp)
    } else {
      let c = $d.createElement('children')
      c.appendChild(grp)
      top.appendChild(createExpander(true))
      top.parentElement.insertBefore(c, top.nextSibling)
    }
    this.linkDiv(grp.offsetParent)
  } else if (top.tagName === 'ROOT') {
    this.processPrimaryNode(grp, newNodeObj)
    top.nextSibling.appendChild(grp)
    this.linkDiv()
  }
  if (!node) {
    this.createInputDiv(newTop.children[0])
  }
  this.selectNode(newTop.children[0], true)
  newTop.scrollIntoViewIfNeeded()
  console.timeEnd('addChild')
  this.bus.fire('operation', {
    name: 'addChild',
    obj: newNodeObj,
  })
}
// uncertain link disappear sometimes??
// TODO while direction = SIDE, move up won't change the direction of primary node

/**
 * @function
 * @instance
 * @name moveUpNode
 * @memberof NodeOperation
 * @description Move the target node up.
 * @param {TargetElement} el - Target element return by E('...'), default value: currentTarget.
 * @example
 * moveUpNode(E('bd4313fbac40284b'))
 */
export let moveUpNode = function (el) {
  let nodeEle = el || this.currentNode
  if (!nodeEle) return
  let grp = nodeEle.parentNode.parentNode
  let obj = nodeEle.nodeObj
  moveUpObj(obj)
  grp.parentNode.insertBefore(grp, grp.previousSibling)
  this.linkDiv()
  nodeEle.scrollIntoViewIfNeeded()
}

/**
 * @function
 * @instance
 * @name moveDownNode
 * @memberof NodeOperation
 * @description Move the target node down.
 * @param {TargetElement} el - Target element return by E('...'), default value: currentTarget.
 * @example
 * moveDownNode(E('bd4313fbac40284b'))
 */
export let moveDownNode = function (el) {
  let nodeEle = el || this.currentNode
  if (!nodeEle) return
  let grp = nodeEle.parentNode.parentNode
  let obj = nodeEle.nodeObj
  moveDownObj(obj)
  if (grp.nextSibling) {
    grp.parentNode.insertBefore(grp, grp.nextSibling.nextSibling)
  } else {
    grp.parentNode.prepend(grp)
  }
  this.linkDiv()
  nodeEle.scrollIntoViewIfNeeded()
}

/**
 * @function
 * @instance
 * @name removeNode
 * @memberof NodeOperation
 * @description Remove the target node.
 * @param {TargetElement} el - Target element return by E('...'), default value: currentTarget.
 * @example
 * removeNode(E('bd4313fbac40284b'))
 */
export let removeNode = function (el) {
  let nodeEle = el || this.currentNode
  if (!nodeEle) return
  let index = nodeEle.nodeObj.parent.children.findIndex(
    node => node === nodeEle.nodeObj
  )
  let next = nodeEle.nodeObj.parent.children[index + 1]
  let originSiblingId = next && next.id

  this.bus.fire('operation', {
    name: 'removeNode',
    obj: nodeEle.nodeObj,
    originSiblingId,
    originParentId: nodeEle.nodeObj.parent.id,
  })
  let childrenLength = removeNodeObj(nodeEle.nodeObj)
  nodeEle = nodeEle.parentNode
  if (nodeEle.tagName === 'T') {
    if (childrenLength === 0) {
      // remove epd when children length === 0
      let parentT = nodeEle.parentNode.parentNode.previousSibling
      if (parentT.tagName !== 'ROOT')
        // root doesn't have epd
        parentT.children[1].remove()
      this.selectParent()
    } else {
      // select sibling automatically
      let success = this.selectPrevSibling()
      if (!success) this.selectNextSibling()
    }
    for (let prop in this.linkData) {
      // BUG should traversal all children node
      let link = this.linkData[prop]
      if (link.from === nodeEle.firstChild || link.to === nodeEle.firstChild) {
        this.removeLink(
          document.querySelector(`[data-linkid=${this.linkData[prop].id}]`)
        )
      }
    }
    nodeEle.parentNode.remove()
  }
  this.linkDiv()
}

/**
 * @function
 * @instance
 * @name moveNode
 * @memberof NodeOperation
 * @description Move the target node to another node (as child node).
 * @param {TargetElement} from - The target you want to move.
 * @param {TargetElement} to - The target(as parent node) you want to move to.
 * @example
 * moveNode(E('bd4313fbac402842'),E('bd4313fbac402839'))
 */
export let moveNode = function (from, to) {
  console.time('moveNode')
  let fromObj = from.nodeObj
  let toObj = to.nodeObj
  let originParentId = fromObj.parent.id
  if (toObj.expanded === false) {
    console.warn('Target node must be expanded')
    return
  }
  if (!checkMoveValid(fromObj, toObj)) {
    console.warn('Invalid move')
    return
  }
  moveNodeObj(fromObj, toObj)
  addParentLink(this.nodeData) // update parent property
  let PFrom = from.parentElement
  let PTo = to.parentElement
  if (PFrom.parentNode.parentNode.className === 'box') {
    // clear svg group of primary node
    PFrom.parentNode.lastChild.remove()
  } else if (PFrom.parentNode.className === 'box') {
    PFrom.style.cssText = '' // clear style
  }
  if (PTo.tagName === 'T') {
    if (PFrom.parentNode.parentNode.className === 'box') {
      // clear direaction class of primary node
      PFrom.parentNode.className = ''
    }
    if (PTo.children[1]) {
      // expander exist
      PTo.nextSibling.appendChild(PFrom.parentNode)
    } else {
      // expander not exist, no child
      let c = $d.createElement('children')
      c.appendChild(PFrom.parentNode)
      PTo.appendChild(createExpander(true))
      PTo.parentElement.insertBefore(c, PTo.nextSibling)
    }
  } else if (PTo.tagName === 'ROOT') {
    this.processPrimaryNode(PFrom.parentNode, fromObj)
    PTo.nextSibling.appendChild(PFrom.parentNode)
  }
  this.linkDiv()
  this.bus.fire('operation', {
    name: 'moveNode',
    obj: { fromObj, toObj, originParentId },
  })
  console.timeEnd('moveNode')
}

/**
 * @function
 * @instance
 * @name beginEdit
 * @memberof NodeOperation
 * @description Begin to edit the target node.
 * @param {TargetElement} el - Target element return by E('...'), default value: currentTarget.
 * @example
 * beginEdit(E('bd4313fbac40284b'))
 */
export let beginEdit = function (el) {
  let nodeEle = el || this.currentNode
  if (!nodeEle) return
  this.createInputDiv(nodeEle)
}

export let choiceNewNodeTemplate = function (el, direction='down') {
  let nodeEle = el || this.currentNode

  if (!nodeEle) return
  let nodeObj = nodeEle.nodeObj
  if (nodeObj.expanded === false) {
    console.warn('Node should be extended')
    return
  }

  let top = nodeEle.parentElement

  let temNodeTemplate = nodeEle.parentElement.parentElement.getElementsByClassName('temporary-node-template')
  if (temNodeTemplate.length > 0) {
    let findSelected = '0'
    for (const tntkey in temNodeTemplate) {
      const tnt = temNodeTemplate[tntkey]
      if (tnt.className === 'temporary-node-template template-selected') {
        findSelected = tntkey
        tnt.className = 'temporary-node-template'
        tnt.style.opacity = '0.5'
      }
    }
    let needSelected
    if (direction === 'down') {
      if (Number(findSelected) === temNodeTemplate.length - 1) {
        needSelected = temNodeTemplate['0']
      } else {
        needSelected = temNodeTemplate[String(Number(findSelected) + 1)]
      }
    } else if (direction === 'up') {
      if (Number(findSelected) === 0) {
        needSelected = temNodeTemplate[temNodeTemplate.length - 1]
      } else {
        needSelected = temNodeTemplate[String(Number(findSelected) - 1)]
      }
    }

    needSelected.className = 'temporary-node-template template-selected'
    needSelected.style.opacity = '1'
    return
  }

  const templateObjs = generateNewTemplateObjs(this.nodeTemplate, nodeObj)
  for (const ntpkey in templateObjs) {
    const ntp = templateObjs[ntpkey]
    let { grp, top: newTop } = createGroup(ntp)
    if (ntpkey !== '0') {
      newTop.style.opacity = '0.5'
      newTop.className = 'temporary-node-template'
    } else {
      newTop.className = 'temporary-node-template template-selected'
    }
    newTop.setAttribute('data-id', ntp.id)
    if (top.tagName === 'T') {
      if (top.children[1]) {
        top.nextSibling.appendChild(grp)
      } else {
        let c = $d.createElement('children')
        c.appendChild(grp)
        top.appendChild(createExpander(true))
        top.parentElement.insertBefore(c, top.nextSibling)
      }
      this.linkDiv(grp.offsetParent)
    } else if (top.tagName === 'ROOT') {
      this.processPrimaryNode(grp, ntp)
      top.nextSibling.appendChild(grp)
      this.linkDiv()
    }
  }

}

export let clearNodeTemplate = function (el) {
  let nodeEle = el || this.currentNode

  if (!nodeEle) return
  let nodeObj = nodeEle.nodeObj
  if (nodeObj.expanded === false) {
    console.warn('Node should be extended')
    return
  }
  let selectedId
  let temNodeTemplate = nodeEle.parentElement.parentElement.getElementsByClassName('temporary-node-template')
  for (const tnt of Array.from(temNodeTemplate)) {
    if (tnt.className === 'temporary-node-template template-selected') {
      selectedId = tnt.getAttribute('data-id')
    }
    tnt.parentNode.remove()
  }
  this.linkDiv()
  this.addChild(nodeEle, generateNewTemplateObj(this.nodeTemplate, selectedId)).then( () => {
    let newChildren = nodeEle.parentElement.nextSibling.childNodes
    newChildren = newChildren[newChildren.length - 1]
    newChildren = newChildren.firstChild.firstChild
    this.createInputDiv(newChildren)
  })

}

export let setNodeTopic = function (tpc, topic) {
  tpc.childNodes[0].textContent = topic
  this.linkDiv()
}

// Judge L or R
export function processPrimaryNode(primaryNode, obj) {
  if (this.direction === LEFT) {
    primaryNode.className = 'lhs'
  } else if (this.direction === RIGHT) {
    primaryNode.className = 'rhs'
  } else if (this.direction === SIDE) {
    let l = $d.querySelectorAll('.lhs').length
    let r = $d.querySelectorAll('.rhs').length
    if (l <= r) {
      primaryNode.className = 'lhs'
      obj.direction = LEFT
    } else {
      primaryNode.className = 'rhs'
      obj.direction = RIGHT
    }
  }
}
