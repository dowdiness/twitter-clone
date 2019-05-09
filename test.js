const text =
  'WebRTCビデオ通話だけで良いならこれ https://gist.github.com/voluntas/67e5a26915751226fdcf 動画配信は面倒くさすぎるからやらん！https://www.slideshare.net/dena_tech/showroom-html5-88373778'
const urlReg = /((http(s)?(:\/\/))+(www\.)?([\w\-./])*(\.[a-zA-Z]{2,3}\/?))[^\s\b\n|]*[^.,;:?!@^$ -]/g
console.log(text.replace(urlReg, "<a href='$1' target='_blank'>$1</a>"))
