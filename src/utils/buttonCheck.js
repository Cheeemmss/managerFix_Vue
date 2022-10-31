export default{
    //判断该该用户是否有该按钮的权限
    ButtonIsAvailable(buttonName){
        let user = JSON.parse(localStorage.getItem('user'))
        let buttons = user.buttonList
        let buttonPermissions = buttons.map(e => e.permission)
        for(let i=0;i<buttonPermissions.length;i++){
            if(buttonName == buttonPermissions[i]){
                return true
             }
          }
        return false
    }
}