angular.module('mbe',[])
    .controller('DE',function($scope){
        $scope.token = window.localStorage.getItem("token");
        $scope.uid = window.localStorage.getItem("uid");
        var SENDER_ID = '868815177821';
        var API_URL = "https://mybestexpert.jp/apiv1/";
        document.addEventListener("deviceready", function() {
            FCMPlugin.onTokenRefresh(function(regId){
                var devicePlatform = device.platform;

                var serviceType = devicePlatform == "Android" ? "android" : "ios";
                $.getJSON(API_URL,{'method':'registerDevice','nodeId':$scope.uid,'token':regId,'serviceType':serviceType},function(data){
                });
            });

            FCMPlugin.getToken(function(regId){
                var devicePlatform = device.platform;

                var serviceType = devicePlatform == "Android" ? "android" : "ios";
                $.getJSON(API_URL,{'method':'registerDevice','nodeId':$scope.uid,'token':regId,'serviceType':serviceType},function(data){
                });
            });

            FCMPlugin.onNotification(function(data){
                switch (data.type) {
                    case 'friendrequest':
                    case 'acceptfriendrequest':
                        if(!data.wasTapped)
                            alert(data.body);
                        $scope.downloadInfo();
                        break;
                    default:
                        if(!data.wasTapped && ($scope.node == undefined || $scope.node.id != data.id)) {
                            if (!confirm(data.name + '様がメッセージを送ってきました. 見ますか？')){
                                return;
                            }
                        }
                        $scope.setNode(data.id);
                }
            });

        }, false);

        $.getJSON(API_URL,{'method':'getUserInfo','uid':$scope.uid,'token':$scope.token,'ginfo':$scope.uid},function(data){
            $scope.infos = data.infos;
//          $scope.gds = $scope.genders[data.infos.gender];
//          $scope.jks = $scope.jokins[data.infos.jokin];
            $scope.$apply();
        });

        $scope.licenses = [{'num':0,'name':'--'},{'num':1,'name':'公認会計士'},{'num':2,'name':'弁護士'},{'num':3,'name':'税理士'},{'num':4,'name':'社会保険労務士'},{'num':5,'name':'司法書士'},{'num':6,'name':'行政書士'},{'num':7,'name':'中小企業診断士'},{'num':8,'name':'不動産鑑定士'},{'num':9,'name':'宅地建物取引士'},{'num':10,'name':'一級建築士'},{'num':11,'name':'経営管理学修士（MBA）'},{'num':12,'name':'証券アナリスト'},{'num':13,'name':'ファイナンシャルプランナー'},{'num':14,'name':'弁理士'}];

        $scope.downloadInfo = function(){
            $.getJSON(API_URL,{'method':'getInfo','uid':$scope.uid,'token':$scope.token},function(data){
                $scope.rcs = data.rcs;
                $scope.nts = data.nts;
                $scope.waits = data.waits;
                $scope.$apply();
            });
        };
        $scope.downloadInfo();

        $scope.sendConnection = function(tt){
            $.getJSON(API_URL,{'method':'sendConnection','uid':$scope.uid,'token':$scope.token,'tt':tt},function(data){
                if(data.status == "200"){
                    $('#rc-'+data.id).parent().parent().fadeOut(500);
                }
            });
        };

        $scope.acceptConnection = function(ff){
            $.getJSON(API_URL,{'method':'acceptConnection','uid':$scope.uid,'token':$scope.token,'ff':ff},function(data){
                if(data.status == "200"){
                    $('#rc-'+data.id).parent().parent().fadeOut(500);
                }
            });
        };

        $scope.showMessage = function(node){
            $.getJSON(API_URL,{'method':'getMessage','uid':$scope.uid,'token':$scope.token, 'tt':node.id},function(data){
                $('.pg').hide();
                $('#msg-p').show();
                $scope.node = node;
                $scope.msgArr = data;
                $scope.$apply();
            });
        };

        $scope.sendMsg = function(){
            var content = $('#txtMessage').val();
            $.getJSON(API_URL,{'method':'sendMessage','uid':$scope.uid,'token':$scope.token, 'tt':$scope.node.id, 'content':content},function(data){
            })
                .always(function() {
                    $('#txtMessage').val("");
                    $scope.showMessage($scope.node);
                });
        };

        $scope.setNode = function(nodeId) {
            $.getJSON(API_URL,{'method':'getNode','nodeId':nodeId},function(data){
                $scope.showMessage(data);
            })
        }
    })