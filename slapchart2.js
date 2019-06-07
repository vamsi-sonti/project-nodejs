'use strict';

const Hapi = require('@hapi/hapi');
const mysql=require('mysql');

const server = Hapi.server({
    host:'localhost',
    port:8000
})

server.route({
    method:'GET',
    path:'/',
    handler:(request,h)=>{
        return 'WELCOME!'
    }
})



//Post in slapchart beats using validations

var  p = async (producerId)=>{
    var n = new Promise((resolve,reject)=>{
        const sqlconnection = mysql.createConnection({
            host:'localhost',
            user:'root',
            database:'slapchart'
    
        })
        sqlconnection.connect();
    
        sqlconnection.query(`select count(*) AS count from beats where submit_date=CURRENT_DATE && producer_id=${producerId}`,(error,results,fields)=>{
            if(error) reject(error);
            
            
            resolve(results);
        })

        sqlconnection.end();
    })
    
     return n;
}  



server.route(
    {
    method:'POST',
    path:'/api/beats',
    handler:async (request,h)=>{
        
        // var bname=request.payload.beat_name;
        var burl=request.payload.beat_url;
        var p_id=request.payload.producer_id;
        var approved=request.payload.approved;
        var sdate=request.payload.submit_date;
        var adate=request.payload.approval_date;
        var post_date_time=request.payload.post_date_time;

        //let {beat_name: bname} = request.payload

        var countArr= await p(p_id).then((results)=>{
            var res = results[0].count;
            //console.log(res);
            return Number(results[0].count);
        });
        console.log(countArr);
        /*var res2 = countArr.then((results)=>{
            var res = results[0].count;
            //console.log(res);
            return res;
        });*/
        console.log(countArr);
            if(bname.length>=64)
                return "Beat Name must be less than 64 characters";
            else if((bname.includes('[')==true) || (bname.includes(']')==true))
                return "Name can't contain Tags";
               
            else if(countArr==0){    
            return new Promise((resolve,reject)=>{
                const sqlconnection = mysql.createConnection({
                    host:'localhost',
                    user:'root',
                    database:'slapchart'
    
                })
                sqlconnection.connect();
    
                sqlconnection.query(`INSERT INTO beats(id,beat_name,beat_url,approved,producer_id,submit_date,approval_date,post_date_time)
                VALUES(${request.payload.id},'${bname}','${burl}',${approved},'${p_id}','${sdate}','${adate}','${post_date_time}')`,(error,results,fields)=>{
                    if(error) reject(error);
    
                    resolve(results);
                })
                sqlconnection.end();
        })
        }
        else
            return "Can't add to the database";
        }
        })

/*else if((email.includes('@gmail.com')==false) && (email.includes('@yahoo.com')==false))
                return "The E-mail provided is not proper";
            else if(email.length>=256)
                return "E-mail Length must be less than 256 characters";
            else if(tname.length>=16)
                return "Twitter Name must be less than 16 characters"; 
            else if(sname.length>=32)
                return "Soundcloud Name must be less than 32 characters";*/ 
             
            // var countobj = countArr[0["count"]];
            // console.log(countArr);
            // return countArr;

/*server.route(
    {
    method:'POST',
    path:'/api/producers',
    handler:(request,h)=>{
        
            
    
            if(pname.length>=32)
                return "Producer Name must be less than 32 characters";
            else if(pname.includes('XxXxStr8FirexXxX')==true)
                return "Name can't contain XxXxStr8FirexXxX!";
            else if((email.includes('@')==false) && (email.includes('.com')==false))
                return "The E-mail provided is not proper";
            else if(email.length>=256)
                return "E-mail Length must be less than 256 characters";
            else if(tname.length>=16)
                return "Twitter Name must be less than 16 characters"; 
            else if(sname.length>=32)
                return "Soundcloud Name must be less than 32 characters"; 
            else{ 
            return new Promise((resolve,reject)=>{
                var pname=request.payload.producer_name;
            var email=request.payload.email;
            var tname=request.payload.twitter_name;
            var sname=request.payload.sound_cloud_name;
            var password=request.payload.password;
            var p_status=request.payload.producer_status;
    
            console.log(tname);
                const sqlconnection = mysql.createConnection({
                    host:'localhost',
                    user:'root',
                    database:'slapchart'
    
                })
                sqlconnection.connect();
    
                sqlconnection.query(`INSERT INTO producers(producer_name,email,password,twitter_name,sound_cloud_name,producer_status) VALUES('${request.payload.producer_name}','${request.payload.email}','${request.payload.password}','${request.payload.twitter_name}','${request.payload.sound_cloud_name}','${request.payload.producer_status}')`,(error,results,fields)=>{
                    if(error) reject(error);
    
                    resolve(results);
                })
                sqlconnection.end();
        })
        //}
        //}
        }
        });*/
    
    server.start();
    console.log('server has started!!');