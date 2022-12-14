var deerResume = angular.module('deerResume', ['ngRoute', 'wiz.markdown', 'ngNotify', 'angularLocalStorage']);
document.write('<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"/>')
//var baseurl = 'http://cvbox.sinaapp.com/'; // 使用SAE托管简历数据
//var baseurl = 'data.php'; // 使用本地文件托管简历数据，本地模式下，不支持在线编辑
// var baseurl = 'data.json?v=1.0.0'; // 使用本地文件托管简历数据，本地模式下，不支持在线编辑
// var baseurl = 'http://10.0.42.111:8009';
var baseurl = 'https://node.darrenzzy.cn';
var pwdurl = 'pwd.json?v=1.0.0';


deerResume.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/admin', {
            templateUrl: 'admin.html',
            controller: 'adminCtrl'
        }).when('/resume', {
            templateUrl: 'resume.html',
            controller: 'resumeCtrl'
        }).otherwise({
            redirectTo: '/resume'
        });
    }]);


deerResume.controller('resumeCtrl', function ($scope, $http, storage) {

    storage.bind($scope, 'vpass');

    // 用于验证密码的 key
    // var url = '';

//     if( $scope.vpass && $scope.vpass.length > 3 )
//         url = baseurl+"?a=show&domain="+encodeURIComponent(window.location)+"&vpass="+encodeURIComponent($scope.vpass);
//     else
//         url = baseurl+"?a=show&domain="+encodeURIComponent(window.location);
// console.log(url,3333)
    // baseurl



    $http.get(baseurl +'/get_data?name=darren').success(function (data) {
        console.log(data,1111)

        $scope.resume = data;
        $scope.vpass = "";
    });
    // $http.get("err.json").success(function (data) {
    //     console.log('12312',data)
    //     $scope.resume = data;
    //     $scope.vpass = "";
    // });

    // 若首页需要加密 开启下面 code
    // $http({
    //     url: pwdurl,
    //     method: 'GET'
    // }).success(function (pwdObj, header, config, status) {
    //     $scope.resume = pwdObj;
    //     if (pwdObj != null && pwdObj.vpass != null) {
    //         if (pwdObj.vpass == $scope.vpass) {
    //             $http.get(baseurl).success(function (data) {
    //                 $scope.resume = data;
    //                 $scope.vpass = "";
    //             });
    //         } else {
    //             $http.get("err.json").success(function (data) {
    //                 $scope.resume = data;
    //                 $scope.vpass = "";
    //             });
    //         }
    //     }
    //
    // }).error(function (data, header, config, status) {
    //     $http.get("err.json").success(function (dataResult) {
    //         $scope.resume = dataResult;
    //     });
    //
    // });

    // console.log(123, $scope, 123, $http, 123, storage)

    $scope.password = function (vpass) {
        $scope.vpass = vpass;
        window.location.reload();
    }

    $scope.password2 = function (vpass) {
        console.log(vpass, 2222)
    }

});

deerResume.controller('adminCtrl', function ($scope, $http, storage, ngNotify) {

    storage.bind($scope, 'wpass');
    storage.bind($scope, 'vpass');
    storage.bind($scope, 'apass');
    storage.bind($scope, 'resume.content');

    var url = '';
    if ($scope.vpass && $scope.vpass.length > 3)
        url  = baseurl + "/get_data?name=darren&domain=" + encodeURIComponent(window.location) + "&vpass=" + encodeURIComponent($scope.vpass);
    else
        url = baseurl + "/get_data?name=darren&domain=" + encodeURIComponent(window.location);

    $http.get(url).success(function (data) {
        var oldcontent = $scope.resume.content;
        $scope.resume = data;
        $scope.resume.admin_password = $scope.apass;
        $scope.resume.view_password = $scope.wpass;
        if (oldcontent.length > 0) $scope.resume.content = oldcontent;
    });

    $scope.save = function (item) {
        $http
        ({
            method: 'POST',
            url: baseurl + "/push_data",
            
            data: $.param({ 'name': 'darren','title': item.title,'show':1, 'subtitle': item.subtitle, 'content': item.content, 'view_password': item.view_password, 'admin_password': item.admin_password}),
            // headers: { 'Content-Type': 'application/json' }
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(
            function (data) {
                ngNotify.set(data.notice, 'success');

                console.log(4444)

                if (data.errno == 0) {
                    $scope.apass = item.admin_password;
                    $scope.wpass = item.view_password;
                    ngNotify.set(data.notice, 'success');

                } else {
                    ngNotify.set(data.error, 'error');
                }
            }
        );
    };

    // 请求云端数据，有三种情况：
    // 1 云端没有任何记录，这个时候显示默认模板
    // 2 云端已经存在数据，且设置有阅读密码，这时候提示输入密码
    // 右上角留入口


});

// ============
function makepdf() {
    //post('http://pdf.ftqq.com',{'title':$('#drtitle').html(),'subtitle':$('#drsubtitle').html(),'content':$('#cvcontent').html(),'pdfkey':'jobdeersocool'});
    $("#hform [name=title]").val($('#drtitle').html());
    $("#hform [name=subtitle]").val($('#drsubtitle').html());
    $("#hform [name=content]").val($('#cvcontent').html());
    $("#hform [name=pdfkey]").val('jobdeersocool');
    $("#hform").submit();
}

function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    var form = jQuery('<form/>', {
        'id': 'hform',
        'method': method,
        'action': path,
        'target': '_blank'
    });

    for (var key in params) {
        if (params.hasOwnProperty(key)) {

            var hiddenField = jQuery('<input/>', {
                'type': 'hidden',
                'name': key,
                'value': params[key]
            });

            form.appendChild(hiddenField);
        }
    }


    form.submit();
}


function pdf() {
    var doc = new jsPDF();
    var specialElementHandlers = {
        '.action-bar': function (element, renderer) {
            return true;
        }
    };

    doc.fromHTML($('#resume_body').get(0), 15, 15, {
        'width': 170,
        'elementHandlers': specialElementHandlers
    });

    doc.output("dataurlnewwindow");
}

//添加置顶功能
$(document).ready(function () {
    var THRESHOLD = 50;
    var $top = $('.back-to-top');

    $(window).on('scroll', function () {
        $top.toggleClass('back-to-top-on', window.pageYOffset > THRESHOLD);
    });

    $top.on('click', function () {
        $('body').velocity('scroll');
    });
});