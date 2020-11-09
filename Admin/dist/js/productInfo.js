var colorArray = new Array();
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
        //循环遍历组件-
        allInput.each(function (i, e) {
            //重组之前销毁select2:
            $(e).find("select")
                .select2("destroy")
                .removeAttr("data-select2-id tabindex aria-hidden");
            $(e).find("option").removeAttr("data-select2-id");
            //分配初始化与名称
            recombination($(e), i);
        });
        $(this).find("input[type=checkbox]").prop('checked', false);
        colorChecked();
        this.remove();
        $('.select2').select2();
    });
}

/**
 * 图片单选按钮事件
 * @param {为true程序不重新加载列表(不执行arrayTable),为false程序重新加载列表(执行arrayTable)} isLoad
 */
function colorChecked(isLoad) {
    colorArray = new Array();
    var allColorCbx = $('.skuColorInfo').find(".cbxColor");
    var arrIndex = 0;
    allColorCbx.each(function (i, e) {
        if ($(e).prop('checked')) {
            var colorSelect = $(e).parent().next().children(".selColorVal");
            var colorName = colorSelect.find("option:selected").text();

            //组合颜色进入数组
            var colorObj = new Object();
            colorObj.val = Number(colorSelect.val());
            colorObj.name = colorName.split(':')[1];

            if (colorObj.val >= 0) {
                colorArray[arrIndex] = colorObj;
                arrIndex++;
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
    var value = $(obj).val();
    $('.selColorVal').each(function (i, e) {
        if (obj != e && value == $(e).val()) {
            alert('不能选择相同的颜色!');
            $(obj).val(-1);
            return false;
        }
    });
    colorChecked(false);
    return true;
}

/**
 * 尺码选择事件
 * @param {为true程序不重新加载列表(不执行arrayTable),为false程序重新加载列表(执行arrayTable)} isLoad
 */
function sizeChecked(isLoad) {
    sizeArray = new Array();
    var allSizeCbx = $('#sizeInfoTab input[type=checkbox]:checked');
    allSizeCbx.each(function (i, e) {
        var sizeObj = new Object();
        sizeObj.val = Number($(e).attr('sizeId'));
        sizeObj.name = $(e).attr('sizeName');
        sizeArray[i] = sizeObj;
    });
    if (allSizeCbx.length > 0) {
        var sizePan = allSizeCbx.parents("div[id^='sizeInfo_']").attr("id");
        $('a#' + sizePan + '_tab').click();
    }
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
    var prodId = $("#Id").val();
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
                var key = prodId + "_" + colorElement.val + "_" + sizeArr[i].val;
                var skuId = localStorage.getItem(key);
                if (skuId == null || skuId == undefined) {
                    skuId = "";
                }
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
                tableHtml += '<input type="hidden" value="' + skuId + '" id="SkuInfoList_' + skuNum + '__SkuId" name="SkuInfoList[' + skuNum + '].SkuId" data-key-id="' + key+'" />';
                tableHtml += '<input type="hidden" value="' + colorElement.val + '" id="SkuInfoList_' + skuNum + '__ColorId" name="SkuInfoList[' + skuNum + '].ColorId" />';
                tableHtml += '<input type="hidden" value="' + sizeArr[i].val + '" id="SkuInfoList_' + skuNum + '__SizeId" name="SkuInfoList[' + skuNum + '].SizeId" />';
                tableHtml += '<input type="hidden" value="' + colorElement.name + '" id="SkuInfoList_' + skuNum + '__ColorName" name="SkuInfoList[' + skuNum + '].ColorName" />';
                tableHtml += '<input type="hidden" value="' + sizeArr[i].name + '" id="SkuInfoList_' + skuNum + '__SizeName" name="SkuInfoList[' + skuNum + '].SizeName" />';
                if (sizeArr[i].name == null || sizeArr[i].name == undefined || sizeArr[i].name == "") {
                    tableHtml += '<input type="hidden" value="' + colorElement.name + '" id="SkuInfoList_' + skuNum + '__SkuName" name="SkuInfoList[' + skuNum + '].SkuName" />';
                } else {
                    tableHtml += '<input type="hidden" value="' + colorElement.name + ':' + sizeArr[i].name + '" id="SkuInfoList_' + skuNum + '__SkuName" name="SkuInfoList[' + skuNum + '].SkuName" />';
                }
                tableHtml += '</td>';
                tableHtml += '<td>';
                tableHtml += '<input type="number" class="form-control skuPrice" min="0" id="SkuInfoList_' + skuNum + '__SkuPrice" name="SkuInfoList[' + skuNum + '].SkuPrice" data-key-id="skuPrice_' + colorElement.val + '_' + sizeArr[i].val + '" />';
                tableHtml += '</td>';
                tableHtml += '<td>';
                tableHtml += '<input type="text" class="form-control skuBarcode" id="SkuInfoList_' + skuNum + '__BarCode" name="SkuInfoList[' + skuNum + '].BarCode" data-key-id="skuBarcode_' + colorElement.val + '_' + sizeArr[i].val + '" />';
                tableHtml += '</td>';
                tableHtml += '<td>';
                tableHtml += '<input type="number" class="form-control skuSort" min="0" id="SkuInfoList_' + skuNum + '__Sort" name="SkuInfoList[' + skuNum + '].Sort" data-key-id="skuSort_' + colorElement.val + '_' + sizeArr[i].val + '" />';
                tableHtml += '</td>';
                tableHtml += '</tr>';
                skuNum++;
            }

        });
    }
    skuTable.html(tableHtml);
    //绑定验证
    $('.skuPrice').rules("remove");
    $('.skuPrice').rules("add", {
        required: true,
        number: true,
        min: 0,
        messages: {
            required: "金额不能为空",
            number: "金额必须是数字",
            min: "金额不能小于0"
        }
    });

    //给SKU添加默认值
    var retailPrice = $('#RetailPrice').val();
    $('.skuPrice').each(function () {
        $(this).val(Number(retailPrice));
        setSkuAttr(this);
    })
    //绑定input改变事件
    skuTable.find('.skuPrice,.skuBarcode,.skuSort').bind('keyup', function () {
        setSkuAttr(this);
    });
    $('#skuInfoNum').val(skuNum);
    getSkuAttr();
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
 * 对增加的组件进行初始化(增加的时候使用)
 * @param {颜色group} obj 
 * @param {序号} index 
 */
function combination(obj, index) {
    //checkbox初始化
    var ids = "SkuColorPic_" + index + "__";
    var names = "SkuColorPic[" + index + "].";
    obj.find("input[type=checkbox]")
        .attr('name', names + 'IsChecked')
        .attr('id', ids + 'IsChecked')
        .next().attr('for', ids + 'IsChecked');
    //下拉菜单初始化
    obj.find("select")
        .attr('id', ids + 'ColorId')
        .attr('name', names + 'ColorId')
        .val(-1);
    //文件上传框初始化
    obj.find("input[type=file]").val("")
        .prop('disabled', false)
        .bind("change", function () {
            window.uploadFiles(this);
        });
    obj.find("label.custom-file-label").text("选择文件");
    //隐藏表单域初始化
    obj.find('input[type=hidden]').val("")
        .attr('id', ids + 'PicUrl')
        .attr('name', names + 'PicUrl');

    //加入按钮绑定事件
    //删除按钮
    obj.find(".delColorGroup").bind("click", function () {
        window.delColorGroup(this);
    });

    //图片
    obj.find("img").attr("src", "").hide();

    //checkbox改变事件
    obj.find('.cbxColor').bind("change", function () {
        colorChecked(false);
    }).prop('checked', false);

    obj.find("select").bind("change", function () {
        return optionSelected(this);
    });

    return obj;
}

/**
 * 删除时对现有的组件进行重组
 * @param {any} obj
 * @param {any} index
 */
function recombination(obj, index) {
    //名称初始化
    var ids = "SkuColorPic_" + index + "__";
    var names = "SkuColorPic[" + index + "].";
    //复选框
    obj.find("input[type=checkbox]")
        .attr('name', names + 'IsChecked')
        .attr('id', ids + 'IsChecked')
        .next().attr('for', ids + 'IsChecked');
    //下拉菜单
    obj.find("select")
        .attr('id', ids + 'ColorId')
        .attr('name', names + 'ColorId');
    //隐藏表单域
    obj.find('input[type=hidden]')
        .attr('id', ids + 'PicUrl')
        .attr('name', names + 'PicUrl');
}

/**
 * 图片列表组合
 * @param {any} filePath
 * @param {any} fileName
 */
function prodPicList(filePath, fileName, index) {
    var html = '<div class="col-sm-2">';
    html += '<a href="' + filePath + '" data-toggle="lightbox" data-title="' + fileName + '" data-gallery="gallery">';
    html += '<img src = "' + filePath + '" class="img-fluid mb-2" alt = "' + fileName + '" />';
    html += '<input type="hidden" class="picUrl" id="ProductPics_' + index + '__PicUrl" name="ProductPics[' + index + '].PicUrl" value = "' + filePath + '" />';
    html += '<input type="hidden" class="picDesc" id="ProductPics_' + index + '__PicDesc" name="ProductPics[' + index + '].PicDesc" value = "' + fileName + '" />';
    html += '</a >';
    html += '<button class="btn btn-block btn-default btn-xs delProdPic" type="button" >删除</button>';
    html += '</div>';
    return html;
}

/**
 * 删除和重组图片组件
 * */
window.delProdPic = function delProdPic(obj) {
    $(obj).parent().fadeOut("fast", function () {
        //选择除了自己以外的所有同辈元素下的a标记
        var thisPic = $(this).siblings().children("a");
        thisPic.each(function (i, e) {
            var newId = "ProductPics_" + i + "__";
            var newName = "ProductPics[" + i + "].";
            $(e).children(".picUrl").attr("id", newId + "PicUrl").attr("name", newName + "PicUrl");
            $(e).children(".picDesc").attr("id", newId + "PicDesc").attr("name", newName + "PicDesc");
            $(e).children(".picSort").attr("id", newId + "Sort").attr("name", newName + "Sort");
        });
        $('#prodPicsNum').val(thisPic.length);
        this.remove();
    });
}

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
/**
 * 页面首次加载的时候使用
 * 设置key的规则是: 用当前输入框的ID+data-key-id属性字段组合
 * key:input_data-key-id
 * data-key-id: 颜色_尺码
 * */
window.pageLoadSkuAttr = function pageLoadSkuAttr() {
    var skuPrice = $("#skuInfoTable .skuPrice");
    var skuBarcode = $("#skuInfoTable .skuBarcode");
    var skuSort = $("#skuInfoTable .skuSort");
    //skuID
    var skuId = $("#skuInfoTable .skuId");
    //产品ID
    var prodId = $("#Id").val();

    localStorage.clear();
    //记录sku价格信息
    skuPrice.each(function (i, e) {
        var key = $(e).attr("data-key-id");
        localStorage.setItem(key, $(e).val());
    });
    //记录sku编码信息
    skuBarcode.each(function (i, e) {
        var key = $(e).attr("data-key-id");
        localStorage.setItem(key, $(e).val());
    });
    //记录sku排序信息
    skuSort.each(function (i, e) {
        var key = $(e).attr("data-key-id");
        localStorage.setItem(key, $(e).val());
    });
    //记录产品的SKUID
    skuId.each(function (i, e) {
        var key = $(e).attr("data-key-id");
        localStorage.setItem(key, $(e).val());
    });
}

function getSkuAttr() {
    $("#skuInfoTable .skuPrice").each(function (i, e) {
        var key = $(e).attr("data-key-id");
        var value = localStorage.getItem(key);
        $(e).val(value);
    });
    $("#skuInfoTable .skuBarcode").each(function (i, e) {
        var key = $(e).attr("data-key-id");
        var value = localStorage.getItem(key);
        $(e).val(value);
    });
    $("#skuInfoTable .skuSort").each(function (i, e) {
        var key = $(e).attr("data-key-id");
        var value = localStorage.getItem(key);
        $(e).val(value);
    });
}

/**
 * 设置一个sku属性控件的浏览器缓存
 * @param {any} obj
 */
window.setSkuAttr = function setSkuAttr(obj) {
    var key = $(obj).attr("data-key-id");
    localStorage.setItem(key, $(obj).val());
}

window.skuSizeTab = function skuSizeTab() {
    $("#sku-size-tab li a").on("click", function (e) {
        var sizeActive = $('#sizeInfoTab .active input[type=checkbox]:checked');
        if (sizeActive.length > 0 && !$(this).hasClass("active")) {
            if (confirm("切换尺码分组将会丢失勾选的尺码及 sku 数据，确定切换？")) {
                $('#sizeInfoTab input[type=checkbox]:checked').prop('checked', false);
                sizeChecked(false);
                return true;
            } else {
                return false;
            }
        } else {
            return true;
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
