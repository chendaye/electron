const ipc = require('electron').ipcRenderer
// 引入jQuery
const $ = require('jquery')

// 告诉主进程在单击示例按钮时显示菜单
const contextMenuBtn = document.getElementById('context-menu')
contextMenuBtn.addEventListener('click', function () {
  ipc.send('show-context-menu')
})

/**
 * 扫描枪自动打印
 */
function autoPrint (debug = 'dev') {
  $(document).ready(function () {
    // 获取光标
    $('#scanning_gun').focus()
    // 监听输入框粘贴事件(扫描) paste
    $('#scanning_gun').on('paste', function () {
      // 扫描时先清空值
      $('#scanning_gun').val(null)
      // 当粘贴事件触发时，输入框里面还没有数据。 粘贴完成过后 setTimeout() 延时执行，再获取刚刚粘贴完成的值
      setTimeout(function () {
        // 扫描枪的值
        let cw = $('#scanning_gun').val()
        if (cw) {
          // 测试单号 CW20170527113（一票一件） CW20170524218（一票多件）
          const testUrl = 'http://www.rewrite56.com/YX_sJsBEkT12004/Fedex_Ctroller.php'
          const proUrl = 'http://cn.fs.com:8006/YX_kVc2yo2cmw0U/Fedex_Ctroller.php'
          let url = debug === 'dev' ? testUrl : proUrl
          $.ajax({
            type: 'POST',
            url: url,
            data: {
              'action': 'check',
              'FS': 'FS2017052393',
              'CW': cw
            },
            dataType: 'json',
            success: function (msg) {
              // todo: 执行打印的逻辑
              console.log(msg)
              checkData(msg)
              // 打印完成重新获取焦点
              $('#scanning_gun').focus()
            }
          })
        }
      })
    })
  })
}

