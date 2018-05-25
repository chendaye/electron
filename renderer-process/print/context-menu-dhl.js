// 引入jQuery
const $ = require('jquery')
// 引入print
const printer = require('printer')

// const testUrl = 'http://www.rewrite56.com/YX_sJsBEkT12004/Dhl_Ctroller.php'
const testUrl = 'http://test.whgxwl.com:8001/YX_sJsBEkT12004/Dhl_Ctroller.php'
// const testUrl2 = 'http://www.rewrite56.com/YX_sJsBEkT12004/Dhl_auto.php'
const proUrl = 'http://cn.fs.com:8006/YX_kVc2yo2cmw0U/Dhl_Ctroller.php'

/**
 * 扫描枪自动打印
 */
function autoPrintDhl (debug = 'pro') {
  $(document).ready(function () {
    // 获取光标
    $('#scanning_gun_dhl_dhl').focus()
    // 获取打印机
    $('.dhl').append(getPrint())
    // 监听输入框粘贴事件(扫描) paste  keyup--op.keyCode === 13
    // $('#scanning_gun_dhl').on('keyup', function (op) {
    $('#scanning_gun_dhl').bind('input porpertychange', function () {
      // 扫描时先清空值
      $('.append_check_dhl').html(null)
      // 当粘贴事件触发时，输入框里面还没有数据。 粘贴完成过后 setTimeout() 延时执行，再获取刚刚粘贴完成的值
      setTimeout(function () {
        // 扫描枪的值
        let cw = $('#scanning_gun_dhl').val()
        // 是否手动
        let manual = $('.manual_submit_dhl').attr('checked')
        if (cw) {
          let url = debug === 'dev' ? testUrl : proUrl
          $.ajax({
            type: 'POST',
            url: url,
            data: {
              'action': 'check',
              'CW': cw
            },
            dataType: 'json',
            success: function (msg) {
              // 获取订单信息
              checkData(msg)
              if (manual === 'checked') {
                $(document).on('click', '#submit', function () {
                  $(this).addClass('loading')
                  $('#scanning_gun_dhl').next().remove()
                  base64(debug)
                })
              } else {
                base64(debug)
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
    let address = msg.address
    let PersonName = address.PersonName
    let CompanyName = address.CompanyName
    let PhoneNumber = address.PhoneNumber
    // 地址
    let StreetLines1 = address.AddressLineOne
    let StreetLines2 = address.AddressLineTwo
    let City = address.City
    let DivisionCode = address.DivisionCode
    let PostalCode = address.PostalCode
    let CountryCode = address.CountryCode
    let CountryName = address.CountryName
    // 州省信息
    let CA = msg.CA
    let US = msg.US
    // 货物描述
    let Des = msg.description
    // 海关总价
    let totalVal = msg.totalValue
    // 是否是海外仓
    let isAbroad = msg.isAbroad
    // 账号
    // $('input[name="shipping_count"]').val(DhlCount)
    // 支付信息
    // 运费支付类型
    checkStr += '<div class="ui huge header">支付方式账号:</div>'
    checkStr += '<div class="column"><div class="ui form"><div class="three fields">'
    checkStr += '<div class="field"><label>运费支付类型：</label><select class="ui fluid dropdown" id="shipping_type" name="shipping_type">'
    checkStr += ' <option value="SENDER">寄件人</option>' +
      '<option value="RECIPIENT">收件人</option>' +
      '<option value="THIRD_PARTY">第三方</option> '
    checkStr += ' </select></div>'
    checkStr += '<div class="field shipping_type_input"><label>公司账号</label><input name="shipping_account" class="shipping_account" maxlength="4" placeholder="公司账号" type="text" value="603694967"></div>'
    checkStr += '<div class="field pay_shipping_account"><label>支付账号</label><input name="pay_shipping_account" class="pay_shipping_account" maxlength="4" placeholder="支付账号" type="text" value=""></div>'
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
    checkStr += '<div class="column"><div class="ui form"><div class="three fields">'
    checkStr += '<div class="field"><label>地址1：</label><input placeholder="地址栏1" type="text" value="' + StreetLines1 + '" name="StreetLines1"></div>'
    checkStr += '<div class="field"><label>地址2：</label><input placeholder="地址栏2" type="text" value="' + StreetLines2 + '" name="StreetLines2"></div>'
    checkStr += '<div class="field"><label>地址3：</label><input placeholder="地址栏3" type="text" value="" name="StreetLines3"></div>'
    checkStr += '</div></div></div>'
    checkStr += '<div class="column"><div class="ui form"><div class="four fields">'
    checkStr += '<div class="field"><label>国家：</label><input placeholder="国家" type="text" value="' + CountryCode + '" name="CountryCode"></div>'
    checkStr += '<div class="field"><label>国家名：</label><input placeholder="国家名" type="text" value="' + CountryName + '" name="CountryName"></div>'
    checkStr += '<div class="field"><label>城市：</label><input placeholder="城市" type="text" value="' + City + '" name="City"></div>'
    checkStr += '<div class="field"><label>邮编：</label><input placeholder="邮编" type="text" value="' + PostalCode + '" name="PostalCode"></div>'
    checkStr += '</div></div></div>'
    checkStr += '<div class="column"><div class="ui form"><div class="two fields">'
    checkStr += '<div class="field"><label>电话：</label><input placeholder="电话" type="text" value="' + PhoneNumber + '" name="PhoneNumber"></div>'
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
        if (DivisionCode === item) {
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
        if (DivisionCode === item) {
          checkStr += '<option value="' + item + '" selected=selected>' + i + '</option>'
        } else {
          checkStr += '<option value="' + item + '">' + i + '</option>'
        }
      })
      checkStr += ' </select></div></div></div>'
    }

    // 包裹信息
    let parcel = msg.parcel.parcel
    checkStr += '<div class="ui huge header">校验包裹信息:</div>'
    checkStr += '<table class="ui celled padded table"><thead><tr><th>包裹号</th><th>实重</th><th>材积</th><th>最终重量</th></tr></thead><tbody>'
    $.each(parcel, function (i, item) {
      checkStr += '<tr>'
      checkStr += '<td>' + (i + 1) + '</td>'
      checkStr += '<td><div class="ui transparent input"><input name="order_weight[]" style="width: 40px" type="text" value="' + item.order_weight + '">/' + item.weight_unit + '</div></td>'
      checkStr += '<td><div class="ui transparent input"><input name="product_volum[]" style="width: 40px" type="text" value="' + item.product_volume + '">/' + item.volume_unit + '</div></td>'
      checkStr += '<td><div class="ui transparent input"><input name="true_weight[]" style="width: 40px" type="text" value="' + item.true_weight + '">/' + item.true_unit + '</div></td>'
      checkStr += '</tr>'
    })
    checkStr += '</tbody></table>'
    checkStr += '<div class="ui right labeled input">\n' +
      '  <label for="amount" class="ui label">总重量</label>\n' +
      '  <input style="width: 60px" name="total_weight" placeholder="总重量" id="amount" type="text" value="' + msg.parcel.total_weight + '">\n' +
      '  <div class="ui basic label">KG</div>\n' +
      '</div>'

    // 货物描述
    checkStr += '<div class="ui huge header">货物描述:</div>'
    checkStr += '<div class="ui right labeled input">\n' +
      '  <label  class="ui label">货物描述</label>\n' +
      '  <input name="Des" style="width: 500px" placeholder="货物描述"  type="text" value="' + Des + '">\n' +
      '</div>'
    // 海关总价
    checkStr += '<div class="ui huge header">海关总价:</div>'
    checkStr += '<div class="ui right labeled input">\n' +
      '  <label class="ui label">海关总价</label>\n' +
      '  <input name="totalVal"  placeholder="EIN/VAT"  type="text" value="' + totalVal + '">\n' +
      '</div>'
    // 提交按钮
    let manual = $('.manual_submit_dhl').attr('checked')
    if (manual === 'checked') {
      checkStr += '<div class="ui huge header"></div>'
      checkStr += '<div class="column"><div class="ui form"><div class="two fields"><div class="field"><button class="ui inverted green button" id="submit">提交</button></div></div></div></div>'
    }
    $('.append_check_dhl').html(checkStr)
  } else {
    checkStr = '<h3><b>客户信息获取失败！</b></h3>'
    $('.append_check_dhl').html(checkStr)
  }
}

/**
 * 测试单号 CW20180302335-DE（一票一件） CW20170524218（一票多件）
 * 请求base64
 */
function base64 (debug) {
  // 账号信息
  let CW = $('#scanning_gun_dhl').val()
  let shippingType = $('select[name="shipping_type"]').val()
  let shippingAccount = $('.shipping_account').val()
  let payShippingAccount = $('input[name="pay_shipping_account"]').val()
  let taxType = $('select[name="tax_type"]').val()
  let taxAccount = $('input[name="tax_account"]').val()
  // 校验信息
  let StreetLines1 = $('input[name="StreetLines1"]').val()
  let StreetLines2 = $('input[name="StreetLines2"]').val()
  let StreetLines3 = $('input[name="StreetLines3"]').val()
  let CountryCode = $('input[name="CountryCode"]').val()
  let City = $('input[name="City"]').val()
  let PostalCode = $('input[name="PostalCode"]').val()
  let PhoneNumber = $('input[name="PhoneNumber"]').val()
  let StateOrProvinceCode = $('select[name="StateOrProvinceCode"]').val()
  // 收件人
  let PersonName = $('input[name="PersonName"]').val()
  // 收件公司
  let CompanyName = $('input[name="CompanyName"]').val()
  // 货物描述
  let Des = $('input[name="Des"]').val()
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
    $('#scanning_gun_dhl').next().remove()
    $('#scanning_gun_dhl').after('<div class="ui left pointing red basic label">无效CW单号</div>')
    foucsScanDhl()
    return false
  }
  if (StreetLines1.length > 35) {
    $('input[name="StreetLines1"]').next().remove()
    $('input[name="StreetLines1"]').after('<div class="ui pointing red basic label">地址字符数不能超过35个</div>')
    foucsScanDhl()
    return false
  }
  if (StreetLines2 && StreetLines2.length > 35) {
    $('input[name="StreetLines2"]').next().remove()
    $('input[name="StreetLines2"]').after('<div class="ui pointing red basic label">地址字符数不能超过35个</div>')
    foucsScanDhl()
    return false
  }
  if (!CountryCode) {
    $('input[name="CountryCode"]').next().remove()
    $('input[name="CountryCode"]').after('<div class="ui pointing red basic label">国家代号不能为空</div>')
    foucsScanDhl()
    return false
  }
  if (!City) {
    $('input[name="City"]').next().remove()
    $('input[name="City"]').after('<div class="ui pointing red basic label">城市名不能为空</div>')
    foucsScanDhl()
    return false
  }
  if (!PostalCode) {
    $('input[name="PostalCode"]').next().remove()
    $('input[name="PostalCode"]').after('<div class="ui pointing red basic label">邮编不能为空</div>')
    foucsScanDhl()
    return false
  }
  if (!PersonName) {
    $('input[name="PersonName"]').next().remove()
    $('input[name="PersonName"]').after('<div class="ui pointing red basic label">收件人不能为空</div>')
    foucsScanDhl()
    return false
  }
  if (!CompanyName) {
    $('input[name="CompanyName"]').next().remove()
    $('input[name="CompanyName"]').after('<div class="ui pointing red basic label">公司名不能为空</div>')
    foucsScanDhl()
    return false
  }
  let data = {
    'action': 'request',
    'CW': CW,
    'shipping_type': shippingType,
    'shipping_account': shippingAccount,
    'pay_shipping_account': payShippingAccount,
    'tax_type': taxType,
    'tax_account': taxAccount,
    'StreetLines_1': StreetLines1,
    'StreetLines_2': StreetLines2,
    'StreetLines_3': StreetLines3,
    'CountryCode': CountryCode,
    'City': City,
    'PostalCode': PostalCode,
    'PhoneNumber': PhoneNumber,
    'DivisionCode': StateOrProvinceCode,
    'weight': weight,
    'volum': volum,
    'true_weight': trueWeight,
    'total_weight': totalWeight,
    'Des': Des,
    'total_val': totalVal,
    'PersonName': PersonName,
    'CompanyName': CompanyName
  }
  let url = debug === 'dev' ? testUrl : proUrl
  $.ajax({
    type: 'POST',
    // async:false,同步执行，一个个来
    url: url,
    dataType: 'json',
    data: data,
    success: function (msg) {
      // 打印机名称
      let printName = $('.dhl').val()
      let status = msg.status
      let responseStr = ''
      if (status[0] === 'Success') {
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
      $('.append_check_dhl').html(responseStr)
      if (status !== 0) {
        // 不断获取焦点
        setInterval(function () {
          $('#scanning_gun_dhl').blur(function () {
            $(this).focus()
          })
        }, 100)
      } else {
        // 粘贴订单号，同时获取焦点
        $(document).on('copy', '.track_number', function () {
          setTimeout(function () {
            foucsScanDhl()
          })
        })
      }
      // 打印完成重新获取焦点
      $('#scanning_gun_dhl').val(null)
      foucsScanDhl()
    }
  })
}

// 轮询执行，500ms一次
setInterval(autoPrintDhl(), 500)

// 手动提交
$('.manual_submit_dhl').change(function () {
  if ($(this).attr('checked') === 'checked') {
    $(this).attr('checked', null)
  } else {
    $(this).attr('checked', 'checked')
  }
  foucsScanDhl()
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
function foucsScanDhl () {
  $('#scanning_gun_dhl').focus()
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
  $('.scanning_gun_dhl').blur(function () {
    if (!$('.append_check_dhl').html()) {
      $(this).focus()
    }
  })
  if (!$('.append_check_dhl').html() && document.activeElement.id !== 'scanning_gun_dhl') {
    foucsScanDhl()
  }
}, 100)

