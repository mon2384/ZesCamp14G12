const db = firebase.firestore()
const auth = firebase.auth()
var user = auth.currentUser
var now = db.collection("EATRAIDEE").doc(email).collection("profile").doc('profile')
let tdee;
let bmr 
var email =localStorage.getItem('Email')
var heig,weig,ageg,sex
var tdeexbmr 
var foodtimeselect = localStorage.getItem('foodTime2')

var floor
var ttcaltopfp = localStorage.getItem('ttcaltopfp')

var caldiff
var files = [];
var reader = new FileReader();
var storageRef = firebase.storage().ref();
var bf,lun,din
var allttcla = 0
bf = localStorage.getItem('bfsit')
lun = localStorage.getItem('lunsit')
din = localStorage.getItem('dinsit')

function nullreset(){

  if(bf == null){
    document.getElementById('bfcalnow').innerText = "Kcal: "+ 0
  }
  if(lun == null){
    document.getElementById('luncalnow').innerText = "Kcal: "+ 0
  }
  if(din == null){
    document.getElementById('dincalnow').innerText = "Kcal: "+ 0
  }
}


document.getElementById('bfcalnow').innerText = "Kcal: "+ bf
document.getElementById('luncalnow').innerText = "Kcal: "+ lun
document.getElementById('dincalnow').innerText = "Kcal: "+ din

RetriveData()
updatecal()
Caltotal()

Difftotal()
rekcal()
nullreset()

function rekcal(){
  document.getElementById('bfcalnow').innerText = "Kcal: "+ bf
  document.getElementById('luncalnow').innerText = "Kcal: "+ lun
  document.getElementById('dincalnow').innerText = "Kcal: "+ din
}



document.getElementById('username').innerText = "Username : " + localStorage.getItem('Username')
document.getElementById('email').innerText =    "Email    : " + localStorage.getItem('Email')
loadpfp()
Swal.fire({
  icon: 'success',
  title: `Hi ${localStorage.getItem('Email')}`,
  text:`please wait 3 sec..`,
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
})

function BMR(kg,cm,age,gender){
  
  if(gender[0] == 'm'){
      bmr =  66 + (13.7 * kg) + (5 * cm) - (6.8 * age)
  }else if (gender[0] == 'f'){
      bmr = 665 + (9.6 * kg) + (1.8 * cm) - (4.7 * age)
  }else{
      console.log("WRONG!!");
      return 0;
  }
  return bmr;
}




function Logout() {
  
    auth.signOut() //<<< ???????????????????????????????????? Logout
    .then(() => {
      console.log("Successfully Sign out");

      Swal.fire({
        icon: 'success',
        title: 'lol... ',
        title: `GOODBYE ${localStorage.getItem('Email')}`,
        text:`please wait 3 sec..`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    })
    .then((result) => {
        if (result.isDismissed) {
          localStorage.setItem('bfsit', 0)
          
          localStorage.setItem('lunsit', 0)

          localStorage.setItem('dinsit', 0)
          openlg()
        }
      })
        
  
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("error " + errorCode + " : " + errorMessage);
    });
  }
  function openlg(){

    window.location.href = '../index.html'
  }


  function bmrXtdee(){
    let aws = floor *  tdee
    tdeexbmr =  Math.round(aws)
    Difftotal()
    document.getElementById('Energypdcal').innerText = "Energy/day : "+ tdeexbmr + " kcal";
    

  }

  function editepfp(){
    Swal.fire({
      title: 'Profile Form',
      html: `
      <input type="number" id="h" class="swal2-input" placeholder="Height(cm)">
      <input type="number" id="w" class="swal2-input" placeholder="Weight(kg)">
      <input type="number" id="y" class="swal2-input" placeholder="Age(yrs)">
      <select id="g">
        <option value="male" >???????????????????????????????????????(default:?????????)</option>
        <option value="male" >????????? </option>
        <option value="female">????????????</option>
      </select>



      `,
      confirmButtonText: 'Confirm',
      focusConfirm: false,
      preConfirm: () => {
        const weight = Swal.getPopup().querySelector('#w').value
        const height = Swal.getPopup().querySelector('#h').value
        const age = Swal.getPopup().querySelector('#y').value
        const gender = Swal.getPopup().querySelector('#g').value

        
        if (!weight || !height ||!age ||!gender) {
          Swal.showValidationMessage(`Please enter your profile`)
        }
        return { we: weight, he: height, ag: age,ge: gender }
      }


    }).then((result) => {
      Swal.fire(`
        height: ${result.value.he} cm
        weight: ${result.value.we} kg
        Age   : ${result.value.ag} yrs
        Gender : ${result.value.ge}
      `
      .trim())

      db.collection("EATRAIDEE").doc(email).collection("profile").doc('profile').set({

        weight: result.value.we,
        height: result.value.he,
        Age   : result.value.ag,
        Gender : result.value.ge
      })

      RetriveData()


    })
    

  }

  function RetriveData() {
    db.collection("EATRAIDEE").doc(email).collection("profile").doc('profile').get()
      .then(function (doc) {
        if(doc.exists){
          heig = doc.data().height;
          weig = doc.data().weight;
          ageg = doc.data().Age;
          sex = doc.data().Gender;
          document.getElementById('height').innerText = "height : " + heig +" cm"
          document.getElementById('weight').innerText = "weight : " + weig +" kg"
          document.getElementById('Age').innerText = "Age : " + ageg +" yrs"
          document.getElementById('Gender').innerText = "Gender : " + sex
          bmr = BMR(weig,heig,ageg,sex)
          floor = Math.round(bmr)
        }
        else{
          console.log("does not exist")
          alert("Please EDIT YOUR PROFILE")
        }
      })
      .catch(function(error){
        console.log("error",error)
      })
  }

  function UploadProcess() {
    const uploadTask = storageRef.child('images/'+ email +'/pfp.jpg').put(files[0]);
    alert("Upload Success");

    namebox.onchange = e => {
      files = e.target.files;
      //???????????????????????????????????????????????????????????????????????????files?????????????????????????????????????????? files[0] ???????????????????????????????????????????????????
      reader.readAsDataURL(files[0]);
  }

  //??????????????????????????????????????????reader????????????????????????????????????????????????????????????
  reader.onload = function () {
      //????????????????????????????????????????????????????????????????????????????????????
      namebox = files[0];
      //?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
      myimg.src = reader.result;
  }
}


