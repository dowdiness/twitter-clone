export default function({ $axios, redirect }) {
  $axios.onRequest(config => {
    console.log('Making request to ' + config.url)
  })

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      redirect('/400')
    }
  })

  $axios.setToken('access_token')

  // 注: ここの引数を今は使わないからと _ とかにするとエラーになる
  $axios.onResponse(config => {
    $axios.setHeader(
      'Access-Control-Allow-Origin' /** 許可するドメイン http://exsample.com あるいは通すだけなら '*' **/
    )
  })
}
