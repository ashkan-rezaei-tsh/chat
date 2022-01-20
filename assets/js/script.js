/*window.onload = function () {
	const dropdown = document.querySelector('[data-toggle="dropdown"]');
	dropdown.addEventListener('click', function (e) {
		e.preventDefault();
		const parent = this.parentNode;
		let menu = null;
		
		// console.log(parent);
		
		for (let i = 0; i < parent.children.length; i++) {
			if (parent.children[i].className.includes('dropdown-menu')) {
				menu = parent.children[i];
				break;
			}
		}
		if (menu.className.includes('show')) {
			menu.classList.remove('show');
		} else {
			menu.classList.add('show');
		}
	});
	
	document.onclick = function (e) {
		if (e.target.className.includes('dropdown-item')) {
			e.target.closest('.dropdown-menu').classList.remove('show');
		}
	}
	
};*/
// Profiles

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
	// We execute the same script as before
	let vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
});

$(function () {
	goToLastMessage();
	
	$('[data-toggle="dropdown"]').on('click', function (e) {
		e.preventDefault();
		
		let dropdown = $(this).parent();
		
		let menu = dropdown.find('.dropdown-menu');
		
		if (menu.hasClass('show')) {
			menu.removeClass('show');
		} else {
			menu.addClass('show');
			e.stopPropagation();
		}
	});
	
	$('.dropdown-item').on('click', function () {
		$('.dropdown-menu').removeClass('show');
	});
	
	
	// modal
	$('[data-toggle="modal"]').on('click', function (e) {
		e.preventDefault();
		let target = $(this).data('target');
		$('#' + target).addClass('show');
		e.stopPropagation();
	});
	
	$('[data-dismiss="modal"]').on('click', function (e) {
		e.preventDefault();
		$modal = $(this).parentsUntil('.modal').parent();
		$modal.removeClass('show');
	});
	
	
	$('[data-toggle="accordion"]').on('click', function (e) {
		e.preventDefault();
		let target = $(this).data('target');
		$parent = $(this).parent();
		
		$parent.find('.accordion#' + target).toggleClass('expanded');
	});
	
	
	$(document).on('keyup', function (e) {
		if (e.keyCode === 27) {
			if ($('.modal.show').length) {
				$('.modal.show').removeClass('show');
			} else if ($('.left-panel-wrapper.show')) {
				$('.left-panel-wrapper.show').removeClass('show').find('.left-panel.show').removeClass('show');
			}
		}
		if (e.keyCode === 13 && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
		e.stopPropagation();
	});
	
	
	// Show Active tab on web page loading!
	const $tabsList = $('.tab-list');
	$tabsList.each(function () {
		$activeTab = $(this).find('.tab-item.active').prop('href').split('#').pop();
		$('#' + $activeTab).parent().find('.tab-content').removeClass('show');
		$('#' + $activeTab).parent().find('.tab-content#' + $activeTab).addClass('show');
	});
	
	// Change active tab on click
	$('.tab-item').on('click', function (e) {
		e.preventDefault();
		if (!$(this).hasClass('active')) {
			$(this).parent().find('.tab-item.active').removeClass('active');
			$(this).addClass('active');
			
			$newActiveTab = $(this).prop('href').split('#').pop();
			$('#' + $newActiveTab).parent().find('.tab-content.show').removeClass('show');
			$('#' + $newActiveTab).parent().find('.tab-content#' + $newActiveTab).addClass('show');
		}
	});
	
	
	$(document).on('click', function (event) {
		let $target = $(event.target);
		if (!$target.closest('.dropdown-menu').length /*&& $('.dropdown-menu').is(":visible")*/) {
			$('.dropdown-menu').removeClass('show');
		}
		
		if (!$target.closest('.modal-content').length) {
			$('.modal.show').removeClass('show');
		}
	});
	
	$('.left-panel-wrapper').on('click', function (e) {
		if ($(e.target).hasClass('left-panel-wrapper')) {
			closeLeftPanel();
		}
	});
	
	
	$('.emojis-button-wrapper a').on('click', function (e) {
		e.preventDefault();
		let parent = $(this).parentsUntil('.emojis-button-wrapper').parent();
		parent.find('li').removeClass('active');
		$(this).parent().addClass('active');
		let targetId = '#' + $(this).prop('href').split('#')[1];
		$('.emojis-wrapper').scrollTop(($(targetId).position().top - 45) - ($('#recentEmojis').position().top - 45));
	});
	
	setTimeout(function () {
		loadEmoticons();
	}, 500);
	
	$('.emojis-box').on('mouseout', function () {
		$(this).removeClass('hover');
	});
	
	$('.emojis-wrapper').on('scroll', function (e) {
		// console.log($('.emojis-wrapper').scrollTop());
		// console.log($('.emojis-wrapper').find('div'));
		
		// console.log(e.handleObj);
	});
	
	
	$('#editor').focus();
	// TODO: Cursor has to be on the end of text
	/*$('#editor').on('focus', function () {
		cursorManager.setEndOfContenteditable(document.getElementById('editor'));
	});*/
});

function loadEmoticons() {
	// Load Emoticons into html
	for (const keys in emoticons) {
		let iconSet = keys;
		let icons = emoticons[keys];
		
		let ul = document.createElement('ul');
		icons.forEach(function (name) {
			let li = document.createElement('li');
			let a = document.createElement('a');
			a.setAttribute('href', 'javascript:addEmoticonToText("' + name + '");')
			let img = document.createElement('img');
			img.setAttribute('src', 'assets/images/emoticons/' + name);
			
			a.appendChild(img);
			li.appendChild(a);
			ul.appendChild(li);
		});
		document.getElementById(iconSet).appendChild(ul);
	}
}

function showLeftPanel(panelId) {
	if ($('.sidebar').hasClass('show')) {
		$('.sidebar').removeClass('show');
	}
	$('.left-panel-wrapper').find('.left-panel').removeClass('show');
	$('.left-panel-wrapper').addClass('show').find('#' + panelId).addClass('show');
}

function closeLeftPanel() {
	$('.left-panel-wrapper').removeClass('show').find('.left-panel').removeClass('show');
}

function toggleLeftMenu() {
	// $('.left-panel-wrapper').find('.left-panel:not(#menu)').removeClass('show');
	$('.left-panel-wrapper').toggleClass('show').find('.left-panel#menu').toggleClass('show');
}

function trigger(elem, triggeredEvent) {
	$(elem).trigger(triggeredEvent);
}

function showSidebar() {
	closeLeftPanel();
	$('.sidebar').addClass('show').find('.chat-preview-box').removeClass('active');
	$('.messages').removeClass('active-chat');
	$('.messages#empty-chat').addClass('active-chat');
}

function closeSidebar() {
	$('.sidebar').removeClass('show');
}

function openChat(sender, chatId) {
	$parent = $(sender).parent();
	$parent.find('.chat-preview-box').removeClass('active');
	$(sender).addClass('active');
	
	$('.messages').removeClass('active-chat');
	$('.messages#' + chatId).addClass('active-chat');
	$('.chat-footer').css('display', 'block');
	emptyEditor();
	closeSidebar();
	goToLastMessage();
}


function goToLastMessage() {
	let scrollTo = document.getElementsByClassName('messages active-chat')[0].scrollHeight;
	$('.messages.active-chat').scrollTop(scrollTo);
}

function copyText(sender) {
	navigator.clipboard.writeText($(sender).text()).then(() => {
	}, () => {
		const el = document.createElement('textarea');
		el.value = $(sender).text();
		el.setAttribute('readonly', '');
		el.style.position = 'absolute';
		el.style.left = '-9999px';
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
	});
	
	$(sender).prop('title', 'کپی شد!');
	setTimeout(function () {
		$(sender).prop('title', 'برای کپی کردن کلیک کنید!');
	}, 3000);
}


function showProfile(id) {
	$profile = $('.left-panel#profile').find('.panel-body');
	let user = profilesData[id];
	let about = user.about;
	let multimedia = user.multimedia;
	
	$profile.find('.panel-profile img').prop('src', 'assets/images/' + (user.img || 'empty-user.png'));
	$profile.find('.panel-profile-name').text(user.name);
	$profile.find('.panel-profile-last-visit span').text(user.lastSeen);
	$profile.find('.profile-description').html(about.aboutText);
	$profile.find('.option-wrapper#phone h3').text(about.phone);
	$profile.find('.option-wrapper#city h3').text(about.city);
	
	
	// Remove Dynamic Content from page, so
	// they can be regenerated again :)
	$('#website').remove();
	$('#profile-social-media').remove();
	$('#profile-recent-files').remove();
	
	if (about.website) {
		$profile.find('.option-wrapper#city').after(`
		<div class="option-wrapper" id="website">
			<label>وبسایت</label>
			<h3 class="ltr">
				<a href="${about.website}" target="_blank">
					${about.website}
				</a>
			</h3>
		</div>`);
	}
	
	
	if (about.socialMediaAccounts) {
		let accounts = about.socialMediaAccounts;
		let template = `
			<div class="option-wrapper" id="profile-social-media">
				<label>شبکه های اجتماعی</label>`;
		
		if (accounts.telegram) {
			template += `<a href="${accounts.telegram}" target="_blank" class="social-media telegram">
								<i class="fab fa-telegram-plane"></i>
							</a>`;
		}
		if (accounts.whatsapp) {
			template += `<a href="${accounts.whatsapp}" target="_blank" class="social-media whatsapp">
								<i class="fab fa-whatsapp"></i>
							</a>`;
		}
		if (accounts.linkedin) {
			template += `<a href="${accounts.linkedin}" target="_blank" class="social-media linkedin">
								<i class="fab fa-linkedin-in"></i>
							</a>`;
		}
		
		if (accounts.google) {
			template += `<a href="${accounts.google}" target="_blank" class="social-media google">
								<i class="fab fa-google"></i>
							</a>`;
		}
		if (accounts.facebook) {
			template += `<a href="${accounts.facebook}" target="_blank" class="social-media facebook">
								<i class="fab fa-facebook-f"></i>
							</a>`;
		}
		if (accounts.twitter) {
			template += `<a href="${accounts.twitter}" target="_blank" class="social-media twitter">
								<i class="fab fa-twitter"></i>
							</a>`;
		}
		if (accounts.instagram) {
			template += `<a href="${accounts.instagram}" target="_blank" class="social-media instagram">
								<i class="fab fa-instagram"></i>
							</a>`;
		}
		template += '</div>';
		$profile.find('#profile-settings').before(template);
	}
	
	$settings = $profile.find('#profile-settings');
	$('#block').prop('checked', about.settings['block']);
	$('#get-notifications').prop('checked', about.settings['getNotifications']);
	
	
	if (multimedia.files) {
		let files = multimedia.files;
		let temp = '<ul class="recent-files" id="profile-recent-files">' + "\n";
		
		files.forEach(function (file) {
			temp += `
			<li>
				<a href="javascript:void(0)" class="recent-item">
					<i class="${file.icon}"></i>
					${file.name}
				</a>
			</li>`;
		});
		
		temp += '</ul>'
		
		$profile.find('#multimedia-tab div').after(temp);
	}
}

function toggleEmojisBox() {
	$('.emojis-box').toggleClass('hover');
}

function addEmoticonToText(name) {
	document.execCommand('insertImage', false, 'assets/images/emoticons/' + name);
	$('#editor').focus();
	// $('a').blur();
}

function getCurrentChat() {
	return $('.messages.active-chat');
}

function getCurrentTime() {
	let currentTime = new Date();
	let persianDate = currentTime.toLocaleDateString('fa-IR').replace(/([۰-۹])/g, token => String.fromCharCode(token.charCodeAt(0) - 1728));
	let hours = currentTime.getHours();
	hours %= 12;
	hours = hours ? hours : 12;
	let ampm = hours > 12 ? 'ب.ظ' : 'ق.ظ';
	let minutes = currentTime.getMinutes();
	minutes = minutes < 10 ? '0' + minutes : minutes;
	
	return persianDate + ' ' + hours + ':' + minutes + ' ' + ampm;
}

function getProfileAvatar(currentChat, inOut) {
	let user = currentChat.find('.message-wrapper.' + inOut + '-message').first();
	let src = user.find('img').attr('src');
	if (src === undefined) {
		return user.find('span.avatar-without-img')[0].outerHTML;
	}
	return `<img src="${src}" alt="" class="rounded ${inOut === 'in' ? 'avatar' : ''}">`;
}

function emptyEditor() {
	$('#editor').html('').focus();
}

function newMessage(inOut, profile, messageBody) {
	let start = `
	<!-- BEGIN:: Message -->
	<div class="message-wrapper ${inOut}-message">
		<div class="message-avatar">
		${profile}
		</div>
		
		<!-- BEGIN::Message section -->
		<div class="message">`;
	
	let end = `
		</div>
		<!-- END::Message section -->
	
	</div>
	<!-- END:: Message -->
		`;
	
	return start + messageBody + end;
}

function sendMessage() {
	let editor = $('#editor');
	
	if (editor.text() === '' && editor.html().indexOf('<img') === -1) {
		editor.focus();
		return;
	}
	let message = editor.html();
	message = message.replace(/(<div><br><\/div>)/g, '');
	message = message.replace(/.<br>$/g, '');
	message = message.replace(/(<img )/g, '<img class="emoticon" ');
	emptyEditor();
	
	let currentChat = getCurrentChat();
	let messageTime = getCurrentTime();
	let id = Date.now();
	
	let messageBody = `
			<!-- BEGIN:: Message Body -->
			<div class="message-body" id="${id}">
				${message}
		
				<!-- BEGIN:: Message info -->
				<div class="message-info">
					<div class="message-delivery not-delivered ml-10px">
						<i class="fa fa-check"></i>
					</div>
					<div class="time">
						${messageTime}
					</div>
				</div>
				<!-- END:: Message info -->
			</div>
			<!-- END:: Message Body -->
		`;
	
	let profile = getProfileAvatar(currentChat, 'out');
	let lastMessageWrapper = currentChat.find('.message-wrapper').last();
	
	if (lastMessageWrapper.hasClass('out-message')) {
		lastMessageWrapper.find('.message').append(messageBody);
	} else {
		currentChat.append(newMessage('out', profile, messageBody));
	}
	goToLastMessage();
	
	setTimeout(function () {
		deliverMessage(id);
	}, 300);
	
	setTimeout(function () {
		seeMessage(id);
	}, 1000);
	
	
	setTimeout(function () {
		sendReplay(currentChat.prop('id'));
	}, 2000);
}

function deliverMessage(id) {
	let currentChat = getCurrentChat();
	let currentMessage = currentChat.find('.message-body#' + id);
	currentMessage.find('.message-delivery').removeClass('not-delivered').addClass('delivered').append('<i class="fa fa-check"></i>');
}

function seeMessage(id) {
	let currentChat = getCurrentChat();
	let currentMessage = currentChat.find('.message-body#' + id);
	currentMessage.find('.message-delivery').addClass('seen');
}

function sendReplay(id) {
	let message = `<div>
					سلام<br>ببخشید سرم <strong>شلوغه</strong>، میشه بعد خودم پیام بدم؟
					<img class="emoticon" src="assets/images/emoticons/face-with-rolling-eyes_1f644.png">
				  </div>`;
	
	let currentChat = $('#' + id);
	let messageTime = getCurrentTime();
	
	let profile = getProfileAvatar(currentChat, 'in');
	
	let messageBody = `
		<div class="message-body">
			${message}
			<div class="message-info">
				<div class="time">
					${messageTime}
				</div>
			</div>
		</div>
		`;
	
	let lastMessageWrapper = currentChat.find('.message-wrapper').last();
	
	if (lastMessageWrapper.hasClass('in-message')) {
		lastMessageWrapper.find('.message').append(messageBody);
	} else {
		currentChat.append(newMessage('in', profile, messageBody));
	}
	goToLastMessage();
}

// window.onbeforeunload = function() { return "شما در حال خارج شدن از صفحه هستید!"; };
history.pushState(null, null, location.href);
window.onpopstate = function () {
	history.go(1);
};