function uploadpfp(){

  var storageRef = firebase.storage().ref();
  const uploadTask = storageRef.child('images/'+ email +'/pfp.jpg').put(files[0]);
  alert("Upload Success");

}

async function uplbtnclick(){

  const { value: file } = await Swal.fire({
    title: 'Select image',
    input: 'file',
    inputAttributes: {
      'accept': 'image/*',
      'aria-label': 'Upload your profile picture'
    }
  })
  
  if (file) {
    const reader = new FileReader()
    const uploadTask = storageRef.child('images/'+ email +'/pfp.jpg').put(file);
    reader.onload = (e) => {
      Swal.fire({
        title: 'Your uploaded picture',
        imageUrl: e.target.result,
        imageAlt: 'The uploaded picture'
      }).then((result) => {
        if (result.isDismissed||result.isConfirmed) {
          loadpfp()
          Swal.fire({
            icon: 'success',
            title: `UPLOAD PFP SUCCESS`,
            text:`please wait 3 sec..`,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })

        }
      })
      
      
    

    }
    reader.readAsDataURL(file)
    

    
  }

}
function loadpfp(){
  storageRef.child('images/'+ email +'/pfp.jpg').getDownloadURL().then((url) => {
    pfpload.src = url;
});
}


function gobybf(){
  localStorage.setItem('foodTime', 1)
  window.location.href = '../newuploadmenu/index.html'

}
function gobylun(){
  localStorage.setItem('foodTime', 2)
  window.location.href = '../newuploadmenu/index.html'
}
function gobydin(){
  localStorage.setItem('foodTime', 3)
  window.location.href = '../newuploadmenu/index.html'
}
function updatecal(){
  if(foodtimeselect == 1){
    bf = ttcaltopfp

  }else if(foodtimeselect == 2){
    lun = ttcaltopfp

  } else if(foodtimeselect == 3){
    din = ttcaltopfp

  }
}
function Caltotal(){
  allttcla = parseInt(bf) + parseInt(lun) +parseInt(din)

  document.getElementById('calttkcal').innerText = "Totalcal: "+ allttcla +"kcal"
  
}
function Difftotal(){
  caldiff =  allttcla - tdeexbmr

  if(isNaN(caldiff)){
    document.getElementById('diffof2kcal').innerText = "kcalDiff: "+ 0 +" kcal"
  }else{

  document.getElementById('diffof2kcal').innerText = "kcalDiff: "+ caldiff +" kcal"
  }

  if(caldiff > 400){
    document.getElementById('adv').innerText = "???????????????????????????????????????????????????????????????????????????"
  }else if(caldiff <= 400 && caldiff >= -400){
    document.getElementById('adv').innerText = "??????????????????????????????????????????????????????????????????????????????????????????????????????"
  }else{
    document.getElementById('adv').innerText = "??????????????????????????????????????????????????????????????????????????????"
  }

//chenge
}



