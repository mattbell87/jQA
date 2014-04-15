
(function ( $, window, undefined) {
	var jQA = function(){
		var defaults = {
			"headerMessage":"jQA has detected the following",
			"defaultSeverity":5
		}
		var rules = {};
		/*Public Methods*/
		this.settings = function(options){
			$.extend(defaults, options);
		}
		this.addQA = function(rule){
			$.extend(rules, rule);
		}
		this.doQA = function(silent){
			if (silent === undefined) {
				silent = false;
			}
			var messages = [];
			$.each(rules, function(index,obj){
				if (obj.severity === undefined) {
					obj.severity = defaults.defaultSeverity;
				}
				var objects = $(obj.selector).filter(function(i,obj){
					return ($(obj).closest('.no-qa').length === 0);
				});
				if (typeof obj.filter === 'function') {
					objects = $(objects).filter(obj.filter);
				}

				if (typeof obj.each === 'function') {
					$(objects).each(function(){
						obj.each($(this));
					});
				}
				if(objects.length){
					if (typeof obj.message === 'function') {
						messages.push({"message":obj.message(objects),"severity":obj.severity});
					} else {
						messages.push({"message":obj.message,"severity":obj.severity});
					}
				}
				$(objects).each(function(index, object){
					$(object).addClass("jQA-fail");
					$(object).addClass("jQA-severity-"+obj.severity);
					if($(object).data("jQAMsg")){
						$(object).data("jQAMsg", $(object).data("jQA-msg")+','+messages[messages.length-1]['message']);
					}else{
						$(object).data("jQAMsg", messages[messages.length-1]['message']);
					}
				});
				
			});
			if (silent){
				$.each(messages, function(index, message){
					console.log("severity: "+ message.severity + " - " + message.message);
				});
			} else {
				if(messages.length){
					var messageHTML ="";
					$.each(messages, function(index, message){
						 messageHTML+= '<li class="severity-'+message.severity+'">'+message.message+'</li>';
					})
					$('head').append('<style>.jqa-tip{font-size:85%;position: absolute;background: #fff;border: solid 1px #ccc;padding: 3px 8px;box-shadow: 0px 0px 3px 1px #ccc;}.jqa-modal{width:600px;left:50%;top:15%;position:absolute;position:fixed;margin:0;margin-left:-300px;color:#808080;font-family:"Helvetica Neue", Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:18px;background-color:#FFFFFF;border:1px solid #EAEEFA;border:1px solid rgba(234, 238, 250, 0.6);border-radius:6px;box-shadow:0 0 3px rgba(0, 0, 0, 0.6);z-index:99999;}.jqa-modal .jqa-modal-header{padding:5px 15px;margin:0;border-bottom:1px solid #EEEEEE;}.jqa-modal .jqa-modal-header strong{margin:0;color:#404040;font-size:16px;font-family:"Helvetica Neue", Helvetica, Arial, sans-serif;line-height:36px;}.jqa-modal a.close{position:absolute;right:15px;top:15px;color:#999;font-family:"Helvetica Neue", Helvetica, Arial, sans-serif;font-size:17px;font-weight:normal;line-height:10px;text-decoration:none;}.jqa-modal a.close:hover{color:#444;}.jqa-modal .jqa-modal-body{padding:15px;}.jqa-modal .jqa-modal-body p{font-size:13px;font-weight:normal;color:#606060;line-height:18px;}.jqa-modal .jqa-modal-footer{display:block;background-color:#F5F5F5;padding:0;border-top:1px solid #EEEEEE;border-radius:0 0 6px 6px;-webkit-box-shadow:inset 0 1px 0 #FFF;-moz-box-shadow:inset 0 1px 0 #FFF;box-shadow:inset 0 1px 0 #FFF;zoom:1;margin-bottom:0;text-align:center;}.jqa-modal .jqa-modal-footer a.jqa-close-modal{text-decoration:none;cursor:pointer;display:block;color:#333;font-size:13px;padding: 15px;}.jqa-modal-footer a.jqa-close-modal:hover,.jqa-modal-footer a.jqa-close-modal:focus,.jqa-modal-footer a.jqa-close-modal:active{border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; background: #F2F2F2; box-shadow: inset 0 0 10px #D9D9D9; outline: none;}</style>');
					$('body').append('<div class="jqa-modal"><div class="jqa-modal-header"><strong>'+defaults.headerMessage+'</strong></div><div class="jqa-modal-body"><ul>'+messageHTML+'</ul></div><div class="jqa-modal-footer"><a title="Close" href="javascript:;" id="jqa-close-modal" class="jqa-close-modal">Close</a></div></div>');
					$('.jqa-modal').on('click', '.jqa-modal-footer', function(){
						$('.jqa-modal').remove();
					});
					$('#jqa-close-modal').focus();
				}
			}
		}
	//Fin
	window.jQA = new jQA;
})( jQuery, window );