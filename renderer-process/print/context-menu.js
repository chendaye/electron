const ipc = require('electron').ipcRenderer
// 引入jQuery
const $ = require('jquery')

// 告诉主进程在单击示例按钮时显示菜单
const contextMenuBtn = document.getElementById('context-menu')
contextMenuBtn.addEventListener('click', function () {
  ipc.send('show-context-menu')
})

function autoPrint () {
  $(document).ready(function () {
    // 监听（回车-13）扫描枪
    $(document).keyup(function (event) {
      if (event.keyCode === 13) {
        let cw = $('#scanning_gun').val()
        let testUrl = 'http://www.rewrite56.com/YX_sJsBEkT12004/Fedex_auto.php'
        let proUrl = 'http://cn.fs.com:8006/YX_kVc2yo2cmw0U/Fedex_auto.php'
        $.ajax({
          type: 'POST',
          url: testUrl,
          data: {
            'cw': cw
          },
          dataType: 'json',
          success: function (data) {
            // todo: 执行打印的逻辑
            let t = setInterval(function () {
              if (t) {
                $('#scanning_gun').val(data)
                console.log(data)
                setTimeout(function () {}, 8000)
              } else {
                clearInterval(t)
              }
            }, 200)
            // 打印完成清空上一次扫描枪的值，重新获取焦点
            $('#scanning_gun').val(null)
            $('#scanning_gun').focus()
          }
        })
      }
    })
  })
}

// 轮询执行，500ms一次
setInterval(autoPrint(), 500)
