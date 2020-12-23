import canvasBg from './canvasBg';
import canvasLine from './canvasLine';
import $ from '../plugins/jquery-3.5.1.min';
import './toast.js';

const API_URL = {
  pro: 'https://docs-api.kylin.network',
  test: '/api/index.html',
}

let data = {
  isMobile: false,
  headerBoxHeight: 0,
  isAutoScroll: false,
  lastWidth: undefined,
  clickScrollBtnId: undefined, // id
  innerHeight: undefined,
  inBottom: false,
  headerTopHeightHarf: 0,
  scrollTop: 0,
  topSpaceArr: [],
  $headBox: null,
  doms: null,
  $tipBox: null, // dom
  tipBoxSpaceTop: 300, //  (px)
}

$(() => {

  setBg()
  setCanvasLine()
 
  setTipBox()
 
  setHeaderBoxHeight()
  // window
  addResizeWatch()
  //  + window
  setScrollBtn()
 
  bindEvent()
})

// 
function setTipBox() {
  let $tipBox = $('.tipBox')
  if ($tipBox.length) data.$tipBox = $tipBox
  if (data.$tipBox) {
    let $close = data.$tipBox.find('.close')
    $close.on('click', function() {
      data.$tipBox.hide()
      data.$tipBox = null
    })
  }
}

// 
function setBg() {
  canvasBg({
    dom: document.querySelector('.bgAnimate')
  })
}

// 
function setCanvasLine() {
  {
    let $allItem = $('.roadMap .mainCon .list:not(.next) .item')
    let $nextList = $('.roadMap .mainCon .list.next')
    for (let i = 0; i < $allItem.length; i++) {
      // ,
      if (i % 2) $nextList.append($($allItem[i]))
    }
    let width = document.body.clientWidth
    data.isMobile = width < 900
    setTimeout(() => {
      canvasLine({
        parentDom: document.querySelector('.curve'),
        isMobile: data.isMobile,
      })
      $(window).on('resize', () => {
        let newWidth = document.body.clientWidth
        if (width < 900 && newWidth >= 900) $('.headBox .header .right').css({display: 'flex'})
        if (newWidth !== width) {
          width = newWidth
          canvasLine({
            parentDom: document.querySelector('.curve'),
            isMobile: data.isMobile,
          })
        }
      })
    }, 0);
  }
}

