let ChangeImagePromise = new Promise(function (resolve,reject) {

    //changing the image

    let isChanged = true;


    if(isChanged){
        resolve('Changed');
    }else
    {
        reject('Not Changed');

    }

});

ChangeImagePromise.then(function(fromResolve){

    console.log('the image is ' + fromResolve);

}).catch(function(fromReject){

    console.log('the image is ' + fromReject);
});