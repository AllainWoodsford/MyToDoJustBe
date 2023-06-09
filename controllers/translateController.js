const taskQueries = require('../databaseRequests/task.queries.js');
const {Translate} = require('@google-cloud/translate').v2;
const axios = require('axios');
require('dotenv').config();


const target = "ja";
//We are goign to pass to this generally an object like this
// req.body {
  //id = taskID in database
  //}
//This is a PATCH request




 const translateText = async (req,res) =>  {
  try {
      console.log('attempt translate');
      const taskID = {id:req.body.id};
      //we are going to take the translated value, there is no point translating a task that is already in Japanese
      const foundTask = await taskQueries.getTask(taskID,['id','isTranslated','taskName']);
      if(foundTask != null)
      {
        console.log('found task');
          //We should check if the task exists before we make an API call
          //Google API costs money don't want to make empty requests to translate.
          //Do a Guard for Null or empty text
          const taskText =foundTask.taskName.trim();
          console.log(taskText);
        if(taskText.length <= 0 ){
          res.status(400).json({
            code: 400,
            message: 'Empty Task'
          });
        } else {
          console.log('task passes empty test');
            if(foundTask.isTranslated){
              //We've got a task we should check if its already translated
              res.status(400).json({
                code: 400,
                message: 'Task is already translated'
              });
            } else {
                console.log('task isnt already translated');
                //At this point we have an untranslated task, that's not empty
                //We want to trim white spaces because they charge per character
                //this returns an array we just need 1 string
                //{from:'en', to: target}
                console.log('attempt translate');
                  const response =  await axios.get(process.env.API_URL, {
                    params: {
                      q: taskText,
                      source: 'en',
                      target: target,
                      key: process.env.API_KEY
                    }
                  });
                console.log(response.data.data.translations[0].translatedText);
                
                foundTask.set({
                  taskName:response.data.data.translations[0].translatedText,
                  isTranslated:true
                });
                console.log('attempt patch on task');
                await foundTask.save();
                console.log('it went well');
                res.status(200).json({
                  code: 200,
                  message: 'task is now translated',
                  entity:foundTask.id,
                  action: 'Translate task'
                });
            } // end else
        } // end else length
      } //END IF TASK NULL
      else {
          res.status(404).json({
            code: 404,
            message: 'Task not found'
          });
      }//END ELSE Found Task
  }//END TRY
  catch{
    console.log('error');
    res.status(500).json({
      code: 500,
      message: 'internal server error'
    });
  } //END Catch
}



// const translateText = async (req,res) =>  {
//   try {
//       console.log('attempt translate');
//       const taskID = {id:req.body.id};
//       //we are going to take the translated value, there is no point translating a task that is already in Japanese
//       const foundTask = await taskQueries.getTask(taskID,['id','isTranslated','taskName']);
//       if(foundTask != null)
//       {
//         console.log('found task');
//           //We should check if the task exists before we make an API call
//           //Google API costs money don't want to make empty requests to translate.
//           //Do a Guard for Null or empty text
//           const taskText =foundTask.taskName.trim();
//           console.log(taskText);
//         if(taskText.length <= 0 ){
//           res.status(400).json({
//             code: 400,
//             message: 'Empty Task'
//           });
//         } else {
//           console.log('task passes empty test');
//             if(foundTask.isTranslated){
//               //We've got a task we should check if its already translated
//               res.status(400).json({
//                 code: 400,
//                 message: 'Task is already translated'
//               });
//             } else {
//               console.log('task isnt already translated');
//               //At this point we have an untranslated task, that's not empty
//                //We want to trim white spaces because they charge per character
//                //this returns an array we just need 1 string
//               //{from:'en', to: target}
//                console.log('attempt translate');
//               let translatedText =  await translate.translate(taskText,target);
//               console.log(tasktext + "/" + target);
//               //Should be good at this point to make the PATCH request
//               foundTask.set({
//                 taskName:translatedText[0],
//                 isTranslated:true
//               });
//               console.log('attempt patch on task');
//               await foundTask.save();
//               console.log('it went well');
//               res.status(200).json({
//                 code: 200,
//                 message: 'task is now translated',
//                 entity:foundTask.id,
//                 action: 'Translate task'
//               })
//             }
//         }
//       } //END IF TASK NULL
//       else {
//           res.status(404).json({
//             code: 404,
//             message: 'Task not found'
//           });
//       }//END ELSE Found Task
//   }//END TRY
//   catch{
//     console.log('error');
//     res.status(500).json({
//       code: 500,
//       message: 'internal server error'
//     });
//   } //END Catch
// }

module.exports = { translateText };
