﻿var colorArray = new Array();
var sizeArray = new Array();

/**
 * 删除图片组件
 * @param {any} obj
 */
function delColorGroup(obj) {
    var allGroup = $("#colorGroup").children("div.form-group");
    var indexNum = allGroup.length;
    if (indexNum <= 1) return;
    $(obj).parent().fadeOut("fast", function () {
        //获取同级的所有其他组件进行重组
        var allInput = jQuery(this).siblings('div.form-group');
        //循环遍历组件
        allInput.each(function (i, e) {
            //重组之前销毁select2
            $(e).find("select")
                .select2("destroy")
                .removeAttr("data-select2-id tabindex aria-hidden");
            $(e).find("option").removeAttr("data-select2-id");
            //分配初始化与名称
            combination($(e),i);
        });
        $(this).find("input[type=checkbox]").prop('checked', false);
        colorChecked();
        this.remove();
        $('.select2').select2();
    });
}

/**
 * 图片单选按钮事件
 * @param {为true程序不重新加载列表,为false程序重新加载列表} isLoad
 */
function colorChecked(isLoad) {
    colorArray = new Array();
    var allColorCbx = $('.skuColorInfo').find(".cbxColor");
    allColorCbx.each(function (i, e) {
        if ($(e).prop('checked')) {
            var colorSelect = $(e).parent().next().children("select");
            var colorObj = new Object();
            colorObj.val = colorSelect.val();
            colorObj.name = colorSelect.find("option:selected").text();
            if (colorObj.val >= 0) {
                colorArray[i] = colorObj;
            }
        }
    });
    //如果不是编辑状态才去重新加载
    if (!isLoad) {
        arrayTable(colorArray, sizeArray);
    }
}

/**
 * 图片下拉菜单触发事件
 * @param {any} obj
 */
function optionSelected(obj) {
    //在选择颜色后重置复选框
    $(obj).parent().prev().children("input[type=checkbox]").prop('checked', false);
        colorChecked();
}

/**
 * 尺码选择事件
 * @param {为true程序不重新加载列表,为false程序重新加载列表} isLoad
 */
function sizeChecked(isLoad) {
    sizeArray = new Array();
    var allSizeCbx = $('#sizeInfoTab input[type=checkbox]:checked');
    allSizeCbx.each(function (i, e) {
        var sizeObj = new Object();
        sizeObj.val = $(e).siblings('input[type=hidden]').val();
        sizeObj.name = $(e).siblings('label').text().trim();
        sizeArray[i] = sizeObj;
    });
    if (!isLoad) {
        arrayTable(colorArray, sizeArray);
    }
}

/**
 * 数组重新组合函数
 * @param {颜色数组} colorArr
 * @param {尺寸数组} sizeArr
 */
function arrayTable(colorArr, sizeArr) {
    var skuTable = $('#skuInfoTable');
    skuTable.html("");//触发此function时先对显示内容进行清空
    var tableHtml = "";
    //如果尺码和颜色被选择才会显示
    if (sizeArr.length > 0 && colorArr.length > 0) {
        var skuNum = 0;
        //先循环颜色
        $.each(colorArr, function (colorIndex, colorElement) {
            //是否是第一次循环这个TR
            var isFirstTd = true;
            for (i = 0; i < sizeArr.length; i++) {
                tableHtml += '<tr>';
                //如果第一次循环TR 给TR增加rowspan合并单元格 单元格数量是尺寸数组的长度
                if (isFirstTd) {
                    tableHtml += '<td rowspan="' + sizeArr.length + '">';
                    tableHtml += colorElement.name;
                    tableHtml += '</td>';
                    isFirstTd = false;
                }
                tableHtml += '<td>';
                tableHtml += sizeArr[i].name;
                tableHtml += '<input type="hidden" value="' + colorElement.val + '" id="SkuInfoList_' + skuNum + '__ColorId" name="SkuInfoList[' + skuNum + '].ColorId" />';
                tableHtml += '<input type="hidden" value="' + sizeArr[i].val + '" id="SkuInfoList_' + skuNum + '__SizeId" name="SkuInfoList[' + skuNum + '].SizeId" />';
                tableHtml += '<input type="hidden" value="' + colorElement.name + '|' + sizeArr[i].name + '" id="SkuInfoList_' + skuNum + '__SkuName" name="SkuInfoList[' + skuNum + '].SkuName" />';
                tableHtml += '</td>';
                tableHtml += '<td>';
                tableHtml += '<input type="number" class="form-control txtSkuPrice" id="SkuInfoList_' + skuNum + '__SkuPrice" name="SkuInfoList[' + skuNum + '].SkuPrice" />';
                tableHtml += '</td>';
                tableHtml += '<td>';
                tableHtml += '<input type="text" class="form-control" id="SkuInfoList_' + skuNum + '__BarCode" name="SkuInfoList[' + skuNum + '].BarCode" />';
                tableHtml += '</td>';
                tableHtml += '<td>';
                tableHtml += '<input type="number" class="form-control" id="SkuInfoList_' + skuNum + '__Sort" name="SkuInfoList[' + skuNum + '].Sort" />';
                tableHtml += '</td>';
                tableHtml += '</tr>';
                skuNum++;
            }
        });
        skuTable.html(tableHtml);
        $('.txtSkuPrice').rules("remove");
        $('.txtSkuPrice').rules("add", {
            required: true,
            number: true,
            min: 0.01,
            messages: {
                required: "金额不能为空",
                number: "金额必须是数字",
                min: "金额不能小于或等于0"
            }
        });
        $('#skuInfoNum').val(skuNum);
    }
}

