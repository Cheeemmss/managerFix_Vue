export default{
    roleData(row){   
        let arr = []
        row.roleList.forEach((item, index)=>{
          if (index > 2) {
            return
          }
          arr.push(item.file_name);
        })
        return arr.join(',')
      } 
}