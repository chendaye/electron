const ipc = require('electron').ipcRenderer
// 引入jQuery
const $ = require('jquery')
// 引入print
const printer = require('printer')

// const testUrl = 'http://www.rewrite56.com/YX_sJsBEkT12004/Fedex_Ctroller.php'
const testUrl = 'http://test.whgxwl.com:8001/YX_sJsBEkT12004/Fedex_Ctroller.php'
// const testUrl2 = 'http://www.rewrite56.com/YX_sJsBEkT12004/Fedex_auto.php'
const proUrl = 'http://cn.fs.com:8006/YX_kVc2yo2cmw0U/Fedex_Ctroller.php'

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
    // 获取打印机
    $('.ui.fluid.dropdown').append(getPrint())
    // 监听输入框粘贴事件(扫描) paste  keyup--op.keyCode === 13
    // $('#scanning_gun').on('keyup', function (op) {
    $('#scanning_gun').bind('input porpertychange', function () {
      // 扫描时先清空值
      $('.append_check').html(null)
      // 当粘贴事件触发时，输入框里面还没有数据。 粘贴完成过后 setTimeout() 延时执行，再获取刚刚粘贴完成的值
      setTimeout(function () {
        // 扫描枪的值
        let cw = $('#scanning_gun').val()
        // 是否手动
        let manual = $('.manual_submit').attr('checked')
        if (cw) {
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
              // 获取订单信息
              checkData(msg)
              if (manual === 'checked') {
                $(document).on('click', '#submit', function () {
                  $(this).addClass('loading')
                  $('#scanning_gun').next().remove()
                  base64()
                })
              } else {
                base64()
              }
            }
          })
        }
      })
    })
  })
}

/**
 * 获取订单信息以供检查
 * @param msg
 */
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
    // 支付信息
    // 运费支付类型
    checkStr += '<div class="ui huge header">支付方式账号:</div>'
    checkStr += '<div class="column"><div class="ui form"><div class="two fields">'
    checkStr += '<div class="field"><label>运费支付类型：</label><select class="ui fluid dropdown" id="shipping_type" name="shipping_type">'
    checkStr += ' <option value="SENDER">寄件人</option>' +
      '<option value="RECIPIENT">收件人</option>' +
      '<option value="THIRD_PARTY">第三方</option> '
    checkStr += ' </select></div>'
    checkStr += '<div class="field shipping_type_input"><label>账号：</label><select class="ui fluid dropdown shipping_account" name="shipping_account">'
    checkStr += '<option value="116131714">116131714</option>' +
      '<option value="833417886">833417886</option>'
    checkStr += ' </select></div>'
    checkStr += '</div></div></div>'
    // 关税支付类型
    checkStr += '<div class="column"><div class="ui form"><div class="two fields">'
    checkStr += '<div class="field"><label>关税支付类型：</label><select class="ui fluid dropdown" name="tax_type">'
    checkStr += ' <option value="SENDER">寄件人</option>' +
      '<option value="RECIPIENT" selected="selected">收件人</option>' +
      '<option value="THIRD_PARTY">第三方</option> '
    checkStr += ' </select></div>'
    checkStr += '<div class="field"><label>关税税金账号</label><input name="tax_account" maxlength="4" placeholder="关税税金账号" type="text" value=""></div>'
    checkStr += '</div></div></div>'
    // 客户信息
    checkStr += '<div class="ui huge header">校验客户信息:</div>'
    if (StreetLines1 && StreetLines2) {
      checkStr += '<div class="column"><div class="ui form"><div class="two fields">'
      checkStr += '<div class="field"><label>地址1：</label><input placeholder="地址栏1" type="text" value="' + StreetLines1 + '" name="StreetLines1"></div>'
      checkStr += '<div class="field"><label>地址2：</label><input placeholder="地址栏2" type="text" value="' + StreetLines2 + '" name="StreetLines2"></div>'
      checkStr += '</div></div></div>'
    }
    if (!StreetLines2) {
      checkStr += '<div class="column"><div class="ui form"><div class="one fields">'
      checkStr += '<div class="eight wide field"><label>地址1：</label><input placeholder="地址栏1" type="text" value="' + StreetLines1 + '" name="StreetLines1"></div>'
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
    } else if (CountryCode === 'US') {
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
    checkStr += '<div class="field"><label>货件参考信息</label><select class="ui fluid dropdown" name="References_type">'
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
    // 提交按钮
    let manual = $('.manual_submit').attr('checked')
    if (manual === 'checked') {
      checkStr += '<div class="ui huge header"></div>'
      checkStr += '<div class="column"><div class="ui form"><div class="two fields"><div class="field"><button class="ui inverted green button" id="submit">提交</button></div></div></div></div>'
    }
    $('.append_check').html(checkStr)
  } else {
    checkStr = '<h3><b>客户信息获取失败！</b></h3>'
    $('.append_check').html(checkStr)
  }
}

