import { dragMoveHelper } from './utils/index'
export default function (mind) {
  mind.map.addEventListener('click', e => {
    // if (dragMoveHelper.afterMoving) return
    e.preventDefault()
    if (e.target.nodeName === 'SPAN' && (e.target.className === 'topic-img-del' || e.target.className === 'del-button')) {
      mind.delSelectImg(e.target)
    } else if (e.target.nodeName === 'EPD') {
      mind.expandNode(e.target.previousSibling)
    } else if (
      e.target.parentElement.parentElement.parentElement.nodeName === 'T' ||
      e.target.parentElement.parentElement.parentElement.nodeName === 'ROOT'
    ) {
      if (e.target.nodeName === 'IMG') mind.selectImg(e.target)
      mind.selectNode(e.target.parentElement.parentElement)
    } else if (
        e.target.parentElement.parentElement.nodeName === 'T' ||
        e.target.parentElement.parentElement.nodeName === 'ROOT'
    ) {
      mind.selectNode(e.target.parentElement)
    } else if (
        e.target.parentElement.nodeName === 'T' ||
        e.target.parentElement.nodeName === 'ROOT'
    ) {
      mind.selectNode(e.target)
    } else if (e.target.nodeName === 'path') {
      if (e.target.parentElement.nodeName === 'g') {
        mind.selectLink(e.target.parentElement)
      }
    } else if (e.target.className === 'circle') {
      // skip circle
    } else {
      mind.unselectNode()
      mind.unselectImg()
      mind.hideLinkController()
    }
  })

  mind.map.addEventListener('dblclick', e => {
    e.preventDefault()
    if (!mind.editable) return
    if (
      e.target.parentElement.parentElement.parentElement.nodeName === 'T' ||
      e.target.parentElement.parentElement.parentElement.nodeName === 'ROOT'
    ) {
      mind.beginEdit(e.target.parentElement.parentElement)
    } else if (
      e.target.parentElement.parentElement.nodeName === 'T' ||
      e.target.parentElement.parentElement.nodeName === 'ROOT'
    ) {
      mind.beginEdit(e.target.parentElement)
    } else if (
      e.target.parentElement.nodeName === 'T' ||
      e.target.parentElement.nodeName === 'ROOT'
    ) {
      mind.beginEdit(e.target)
    }
  })

  /**
   * drag and move
   */
  mind.map.addEventListener('mousemove', e => {
    // click trigger mousemove in windows chrome
    // the 'true' is a string
    if (e.target.contentEditable !== 'true') {
      dragMoveHelper.onMove(e, mind.container)
    }
  })
  mind.map.addEventListener('mousedown', e => {
    if (e.target.contentEditable !== 'true') {
      dragMoveHelper.afterMoving = false
      dragMoveHelper.mousedown = true
    }
  })
  mind.map.addEventListener('mouseleave', e => {
    dragMoveHelper.clear()
  })
  mind.map.addEventListener('mouseup', e => {
    dragMoveHelper.clear()
  })
}
