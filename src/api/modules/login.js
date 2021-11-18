export default {
    "login": '/api/user/v1/login',
    "validate": '/api/user/v1/validate',
    "logout": '/api/user/v1/logout',
    "getLoginInfoApi": "/api/param/v1/params/value/map?keys=org.name,sys.version",//keys=org.name,sys.version

    //按机构统计案件量-统计图  ?from=2019-01-01&to=2020-03-20
    "orgCaseCntApi": '/api/case-stat/v1/org/case-cnt',
    //按专业统计案件量-统计图  ?from=2019-01-01&to=2020-03-20&orgId=1
    "pcCaseCntApi": '/api/case-stat/v1/pc/case-cnt',
    //按机构统计金额-统计图    ?from=2019-01-01&to=2020-03-20
    "orgAmountApi": '/api/case-stat/v1/org/amount',
    //按专业类别统计金额-统计图  ?from=2019-01-01&to=2020-03-20&orgId=1
    "pcAmountApi": '/api/case-stat/v1/pc/amount',
    //面板的通知部件  ?pageSize=25&current=1
    "msgRecentApi": 'api/message/v1/messages/recent',
}