// 
function bindEvent() {
  let $items = $('.application .list .item')
  $items.on('mouseenter', function() {
    $items.removeClass('active')
    $(this).addClass('active')
  })

  { // Top color bar word close
    $('.closeX').on('click', () => {
      $('.topLineBox').addClass('hide')
      $('.banner').addClass('hideTopBar')
    })

  }

  { // menuPopBox ,url
    let $apiDocsBtn = $('.menuPopBox .pop .apiDocsBtn')
    let origin = window.location.origin
    if (origin.indexOf('jar.today') > -1 || origin.indexOf('http:') > -1 ) $apiDocsBtn.attr('href', API_URL.test)
    else $apiDocsBtn.attr('href', API_URL.pro)
  }

  {
    let $headRight = $('.headBox .header .right')
    let $hamburger = $('.hamburger')
    let clickBtn = false
    $hamburger.on('click', function() {
      if (!data.isMobile) return
      if ($hamburger.hasClass('is-active')) { // ,
        clickBtn = false
        $headRight.css({display: 'none'})
      } else { // ,
        clickBtn = true
        $headRight.css({display: 'flex'})
      }
      $hamburger.toggleClass('is-active')
    })
    if (data.isMobile) {
      let $oracle = $('.headBox .header .right .menuPopBox')
      $oracle.on('click', function(e) {
        let $this = $(this)
        if ($this.hasClass('show')) { // ,
          $this.removeClass('show')
        } else {
          $this.addClass('show')
        }
        e.stopPropagation()
      })
    }
    $('body').on('click', function() {
      if (!data.isMobile) return
      setTimeout(() => {
        if (!clickBtn) {
          $headRight.css({display: 'none'})
          $hamburger.removeClass('is-active')
        }
        clickBtn = false
      }, 0)
    })
  }

  {
    let $btn = $('.footer .right .menuPopBox')
    if (data.isMobile) {
      $btn.on('click', function() {
        let $this = $(this)
        if ($this.hasClass('show')) return
        $this.addClass('show')
        setTimeout(() => {
          $(window).on('click', removeShow)
        }, 0);
      })
    }
    function removeShow() {
      $btn.removeClass('show')
      $(window).off('click', removeShow)
    }
  }
  
  $('.subscribeBtn').on('click', () => {
    let email = $.trim($('.subscribeInp').val())
    if (!email) {
      toast({
        type: 'warn',
        message: 'Please input Email!'
      })
      return
    }
    let reg = new RegExp("^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$"); 
    if (!reg.test(email)) {
      toast({
        type: 'warn',
        message: 'Please input the email address with the right format!'
      })
      return
    }
    $.ajax({
      url: `https://api.kylin.network/saveEmail?email=` + email
    }).then(result => {
      try {
        result = JSON.parse(result)
        if (result.code === 200) {
          toast({
            type: '',
            message: 'Subscription Succeeded!'
          })
        } else throw ""
      } catch(err) {
        throw err;
      }
    }).catch(err => {
      toast({
        type: 'error',
        message: 'Please retry!'
      })
      console.error(err)
    })
  })


  {
   
    let $popPage = $('.popPage')
    let $popPageBox = $('.popPage').find('.box')
    let $video = $popPage.find('video')

    $video.remove()
    if ($popPage[0]) {
     
      $('.banner .btn .btnBox').on('click', () => {
        $video.attr('src', $video.attr('data_src'))
        $video[0].currentTime = 0
        $popPageBox.append($video)
        $popPage.addClass('active')
        $video[0].play()
        
         $('html').css({'margin-right': getScrollWidth(), 'overflow': 'hidden'})
      })
    
     
      $('.popPage .shadow').on('click', closePopPage);
      $('.popPage .box .close').on('click', closePopPage);
    
      // pop
      function closePopPage() {
        $video.remove()
        $popPage.removeClass('active')
       
        $('html').css({'margin-right': 0, 'overflow': 'auto'})
      }
    }

   
    function getScrollWidth() {  
      var noScroll, scroll, oDiv = document.createElement("DIV");  
      oDiv.style.cssText = "position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;";  
      noScroll = document.body.appendChild(oDiv).clientWidth;  
      oDiv.style.overflowY = "scroll";  
      scroll = oDiv.clientWidth;  
      document.body.removeChild(oDiv);  
      return noScroll-scroll;  
    }
  }
}

// window
function addResizeWatch() {
  $(window).on('resize', resize)
  resize()

  function resize() {
    var width = document.body.clientWidth
    data.isMobile = width < 900
    data.innerHeight = window.innerHeight
   
    if (data.lastWidth !== width) {
      if (data.doms) {
        for (let i = 0; i < data.doms.length; i++) {
          $(data.doms[i]).css({width: 'auto'})
        }
      }
     
      setHeaderBoxHeight()
      //  + window
      setScrollBtn()
      data.scrollTop = (document.documentElement.scrollTop || document.body.scrollTop)
    }
    data.lastWidth = width
  }
}

// 
function setHeaderBoxHeight() {
  data.headerBoxHeight = Math.ceil($('.header').height() || 0) - 2
  if ($('.headerTop').length) data.headerTopHeightHarf = ($('.headerTop').height() || 0) / 2
}

