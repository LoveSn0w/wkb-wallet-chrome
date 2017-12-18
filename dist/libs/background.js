(function() {
    let appDetail = chrome.app.getDetails();

	let notify = function (notifications) {
        if (notifications.length > 0) {
            chrome.notifications.create('', {
                iconUrl: 'images/icon48.png',
                type: 'list',
                title: '您有新的通知',
                message: '来自玩客币钱包的提醒',
                items: notifications,
                buttons: [
                    {
                        title: '查看详情',
                    }],
            });

            chrome.notifications.onButtonClicked.addListener(
                function(notificationId, buttonIndex) {
                    if(buttonIndex === 0) {
                        window.open('chrome-extension://'+appDetail.id+'/index.html');
                    }
                    chrome.notifications.clear(notificationId)
                });
        }
    }

	let hasRemind = function() {  // 今天有没有提醒
		let walletList = {};   // 所有的待办事项
		let notifications = [];  // 所有的通知列表
		chrome.storage.sync.get('wkbWalletStorage', function(rs) {
            if(!$.isEmptyObject(rs.wkbWalletStorage)){
                let count = 1;
                let nowtime = Date.parse(new Date());
                let store = rs.wkbWalletStorage;
                walletList = rs.wkbWalletStorage.walletAddress.list;
                for (let i = 0; i < walletList.length; i++) {
                    //如果最后更新时间到现在超过30分钟,更新一次
                    if(nowtime - walletList[i].lastupdate > 30*60*1000){
                        //更新钱包
                        $.getJSON('https://wkbminer.com/api/account/' + walletList[i].address, function(data){
                            store.walletAddress.list[i].lastupdate = nowtime;
                            //添加提醒
                            if(store.walletAddress.list[i].amount != data.msg.balance){
                                try {
                                    notifications.push({
                                        title: "第"+(i+1)+"个钱包里",
                                        message: "钱包余额发生变动 !",
                                    });
                                    notify(notifications);
                                } catch (__) {}
							}
                            store.walletAddress.list[i].amount = data.msg.balance;
                            store.walletAddress.list[i].totaltrans = data.msg.totaltrans;
                            store.walletAddress.list[i].trans = data.msg.trans;
                            store.walletAddress.list[i].transout = data.msg.transout;
                            store.walletAddress.list[i].lastupdate = nowtime;
                            chrome.storage.sync.set({
                                wkbWalletStorage: store
                            });
                        });
                    }
                }
                
			}
		});
	};

	chrome.runtime.onMessage.addListener(function(request) {
		if (request.text === 'showNotifications') {
			hasRemind();
		}
	});
})();




