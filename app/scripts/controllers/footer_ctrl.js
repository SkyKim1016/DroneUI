kindFramework.controller('footerCtrl', function ($scope,$rootScope) {
        $(document).on("scroll",function(){
            var hue = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
            $('footer').attr('style','background:'+hue);
        });                       

});