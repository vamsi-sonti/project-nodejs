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


//Producer table changes
server.route(
   //GET Producers
    {
    method:'GET',
    path:'/api/producers',
    handler:(req,h)=>{
        var p = new Promise((resolve,reject)=>{
            const sqlconnection = mysql.createConnection({
                host:'localhost',
                user:'root',
                database:'slapchart'
    
            })
            //var flag=0;
            sqlconnection.connect();
    
            sqlconnection.query('select * from producers',(error,results,fields)=>{
                if(error){
                    //flag=1;
                    reject(error);
                }
    
                resolve(results);
            })
            sqlconnection.end();
        }
        
    )
    //if(flag==1)
       // return p.catch();
    //else
        return p.then();
    }
});
//POST in producers
server.route(
{
method:'POST',
path:'/api/producers',
handler:(request,h)=>{
    
    var pname=request.payload.producer_name;
    var email=request.payload.email;
    var tname=request.payload.twitter_name;
    var sname=request.payload.sound_cloud_name;
    var password=request.payload.password;
    var p_status=request.payload.producer_status;

        if(pname.length>=32)
            return "Producer Name must be less than 32 characters";
        else if(pname.includes('XxXxStr8FirexXxX')==true)
            return "Name can't contain XxXxStr8FirexXxX!";
        else if((email.includes('@gmail.com')==false) && (email.includes('@yahoo.com')==false))
            return "The E-mail provided is not proper";
        else if(email.length>=256)
            return "E-mail Length must be less than 256 characters";
        else if(tname.length>=16)
            return "Twitter Name must be less than 16 characters"; 
        else if(sname.length>=32)
            return "Soundcloud Name must be less than 32 characters"; 
        else{    
        return new Promise((resolve,reject)=>{
            const sqlconnection = mysql.createConnection({
                host:'localhost',
                user:'root',
                database:'slapchart'

            })
            sqlconnection.connect();

            sqlconnection.query(`INSERT INTO producers(id,producer_name,email,password,twitter_name,sound_cloud_name,producer_status) VALUES(${request.payload.id},'${pname}','${email}','${password}','${tname}','${sname}','${p_status}')`,(error,results,fields)=>{
                if(error) reject(error);

                resolve(results);
            })
            sqlconnection.end();
    })
    }
    }
    })

//Question 3 GET with ID
server.route({
    method:'GET',
    path:'/api/producers/{id}',
    handler:(req,h)=>{
        var id=req.params.id;
        return new Promise((resolve,reject)=>{
            const sqlconnection = mysql.createConnection({
                host:'localhost',
                user:'root',
                database:'slapchart'

            })
           // var strval=`select * from producers WHERE id=${id}`;
            sqlconnection.connect();

            sqlconnection.query(`select * from producers WHERE id=${req.params.id}`,(error,results,fields)=>{
                if(error) reject(error);

                resolve(results);
            })
            sqlconnection.end();
    })
    }
})

//Question 4 DELETE from both producers and beats

server.route({
    method:'DELETE',
    path:'/api/producers/{id}',
    handler:(req,h)=>{
        var id=req.params.id;
        return new Promise((resolve,reject)=>{
            const sqlconnection = mysql.createConnection({
                host:'localhost',
                user:'root',
                database:'slapchart'

            })
           // var strval=`select * from producers WHERE id=${id}`;
            sqlconnection.connect();

            sqlconnection.query(`DELETE from producers WHERE id=${req.params.id}`,(error,results,fields)=>{
                if(error) reject(error);

                resolve(results);
            })
            sqlconnection.query(`DELETE from beats WHERE producer_id=${req.params.id}`,(error,results,fields)=>{
                if(error) reject(error);

                resolve(results);
            })
            sqlconnection.end();
    })
    }
})

