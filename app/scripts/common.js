$(function(){

	$('.contents').css('height' , parseInt($(window).height()-71) + 'px');
	$(window).resize(function(){
		$('.contents').css('height' , parseInt($(window).height()-71) + 'px');
	});
    
   


	$('.allMenu a').click(function(){   
		if($('.menuList').css('display') == 'block'){
           $(this).removeClass('menuclose');
           $('.menuList').slideUp();
           }else{
           $(this).addClass('menuclose');
            $('.menuList').slideDown();              
        }
    });
    
       
    $('input.input_ez').ezMark();
    
    $('.leftBtnGrp .subList').hide();
    $('.icoBtn a').click(function(){
        $('.icoBtn a.on').removeClass('on');
        $('.leftBtnGrp .subList').hide();
		$(this).addClass('on');
		$(this).siblings('.subList').show();
	});
    

    $(document).mousedown(function(e){
    $('.subList').each(function(){
            if( $(this).css('display') == 'block' )
            {
                var l_position = $(this).offset();
                l_position.right = parseInt(l_position.left) + ($(this).width());
                l_position.bottom = parseInt(l_position.top) + parseInt($(this).height());

                if( ( l_position.left <= e.pageX && e.pageX <= l_position.right )
                    && ( l_position.top <= e.pageY && e.pageY <= l_position.bottom ) )
                {
                    
                }
                else
                {                    
                    $(this).hide("slow");
                    $('.icoBtn a.on').removeClass('on');
                }
            }
        })
      })
    $('.btnView').click(function(){   		
        $(this).hide();
        $(this).siblings('.mvView').slideDown();          
    });
    
    $('.droneMv .mvView a.tit').click(function(){   		
        $(this).parent('.mvView').slideUp();
        $('.droneMv .btnView').fadeTo("1000","1");
    });
    
   $('.cameraMv .mvView a.tit').click(function(){   		
        $(this).parent('.mvView').slideUp();
        $('.cameraMv .btnView').fadeTo("1000","1");
    });
    
    
});
