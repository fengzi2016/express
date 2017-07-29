let req={
    body:{Id: '201611',
         name: 'Jack',
         group: '汉',
         klass: '1',
         math: '100',
         Chinese: '100',
         English: '100',
         Program: '100'
    }
};
let trueFlag=0;
    if( /^[a-zA-Z]||[\u4e00-\u9fa5]$/.exec(req.body.name)!==null){trueFlag++;}
    if(/^[0-9]{6}$/.exec(req.body.Id)!==null){trueFlag++;}
    if(/^[a-zA-Z]||[\u4e00-\u9fa5]$/.exec(req.body.group)!==null){trueFlag++;}
    if(/^[0-9]{1,2}$/.exec(req.body.klass)!==null){trueFlag++;}
    if(/^[0-9]{1,3}$/.exec(req.body.math)!==null){trueFlag++;}
    if(/^[0-9]{1,3}$/.exec(req.body.Chinese)!==null){trueFlag++;}
    if(/^[0-9]{1,3}$/.exec(req.body.English)!==null){trueFlag++;}
    if(/^[0-9]{1,3}$/.exec(req.body.Program)!==null){trueFlag++;}
if(trueFlag===8){
    console.log('OK');
}else{console.log('Fail')}