//  + window
function setScrollBtn() {
  setTimeout(() => {
    data.doms = document.querySelectorAll('.header .right button[targetclassname]')
    data.$headBox = $('.headBox')
    $(window).off('scroll', windowScroll)
    $(window).on('scroll', windowScroll)
    if (!data.doms || !data.doms.length) return
    data.topSpaceArr = [] // dom
    for (let i = 0; i < data.doms.length; i++) {
      let dom = data.doms[i], $dom = $(dom)
      let targetClassName = dom.getAttribute('targetclassname')
      if (!targetClassName) continue
      let targetDom = document.querySelector('.' + targetClassName)
      if (!targetDom) continue
      let widthInner = $dom.width()
      if (!data.isMobile) $dom.css({width: widthInner})
      let widthOut = $dom.outerWidth()
      let spaceLeft = $dom.position().left
      if (spaceLeft < 0) spaceLeft = 0
      data.topSpaceArr.push({
        width: Math.ceil(widthOut),
        spaceLeft: Math.ceil(spaceLeft),
        btnDom: dom,
        targetSpace: $dom.attr('first') ? 0 : targetDom.offsetTop - data.headerBoxHeight,
      })
      let targetclassname = dom.getAttribute('targetclassname')
      let inDoms = $(`[targetclassname=${targetclassname}]`)
      for (let i = 0; i < inDoms.length; i++) {
        inDoms[i].onclick = judge
      }
     
      function judge() {
        let targetClassName = this.getAttribute('targetclassname')
        if (!targetClassName) return
        let targetDom = document.querySelector('.' + targetClassName)
        if (!targetDom) return
        let clickScrollBtnId = +new Date()
        data.clickScrollBtnId = clickScrollBtnId
        scrollSmoothTo($dom.attr('first') ? 0 : targetDom.offsetTop - data.headerBoxHeight / 2, data.doms, this, clickScrollBtnId, data.topSpaceArr[i])
      }
    }
    windowScroll()
  }, 0);
}
// window
function windowScroll() {
  data.scrollTop = (document.documentElement.scrollTop || document.body.scrollTop)
  if (data.$tipBox) {
    if (data.scrollTop > data.tipBoxSpaceTop && !data.$tipBox.hasClass('opacity0')) {
      data.$tipBox.addClass('opacity0')
    } else if (data.scrollTop <= data.tipBoxSpaceTop && data.$tipBox.hasClass('opacity0')) {
      data.$tipBox.removeClass('opacity0')
    }
  }
  var scrollTop = data.scrollTop + 1
  if (data.headerTopHeightHarf) {
    if (scrollTop >= data.headerTopHeightHarf && !data.$headBox.hasClass('up')) data.$headBox.addClass('up')
    else if (scrollTop < data.headerTopHeightHarf && data.$headBox.hasClass('up')) data.$headBox.removeClass('up')
  }
  if (data.isAutoScroll) return
  if (data.topSpaceArr && data.topSpaceArr.length) {
    let find = false
    for (var i = 0; i < data.topSpaceArr.length; i++) {
      var obj = data.topSpaceArr[i]
      var targetSpace = obj.targetSpace
      if (targetSpace <= scrollTop) {
        if (!data.topSpaceArr[i + 1] || data.topSpaceArr[i + 1].targetSpace > scrollTop) {
          if (!obj.btnDom.classList.contains('active')) {
            for (var i = 0; i < data.doms.length; i++) {
              data.doms[i].classList.remove('active')
            }
            obj.btnDom.classList.add('active')
          }
          let $flagLine = $('.flagLine')
          if ($flagLine.attr('data_width') != obj.width || $flagLine.attr('data_left') != obj.spaceLeft) {
            $flagLine.css({width: obj.width, left: obj.spaceLeft})
            $flagLine.attr({data_width: obj.width, data_left: obj.spaceLeft})
          }
          find = true
          break
        }
      } else {
        if (obj.btnDom.classList.contains('active')) {
          data.doms[i].classList.remove('active')
        }
      }
    }
    if (!find) {
      let $flagLine = $('.flagLine')
      $flagLine.css({width: 0, left: 0})
      $flagLine.attr({data_width: 0, data_left: 0})
    }
  }
}

// 
function scrollSmoothTo(position, doms, btnDom, clickScrollBtnId, obj) {
  if (clickScrollBtnId !== data.clickScrollBtnId) return
 
  for (var i = 0; i < doms.length; i++) {
    doms[i].classList.remove('active')
  }
  btnDom.classList.add('active')
  let $flagLine = $('.flagLine')
  if ($flagLine.attr('data_width') != obj.width || $flagLine.attr('data_left') != obj.spaceLeft) {
    $flagLine.css({width: obj.width, left: obj.spaceLeft})
    $flagLine.attr({data_width: obj.width, data_left: obj.spaceLeft})
  }
  data.isAutoScroll = true
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback) {
      setTimeout(callback, 20)
    }
  }
 
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  // step
  var step = function() {
    if (clickScrollBtnId !== data.clickScrollBtnId) return
   
    var distance = position - scrollTop
   
    var space = distance / 10
    space > 0 && space < 3 ? space = 3 : ''
    space < 0 && space > -3 ? space = -3 : ''
    scrollTop = scrollTop + space
    if (Math.abs(distance) < 4) {
      data.isAutoScroll = false
      window.scrollTo(0, position)
    } else {
      window.scrollTo(0, scrollTop)
      requestAnimationFrame(step)
    }
  }
  step()
}