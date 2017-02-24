/*
	jQuery document ready.
*/
$(document).ready(function()
{
	/*
		assigning keyup event to password field
		so everytime user type code will execute
	*/

	$('#pwd').keyup(function()
	{
		$('#pass-strength').html(checkStrength($('#pwd').val()))
	})	
	
	/*
		checkStrength is function which will do the 
		main password strength checking for us
	*/
	
	function checkStrength(password)
	{
		//initial strength
		var strength = 0
		
		//if the password length is less than 6, return message.
		if (password.length < 6) { 
			$('#pass-strength').removeClass()
			$('#pass-strength').addClass('short')
			return 'Password is TOO SHORT' 
		}
		
		//length is ok, lets continue.
		
		//if length is 8 characters or more, increase strength value
		if (password.length > 7) strength += 1
		
		//if password contains both lower and uppercase characters, increase strength value
		if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/))  strength += 1
		
		//if it has numbers and characters, increase strength value
		if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/))  strength += 1 
		
		//if it has one special character, increase strength value
		if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/))  strength += 1
		
		//if it has two special characters, increase strength value
		if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
		
		//now we have calculated strength value, we can return messages
		
		//if value is less than 2
		if (strength < 2 )
		{
			$('#pass-strength').removeClass()
			$('#pass-strength').addClass('weak')
			return 'Password is WEAK'			
		}
		else if (strength == 2 )
		{
			$('#pass-strength').removeClass()
			$('#pass-strength').addClass('good')
			return 'Password is GOOD'		
		}
		else
		{
			$('#pass-strength').removeClass()
			$('#pass-strength').addClass('strong')
			return 'Password is STRONG'
		}
	}
});