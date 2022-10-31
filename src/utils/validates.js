 const validates = {
  //手机号码校验
  validatephone(rule, value, callback){
    let reg = /^[1][3, 4, 5, 6, 7, 8][0-9]{9}$/
    if(!String(value).match(reg)){
      callback(new Error('请输入正确的手机号'))
    }else{
      callback()
    }
  },
  //电子邮箱校验
  validateemail(rule, value, callback) {
    let reg = /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/
    if(!String(value).match(reg)){
      callback(new Error('请输入正确的邮箱'))
    }else{
      callback()
    }    
  }
  
 }

export default validates