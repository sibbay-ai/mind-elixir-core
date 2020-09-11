import i18n from '../i18n'
import {generateNewTemplateObj} from '../utils/index'

export default function(mind) {
  let locale = i18n[mind.locale] ? mind.locale : 'en'
  let createDiv = (id, name) => {
    let div = document.createElement('div')
    div.id = id
    div.innerHTML = `<span>${name}</span>`
    return div
  }

  let blockDiv = createDiv('nm-style', 'style')

  let colorList = [
    '#2c3e50',
    '#34495e',
    '#7f8c8d',
    '#94a5a6',
    '#bdc3c7',
    '#ecf0f1',
    '#8e44ad',
    '#9b59b6',
    '#2980b9',
    '#3298db',
    '#c0392c',
    '#e74c3c',
    '#d35400',
    '#f39c11',
    '#f1c40e',
    '#17a085',
    '#27ae61',
    '#2ecc71',
  ]

  let nodeTemplate = mind.nodeTemplate

  let builtInTags = mind.builtInTags

  let headHTML = `
    <div class="bof">
      <span class="nm-node-template-button">${i18n[locale].nodeTemplate}</span>
      <span class="nm-style-button">${i18n[locale].style}</span>
      <span class="nm-tag-button">${i18n[locale].tag}</span>
      <span class="nm-icon-button">${i18n[locale].icon}</span>
    </div>
  `

  let styleHTML = `
    <div class="nm-style-block" style="display: none">
    ${i18n[locale].font}
    <div class="nm-fontsize-container">
        ${['15', '24', '32'].map(size => {
      return `<div class="size"  data-size="${size}">
            <svg class="icon" style="width: ${size}px;height: ${size}px" aria-hidden="true">
              <use xlink:href="#icon-a"></use>
            </svg></div>`
    }).join('')}
          <div class="bold">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-B"></use>
            </svg>
          </div>
      </div>
      <div class="nm-fontcolor-container">
          ${colorList.map(color => {
      return `<div class="split6"><div class="palette fontcolor-palette" data-color="${color}" style="background-color: ${color};"></div></div>`
    }).join('')}
      </div>
      ${i18n[locale].background}
      <div class="nm-fontcolor-container">
          ${colorList.map(color => {
      return `<div class="split6"><div class="palette background-palette" data-color="${color}" style="background-color: ${color};"></div></div>`
    }).join('')}
      </div>
    </div>
  `

  function getAllNodeTemplate(t, r) {
    for (const tElement of t) {
      r.push(tElement)
      getAllNodeTemplate(tElement.children || [], r)
    }
    return r
  }

  let nodeTemplateHTML = `
    <div class="nm-node-template-block" style="">
    <div class="nm-node-template-group">
        ${getAllNodeTemplate(nodeTemplate, []).map(template => {
            return `<div class="nm-node" 
                         data-id="${template.id}" 
                         style="
                            color: ${template.style.color}; 
                            background: ${template.style.background}; 
                            border: ${template.style.border || ''}; 
                            border-radius: ${template.style.borderRadius || '0px'}
                         ">${template.text}</div>`
        }).join('')}
    </div>
   
    </div>
  `

  let tagHTML = `
    <div class="nm-tag-block" style="display: none">
    <div class="nm-tags-group ${builtInTags.length > 0 ? 'had' : ''}">
       ${builtInTags.map(tag => {
        return `<span class="nm-tags" data-tag="${tag}">${tag}</span>`
       }).join('')}
    </div>
    <input class="nm-tag" tabindex="-1" placeholder="${i18n[locale].tagsSeparate}" />
    <br>
    </div>
  `

  let iconHTML = `
    <div class="nm-icon-block" style="display: none">
    <input class="nm-icon" tabindex="-1" placeholder="${i18n[locale].iconsSeparate}" />
    <br>
    </div>
  `

  blockDiv.innerHTML = headHTML + styleHTML + nodeTemplateHTML + tagHTML + iconHTML

  let menuContainer = document.createElement('nmenu')
  menuContainer.innerHTML = `
  <div class="button-container">
  <svg class="icon" aria-hidden="true">
  <use xlink:href="#icon-close"></use>
  </svg>
  </div>
  `
  menuContainer.appendChild(blockDiv)
  menuContainer.hidden = true

  function clearSelect(klass, remove) {
    var elems = document.querySelectorAll(klass)
    ;[].forEach.call(elems, function(el) {
      el.classList.remove(remove)
    })
  }

  mind.container.append(menuContainer)
  let sizeSelector = menuContainer.querySelectorAll('.size')
  let bold = menuContainer.querySelector('.bold')
  let buttonContainer = menuContainer.querySelector('.button-container')

  let tagInput = document.querySelector('.nm-tag')
  let tagsGroup = document.querySelector('.nm-tags-group')
  let nodeTemplateGroup = document.querySelector('.nm-node-template-group')
  let iconInput = document.querySelector('.nm-icon')

  let styleButton = document.querySelector('.nm-style-button')
  let nodeTemplateButton = document.querySelector('.nm-node-template-button')
  let tagButton = document.querySelector('.nm-tag-button')
  let iconButton = document.querySelector('.nm-icon-button')

  let styleBlock = document.querySelector('.nm-style-block')
  let nodeTemplateBlock = document.querySelector('.nm-node-template-block')
  let tagBlock = document.querySelector('.nm-tag-block')
  let iconBlock = document.querySelector('.nm-icon-block')

  let buttonBlockGroup = {
    'tag': [tagButton, tagBlock],
    'node-template': [nodeTemplateButton, nodeTemplateBlock],
    'style': [styleButton, styleBlock],
    'icon': [iconButton, iconBlock]
  }

  function resetButtonStatus(sign) {
    for (const bbge in buttonBlockGroup) {
      if (sign === bbge) {
        buttonBlockGroup[bbge][0].className = `nm-${bbge}-button selected`
        buttonBlockGroup[bbge][1].style = ''
        continue
      }
      buttonBlockGroup[bbge][0].className = `nm-${bbge}-button`
      buttonBlockGroup[bbge][1].style = 'display:none'
    }
  }

  menuContainer.onclick = e => {
    if (!mind.currentNode) return
    let nodeObj = mind.currentNode.nodeObj
    if (e.target.className === 'palette fontcolor-palette') {
      if (!nodeObj.style) nodeObj.style = {}
      clearSelect('.palette', 'nmenu-selected')
      e.target.className = 'palette fontcolor-palette nmenu-selected'
      nodeObj.style.color = e.target.dataset.color
      mind.updateNodeStyle(nodeObj)
    } else if (e.target.className === 'palette background-palette') {
      if (!nodeObj.style) nodeObj.style = {}
      clearSelect('.palette', 'nmenu-selected')
      e.target.className = 'palette background-palette nmenu-selected'
      nodeObj.style.background = e.target.dataset.color
      mind.updateNodeStyle(nodeObj)
    } else if (e.target.className === 'nm-style-button') {
      clearSelect('.palette', 'nmenu-selected')
      resetButtonStatus('style')
    } else if (e.target.className === 'nm-node-template-button') {
      clearSelect('.palette', 'nmenu-selected')
      resetButtonStatus('node-template')
    } else if (e.target.className === 'nm-tag-button') {
      clearSelect('.palette', 'nmenu-selected')
      resetButtonStatus('tag')
    } else if (e.target.className === 'nm-icon-button') {
      clearSelect('.palette', 'nmenu-selected')
      resetButtonStatus('icon')
    }
  }
  Array.from(sizeSelector).map(
    dom =>
      (dom.onclick = e => {
        if (!mind.currentNode.nodeObj.style) mind.currentNode.nodeObj.style = {}
        clearSelect('.size', 'size-selected')
        let size = e.currentTarget
        mind.currentNode.nodeObj.style.fontSize = size.dataset.size
        size.className = 'size size-selected'
        mind.updateNodeStyle(mind.currentNode.nodeObj)
      })
  )
  bold.onclick = e => {
    if (!mind.currentNode.nodeObj.style) mind.currentNode.nodeObj.style = {}
    if (mind.currentNode.nodeObj.style.fontWeight === 'bold') {
      delete mind.currentNode.nodeObj.style.fontWeight
      e.currentTarget.className = 'bold'
      mind.updateNodeStyle(mind.currentNode.nodeObj)
    } else {
      mind.currentNode.nodeObj.style.fontWeight = 'bold'
      e.currentTarget.className = 'bold size-selected'
      mind.updateNodeStyle(mind.currentNode.nodeObj)
    }
  }
  nodeTemplateGroup.onclick = e => {
    if (!mind.currentNode) return
    let templateId = e.target.getAttribute('data-id')

    let templateStyle = generateNewTemplateObj(nodeTemplate, templateId)
    let nodeObj = mind.currentNode.nodeObj
    mind.updateNodeObjStyle(nodeObj, templateStyle)
    mind.updateNodeStyle(nodeObj)
  }
  tagInput.onchange = e => {
    if (!mind.currentNode || mind.currentNode.nodeObj.root === true) return
    if (!e.target.value) {
      mind.currentNode.nodeObj.tags = []
    } else {
      mind.currentNode.nodeObj.tags = e.target.value.split(',')
    }
    mind.bus.fire('operation', {
      name: 'setTag',
      obj: mind.currentNode.nodeObj,
    })
    mind.updateNodeTags(mind.currentNode.nodeObj)
  }
  tagsGroup.onclick = e => {
    if (!mind.currentNode || mind.currentNode.nodeObj.root === true) return
    let tagValue = e.target.getAttribute('data-tag')
    if (!tagValue) return
    mind.currentNode.nodeObj.tags = mind.currentNode.nodeObj.tags || []
    let searchTag = mind.currentNode.nodeObj.tags.indexOf(tagValue)
    if (searchTag === -1) {
      mind.currentNode.nodeObj.tags.push(tagValue)
    } else {
      mind.currentNode.nodeObj.tags.splice(searchTag, 1)
    }
    tagInput.value = mind.currentNode.nodeObj.tags.join(',')
    mind.bus.fire('operation', {
      name: 'setTag',
      obj: mind.currentNode.nodeObj,
    })
    mind.updateNodeTags(mind.currentNode.nodeObj)
  }
  iconInput.onchange = e => {
    if (!mind.currentNode) return
    mind.currentNode.nodeObj.icons = e.target.value.split(',')
    mind.updateNodeIcons(mind.currentNode.nodeObj)
  }
  let state = 'open'
  buttonContainer.onclick = e => {
    if (state === 'open') {
      state = 'close'
      menuContainer.className = 'close'
      buttonContainer.innerHTML = `<svg class="icon" aria-hidden="true">
    <use xlink:href="#icon-menu"></use>
    </svg>`
    } else {
      state = 'open'
      menuContainer.className = ''
      buttonContainer.innerHTML = `<svg class="icon" aria-hidden="true">
    <use xlink:href="#icon-close"></use>
    </svg>`
    }
  }
  mind.bus.addListener('unselectNode', function() {
    menuContainer.hidden = true
  })
  mind.bus.addListener('selectNode', function(nodeObj) {
    menuContainer.hidden = false
    clearSelect('.palette', 'nmenu-selected')
    clearSelect('.size', 'size-selected')
    clearSelect('.bold', 'size-selected')
    resetButtonStatus('node-template')
    if (nodeObj.style) {
      if (nodeObj.style.fontSize)
        menuContainer.querySelector(
          '.size[data-size="' + nodeObj.style.fontSize + '"]'
        ).className = 'size size-selected'
      if (nodeObj.style.fontWeight)
        menuContainer.querySelector('.bold').className = 'bold size-selected'
      if (nodeObj.style.color && colorList.indexOf(nodeObj.style.color) !== -1)
        menuContainer.querySelector(
          '.palette.fontcolor-palette[data-color="' + nodeObj.style.color + '"]'
        ).className = 'palette fontcolor-palette nmenu-selected'
      if (nodeObj.style.background && colorList.indexOf(nodeObj.style.background) !== -1)
        menuContainer.querySelector(
            '.palette.background-palette[data-color="' + nodeObj.style.background + '"]'
        ).className = 'palette background-palette nmenu-selected'
    }
    if (nodeObj.tags) {
      tagInput.value = nodeObj.tags.join(',')
    } else {
      tagInput.value = ''
    }
    if (nodeObj.icons) {
      iconInput.value = nodeObj.icons.join(',')
    } else {
      iconInput.value = ''
    }
  })
}
