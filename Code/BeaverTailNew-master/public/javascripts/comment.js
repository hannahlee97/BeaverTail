
function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

(function() {
  var ndx = 0; $('section.comments').find('a.reply').click(function (e) {
     e.preventDefault;
     alert('Available Very Soon!\n\nBientôt disponible');
   });
   
   $('section.comments').find('span.likes-counter a').click(function() {
     if (ndx === 0) {
       var likes = $(this).text().substr(0,2);
       
       likes = +likes + 1;
       $(this).text(likes + " Likes");
       ndx++;
     }
   })
 })