/**
 * 测试单号 CW20170527113（一票一件） CW20170524218（一票多件）
 * 请求base64
 */
function base64 () {
  // 账号信息
  let FS = 'FS2017052393'
  let CW = $('#scanning_gun').val()
  let shippingType = $('select[name="shipping_type"]').val()
  let shippingAccount = $('.shipping_account').val()
  let taxType = $('select[name="tax_type"]').val()
  let taxAccount = $('input[name="tax_account"]').val()
  // 校验信息
  let StreetLines1 = $('input[name="StreetLines1"]').val()
  let StreetLines2 = $('input[name="StreetLines2"]').val()
  let CountryCode = $('input[name="CountryCode"]').val()
  let City = $('input[name="City"]').val()
  let PostalCode = $('input[name="PostalCode"]').val()
  let PhoneNumber = $('input[name="PhoneNumber"]').val()
  let PhoneExtension = $('input[name="PhoneExtension"]').val()
  let StateOrProvinceCode = $('select[name="StateOrProvinceCode"]').val()
  // 收件人
  let PersonName = $('input[name="PersonName"]').val()
  // 收件公司
  let CompanyName = $('input[name="CompanyName"]').val()
  // 参考信息
  let CustomerReferenceType = $('select[name="References_type"]').val()
  let ReferencesMsg = $('input[name="ReferencesMsg"]').val()
  let EIN = $('input[name="EIN"]').val()
  // 货物描述
  let Des = $('input[name="Des"]').val()
  // EIN/VAT
  let FedexType = $('select[name="FedexType"]').val()
  // 海关总价
  let totalVal = $('input[name="totalVal"]').val()

  // 包裹信息
  let weight = []
  let volum = []
  let length = []
  let width = []
  let height = []
  let trueWeight = []
  let i = 0
  $('input[name="order_weight[]"]').each(function (index, item) {
    weight[i] = $(this).val()
    i++
  })
  i = 0
  $('input[name="product_volum[]"]').each(function (index, item) {
    volum[i] = $(this).val()
    i++
  })
  i = 0
  $('input[name="product_length[]"]').each(function (index, item) {
    length[i] = $(this).val()
    i++
  })
  i = 0
  $('input[name="product_width[]"]').each(function (index, item) {
    width[i] = $(this).val()
    i++
  })
  i = 0
  $('input[name="product_height[]"]').each(function (index, item) {
    height[i] = $(this).val()
    i++
  })
  i = 0
  $('input[name="true_weight[]"]').each(function (index, item) {
    trueWeight[i] = $(this).val()
    i++
  })
  let totalWeight = $('input[name="total_weight"]').val()
  // 校验信息
  let reg = /^(CW)/
  if (!CW || !reg.test(CW)) {
    $('#submit').removeClass('loading')
    $('#scanning_gun').next().remove()
    $('#scanning_gun').after('<div class="ui left pointing red basic label">无效CW单号</div>')
    foucsScan()
    return false
  }
  if (StreetLines1.length > 35) {
    $('input[name="StreetLines1"]').next().remove()
    $('input[name="StreetLines1"]').after('<div class="ui pointing red basic label">地址字符数不能超过35个</div>')
    foucsScan()
    return false
  }
  if (StreetLines2 && StreetLines2.length > 35) {
    $('input[name="StreetLines2"]').next().remove()
    $('input[name="StreetLines2"]').after('<div class="ui pointing red basic label">地址字符数不能超过35个</div>')
    foucsScan()
    return false
  }
  if (!CountryCode) {
    $('input[name="CountryCode"]').next().remove()
    $('input[name="CountryCode"]').after('<div class="ui pointing red basic label">国家代号不能为空</div>')
    foucsScan()
    return false
  }
  if (!City) {
    $('input[name="City"]').next().remove()
    $('input[name="City"]').after('<div class="ui pointing red basic label">城市名不能为空</div>')
    foucsScan()
    return false
  }
  if (!PostalCode) {
    $('input[name="PostalCode"]').next().remove()
    $('input[name="PostalCode"]').after('<div class="ui pointing red basic label">邮编不能为空</div>')
    foucsScan()
    return false
  }
  if (!PersonName) {
    $('input[name="PersonName"]').next().remove()
    $('input[name="PersonName"]').after('<div class="ui pointing red basic label">收件人不能为空</div>')
    foucsScan()
    return false
  }
  if (!CompanyName) {
    $('input[name="CompanyName"]').next().remove()
    $('input[name="CompanyName"]').after('<div class="ui pointing red basic label">公司名不能为空</div>')
    foucsScan()
    return false
  }
  let data = {
    'action': 'request',
    'FS': FS,
    'CW': CW,
    'shipping_type': shippingType,
    'shipping_account': shippingAccount,
    'tax_type': taxType,
    'tax_account': taxAccount,
    'StreetLines_1': StreetLines1,
    'StreetLines_2': StreetLines2,
    'CountryCode': CountryCode,
    'City': City,
    'PostalCode': PostalCode,
    'PhoneNumber': PhoneNumber,
    'PhoneExtension': PhoneExtension,
    'StateOrProvinceCode': StateOrProvinceCode,
    'weight': weight,
    'volum': volum,
    'length': length,
    'width': width,
    'height': height,
    'true_weight': trueWeight,
    'total_weight': totalWeight,
    'CustomerReferenceType': CustomerReferenceType,
    'ReferenceTypeValue': ReferencesMsg,
    'EIN': EIN,
    'Des': Des,
    'Fedex_type': FedexType,
    'total_val': totalVal,
    'PersonName': PersonName,
    'CompanyName': CompanyName
  }
  $.ajax({
    type: 'POST',
    // async:false,同步执行，一个个来
    url: testUrl,
    dataType: 'json',
    data: data,
    success: function (msg) {
      // 打印机名称
      let printName = $('.ui.fluid.dropdown').val()
      let status = msg.error
      let responseStr = ''
      if (status === 0) {
        let trackNumber = msg.track_number
        let base64 = msg.base64
        responseStr += '<table class="ui celled padded table"><thead><tr><th>信息</th><th>描述</th></tr></thead><tbody>'
        responseStr += '<tr><td>CW号</td><td>' + CW + '</td></tr>'
        $.each(trackNumber, function (i, item) {
          if (item) {
            responseStr += '<tr><td>包裹号</td><td>' + (i + 1) + '</td></tr>'
            responseStr += '<tr><td>运单号</td><td><code class="track_number">' + trackNumber[i] + '</code></td></tr>'
            // 打印标签
            console.log(base64[i])
            printRaw(base64[i], printName)
          }
        })
        responseStr += '</tbody></table>'
      } else if (status === 1) {
        let error = msg.note_obj
        // let xml = msg.xml
        responseStr += '<table class="ui celled padded table"><thead><tr><th>信息</th><th>描述</th></tr></thead><tbody>'
        responseStr += '<tr><td>CW号</td><td>' + CW + '</td></tr>'
        $.each(error, function (i, item) {
          responseStr += '<tr><td>错误：' + (i + 1) + '</td><td></td></tr>'
          responseStr += '<tr><td>Severity</td><td>' + item.Severity + '</td></tr>'
          responseStr += '<tr><td>Source</td><td>' + item.Source + '</td></tr>'
          responseStr += '<tr><td>Code</td><td>' + item.Code + '</td></tr>'
          responseStr += '<tr><td>Message</td><td>' + item.Message + '</td></tr>'
          responseStr += '<tr><td>LocalizedMessage</td><td>' + item.LocalizedMessage + '</td></tr>'
        })
        responseStr += '</tbody></table>'
      } else if (status === 2) {
        let fault = msg.fault
        responseStr += '<table class="ui celled padded table"><thead><tr><th>信息</th><th>描述</th></tr></thead><tbody>'
        responseStr += '<tr><td>CW号</td><td>' + CW + '</td></tr>'
        responseStr += '<tr><td>Fault</td><td></td></tr>'
        responseStr += '<tr><td>Code</td><td>' + fault.Code + '</td></tr>'
        responseStr += '<tr><td>String</td><td>' + fault.String + '</td></tr>'
        responseStr += '<tr><td>Request</td><td>' + fault.Request + '</td></tr>'
        responseStr += '</tbody></table>'
      }
      $('.append_check').html(responseStr)
      if (status !== 0) {
        // 不断获取焦点
        setInterval(function () {
          $('#scanning_gun').blur(function () {
            $(this).focus()
          })
        }, 100)
      } else {
        // 粘贴订单号，同时获取焦点
        $(document).on('copy', '.track_number', function () {
          setTimeout(function () {
            foucsScan()
          })
        })
      }
      // 打印完成重新获取焦点
      $('#scanning_gun').val(null)
      foucsScan()
    }
  })
}

