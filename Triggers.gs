function createTriggers() {
  ScriptApp.newTrigger("exportCompletedItems")
  .timeBased()
  .atHour(14)
  .everyDays(1) 
  .create();
  
  ScriptApp.newTrigger("exportCompletedItems")
  .timeBased()
  .atHour(20)
  .everyDays(1) 
  .create();
}


function exportCompletedItems(){
var today = new Date();
var formattedDate = Utilities.formatDate(new Date(), "GMT","dd-MM-yyyy");
var subject = 'Completed items for today';
if(today.getHours() == 14){
subject+=' 2PM report ';
}else{
subject+=' 8PM report ';
}
var name = subject+' '+formattedDate;
var file = createCompletedExport(today.getHours(),name);
COMPLETED_ITEMS_MAIL.map(function(item){
file.addEditor(item);
MailApp.sendEmail({
    to: item,
    subject: name,
    htmlBody: "<a href='"+file.getUrl()+"'>"+name+"</a> ",
  });
});
}