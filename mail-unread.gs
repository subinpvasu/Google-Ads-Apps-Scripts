/**
* Forward unread mails to your active mail box and markRead
*
*/

function messageStars(){
  const emails = GmailApp.getInboxThreads();
  emails.forEach((thread)=>{
    //Logger.log(thread);
    const messages = thread.getMessages();
    messages.forEach((message)=>{      
      if(message.isUnread()){
        message.forward('subinpvasu@gmail.com');
        message.markRead();
      }
    })
  })
}
