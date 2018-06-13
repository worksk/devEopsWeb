/**
 * 
 * @param {object} object 
 */
export function objectIterator(object) {
   let st = []
   for(let obj in object){
        st.push(obj+"="+object[obj])
   }
    return "?"+st.join('&')
}
  