import $ from '../plugins/jquery-3.5.1.min';
window.toast = obj => {
  // {
  //   message, // 
  //   color, // -
  //   type, // -
  //   background, // -
  //   border, // -
  //   timer, // -
  // }
  let dom = $('.toast-box')
  clearTimeout(window.toastTimer)
  if (!dom.length) {
    dom = $('<div><div></div></div>')
    $('body').append(dom)
  }
  let color = obj.color || '#71c844'
  if (obj.type) {
    if (obj.type === 'warn') color = '#dda639'
    else if (obj.type === 'error') color = '#e9392a'
  }
  dom.css({
    'position': 'fixed',
    'top': '10%',
    'left': '50%',
    'width': '100%',
    'transform': 'translateX(-50%)',
    'display': 'none',
    'justify-content': 'center',
    'opacity': 0,
    'z-index': '1000',
  })
  dom.children('div').html(obj.message).css({
    'background': obj.background || '#fff',
    // 'font-size': '16px',
    'color': color,
    'display': 'inline-block',
    // 'max-width': '90%',
    // 'border-radius': '3px' || obj['border-radius'],
    'border': obj.border || '',
    // 'padding': '10px 20px',
    'box-shadow': '0 0 2px ' + color,
  })
  dom.addClass('toast-box').css('display', 'flex').animate({ 'opacity': 1 }, () => {
    window.toastTimer = setTimeout(() => {
      dom.animate({ 'opacity': 0 }, () => {
        dom.css('display', 'none')
      })
    }, obj.timer || 3000)
  })
}