//Question 5 Update using validations
server.route(
    {
    method:'PUT',
    path:'/api/producers/{id}',
    handler:(request,h)=>{
        
        let id=request.params.id;
        var pname=request.payload.producer_name;
        var email=request.payload.email;
        var tname=request.payload.twitter_name;
        var sname=request.payload.sound_cloud_name;
        var password=request.payload.password;
        var p_status=request.payload.producer_status;
    
            if(pname.length>=32)
                return "Producer Name must be less than 32 characters";
            else if(pname.includes('XxXxStr8FirexXxX')==true)
                return "Name can't contain XxXxStr8FirexXxX!";
            else if((email.includes('@gmail.com')==false) && (email.includes('@yahoo.com')==false))
                return "The E-mail provided is not proper";
            else if(email.length>=256)
                return "E-mail Length must be less than 256 characters";
            else if(tname.length>=16)
                return "Twitter Name must be less than 16 characters"; 
            else if(sname.length>=32)
                return "Soundcloud Name must be less than 32 characters"; 
            else{    
            return new Promise((resolve,reject)=>{
                const sqlconnection = mysql.createConnection({
                    host:'localhost',
                    user:'root',
                    database:'slapchart'
    
                })
                sqlconnection.connect();
    
                sqlconnection.query(`UPDATE producers SET producer_status='${p_status}' WHERE id=${id}`,(error,results,fields)=>{
                    if(error) reject(error);
    
                    resolve(results);
                })
                sqlconnection.end();
        })
        }
        }
        })

        //Question 6 Get related beats
        server.route({
            method:'GET',
            path:'/api/producers/{id}/approvedBeats',
            handler:(req,h)=>{
                var id=req.params.id;
                return new Promise((resolve,reject)=>{
                    const sqlconnection = mysql.createConnection({
                        host:'localhost',
                        user:'root',
                        database:'slapchart'
        
                    })
                   // var strval=`select * from producers WHERE id=${id}`;
                    sqlconnection.connect();
        
                    sqlconnection.query(`select beat_name,beat_url from beats WHERE approved=1 && producer_id=${id}`,(error,results,fields)=>{
                        if(error) reject(error);
        
                        resolve(results);
                    })
                    /*sqlconnection.query(`DELETE from beats WHERE producer_id=${req.params.id}`,(error,results,fields)=>{
                        if(error) reject(error);
        
                        resolve(results);
                    })*/
                    sqlconnection.end();
            })
            }
        })

        //Question 7 GET from both producers and beats only submitted
        server.route({
            method:'GET',
            path:'/api/producers/{id}/submittedBeats',
            handler:(req,h)=>{
                var id=req.params.id;
                return new Promise((resolve,reject)=>{
                    const sqlconnection = mysql.createConnection({
                        host:'localhost',
                        user:'root',
                        database:'slapchart'
        
                    })
                   // var strval=`select * from producers WHERE id=${id}`;
                    sqlconnection.connect();
        
                    sqlconnection.query(`select producer_name,beat_name,beat_url from beats inner join producers ON beats.producer_id=producers.id WHERE submit_date IS NOT NULL && producer_id=${id}`,(error,results,fields)=>{
                        if(error) reject(error);
        
                        resolve(results);
                    })
                    sqlconnection.end();
            })
            }
        })

        //Question 8 beats with submitted but not approved
        server.route({
            method:'GET',
            path:'/api/beats/submitted',
            handler:(req,h)=>{
                //var id=req.params.id;
                return new Promise((resolve,reject)=>{
                    const sqlconnection = mysql.createConnection({
                        host:'localhost',
                        user:'root',
                        database:'slapchart'
        
                    })
                   // var strval=`select * from producers WHERE id=${id}`;
                    sqlconnection.connect();
        
                    sqlconnection.query(`select * from beats where approved=0`,(error,results,fields)=>{
                        if(error) reject(error);
        
                        resolve(results);
                    })
                    sqlconnection.end();
            })
            }
        })

        //Question 9 from beats approved to be posted between start date and end date
        server.route({
            method:'GET',
            path:'/api/beats/approved/{startDate}/{endDate}',
            handler:(req,h)=>{
                //var id=req.params.id;
                var startdate=req.params.startDate;
                var enddate=req.params.endDate;
                console.log(enddate);
                return new Promise((resolve,reject)=>{
                    const sqlconnection = mysql.createConnection({
                        host:'localhost',
                        user:'root',
                        database:'slapchart'
        
                    })
                   // var strval=`select * from producers WHERE id=${id}`;
                    sqlconnection.connect();
        
                    sqlconnection.query(`select * from beats where post_date_time > '${startdate}' && post_date_time < '${enddate}' && approved=1`,(error,results,fields)=>{
                        if(error) reject(error);
        
                        resolve(results);
                    })
                    sqlconnection.end();
            })
            }
        })

        //Question 10 beats submitted between startdate and current date
        server.route({
            method:'GET',
            path:'/api/beats/posted/{startDate}',
            handler:(req,h)=>{
                var startdate=req.params.startDate;
                return new Promise((resolve,reject)=>{
                    const sqlconnection = mysql.createConnection({
                        host:'localhost',
                        user:'root',
                        database:'slapchart'
        
                    })
                   // var strval=`select * from producers WHERE id=${id}`;
                    sqlconnection.connect();
        
                    sqlconnection.query(`select * from beats where post_date_time > '${startdate}' && post_date_time < CURRENT_TIMESTAMP && approved=1`,(error,results,fields)=>{
                        if(error) reject(error);
        
                        resolve(results);
                    })
                    sqlconnection.end();
            })
            }
        })
        //Question 11 from beats where approved but no approval date
        server.route({
            method:'GET',
            path:'/api/beats/pending',
            handler:(req,h)=>{
                return new Promise((resolve,reject)=>{
                    const sqlconnection = mysql.createConnection({
                        host:'localhost',
                        user:'root',
                        database:'slapchart'
        
                    })
                   // var strval=`select * from producers WHERE id=${id}`;
                    sqlconnection.connect();
        
                    sqlconnection.query(`select * from beats where approval_date IS NULL && approved=1`,(error,results,fields)=>{
                        if(error) reject(error);
        
                        resolve(results);
                    })
                    sqlconnection.end();
            })
            }
        })

        //Question 12 Post in beats with validations
        server.route(
            {
            method:'POST',
            path:'/api/beats',
            handler:(request,h)=>{
                
                var bname=request.payload.beat_name;
                var burl=request.payload.beat_url;
                var p_id=request.payload.producer_id;
                var approved=request.payload.approved;
                var sdate=request.payload.submit_date;
                var adate=request.payload.approval_date;
                var post_date_time=request.payload.post_date_time;
            
                    if(bname.length>=64)
                        return "Beat Name must be less than 64 characters";
                    else if((bname.includes('[')==true) || (bname.includes(']')==true))
                        return "Name can't contain Tags";
                    /*else if((email.includes('@gmail.com')==false) && (email.includes('@yahoo.com')==false))
                        return "The E-mail provided is not proper";
                    else if(email.length>=256)
                        return "E-mail Length must be less than 256 characters";
                    else if(tname.length>=16)
                        return "Twitter Name must be less than 16 characters"; 
                    else if(sname.length>=32)
                        return "Soundcloud Name must be less than 32 characters";*/ 
                    else{    
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
                }
                })

                //Question 13 from beats using id
                server.route({
                    method:'GET',
                    path:'/api/beats/{id}',
                    handler:(req,h)=>{
                        var id=req.params.id;
                        return new Promise((resolve,reject)=>{
                            const sqlconnection = mysql.createConnection({
                                host:'localhost',
                                user:'root',
                                database:'slapchart'
                
                            })
                           // var strval=`select * from producers WHERE id=${id}`;
                            sqlconnection.connect();
                
                            sqlconnection.query(`select * from beats WHERE id=${id}`,(error,results,fields)=>{
                                if(error) reject(error);
                
                                resolve(results);
                            })
                            sqlconnection.end();
                    })
                    }
                })

                //Question 14 Delete using id
                server.route({
                    method:'DELETE',
                    path:'/api/beats/{id}',
                    handler:(req,h)=>{
                        var id=req.params.id;
                        return new Promise((resolve,reject)=>{
                            const sqlconnection = mysql.createConnection({
                                host:'localhost',
                                user:'root',
                                database:'slapchart'
                
                            })
                           // var strval=`select * from producers WHERE id=${id}`;
                            sqlconnection.connect();
                
                            sqlconnection.query(`delete from beats WHERE id=${id}`,(error,results,fields)=>{
                                if(error) reject(error);
                
                                resolve(results);
                            })
                            sqlconnection.end();
                    })
                    }
                })

                //Question 15 update using id
                server.route(
                    {
                    method:'PUT',
                    path:'/api/beats/{id}',
                    handler:(request,h)=>{
                        
                        var id=request.params.id;
                        var bname=request.payload.beat_name;
                        var burl=request.payload.beat_url;
                        var p_id=request.payload.producer_id;
                        var approved1=request.payload.approved;
                        var sdate=request.payload.submit_date;
                        var adate=request.payload.approval_date;
                        var post_date_time=request.payload.post_date_time;
                    
                            if(bname.length>=64)
                                return "Beat Name must be less than 64 characters";
                            else if((bname.includes('[')==true) || (bname.includes(']')==true))
                                return "Name can't contain Tags";
                            /*else if((email.includes('@gmail.com')==false) && (email.includes('@yahoo.com')==false))
                                return "The E-mail provided is not proper";
                            else if(email.length>=256)
                                return "E-mail Length must be less than 256 characters";
                            else if(tname.length>=16)
                                return "Twitter Name must be less than 16 characters"; 
                            else if(sname.length>=32)
                                return "Soundcloud Name must be less than 32 characters";*/ 
                            else{    
                            return new Promise((resolve,reject)=>{
                                const sqlconnection = mysql.createConnection({
                                    host:'localhost',
                                    user:'root',
                                    database:'slapchart'
                    
                                })
                                sqlconnection.connect();
                    
                                sqlconnection.query(`UPDATE beats SET producer_id=${p_id} where id=${id}`,(error,results,fields)=>{
                                    if(error) reject(error);
                    
                                    resolve(results);
                                })
                                sqlconnection.end();
                        })
                        }
                        }
                        })

                        //Question 16 approve using id
                        server.route(
                            {
                            method:'PUT',
                            path:'/api/beats/{id}/approve',
                            handler:(request,h)=>{
                                
                                var id=request.params.id;
                                var adate=request.payload.approval_date;
                                var post_date_time=request.payload.post_date_time;
                             
                                    return new Promise((resolve,reject)=>{
                                        const sqlconnection = mysql.createConnection({
                                            host:'localhost',
                                            user:'root',
                                            database:'slapchart'
                            
                                        })
                                        sqlconnection.connect();
                            
                                        sqlconnection.query(`UPDATE beats SET approved=1,approval_date='${adate}',post_date_time='${post_date_time}' where id=${id}`,(error,results,fields)=>{
                                            if(error) reject(error);
                            
                                            resolve(results);
                                        })
                                        sqlconnection.end();
                                })
                                }
                                }
                                )
                                
                                //Question 17 unapproves based on id
                                server.route(
                                    {
                                    method:'PUT',
                                    path:'/api/beats/{id}/unapprove',
                                    handler:(request,h)=>{
                                        
                                        var id=request.params.id;
                                        /*var adate=request.payload.approval_date;
                                        var post_date_time=request.payload.post_date_time;*/
                                     
                                            return new Promise((resolve,reject)=>{
                                                const sqlconnection = mysql.createConnection({
                                                    host:'localhost',
                                                    user:'root',
                                                    database:'slapchart'
                                    
                                                })
                                                sqlconnection.connect();
                                    
                                                sqlconnection.query(`UPDATE beats SET approved=0,approval_date=NULL,post_date_time=NULL where id=${id}`,(error,results,fields)=>{
                                                    if(error) reject(error);
                                    
                                                    resolve(results);
                                                })
                                                sqlconnection.end();
                                        })
                                        }
                                        }
                                        )


server.start();
console.log('server has started!!');