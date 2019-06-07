const createCsvWriter = require('csv-writer').createObjectCsvWriter;
exports.generateCsv = function(data,env){
    var path = env+'-list.csv';
    const csvWriter = createCsvWriter({
        path: './public/'+path,
        header: [
            {id: 'name', title: 'NAME'},
        ]
    });
    var records =[];
     data.forEach((data)=>{
        records.push({name :data});
     })
    csvWriter.writeRecords(records)       // returns a promise
        .then(() => {
            console.log('...Done');
        });
        return path;
}