import $ from "jquery";

function jQueryify(){
    $(document).ready(function() {

        $('#timeline-filterables').find('a').on('click', function() {
            $('#timeline-filterables').find('a').removeClass('clickedOn');
            $(this).addClass('clickedOn');
        });
    });
};

export default jQueryify;
