const taskQueries = require('../databaseRequests/task.queries.js');
const {Translate} = require('@google-cloud/translate').v2;
const translate = new Translate();


const target = "ja";
//We are goign to pass to this generally an object like this
// req.body {
  //id = taskID in database
  //}
//This is a PATCH request
const translateText = async (req,res) =>  {
  try {
      const taskID = {id:req.body.id};
      //we are going to take the translated value, there is no point translating a task that is already in Japanese
      const foundTask = await taskQueries.getTask(taskID,['id','isTranslated','taskName']);
      if(foundTask != null)
      {
          //We should check if the task exists before we make an API call
          //Google API costs money don't want to make empty requests to translate.
          //Do a Guard for Null or empty text
          const taskText =foundTask.taskName.trim();

        if(taskText.length <= 0 ){
          res.status(400).json({
            code: 400,
            message: 'Empty Task'
          });
        } else {
            if(foundTask.isTranslated){
              //We've got a task we should check if its already translated
              res.status(400).json({
                message: 'Task is already translated'
              });
            } else {
              //At this point we have an untranslated task, that's not empty
               //We want to trim white spaces because they charge per character
               //this returns an array we just need 1 string
              const translatedText =  await translate.translate(taskText,target);
              //Should be good at this point to make the PATCH request
              foundTask.set({
                taskName:translatedText[0],
                isTranslated:true
              });
              await foundTask.save();
              res.status(200).json({
                code: 200,
                message: 'task is now translated',
                entity:foundTask.id,
                action: 'Translate task'
              })
            }
        }
      } //END IF TASK NULL
      else {
          res.status(404).json({
            code: 404,
            message: 'Task not found'
          });
      }//END ELSE Found Task
  }//END TRY
  catch{
    res.status(500).json({
      code: 500,
      message: 'internal server error'
    });
  } //END Catch
}

module.exports = { translateText };