// 轮询执行，500ms一次
setInterval(autoPrint(), 500)

// 手动提交
$('.manual_submit').change(function () {
  if ($(this).attr('checked') === 'checked') {
    $(this).attr('checked', null)
  } else {
    $(this).attr('checked', 'checked')
  }
  foucsScan()
})

// 支付账号
$(document).on('change', '.field #shipping_type', function () {
  if ($(this).val() !== 'SENDER') {
    $('.shipping_type_input').children().remove()
    $('.shipping_type_input').html('<label>账号：</label><input class="shipping_account" name="shipping_account" maxlength="4" placeholder="运费支付账号" type="text" value="">')
  } else {
    $('.shipping_type_input').children().remove()
    $('.shipping_type_input').html('<label>账号：</label><select class="ui fluid dropdown shipping_account" name="shipping_account"><option value="116131714">116131714</option><option value="833417886">833417886</option></select></div>')
  }
})

// 聚焦
function foucsScan () {
  $('#scanning_gun').focus()
}

// 获取打印机 \\10.172.0.195\Zebra 2844
function getPrint () {
  let prints = printer.getPrinters()
  let str = '<option value="\\\\10.172.0.195\\Zebra 2844" selected="selected">\\\\10.172.0.195\\Zebra 2844</option>'
  for (let [index, elem] of prints.entries()) {
    str += '<option value="' + elem.name + '">' + elem.name + '</option>'
  }
  return str
}

// 打印标签
function printRaw (code, printerName) {
  printer.printDirect({
    data: code,
    printer: printerName,
    type: 'RAW',
    success: function () {
      console.log('printed')
    },
    error: function (err) {
      console.log(err)
    }
  })
}

// 没有显示内容的时候不断获取焦点
setInterval(function () {
  $('.scanning_gun').blur(function () {
    if (!$('.append_check').html()) {
      $(this).focus()
    }
  })
  if (!$('.append_check').html() && document.activeElement.id !== 'scanning_gun') {
    foucsScan()
  }
}, 100)


