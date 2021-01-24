document.addEventListener('DOMContentLoaded', () => {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  
  //my code
  document.querySelector('#compose-view').addEventListener('submit', (e)=>{send_email(e)})
  
  // By default, load the inbox
  load_mailbox('inbox');

});


function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#display-email').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
};


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#display-email').style.display = 'none';
  
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
  if (mailbox === "inbox"){
    
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {
      // Print emails
      // console.log(emails);
      // ... do something else with emails ...
      for (let index = 0; index < emails.length; index++) {
        // console.log("this is the id: "+emails[index].id+" "+ emails[index].subject)
        
        const element = document.createElement('div');
        element.innerHTML = emails[index].subject + "   from: " +emails[index].sender + " Date:"+emails[index].timestamp;
        element.className = "individual-email";

      
      //adjust the read field to false
      // console.log(emails[index])
      
      //Chosses the color of the element
      if (emails[index].read){
        element.style.backgroundColor = "white";
      }else{element.style.backgroundColor = "gray";}
      
      element.addEventListener('click', function() {
        
        // console.log('This element has been clicked!  ' + emails[index].subject );
        var email_id = emails[index].id
        fetch_put(email_id, false);
        element.style.backgroundColor = "gray";
        displayemail(email_id)
      });
      document.querySelector('#emails-view').append(element);
    }
    
  });
};
};




function send_email(e){
  
  e.preventDefault();
  
  var dest = document.querySelector('#compose-recipients').value;
  var subject = document.querySelector('#compose-subject').value;
  var body = document.querySelector('#compose-body').value;
  
  if (dest == "" || subject == "" ||  body== "") {
    console.log("All fields must be filled!");
    alert("not enough information")
  }
  else{
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: dest,
        subject: subject,
        body: body
      })
    })
    .then(response => response.json())
    .then(result => {
      // Print result
      console.log(result);
    });
  };
  load_mailbox('sent');
};


function displayemail(id) {

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#display-email').style.display = 'block';

  

  fetch('/emails/'+id)
  .then(response => response.json())
  .then(email => {
    //       // Print email
          // console.log(email)
          console.log(email)

          document.getElementById("sender").innerHTML = email.sender
          document.getElementById("subject").innerHTML = email.subject
          document.getElementById("content").innerHTML = email.body
          document.getElementById("date").innerHTML = email.timestamp
  });

  let vol = document.getElementById('voltar');
  let rep = document.getElementById('reply');

  vol.addEventListener('click', event => {
    load_mailbox('inbox')
  });

  rep.addEventListener('click', event => {
    
    // inputs for the the reply
    var email = document.querySelector("#sender").innerHTML;
    var sub = "Re: "+document.querySelector("#subject").innerHTML;
    var time = document.querySelector("#date").innerHTML
    var cont = document.querySelector("#content").innerHTML
    var text = "On " + time +", " + email +" wrote: " +cont  
    reply_email(email, sub, text)
  });
  
};


function fetch_put (id, bolean) {

  fetch('/emails/'+id, {
    method: 'PUT',
    body: JSON.stringify({
        "read": bolean
    })

  })
}

function reply_email(email, assunto, texto){

  compose_email();

  // Pre-preenche os campos
  document.querySelector('#compose-recipients').value = email;
  document.querySelector('#compose-subject').value = assunto;
  document.querySelector('#compose-body').value = texto;

}