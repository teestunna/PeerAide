jQuery.validator.addMethod( 'passwordMatch', function(value, element) {
    
    var password = $("#new_password").val();
    var confirmPassword = $("#repeat_password").val();

    if (password != confirmPassword ) {
        return false;
    } else {
        return true;
    }

}, "Your Passwords Must Match");


/* Login form validation */
$('#login-form').validate({
    rules: {
        email: {
            required: true
        },
        password: {
            minlength: 3,
            maxlength: 50,
            required: true
        }
    },

    messages: {
        email: {
            required: "Enter your peeraide username/email"
        },
        password: {
            required: "Please enter your password",
            minlength: "Your password must contain more than 3 characters"
        }
    },

    highlight: function(element) {
        $(element).closest('.input-container').addClass('has-error');
    },
    unhighlight: function(element) {
        $(element).closest('.input-container').removeClass('has-error');
    },
    success: function (element) {
        element.addClass('valid')
            .closest('.form-group').removeClass('error').addClass('has-success');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) {
        if(element.parent('.input-group').length) {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }
    }
});

/* Sign up validation form */
$('#sign-up-form').validate({
    rules: {
        email: {
            required: true,
            email: true
        },
        pwd: {
            minlength: 3,
            maxlength: 50,
            required: true
        }
    },
    highlight: function(element) {
        $(element).closest('.input-container').addClass('has-error');
    },
    unhighlight: function(element) {
        $(element).closest('.input-container').removeClass('has-error');
    },
    success: function (element) {
        element.addClass('valid')
            .closest('.form-group').removeClass('error').addClass('has-success');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) {
        if(element.parent('.input-group').length) {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }
    }
});

/* Search courses form validation */
$('#search-for-courses').validate({
    rules: {
        course_name: {
            minlength: 3,
            required: true
        },
        course_code: {
            minlength: 1,
            required: true
        }
    },

    messages: {
        course_name: {
            required: "The course name field cannot be blank!"
        },
        course_code: {
            required: "The course code field cannot be blank!"
        }
    },

    highlight: function(element) {
        $(element).closest('.form-group').addClass('has-error');
    },
    unhighlight: function(element) {
        $(element).closest('.form-group').removeClass('has-error');
    }
    success: function (element) {
        element.addClass('valid')
            .closest('.form-group').removeClass('error').addClass('has-success');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) {
        if(element.parent('.input-group').length) {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }
    }
});

/* send a message to us contact us form */
$('#send-us-a-message').validate({
    rules: {
        field2: {
            required: true,
            email: true
        },
        field1: {
            minlength: 3,
            maxlength: 50,
            required: true
        },
        message_us: {
            required: true,
            minlength: 3,
            maxlength: 200
        }
    },
    highlight: function(element) {
        $(element).closest('.input-container').addClass('has-error');
    },
    unhighlight: function(element) {
        $(element).closest('.input-container').removeClass('has-error');
    },
    success: function (element) {
        element.addClass('valid')
            .closest('.form-group').removeClass('error').addClass('has-success');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) {
        if(element.parent('.input-group').length) {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }
    }
});

/* send a message to us contact us form */
$('#user-has-rated').validate({
    rules: {
        rating: {
            required: true
        },
        rating1: {
            required: true
        }
    },
    highlight: function(element) {
        $(element).closest('.rating').addClass('has-error');
    },
    unhighlight: function(element) {
        $(element).closest('rating').removeClass('has-error');
    },
    success: function (element) {
        element.addClass('valid')
            .closest('.form-group').removeClass('error').addClass('has-success');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) {
        if(element.parent('.input-group').length) {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }
    }
});


$('#reset-pass').validate({
    rules: {
        new_password: {
            minlength: 3,
            maxlength: 50,
            required: true
        },
        repeat_password: {
            required: true,
            minlength: 3,
            maxlength: 50,
            passwordMatch: true
        }
    },

    messages: {
        new_password: {
            required: "Enter your new password please",
            minlength: "Your password must contain more than 3 characters"
        },
        repeat_password: {
            required: "Please enter the same password as above",
            minlength: "Your password must contain more than 3 characters",
            passwordMatch: "Your Passwords Must Match"
        }
    },

    highlight: function(element) {
        $(element).closest('.input-container').addClass('has-error');
    },
    unhighlight: function(element) {
        $(element).closest('.input-container').removeClass('has-error');
    },
    success: function (element) {
        element.addClass('valid')
            .closest('.form-group').removeClass('error').addClass('has-success');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) {
        if(element.parent('.input-group').length) {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }
    }
});