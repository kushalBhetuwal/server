var isPalindrome = function(x) {
    y = x.toString().split("")
    console.log(y)
   let array =[]
   for(item of x){
       array.push(y.pop())
   }
   console.log(array)


};

console.log(isPalindrome(121))
