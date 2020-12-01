import $ from '../plugins/jquery-3.5.1.min';
let itemXArr = [] // 
export default function(obj) {
  let { parentDom, isMobile } = obj

  // dom
  let $parentDom = $(parentDom) // dom
  let width_parentDom = $parentDom.width(), height_parentDom = $parentDom.height() // dom''
  if (isMobile) {
    var tempHeight = $parentDom.parent().height() // dom''

    height_parentDom = width_parentDom
    width_parentDom = tempHeight
  }

  let $dom = $parentDom.children('canvas')

  // 
  let width = width_parentDom * 2, height = height_parentDom * 2

  $dom.attr('width', width)
  $dom.attr('height', height)

  let ctx = $dom[0].getContext('2d')

  let $items = $('.roadMap .mainCon .list .item .date')

  itemXArr = []
  for (let i = 0; i < $items.length; i++) {
    let temp;
    if (isMobile) temp = Math.ceil($($items[i]).position().top) * 2
    else temp = Math.ceil($($items[i]).position().left) * 2
    itemXArr.push(temp)
  }

  // 
  drow({
    ctx,
    lineWidth: 0.03, //  
    lineColor: [230, 0, 122], // 
    width,
    height,
  })
}

// 
function drow(params) {
  let {
    ctx,
    lineWidth,
    lineColor,
    width,
    height,
  } = params

  lineWidth *= height

  let flag = 1.6
  let flagHeight = flag * height

  let x = 0
  let center_y = (height - flagHeight) / 2

  let condition = true, colorRGB = lineColor.join(','), widthHarf = width / 2
  let minOpacity = 0.01

  let allPointArr = [] // 
  while (condition) {
    let temp_y = height / 2 + Math.sin(x/120) * center_y
    // '',1,0.26
    let opacity
    if (x < widthHarf) opacity = minOpacity + (1 - minOpacity) * (x / widthHarf)
    else opacity = 1 - (1 - minOpacity) * ((x - widthHarf) / widthHarf)
    ctx.fillStyle = `rgba(${colorRGB},${opacity})`
    ctx.beginPath();
    ctx.arc(x, temp_y, lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();

    // ''
    allPointArr.push([x, temp_y])
    ctx.closePath();

    x++
    if (x > width) break
  }

  // ''
  for (let i = itemXArr.length - 1; i >= 0; i--) {
    let index = -1
    for (let j = 0; j < allPointArr.length; j++) {
      if (allPointArr[j][0] === itemXArr[i]) {
        index = j
        break
      }
    }

    if (index >= 0) {
      ctx.beginPath();
      itemXArr.splice(index, 1)
      // ''
      ctx.fillStyle = `#ffffff`
      ctx.arc(allPointArr[index][0], allPointArr[index][1], lineWidth * 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
  
      // ''
      ctx.beginPath();
      ctx.fillStyle = `rgba(${colorRGB}, 1)`
      ctx.arc(allPointArr[index][0], allPointArr[index][1], lineWidth * 1.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
  }
}