function uniqueArr(arr) {
    var result = [];
    var obj = {};
    for (var h = 0; h < allData.length; h++) {
        if (!obj[allData[h].key]) {
            result.push(allData[h]);
            obj[allData[h].key] = true;
        }
    }
    return result;
}
/**
 * 组合新的颜色选项
 * @param {颜色group} obj 
 * @param {序号} index 
 */
function combination(obj ,index){
    //checkbox初始化
    var ids = "SkuColorPic_" + index + "__";
    var names = "SkuColorPic[" + index+"].";
    obj.find("input[type=checkbox]")
        .attr('name', names + 'IsChecked')
        .attr('id', ids + 'IsChecked')
        .next().attr('for', ids + 'IsChecked');
    //下拉菜单初始化
    obj.find("select")
        .attr('id', ids + 'ColorId')
        .attr('name', names + 'ColorId');
    //文件上传框初始化
    obj.find("input[type=file]")
        .attr('id', ids + 'PicFile')
        .attr('name', names + 'PicFile')
        .next().attr('for', ids + 'PicFile');
    //隐藏表单域初始化
    obj.find('input[type=hidden]')
        .attr('id', ids + 'PicUrl')
        .attr('name', names + 'PicUrl');
}

/**
 * 图片列表组合
 * @param {any} filePath
 * @param {any} fileName
 */
function prodPicList(filePath,fileName,index) {
    var html = '<div class="col-sm-2">';
    html += '<a href="' + filePath + '" data-toggle="lightbox" data-title="' + fileName+'" data-gallery="gallery">';
    html += '<img src = "' + filePath + '" class="img-fluid mb-2" alt = "' + fileName+'" />';
    html += '<input type="hidden" id="ProductPics_' + index +'__PicUrl" name="ProductPics[' + index+'].PicUrl" value = "' + filePath + '" />';
    html += '<input type="hidden" id="ProductPics_' + index + '__PicDesc" name="ProductPics[' + index + '].PicDesc" value = "' + fileName + '" />';
    html += '</a >';
    html += '</div>';
    return html;
}

//-------------------------------------------以下是验证部分-------------------------------------------
$(function () {
    $.validator.addMethod("isDefSelect", function (value, element) {
        if (value == -1) {
            return false;
        } else {
            return true;
        }
    }, "请选择");
    //----------------验证开始----------------
    $('#quickForm').validate({
        ignore: "",
        rules: {
            ProdName: {
                required: true
            },
            NoteName: {
                required: true
            },
            PurchasePrice: {
                required: true,
                min: 0.01,
                number: true
            },
            RetailPrice: {
                required: true,
                min: 0.01,
                number: true
            },
            Weight: {
                required: true,
                min: 0.01,
                number: true
            },
            prodPicsNum: {
                required: true,
                min: 1,
            },
            skuInfoNum: {
                required: true,
                min: 1,
            },
            Description: {
                required: true,
                minlength: 10,
            }
        },
        messages: {
            ProdName: {
                required: "产品名称不能为空!",
            },
            NoteName: {
                required: "中文备注不能为空!",
            },
            PurchasePrice: {
                required: "采购价不能为空!",
                min: "采购价不能小于或等于0",
                number: "采购价必须是数字",
            },
            RetailPrice: {
                required: "零售价不能为空!",
                min: "零售价不能小于或等于0",
                number: "零售价必须是数字",
            },
            Weight: {
                required: "重量不能为空!",
                min: "重量不能小于或等于0",
                number: "重量必须是数字",
            },
            prodPicsNum: {
                required: "产品图片数量异常!",
                min: "产品图片数量不能少于1,请上传图片",
            },
            skuInfoNum: {
                required: "SKU数量异常!",
                min: "SKU数量不能少于1,请选择颜色/尺码,组合SKU",
            },
            Description: {
                required: "产品描述不能为空",
                minlength: "产品描述不能少于10个字符",
            }
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        }
    });
});

function loadColorValidate() {
    $('.hidSkuColorPic').rules("add", {
        required: true,
        messages: {
            required: "请完成图片上传",
        }
    });
    $('.selColorVal').rules("add", {
        isDefSelect: true,
        messages: {
            isDefSelect: "请选择一个颜色",
        }
    });
}

window.delColorGroup = delColorGroup;
window.colorChecked = colorChecked;
window.optionSelected = optionSelected;
window.sizeChecked = sizeChecked;
window.combination = combination;
window.prodPicList = prodPicList;
window.loadColorValidate = loadColorValidate;