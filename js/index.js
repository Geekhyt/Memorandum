/**
 * Created by Jonathan_Lee on 2017/1/12.
 */
$(function () {
    // 1.利用jQuery UI事项选项卡
    $("#tabs").tabs();
    /********************************************************/

    // 2.实现返回顶部
    // 2.1监听滚动, 实现显示隐藏
    $(window).scroll(function () {
        var winT = $(this).scrollTop();
        if (winT >= 100) {
            $('.back-top').stop().show();
        } else {
            $('.back-top').stop().hide();
        }
    });
    // 2.2监听点击事件回到顶部
    $('.back-top').click(function () {
        $('html body').stop().animate({
            scrollTop: 0
        });
    });

    /********************************************************/

    // 3.实现导航条吸顶
    // 3.1获取默认距离顶部的距离
    var offsetT = $('.nav').offset().top;
    // 3.2监听窗口滚动
    $(window).scroll(function () {
        // 3.2.1获得当前偏移量
        var winT = $(this).scrollTop();
        // 3.2.2判断是否需要吸顶
        if (winT >= offsetT) {
            $('.nav').css({
                'position': 'fixed',
                'top': '0px',
                'left': '50%',
                'margin-left': '-480px',
                'z-index': '999'
            });
        } else {
            $('.nav').css({
                'position': 'static',
                'margin': '0px auto'
            });
        }
    });

    /********************************************************/

    // 4.实现数据存储和添加数据
    var itemArray;
    // 4.1初始化方法
    function init() {
        // 4.1.1获取本地存储的数据, 如果没有创建一个空的数组用于保存数据
        itemArray = store.get('itemArray') || [];
        // 4.1.2刷新界面
        refresh();
    }

    // 4.2执行初始化方法
    init();

    // 4.3监听提交按钮点击
    $('input[type="submit"]').click(function (event) {
        // 4.3.1阻止默认行为
        event.preventDefault();
        // 4.3.2获取输入内容
        var title = $('input[type="text"]').val();
        $('input[type="text"]').val('');

        if ($.trim(title) == '') {
            alert('亲爱的用户，请输入您要创建的事项名称')
            return;
        }
        // 4.3.3创建对象保存数据
        saveItems(title);

        // 4.3.6重新刷新界面
        refresh();

        // 4.3.7执行第一条数据动画
        $('.task li:first').hide().slideDown();
    });

    // 4.4创建保存对象
    function saveItems(title) {
        if (title != '' && title != undefined) {
            // 4.3.3根据获取到的内容创建一个对象
            var newItem = {
                title: '',
                check: false,
                content: '',
                time: '',
                is_notice: false
            };
            newItem.title = title;
            // 4.3.4保存输入的内容
            itemArray.push(newItem);
        }
        // 4.3.5保存数据到本地
        store.set('itemArray', itemArray);
    }

    // 4.5刷新界面
    function refresh() {
        // 4.4.1清空以前的内容
        $('.task').empty();
        $('.finish-task').empty();

        // 4.4.2根据保存的内容刷新界面
        for (var i = 0; i < itemArray.length; i++) {
            // 4.4.2.1取出对应数据
            var item = itemArray[i];
            if (item == undefined || !item) {
                continue;
            }
            // 4.4.2.2创建模板
            var check = item.check ? "checked" : "";
            var tag = $(
                '<li class="item" data-index=' + i + '>' +
                '<input type="checkbox" ' + check + '>' +
                '<span class="item-content">' + item.title + '</span>' +
                '<a href="#" class="item-del">删除</a>' +
                '<a href="#" class="item-des">详情</a>' +
                '</li>'
            );
            if (item.check == true) {
                // 4.4.2.3添加元素
                $('.finish-task').prepend(tag);
            } else {
                // 4.4.2.3添加元素
                $('.task').prepend(tag);
            }
        }
    }

    /********************************************************/

    // 5.监听删除按钮点击
    $('#tabs').on('click', '.item-del', function () {
        // 5.1获取当前点击的item
        var item = $(this).parent();
        // 5.2获取当前点击item的索引
        var index = item.data('index');
        // 5.3根据索引删除对应数据
        // itemArray.splice(index, 1);
        delete itemArray[index];
        // 5.4重新存储删除后的数据
        saveItems('');
        // 5.5刷新界面
        item.slideUp();
    });

    /********************************************************/

    // 6.监听checkbox点击
    $('#tabs').on('click', 'input[type=checkbox]', function () {
        // 5.1获取当前点击的item
        var item = $(this).parent();
        // 5.2获取当前点击item的索引
        var index = item.data('index');
        // 5.3根据索引拿到对应的对象
        var obj = itemArray[index];
        // 5.4拿到当前的选中状态
        var isCheck = $(this).is(':checked');
        // 5.5修改对象的选中状态
        obj.check = isCheck;
        // 5.6保存修改后的数据
        saveItems('');
        // 5.7执行第一条数据动画
        item.hide().slideUp();
        // 5.8刷新界面
        refresh();
    });

    /********************************************************/

    // 7.监听详情按钮点击
    /*设置日期选择框*/
    $.datetimepicker.setLocale('ch');//设置中文
    $('.date_time').datetimepicker();//显示日期
    var current_index;
    $('body').on('click', '.item-des', function () {
        // 7.1拿到当前点击的item
        var item = $(this).parent();
        // 7.2根据item拿到当前的索引
        var index = item.data('index');
        current_index = index;
        // 7.3根据索引找到对应的对象
        var obj = itemArray[index];
        console.log(obj);
        // 7.4设置弹窗的内容
        $('.detail-title').text(obj.title);
        $('.detail-content').val(obj.content);
        $('.date_time').val(obj.time);

        // 7.5显示详情弹窗
        $('.mask').stop().fadeIn();
    });
    $('body').on('click', '.detail-close', function () {
        $('.mask').stop().fadeOut();
        $('.detail-title').text('');
        $('.detail-content').val('');
        $('.date_time').val('');
    });

    /********************************************************/

    // 8.监听更新按钮点击
    $('body').on('click', '.detail-btn', function () {
        // 8.1拿到当前详情对应的对象
        var obj = itemArray[current_index];
        // 8.2更新数据
        obj.content = $('.detail-content').val();
        obj.time = $('.date_time').val();
        obj.is_notice = false;
        itemArray[current_index] = obj;

        // 8.3保存数据
        saveItems('');
        // 8.4执行动画
        $('.mask').fadeOut();
    });

    /********************************************************/

    // 9.提醒功能
    setInterval(function () {
        // 9.1遍历取出所有元素
        for (var i = 0; i < itemArray.length; i++) {
            var item = itemArray[i];
            // 如果元素不存在, 或者已经提醒过直接跳过
            if (!item || item == undefined || item.is_notice) {
                continue;
            }
            // 拿到当前时间
            var cur_time = (new Date()).getTime();
            // 拿到提醒时间
            var item_time = (new Date(item.time)).getTime();
            // console.log(cur_time, item_time);
            // 判断是否需要提醒
            if (cur_time - item_time >= 1) {
                item.is_notice = true;
                itemArray[i] = item;
                saveItems('');
                notice(item.title);
            }
        }
    }, 500);
    function notice(title) {
        console.log('播放提醒' + title);
        // 设置提醒标题
        $('.notice').text(title);
        // 显示提醒动画
        $('.notice').stop().slideDown();
        // 播放提醒音乐
        $('video').get(0).play();
    }

    // 监听提醒点击
    $('body').on('click', '.notice', function () {
        // 收起提醒
        $('.notice').stop().slideUp();
        // 停止音乐
        $('video').get(0).stop();
    });
});