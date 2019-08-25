
  $(document).ready(function(){
      //populate the selct options
    $('select').formSelect();

    $('.modal').modal();

    $('#delete_referral_btn').on('click', () => {
       console.log('Clicked');
       $('#form_modal').submit();
    })

    //populate zipcode
    $('#zipcode').keyup(function(){
      let value = this.value;
      let city = $('#city').val();
      if (value.length >= 3) {
         if (value == '104') {
            $('#city').val('Bronx');
         } else if (value == '107') {
            $('#city').val('Yonkers');
         }  else if (value == '100') {
            $('#city').val('Manhattan');
         } 
      }

    })

    $('#status').on('change', function (e) {
      let optionSelected = $("option:selected", this);
      let valueSelected = this.value;
     
      if (valueSelected.toLowerCase() == 'closed') {
         //code if order is closed
          $('#order_closed').removeClass('hidden');
          $('#mon').attr('required', true);
          $('#due_date').attr('required', true);
          $('#order_date').attr('required', true);
          $('#package').attr('required', true);

      } else {
         //code if order is not closed
         $('#order_closed').addClass('hidden');
         $('#mon').attr('required', false);
         $('#due_date').attr('required', false);
         $('#order_date').attr('required', false);
         $('#package').attr('required', false);
      }
     
     
  });

  
  $("#formValidate").validate({
   rules: {
       name: {
           required: true,
           minlength: 5
       },
       cemail: {
           required: true,
           email:true
       },
       password: {
       required: true,
       minlength: 5
    },
    cpassword: {
       required: true,
       minlength: 5,
       equalTo: "#password"
    },
    curl: {
           required: true,
           url:true
       },
       crole:"required",
       ccomment: {
       required: true,
       minlength: 15
       },
       cgender:"required",
    cagree:"required",
   },
   //For custom messages
   messages: {
       name:{
           required: "Enter a username",
           minlength: "Enter at least 5 characters"
       },
       curl: "Enter your website",
   },
   errorElement : 'div',
   errorPlacement: function(error, element) {
     var placement = $(element).data('error');
     if (placement) {
       $(placement).append(error)
     } else {
       error.insertAfter(element);
     }
   }
});




  });

  function formatPhone(obj) {
    var numbers = obj.value;
    numbers.replace(/\D/g, '');
        char = {0:'(',3:') ',6:'-'};
    obj.value = '';
    for (var i = 0; i < numbers.length; i++) {
        obj.value += (char[i]||'') + numbers[i];
    }
}