function checkData (msg) {
  // 追加信息
  let checkStr = ''
  if (msg) {
    // 联系方式
    let PersonName = msg.contact.PersonName
    let CompanyName = msg.contact.CompanyName
    let PhoneNumber = msg.contact.PhoneNumber
    let PhoneExtension = msg.contact.PhoneExtension
    // 地址
    let StreetLines = msg.address.StreetLines
    let StreetLines1 = StreetLines[0]
    let StreetLines2 = StreetLines[1]
    let City = msg.address.City
    let StateOrProvinceCode = msg.address.StateOrProvinceCode
    let PostalCode = msg.address.PostalCode
    let CountryCode = msg.address.CountryCode
    // 参考信息
    // let ReferencesType = msg.References.type
    let ReferencesMsg = msg.References.msg
    let EIN = msg.EIN
    // let FedexCount = msg.FedexCount
    let CA = msg.CA
    let US = msg.US
    // 货物描述
    let Des = msg.Des
    // EIN/VAT
    let FedexType = msg.Fedex_type
    // 海关总价
    let totalVal = msg.total_val
    // 账号
    // $('input[name="shipping_count"]').val(FedexCount)
    // 客户信息
    checkStr += '<div class="ui huge header">校验客户信息:</div>'
    if (StreetLines1 && StreetLines2) {
      checkStr += '<div class="column"><div class="ui form"><div class="two fields">'
      checkStr += '<div class="field"><label>地址1：</label><input placeholder="地址栏1" type="text" value="' + StreetLines1 + '" name="StreetLines[]"></div>'
      checkStr += '<div class="field"><label>地址2：</label><input placeholder="地址栏2" type="text" value="' + StreetLines2 + '" name="StreetLines[]"></div>'
      checkStr += '</div></div></div>'
    }
    if (!StreetLines2) {
      checkStr += '<div class="column"><div class="ui form"><div class="one fields">'
      checkStr += '<div class="eight wide field"><label>地址1：</label><input placeholder="地址栏1" type="text" value="' + StreetLines1 + '" name="StreetLines[]"></div>'
      checkStr += '</div></div></div>'
    }
    checkStr += '<div class="column"><div class="ui form"><div class="three fields">'
    checkStr += '<div class="field"><label>国家：</label><input placeholder="国家" type="text" value="' + CountryCode + '" name="CountryCode"></div>'
    checkStr += '<div class="field"><label>城市：</label><input placeholder="城市" type="text" value="' + City + '" name="City"></div>'
    checkStr += '<div class="field"><label>邮编：</label><input placeholder="邮编" type="text" value="' + PostalCode + '" name="PostalCode"></div>'
    checkStr += '</div></div></div>'
    checkStr += '<div class="column"><div class="ui form"><div class="two fields">'
    checkStr += '<div class="field"><label>电话：</label><input placeholder="电话" type="text" value="' + PhoneNumber + '" name="PhoneNumber"></div>'
    checkStr += '<div class="three wide field"><label>分机：</label><input placeholder="分机" type="text" value="' + PhoneExtension + '" name="PhoneExtension"></div>'
    checkStr += '</div></div></div>'
    checkStr += '<div class="column"><div class="ui form"><div class="two fields">'
    checkStr += '<div class="field"><label>收件人：</label><input placeholder="收件人" type="text" value="' + PersonName + '" name="PersonName"></div>'
    checkStr += '<div class="field"><label>收件公司：</label><input placeholder="收件公司" type="text" value="' + CompanyName + '" name="CompanyName"></div>'
    checkStr += '</div></div></div>'
    if (CountryCode === 'CA') {
      checkStr += '<div class="column"><div class="ui form"><div class="two fields">'
      checkStr += '<div class="field"><label>州省代码(加拿大省、美国州)：</label><select class="ui fluid dropdown" name="StateOrProvinceCode">'
      checkStr += '<option value="">请选择省代码</option>'
      $.each(CA, function (i, item) {
        if (StateOrProvinceCode === item) {
          checkStr += '<option value="' + item + '" selected=selected>' + i + '</option>'
        } else {
          checkStr += '<option value="' + item + '">' + i + '</option>'
        }
      })
      checkStr += ' </select></div></div></div>'
    } else if (CountryCode === 'US' || 1) {
      checkStr += '<div class="column"><div class="ui form"><div class="two fields">'
      checkStr += '<div class="field"><label>州省代码(加拿大省、美国州)：</label><select class="ui fluid dropdown" name="StateOrProvinceCode">'
      checkStr += '<option value="">请选择州代码</option>'
      $.each(US, function (i, item) {
        if (StateOrProvinceCode === item) {
          checkStr += '<option value="' + item + '" selected=selected>' + i + '</option>'
        } else {
          checkStr += '<option value="' + item + '">' + i + '</option>'
        }
      })
      checkStr += ' </select></div></div></div>'
    }

    // 包裹信息
    let parcel = msg.parcel
    checkStr += '<div class="ui huge header">校验包裹信息:</div>'
    checkStr += '<table class="ui celled padded table"><thead><tr><th>包裹号</th><th>实重</th><th>材积</th><th>最终重量</th><th>长</th><th>宽</th><th>高</th></tr></thead><tbody>'
    $.each(parcel, function (i, item) {
      checkStr += '<tr>'
      checkStr += '<td>' + (i + 1) + '</td>'
      checkStr += '<td><div class="ui transparent input"><input name="order_weight[]" style="width: 40px" type="text" value="' + item.order_weight + '">/' + item.weight_unit + '</div></td>'
      checkStr += '<td><div class="ui transparent input"><input name="product_volum[]" style="width: 40px" type="text" value="' + item.product_volume + '">/' + item.volume_unit + '</div></td>'
      checkStr += '<td><div class="ui transparent input"><input name="true_weight[]" style="width: 40px" type="text" value="' + item.true_weight + '">/' + item.true_unit + '</div></td>'
      checkStr += '<td><div class="ui transparent input"><input name="product_length[]"  style="width: 40px" type="text" value="' + item.product_length + '">/' + item.size_unit + '</div></td>'
      checkStr += '<td><div class="ui transparent input"><input name="product_width[]" style="width: 40px" type="text" value="' + item.product_width + '">/' + item.size_unit + '</div></td>'
      checkStr += '<td><div class="ui transparent input"><input name="product_height[]" style="width: 40px" type="text" value="' + item.product_height + '">/' + item.size_unit + '</div></td>'
      checkStr += '</tr>'
    })
    checkStr += '</tbody></table>'
    checkStr += '<div class="ui right labeled input">\n' +
      '  <label for="amount" class="ui label">总重量</label>\n' +
      '  <input style="width: 60px" name="total_weight" placeholder="总重量" id="amount" type="text" value="' + msg.total_weight + '">\n' +
      '  <div class="ui basic label">' + msg.unit + '</div>\n' +
      '</div>'

    // 货物描述
    checkStr += '<div class="ui huge header">货物描述:</div>'
    checkStr += '<div class="ui right labeled input">\n' +
      '  <label  class="ui label">货物描述</label>\n' +
      '  <input name="Des" style="width: 500px" placeholder="货物描述"  type="text" value="' + Des + '">\n' +
      '</div>'

    // 参考信息（非必填）
    checkStr += '<div class="ui huge header">参考信息（非必填）:</div>'
    checkStr += '<div class="column"><div class="ui form"><div class="two fields">'
    checkStr += '<div class="field"><label>货件参考信息</label><select class="ui fluid dropdown" name="StateOrProvinceCode">'
    checkStr += ' <option value="P_O_NUMBER">P_O_NUMBER</option> ' +
    '<option value="INVOICE_NUMBER">INVOICE_NUMBER</option>' +
    '<option value="BILL_OF_LADING ">BILL_OF_LADING</option> ' +
    '<option value="DEPARTMENT_NUMBER">DEPARTMENT_NUMBER</option> ' +
    '<option value="ELECTRONIC_PRODUCT_CODE">ELECTRONIC_PRODUCT_CODE</option> ' +
    '<option value="INTRACOUNTRY_REGULATORY_REFERENCE">INTRACOUNTRY_REGULATORY_REFERENCE</option> ' +
    '<option value="RMA_ASSOCIATION">RMA_ASSOCIATION</option> <option value="SHIPMENT_INTEGRITY">SHIPMENT_INTEGRITY</option> ' +
    '<option value="STORE_NUMBER">STORE_NUMBER</option> '
    checkStr += ' </select></div>'
    checkStr += '<div class="field"><label>参考信息(PO 号)</label><input name="ReferencesMsg" maxlength="4" placeholder="PO 号" type="text" value="' + ReferencesMsg + '"></div>'
    checkStr += '</div></div></div>'

    // 服务类型
    checkStr += '<div class="ui huge header">服务类型</div>'
    checkStr += '<div class="column"><div class="ui form"><div class="two fields">'
    checkStr += '<div class="field"><select class="ui fluid dropdown" name="FedexType">'
    if (FedexType === 'INTERNATIONAL_ECONOMY') {
      checkStr += '<option  value="INTERNATIONAL_ECONOMY" selected="selected">IE</option> '
    } else {
      checkStr += '<option  value="INTERNATIONAL_ECONOMY" >IE</option> '
    }
    if (FedexType === 'INTERNATIONAL_PRIORITY') {
      checkStr += ' <option value="INTERNATIONAL_PRIORITY" selected="selected">IP</option> '
    } else {
      checkStr += ' <option value="INTERNATIONAL_PRIORITY">IP</option> '
    }
    checkStr += ' </select></div>'
    checkStr += '</div></div></div>'
    // 税号
    checkStr += '<div class="ui huge header">税号:</div>'
    checkStr += '<div class="ui right labeled input">\n' +
      '  <label class="ui label">税号</label>\n' +
      '  <input name="EIN"  placeholder="EIN/VAT"  type="text" value="' + EIN + '">\n' +
      '</div>'
    // 海关总价
    checkStr += '<div class="ui huge header">海关总价:</div>'
    checkStr += '<div class="ui right labeled input">\n' +
      '  <label class="ui label">海关总价</label>\n' +
      '  <input name="totalVal"  placeholder="EIN/VAT"  type="text" value="' + totalVal + '">\n' +
      '</div>'
    // append() 方法在被选元素的结尾插入内容。
    //  prepend() 方法在被选元素的开头插入内容。
    //  after() 方法在被选元素之后插入内容。
    //  before() 方法在被选元素之前插入内容。
    $('.append_check').after(checkStr)
    $('.check_button').css('display', 'none')
    $('.submit_button').css('display', 'block')
  } else {
    checkStr = '<tr ><td align="right"><h3><b>客户信息获取失败！</b></h3></td></tr>'
    $('.append_check').after(checkStr)
    $('.check_button').css('display', 'none')
    $('.submit_button').css('display', 'none')
  }
}

// 不断获取焦点
setInterval(function () {
  $('#scanning_gun').blur(function () {
    // $(this).focus()
  })
}, 100)

// 轮询执行，500ms一次
setInterval(autoPrint(), 500)
