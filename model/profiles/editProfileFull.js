//DEPRECATED TO BE DELETED SOON

// var mysql = require('mysql');
//
// function editProfileFull(router,connection){
//   var self=this;
//   self.handleRoutes(router,connection);
// }
//
// var self=this;
//
// editProfileFull.prototype.handleRoutes = function(router,connection){
//   router.post("/editProfileFull",function(req,res){
//     var sessionCode = req.body.sessionCode;
//     var timestamp = req.body.timestamp;
//     if(sessionCode == null || sessionCode == undefined || sessionCode == ""){
//       res.json({"message":"err.. error no params receive"});
//     }else{
//       if(timestamp==null || timestamp==undefined || timestamp==''){
//         res.json({"message":"err.. no params t_s rec"});
//       }else{
//         connection.query("select id_host from `session_host` where session_code='"+sessionCode+"'",function(err,rows){
//           if(err){
//             res.json({"message":"err.. error in selecting host from session given"});
//           }else{
//             if(rows.length>0){
//               var idHost = rows[0].id_host;
//               //step1
//               var companyName = req.body.companyName;
//               var title = req.body.title;
//               var businessField = req.body.businessField; // <-- business category
//               var tagline = req.body.tagline;
//               var companyDesc = req.body.companyDesc;
//               var region = req.body.region;
//               var address = req.body.address;
//               //step2 -> define on edit profile full product model
//               //var products = req.body.products; // <-- array
//               //step3 -> define on edit profile full product model
//               //var portofolios = req.body.portofolios; // <-- array
//
//               //connection.query("select id_cat from `bussiness_category` where category_name='"+businessField+"'",function(err,rows){
//                 //if(err){
//                   //res.json({"message":"err.. error on selecting business Category"});
//                 //}else{
//                   //if(rows.length>0){
//
//                     //connection.query("select id_province from `province` where province_name='"+region+"'",function(err,rows){
//                       //if(err){
//                         //res.json({"message":"err.. error in selecting province id from region"});
//                       //}else{
//                         //f(rows.length>0){
//                           //var idProvince = rows[0].id_province;
//                           connection.query("update `host` set company_name='"+companyName+"',title='"+title+"',category="+businessField+",tagline='"+tagline+"',profile_desc='"+companyDesc+"',region="+region+",address='"+address+"' where id_host="+idHost,function(err,rows){
//                             if(err){
//                               res.json({"message":"err.. error in updating first step val"});
//                             }else{
//                               //updating timestamp on session_host
//                               connection.query("update `session_host` set last_activity='"+timestamp+"' where session_code='"+sessionCode+"'",function(err,rows){
//                                 if(err){
//                                   res.json({"message":"err.. error on updating session"})
//                                 }else{
//                                   res.json({"message":"success updating host val and session last activity, happy sunday"});
//                                 }
//                               });
//                             }
//                           });
//                         //}else{
//                           //res.json({"message":"err.. no rows in province"});
//                         //}
//                       //}
//                     //});
//                   //}else{
//                   //  res.json({"message":"err.. no rows in business category"});
//                   //}
//                 //}
//               //});
//             }else{
//               res.json({"message":"err.. no rows in host with given session"});
//             }
//           }
//         });
//       }
//     }
//     //myFUNCTION
//
//
//     //end of myFUNCTION
//     /*var email = "";
//     var companyName = ;
//     var imgUrl = ;
//     var category = ;
//     var tagline = ;
//     var profileDesc = ;
//     var location = req.body.location;
//     var address = req.body.address;
//     var title = req.body.title;
//     var idTipe = req.body.idTipe;
//     */
//   });
// }
//
// module.exports = editProfileFull;
